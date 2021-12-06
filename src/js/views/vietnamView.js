import View from "./view.js";
import icons from "url:../../img/icons.svg";
import Chart from "chart.js/auto";
import { COLOR } from "../config.js";
import { formatNumber } from "../helpers.js";

class vietnamView extends View {
  _case = document.querySelector(".vietnam-case");
  _treated = document.querySelector(".vietnam-treated");
  _recovered = document.querySelector(".vietnam-recovered");
  _death = document.querySelector(".vietnam-death");
  _parentElement = document.querySelector(".table-vietnam");
  _message = "Failed to load Data";
  _chartCases = document.querySelector("#chart__cases");
  _chartDeath = document.querySelector("#chart__death");
  _chartRecovered = document.querySelector("#chart__recovered");
  updateTotalData(data) {
    this._case.textContent = formatNumber(data.infected);
    this._treated.textContent = formatNumber(data.treated);
    this._recovered.textContent = formatNumber(data.recovered);
    this._death.textContent = formatNumber(data.deceased);
  }

  addHandlerUpdateTotalData(handler) {
    window.addEventListener("load", handler);
  }

  renderLoadDot() {
    [
      this._case,
      this._treated,
      this._death,
      this._recovered,
      this._parentElement,
    ].forEach((div) => this.renderDot(div));
  }
  _generateRowMarkup(data) {
    return `
    <tr>
      <td>${data.name}</td>
      <td>${data.cases}</td>
      <td>${data.casesToday}</td>
      <td>${data.death}</td>
    </tr>
    `;
  }
  _generateMarkup() {
    return `
    <table>
      <tr>
        <th>Tỉnh/Thành Phố</th>
        <th>Số ca nhiểm</th>
        <th>Hôm nay</th>
        <th>Số ca tử vong</th>
      </tr>
      ${this._data.map((prov) => this._generateRowMarkup(prov)).join("")}
    </table>
    `;
  }
  _renderChart(div, data, color, msg) {
    const label = data.map((data) => data.day);
    const quantity = data.map((data) => data.quantity);
    return new Chart(div, {
      type: "line",
      data: {
        labels: label,
        datasets: [
          {
            label: msg,
            data: quantity,
            backgroundColor: [color],
            //borderColor: [color],
            borderWidth: 3,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
        },
        tension: 0.3,
        pointStyle: "circle",
        borderColor: [color],
        elements: {
          line: {
            borderColor: color,
          },
        },
        responsive: true,
      },
    });
  }
  renderAllChart(data) {
    this._renderChart(this._chartCases, data.cases, COLOR.red, "Cases by day");
    this._renderChart(
      this._chartDeath,
      data.deaths,
      COLOR.gray,
      "Death by day"
    );
    this._renderChart(
      this._chartRecovered,
      data.recovered,
      COLOR.green,
      "Recovered by day"
    );
  }
}

export default new vietnamView();
