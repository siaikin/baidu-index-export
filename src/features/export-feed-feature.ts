import {ChartData} from "../models";
import {exportCSV, exportNewsCSV} from "../export-csv";

export async function loadExportFeedFeature(chartDataKey: string) {
  let chartData: ChartData | null = null;
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

  const container = document.querySelectorAll('.index-trend-content')[2];
  const splitline = container.querySelector('.splitline');
  const regionButton = container.querySelector('.index-region')
  if (!splitline || !regionButton) return;

  const downloadButton = regionButton.cloneNode() as Element;
  downloadButton.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载</a>';
  downloadButton.addEventListener('click', handleDownloadClick);

  regionButton.parentNode?.append(splitline.cloneNode());
  regionButton.parentNode?.append(downloadButton)

  function handleDownloadClick() {
    if (!chartData) {
      console.error('[baidu-index-export] chartData is not ready');
      return;
    }

    exportCSV(chartData);
    exportNewsCSV(chartData);
  }
}