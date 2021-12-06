import {
  VIETNAM_COVID_API,
  VIETNAM_CHART_API,
  WORLD_COVID_DATA_API,
  COUNTRIES_API,
  WORLD_COVID_CHART_API,
  WORLD_VACCINE_API,
  COUNTRY_COVID_API,
  HISTORICAL_COUNTRY,
  SEARCH_VAX_API,
} from "./config.js";
import { AJAX, get30Date } from "./helpers.js";
import moment from "moment";
import { async } from "regenerator-runtime";

export const state = {
  vietnamTotal: {},
  vietnamDetail: [],
  vietnamChartData: {
    recovered: [],
    cases: [],
    deaths: [],
  },
  globalTotal: {},
  countriesData: [],
  countriesInfo: [],
  globalChartData: {
    cases: [],
    deaths: [],
  },
  searchData: {
    history: {
      cases: [],
      deaths: [],
    },
    data: {},
    vax: {},
  },
  vaxData: 0,
};

export const getVietnamCovidData = async function () {
  try {
    const vietnamData = await AJAX(VIETNAM_COVID_API);
    const chartData = await AJAX(VIETNAM_CHART_API);
    const { deceased, treated, recovered, infected, detail } = vietnamData;
    state.vietnamTotal = {
      deceased,
      treated,
      recovered,
      infected,
    };
    state.vietnamDetail = detail;
    const { cakhoi, canhiem, catuvong } = chartData;
    state.vietnamChartData = {
      recovered: cakhoi,
      cases: canhiem,
      deaths: catuvong,
    };
  } catch (err) {
    console.error(err.message);
  }
};
export const getGlobalData = async function () {
  try {
    const globalData = await AJAX(WORLD_COVID_DATA_API);
    const chartData = await AJAX(WORLD_COVID_CHART_API);
    const { active, cases, deaths, recovered } = globalData;
    state.globalTotal = {
      active,
      cases,
      deaths,
      recovered,
    };
    chartData.cases["1/21/20"] = 0;
    chartData.deaths["1/21/20"] = 0;
    const date = get30Date();

    date.forEach((day, index) => {
      state.globalChartData.cases.push({
        day: day,
        quantity:
          chartData.cases[date[index]] - chartData.cases[date[index - 1]],
      });
      state.globalChartData.deaths.push({
        day: day,
        quantity:
          chartData.deaths[date[index]] - chartData.deaths[date[index - 1]],
      });
    });

    // state.globalChartData.cases = chartCases;
    // state.globalChartData.deaths = chartDeaths;
  } catch (err) {
    throw err;
  }
};

const setCountryData = function (data) {
  const { active, cases, deaths, recovered } = data;
  return {
    cases,
    deaths,
    active,
    recovered,
    iso2: data.countryInfo.iso2,
  };
};
export const getCountriesData = async function () {
  try {
    const countriesData = await AJAX(COUNTRIES_API);
    state.countriesInfo = countriesData.map((country) => {
      return {
        name: country.country,
        iso2: country.countryInfo.iso2,
      };
    });
    state.countriesData = countriesData.map((country) =>
      setCountryData(country)
    );
  } catch (err) {
    throw err;
  }
};
export const extractTimeline = function (data) {
  let property;
  let temp = [];
  for (property in data) {
    temp.push({
      date: moment(property).format("D/M/YYYY"),
      quantity:
        data[property] -
        data[moment(property).add(-1, "days").format("M/D/YY")],
    });
  }
  return temp;
};

export const getSearchData = async function (iso2) {
  try {
    const urlData = `${COUNTRY_COVID_API}${iso2}`;
    const data = await AJAX(urlData);
    const urlHistorical = `${HISTORICAL_COUNTRY}${iso2}`;
    const historical = await AJAX(urlHistorical);
    const { active, cases, deaths, recovered, country } = data;
    state.searchData.data = {
      active,
      cases,
      deaths,
      recovered,
      country,
    };
    state.searchData.history.cases = extractTimeline(historical.timeline.cases);
    state.searchData.history.deaths = extractTimeline(
      historical.timeline.deaths
    );

    // state.searchData.history.cases = historical.timeline.cases;
    // state.searchData.history.deaths = historical.timeline.deaths;
  } catch (err) {
    throw err;
  }
};

export const getVaxData = async function () {
  try {
    const [vaxData] = await AJAX(WORLD_VACCINE_API);
    state.vaxData = vaxData.total;
  } catch (err) {
    throw err;
  }
};

export const searchVaxData = async function (iso2) {
  try {
    const url = `${SEARCH_VAX_API}${iso2}?lastdays=1&fullData=true`;
    const data = await AJAX(url);
    const country = data.country;
    const [vaxData] = data.timeline;
    state.searchData.vax = {
      country,
      quantity: vaxData.total,
    };
    console.log(state.searchData.vax);
  } catch (err) {
    throw err;
  }
};
