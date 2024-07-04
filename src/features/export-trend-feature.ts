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
  downloadButton.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载（无 BOM）</a>';
  downloadButton.addEventListener('click', () => handleDownloadClick(false));
  shareButton.parentNode?.append(splitline.cloneNode());
  shareButton.parentNode?.append(downloadButton)

  const downloadButtonWithBOM = shareButton.cloneNode() as Element;
  downloadButtonWithBOM.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载（带有 BOM，Excel可用）</a>';
  downloadButtonWithBOM.addEventListener('click', () => handleDownloadClick(true));
  shareButton.parentNode?.append(splitline.cloneNode());
  shareButton.parentNode?.append(downloadButtonWithBOM)

  function handleDownloadClick(withBOM = false) {
    if (!chartData) {
      console.error('[baidu-index-export] chartData is not ready');
      alert('数据未准备好，请稍后再试')
      return;
    }

    exportCSV(chartData.all, withBOM);
    exportNewsCSV(chartData.all, withBOM);
  }
}