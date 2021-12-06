import View from "./view.js";
import icons from "url:../../img/icons.svg";
import { COLOR } from "../config.js";
import Chart from "chart.js/auto";
import { formatNumber } from "../helpers.js";

class searchView extends View {
  _dropdown = document.querySelector(".dropdown__menu--country");
  _dropdownVax = document.querySelector(".dropdown__menu--vax");
  _inputCountry = document.querySelector(".input-country");
  _inputVax = document.querySelector(".input-vax");
  _form = document.querySelector(".search__form--covid");
  _parentElement = document.querySelector(".search__data");
  constructor() {
    super();
    this._dropdown.addEventListener("click", this._handlerSelectOption);
    this._dropdownVax.addEventListener("click", this._handlerSelectOption);
  }
  setDropdownOption(data) {
    this._dropdown.innerHTML = "";
    this._dropdownVax.innerHTML = "";
    const markup = data
      .map((country) => {
        return `
            <li class="dropdown__option">
                <option value="${country.iso2}">${country.name}</option>
            </li>
          `;
      })
      .join("");
    this._dropdown.insertAdjacentHTML("afterbegin", markup);
    this._dropdownVax.insertAdjacentHTML("afterbegin", markup);
    this._dropdown.querySelector(`[value="VN"]`).classList.add("active");
    this._dropdownVax.querySelector(`[value="VN"]`).classList.add("active");
  }
  _handlerSelectOption(e) {
    const option = e.target.closest(".dropdown__option option");
    if (!option) return;
    const dropdown = option.closest(".dropdown");
    dropdown.classList.toggle("active");
    dropdown.querySelector("option.active").classList.remove("active");
    option.classList.add("active");

    dropdown.querySelector("[data-iso2]").value = option.textContent;
    dropdown.querySelector("[data-iso2]").dataset.iso2 = option.value;
  }
  addHandlerSearchData(handler) {
    this._form.addEventListener("submit", function (e) {
      e.preventDefault();
      const option = document.querySelector(".input-country");
      const data = {
        name: option.value,
        iso2: option.dataset.iso2,
      };
      handler(data);
    });
  }

  _generateMarkup() {
    return `
    <h4 class="country">${this._data.country}</h4>
    <div class="grid">
      <div class="row">
        <div class="col l-3 m-3 c-12">
          <div class="data-container search__container">
            <div class="case">
              <div class="grid">
                <div class="row sm-gutter">
                  <div class="col m-4">
                    <div class="case__icon">
                      <svg>
                        <use
                          href="${icons}#icon-infected"
                        ></use>
                      </svg>
                    </div>
                  </div>
                  <div class="col m-8">
                    <div class="case__label">Total Case</div>
                    <div class="case__number global-case">${formatNumber(
                      this._data.cases
                    )}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="case">
              <div class="grid">
                <div class="row sm-gutter">
                  <div class="col m-4">
                    <div class="case__icon">
                      <svg>
                        <use
                          href="${icons}#icon-death"
                        ></use>
                      </svg>
                    </div>
                  </div>
                  <div class="col m-8">
                    <div class="case__label">Total Death</div>
                    <div class="case__number global-death">${formatNumber(
                      this._data.deaths
                    )}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="case">
              <div class="grid">
                <div class="row sm-gutter">
                  <div class="col m-4">
                    <div class="case__icon">
                      <svg>
                        <use
                          href="${icons}#icon-treated"
                        ></use>
                      </svg>
                    </div>
                  </div>
                  <div class="col m-8">
                    <div class="case__label">Being treated</div>
                    <div class="case__number global-treated">${formatNumber(
                      this._data.active
                    )}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="case">
              <div class="grid">
                <div class="row sm-gutter">
                  <div class="col m-4">
                    <div class="case__icon">
                      <svg>
                        <use
                          href="${icons}#icon-recovered"
                        ></use>
                      </svg>
                    </div>
                  </div>
                  <div class="col m-8">
                    <div class="case__label">Recovered</div>
                    <div class="case__number global-recovered">${formatNumber(
                      this._data.recovered
                    )}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col l-9 m-9 c-12">
          <canvas id="search__chart"></canvas>
        </div>
      </div>
    </div>
    
    `;
  }

  renderChart(data) {
    const chart = document.querySelector("#search__chart");
    const quantityCases = data.cases.map((cases) => cases.quantity);
    quantityCases.shift();
    const quantityDeaths = data.deaths.map((cases) => cases.quantity);
    quantityDeaths.shift();
    const label = data.cases.map((data) => {
      return data.date;
    });
    const datasetCases = {
      label: "New Cases",
      data: quantityCases,
      backgroundColor: COLOR.red,
      borderColor: COLOR.red,
      borderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 2,
      hoverRadius: 5,
    };
    const datasetDeaths = {
      label: "Deaths",
      data: quantityDeaths,
      backgroundColor: COLOR.gray,
      borderColor: COLOR.gray,
      borderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 2,
      hoverRadius: 5,
    };

    return new Chart(chart, {
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
              maxTicksLimit: 10,
              color: COLOR.gray,
              maxRotation: 50,
              minRotation: 0,
            },
          },
        },
        tension: 0.3,
        responsive: true,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 15,
              },
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

export default new searchView();
