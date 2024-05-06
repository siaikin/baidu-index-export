// ==UserScript==
// @name         百度指数数据导出工具
// @namespace    https://github.com/siaikin/baidu-index-export
// @version      1.3.0
// @author       siaikin
// @description  这是一个 Tampermonkey 的脚本，用于将 baidu index 的数据导出为 csv
// @copyright    https://github.com/siaikin
// @homepage     https://github.com/siaikin/baidu-index-export
// @supportURL   https://github.com/siaikin/baidu-index-export/issues
// @match        *://index.baidu.com/*
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  var ChartType = /* @__PURE__ */ ((ChartType2) => {
    ChartType2[ChartType2["TREND"] = 0] = "TREND";
    ChartType2[ChartType2["BRAND"] = 1] = "BRAND";
    return ChartType2;
  })(ChartType || {});
  function exportCSV(chartData) {
    const titleRow = ["name"].concat(chartData.xAxisData);
    const dataRows = chartData.series.map((item) => [`"${item.name}"`].concat(item.data));
    const csv = [titleRow.join(",") + "\n"];
    dataRows.forEach((row) => csv.push(row.join(",") + "\n"));
    download(
      new Blob(csv, { type: "text/csv" }),
      `${chartData.series.map((item) => item.name).join(",")}_${chartData.startDate}-${chartData.endDate}.csv`
    );
  }
  function exportNewsCSV(chartData) {
    const titleRow = ["name", "date", "newsDate", "newsSource", "newsTitle", "newsUrl"];
    let dataRows = [];
    for (const [name, dateList] of Object.entries(chartData.newDatas)) {
      const rows = dateList.map(({ xAxis, news }) => news.map((item) => [
        `"${name}"`,
        xAxis,
        `"${item.date}"`,
        `"${item.source}"`,
        `"${item.title}"`,
        `"${item.url}"`
      ])).flat();
      dataRows = dataRows.concat(rows);
    }
    const csv = [titleRow.join(",") + "\n"];
    dataRows.forEach((row) => csv.push(row.join(",") + "\n"));
    download(
      new Blob(csv, { type: "text/csv" }),
      `${chartData.series.map((item) => item.name).join(",")}_${chartData.startDate}-${chartData.endDate}.news.csv`
    );
  }
  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
  async function loadExportTrendFeature(chartDataKey) {
    var _a, _b;
    let chartData = null;
    Object.defineProperty(
      Object.prototype,
      chartDataKey,
      {
        configurable: true,
        get: () => chartData,
        set(value) {
          delete Object.prototype[chartDataKey];
          chartData = value;
          Object.defineProperty(
            this,
            chartDataKey,
            {
              configurable: true,
              get: () => chartData,
              set(value2) {
                chartData = value2;
              }
            }
          );
        }
      }
    );
    await new Promise((resolve) => window.addEventListener("load", resolve));
    const container = document.querySelectorAll(".index-trend-content")[1];
    const splitline = container.querySelector(".splitline");
    const shareButton = container.querySelector(".share-icon");
    if (!splitline || !shareButton)
      return;
    const downloadButton = shareButton.cloneNode();
    downloadButton.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载</a>';
    downloadButton.addEventListener("click", handleDownloadClick);
    (_a = shareButton.parentNode) == null ? void 0 : _a.append(splitline.cloneNode());
    (_b = shareButton.parentNode) == null ? void 0 : _b.append(downloadButton);
    function handleDownloadClick() {
      if (!chartData) {
        console.error("[baidu-index-export] chartData is not ready");
        return;
      }
      exportCSV(chartData.all);
      exportNewsCSV(chartData.all);
    }
  }
  async function loadExportFeedFeature(chartDataKey) {
    var _a, _b;
    let chartData = null;
    Object.defineProperty(
      Object.prototype,
      chartDataKey,
      {
        configurable: true,
        get: () => chartData,
        set(value) {
          delete Object.prototype[chartDataKey];
          chartData = value;
          Object.defineProperty(
            this,
            chartDataKey,
            {
              configurable: true,
              get: () => chartData,
              set(value2) {
                chartData = value2;
              }
            }
          );
        }
      }
    );
    await new Promise((resolve) => window.addEventListener("load", resolve));
    const container = document.querySelectorAll(".index-trend-content")[2];
    const splitline = container.querySelector(".splitline");
    const regionButton = container.querySelector(".index-region");
    if (!splitline || !regionButton)
      return;
    const downloadButton = regionButton.cloneNode();
    downloadButton.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载</a>';
    downloadButton.addEventListener("click", handleDownloadClick);
    (_a = regionButton.parentNode) == null ? void 0 : _a.append(splitline.cloneNode());
    (_b = regionButton.parentNode) == null ? void 0 : _b.append(downloadButton);
    function handleDownloadClick() {
      if (!chartData) {
        console.error("[baidu-index-export] chartData is not ready");
        return;
      }
      exportCSV(chartData);
      exportNewsCSV(chartData);
    }
  }
  async function loadExportBrandFeature(chartDataKey) {
    var _a, _b;
    let chartData = null;
    let pageThis = null;
    Object.defineProperty(
      Object.prototype,
      chartDataKey,
      {
        configurable: true,
        get: () => chartData,
        set(value) {
          delete Object.prototype[chartDataKey];
          chartData = value;
          pageThis = this;
          Object.defineProperty(
            this,
            chartDataKey,
            {
              configurable: true,
              get: () => chartData,
              set(value2) {
                chartData = {
                  ...chartData,
                  ...value2,
                  startDate: pageThis.startDate,
                  endDate: pageThis.endDate
                };
              }
            }
          );
        }
      }
    );
    await new Promise((resolve) => window.addEventListener("load", resolve));
    const container = document.querySelectorAll(".index-brand-content")[0];
    const splitline = container.querySelector(".splitline");
    const shareButton = container.querySelector(".share-icon");
    if (!splitline || !shareButton)
      return;
    const downloadButton = shareButton.cloneNode();
    downloadButton.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载</a>';
    downloadButton.addEventListener("click", handleDownloadClick);
    (_a = shareButton.parentNode) == null ? void 0 : _a.append(splitline.cloneNode());
    (_b = shareButton.parentNode) == null ? void 0 : _b.append(downloadButton);
    function handleDownloadClick() {
      if (!chartData) {
        console.error("[baidu-index-export] chartData is not ready");
        return;
      }
      exportCSV(chartData);
    }
  }
  const chartType = (() => {
    const hash = window.location.hash;
    if (hash.startsWith("#/trend/"))
      return ChartType.TREND;
    else if (hash.startsWith("#/brand/"))
      return ChartType.BRAND;
    else
      return ChartType.TREND;
  })();
  (() => {
    switch (chartType) {
      case ChartType.BRAND:
        loadExportBrandFeature("brandDatas");
        break;
      case ChartType.TREND:
        loadExportTrendFeature("chartDatas");
        loadExportFeedFeature("chartDatas2");
        break;
    }
  })();

})();