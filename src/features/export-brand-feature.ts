import {ChartData} from "../models";
import {exportCSV} from "../export-csv";

export async function loadExportBrandFeature(chartDataKey: string) {
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
            chartData = {
              ...chartData,
              ...value,
              startDate: pageThis.startDate,
              endDate: pageThis.endDate
            };
          }}
        );
      }
    }
  );

  await new Promise((resolve) => window.addEventListener('load', resolve));

  const container = document.querySelectorAll('.index-brand-content')[0];
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

    exportCSV(chartData);
  }
}