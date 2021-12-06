import * as model from "./model.js";
import globalView from "./views/globalView.js";
import vietnamView from "./views/vietnamView.js";
import searchView from "./views/searchView.js";
import dropdownView from "./views/dropdownView.js";
import modalView from "./views/modalView.js";
import UI from "./views/effectView.js";
import vaccineView from "./views/vaccineView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

const controlUpdateVietnamData = async function () {
  try {
    vietnamView.renderLoadDot();
    await model.getVietnamCovidData();
    vietnamView.updateTotalData(model.state.vietnamTotal);
    vietnamView.render(model.state.vietnamDetail);
    vietnamView.renderAllChart(model.state.vietnamChartData);
  } catch (err) {
    vietnamView.renderMessage();
  }
};

const controlUpdateGlobalData = async function () {
  try {
    globalView.renderLoadDot();
    await model.getGlobalData();
    globalView.updateTotalData(model.state.globalTotal);
    globalView.renderChart(model.state.globalChartData);
  } catch (err) {
    vietnamView.renderMessage;
    console.log(err);
  }
};

const controlUpdateWorldMap = async function () {
  try {
    await model.getCountriesData();
    searchView.setDropdownOption(model.state.countriesInfo);
    globalView.updateWorldMap(model.state.countriesData);
  } catch (err) {
    console.log(err);
  }
};

const controlSearchData = async function (data) {
  try {
    searchView.renderDot();
    await model.getSearchData(data.iso2);
    searchView.render(model.state.searchData.data);
    searchView.renderChart(model.state.searchData.history);
  } catch (err) {
    searchView.renderMessage(
      "Cannot access to Covid-19 data of this country :(."
    );
  }
};

const controlUpdateTotalVac = async function () {
  try {
    await model.getVaxData();
    vaccineView.updateTotalVaccine(model.state.vaxData);
  } catch (err) {
    console.log(err);
  }
};

const controlSearchVax = async function (data) {
  try {
    vaccineView.renderDot();
    await model.searchVaxData(data.iso2);
    vaccineView.render(model.state.searchData.vax);
  } catch (err) {
    console.log(err);
    vaccineView.renderMessage("Failed to load vaccine data :(");
  }
};

const init = function () {
  vietnamView.addHandlerUpdateTotalData(controlUpdateVietnamData);
  globalView.addHandlerUpdateTotalData(controlUpdateGlobalData);
  globalView.addHandlerRenderWorldMap(controlUpdateWorldMap);
  searchView.addHandlerSearchData(controlSearchData);
  vaccineView.addHandlerUpdateTotalVac(controlUpdateTotalVac);
  vaccineView.addHandlerSearchVax(controlSearchVax);
  console.log("Welcome");
};

init();
