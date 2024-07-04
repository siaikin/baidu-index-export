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
  downloadButton.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载（无 BOM）</a>';
  downloadButton.addEventListener('click', () => handleDownloadClick(false));
  regionButton.parentNode?.append(splitline.cloneNode());
  regionButton.parentNode?.append(downloadButton)

  const downloadButtonWithBOM = regionButton.cloneNode() as Element;
  downloadButtonWithBOM.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载（带有 BOM，Excel可用）</a>';
  downloadButtonWithBOM.addEventListener('click', () => handleDownloadClick(true));
  regionButton.parentNode?.append(splitline.cloneNode());
  regionButton.parentNode?.append(downloadButtonWithBOM)

  function handleDownloadClick(withBOM = false) {
    if (!chartData) {
      console.error('[baidu-index-export] chartData is not ready');
      alert('数据未准备好，请稍后再试')
      return;
    }

    exportCSV(chartData, withBOM);
    exportNewsCSV(chartData, withBOM);
  }
}