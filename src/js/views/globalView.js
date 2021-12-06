import View from "./View.js";
import { formatNumber } from "../helpers.js";
import svgMap from "svgmap";
import "svgmap/dist/svgMap.min.css";
import Chart from "chart.js/auto";
import { COLOR } from "../config.js";
import moment from "moment";

class globalView extends View {
  _case = document.querySelector(".global-case");
  _treated = document.querySelector(".global-treated");
  _recovered = document.querySelector(".global-recovered");
  _death = document.querySelector(".global-death");
  _message = "Failed to load Data";
  _chart = document.querySelector("#global__chart");

  updateTotalData(data) {
    this._case.textContent = formatNumber(data.cases);
    this._treated.textContent = formatNumber(data.active);
    this._recovered.textContent = formatNumber(data.recovered);
    this._death.textContent = formatNumber(data.deaths);
  }

  addHandlerUpdateTotalData(handler) {
    window.addEventListener("load", handler);
  }

  renderLoadDot() {
    [this._case, this._treated, this._death, this._recovered].forEach((div) =>
      this.renderDot(div)
    );
  }

  updateWorldMap(data) {
    let values = {};
    data.forEach((country) => {
      const { cases, deaths, recovered, active } = country;
      values[country.iso2] = {
        cases,
        deaths,
        recovered,
        active,
      };
    });
    const map = new svgMap({
      targetElementID: "world_map",
      data: {
        data: {
          cases: {
            name: "Total Cases: ",
            format: "{0} cases",
            thousandSeparator: ",",
            thresholdMax: 25000000,
            thresholdMin: 1000,
          },
          deaths: {
            name: "Total Deaths:",
            format: "{0} cases",
            thousandSeparator: ",",
          },
          recovered: {
            name: "Recovered after get Covid-19: ",
            format: "{0} cases",
            thousandSeparator: ",",
          },
          active: {
            name: "Cases being treated in hospital: ",
            format: "{0} cases",
            thousandSeparator: ",",
          },
        },
        applyData: "cases",
        values: values,
      },
      minZoom: 0.8,
      maxZoom: 2,
      initialZoom: 1,
      colorNoData: "#c3bfbc",
    });

    document.querySelector(".svgMap-map-wrapper").style.background =
      "transparent";
  }
  addHandlerRenderWorldMap(handler) {
    window.addEventListener("load", handler);
  }

  renderChart(data) {
    const quantityCases = data.cases.map((cases) => cases.quantity);
    const quantityDeaths = data.deaths.map((cases) => cases.quantity);
    const label = data.cases.map((data) => {
      // const date = moment(data.day);
      // console.log();
      // return date.format("MMMM YYYY");
      return data.day;
    });
    const datasetCases = {
      label: "New Cases",
      data: quantityCases,
      backgroundColor: COLOR.red,
      borderColor: COLOR.red,
      borderWidth: 2,
      pointRadius: 0,
      pointHitRadius: 10,
      hoverRadius: 5,
    };
    const datasetDeaths = {
      label: "Deaths",
      data: quantityDeaths,
      backgroundColor: COLOR.gray,
      borderColor: COLOR.gray,
      borderWidth: 2,
      pointRadius: 0,
      pointHitRadius: 10,
      hoverRadius: 5,
    };
    return new Chart(this._chart, {
      type: "line",
      data: {
        labels: label,
        datasets: [datasetCases, datasetDeaths],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              borderColor: COLOR.black,
              color: COLOR.black,
            },
          },
          x: {
            // type: "time",
            // time: {
            //   unit: "month",
            // },
            beginAtZero: false,
            grid: {
              borderColor: COLOR.yellow,
            },

            ticks: {
              maxTicksLimit: 4,
              callback: function (val, index) {
                const date = moment(this.getLabelForValue(val));
                return date.format("MMMM YYYY");
              },
              font: {},
              color: COLOR.gray,
              maxRotation: 0,
              minRotation: 0,
            },
          },
        },
        tension: 0.3,
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Chart about the spread of covid-19 around the world",
            color: COLOR.yellow,
            font: {
              size: 25,
            },
          },
          legend: {
            labels: {
              font: {
                size: 15,
              },
            },
          },
          tooltip: {
            callbacks: {
              title: (tooltipItem) =>
                moment(tooltipItem[0].label).format("DD/MM/YYYY"),
            },
          },
        },
        hover: {
          intersect: false,
        },
      },
    });
  }
}

export default new globalView();
