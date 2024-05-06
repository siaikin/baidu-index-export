import {ChartData} from "../models";
import {exportCSV, exportNewsCSV} from "../export-csv";

export async function loadExportTrendFeature(chartDataKey: string) {
  let chartData: { all: ChartData; wise: ChartData; pc: ChartData } | null = null;
  // @ts-ignore
  let pageThis: any = null;

  Object.defineProperty(Object.prototype, chartDataKey, {
      configurable: true,
      get: () => chartData,
      set(value) {
        // @ts-ignore
        delete Object.prototype[chartDataKey];

        chartData = value;
        pageThis = this;

        Object.defineProperty(this, chartDataKey, {
          configurable: true,
          get: () => chartData,
          set(value) {
            chartData = value;
          }}
        );
      }
    }
  );

  await new Promise((resolve) => window.addEventListener('load', resolve));

  const container = document.querySelectorAll('.index-trend-content')[1];
  const splitline = container.querySelector('.splitline');
  const shareButton = container.querySelector('.share-icon')
  if (!splitline || !shareButton) return;

  const downloadButton = shareButton.cloneNode() as Element;
  downloadButton.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载</a>';
  downloadButton.addEventListener('click', handleDownloadClick);

  shareButton.parentNode?.append(splitline.cloneNode());
  shareButton.parentNode?.append(downloadButton)

  function handleDownloadClick() {
    if (!chartData) {
      console.error('[baidu-index-export] chartData is not ready');
      return;
    }

    exportCSV(chartData.all);
    exportNewsCSV(chartData.all);
  }
}