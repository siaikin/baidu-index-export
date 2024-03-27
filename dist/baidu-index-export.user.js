// ==UserScript==
// @name         百度指数数据导出工具
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @author       siaikin
// @description  这是一个 Tampermonkey 的脚本，用于将 baidu index 的数据导出为 csv
// @copyright    https://github.com/siaikin
// @homepage     https://github.com/siaikin/baidu-index-export
// @supportURL   https://github.com/siaikin/baidu-index-export/issues
// @match        *://index.baidu.com/*
// ==/UserScript==

(function () {
  'use strict';

  const chartDataKey = "chartDatas";
  (() => {
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
          Object.defineProperty(this, chartDataKey, {
            configurable: true,
            get: () => chartData,
            set: (value2) => {
              chartData = value2;
              console.log(chartData);
            }
          });
        }
      }
    );
    const splitline = document.querySelector(".splitline");
    const shareButton = document.querySelector(".share-icon");
    const parent = shareButton == null ? void 0 : shareButton.parentNode;
    if (!splitline || !shareButton || !parent)
      return;
    parent.append(splitline.cloneNode());
    const downloadButton = shareButton.cloneNode();
    downloadButton.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载</a>';
    downloadButton.addEventListener("click", handleDownloadClick);
    parent.append(downloadButton);
    function handleDownloadClick() {
      if (!chartData)
        return;
      exportCSV(chartData.all);
      exportNewsCSV(chartData.all);
    }
    function exportCSV(chartData2) {
      const titleRow = [""].concat(chartData2.xAxisData);
      const dataRows = chartData2.series.map((item) => [`"${item.name}"`].concat(item.data));
      const csv = [titleRow.join(",") + "\n"];
      dataRows.forEach((row) => csv.push(row.join(",") + "\n"));
      download(
        new Blob(csv, { type: "text/csv" }),
        `${chartData2.series.map((item) => item.name).join(",")}_${chartData2.startDate}-${chartData2.endDate}.csv`
      );
    }
    function exportNewsCSV(chartData2) {
      const titleRow = ["", "date", "newsDate", "newsSource", "newsTitle", "newsUrl"];
      let dataRows = [];
      for (const [name, dateList] of Object.entries(chartData2.newDatas)) {
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
        `${chartData2.series.map((item) => item.name).join(",")}_${chartData2.startDate}-${chartData2.endDate}.news.csv`
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
  })();

})();