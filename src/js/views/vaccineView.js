import View from "./view.js";
import icons from "url:../../img/icons.svg";
import { COLOR } from "../config.js";
import { formatNumber } from "../helpers.js";

class vaccineView extends View {
  _totalVac = document.querySelector(".vax__data");
  _parentElement = document.querySelector(".search__vax");
  _form = document.querySelector(".search__form--vac");
  updateTotalVaccine(data) {
    this._totalVac.textContent = formatNumber(data);
  }
  addHandlerUpdateTotalVac(handler) {
    window.addEventListener("load", handler);
  }
  _generateMarkup() {
    return `
    <div class="case">
        <div class="grid">
            <div class="row sm-gutter">
            <div class="col m-4">
                <div class="case__icon">
                <svg>
                    <use href="${icons}#icon-vaccine"></use>
                </svg>
                </div>
            </div>
            <div class="col m-8">
                <div class="case__label">${this._data.country}</div>
                <div class="case__number">${formatNumber(
                  this._data.quantity
                )}</div>
            </div>
            </div>
        </div>
    </div>
    
    `;
  }
  addHandlerSearchVax(handler) {
    this._form.addEventListener("submit", function (e) {
      e.preventDefault();
      const option = document.querySelector(".input-vax");
      const data = {
        name: option.value,
        iso2: option.dataset.iso2,
      };
      handler(data);
    });
  }
}

export default new vaccineView();
