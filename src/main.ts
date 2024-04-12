import './style.css';

const chartDataKey = 'chartDatas' as const;

interface ChartData {
  xAxisData: Array<string>;
  series: Array<{ name: string; data: Array<string>; }>;
  startDate: string;
  endDate: string;
  newDatas: {
    [key: string]: Array<{ news: Array<{ date: string; source: string; title: string; url: string }>; xAxis: string }>
  };
}

(() => {
  let chartData: { all: ChartData; wise: ChartData; pc: ChartData } | null = null;

  Object.defineProperty(Object.prototype, chartDataKey, {
      configurable: true,
      get: () => chartData,
      set(value) {
        // @ts-ignore
        delete Object.prototype[chartDataKey];

        chartData = value;

        Object.defineProperty(this, chartDataKey, {
          configurable: true,
          get: () => chartData,
          set: (value) => chartData = value
        });
      }
    }
  );

  const splitline = document.querySelector('.splitline');
  const shareButton = document.querySelector('.share-icon')
  const parent = shareButton?.parentNode;
  if (!splitline || !shareButton || !parent) return;

  parent.append(splitline.cloneNode());

  const downloadButton = shareButton.cloneNode() as Element;
  downloadButton.innerHTML = '<a href="javascript:void(0)" class="share-icon">下载</a>';
  downloadButton.addEventListener('click', handleDownloadClick);
  parent.append(downloadButton)

  function handleDownloadClick() {
    if (!chartData) return;
    exportCSV(chartData.all)
    exportNewsCSV(chartData.all)
  }

  function exportCSV(chartData: ChartData) {
    const titleRow = ['name'].concat(chartData.xAxisData);
    const dataRows = chartData.series.map((item) => [`"${item.name}"`].concat(item.data));

    const csv: Array<string> = [titleRow.join(',') + '\n'];
    dataRows.forEach((row) => csv.push(row.join(',') + '\n'));
    download(
      new Blob(csv, {type: 'text/csv'}),
      `${chartData.series.map((item) => item.name).join(',')}_${chartData.startDate}-${chartData.endDate}.csv`
    );
  }

  function exportNewsCSV(chartData: ChartData) {
    const titleRow = ['name', 'date', 'newsDate', 'newsSource', 'newsTitle', 'newsUrl'];

    let dataRows: Array<Array<string>> = [];
    for (const [name, dateList] of Object.entries(chartData.newDatas)) {
      const rows = dateList.map(({xAxis, news}) => news.map((item) => [
        `"${name}"`,
        xAxis,
        `"${item.date}"`,
        `"${item.source}"`,
        `"${item.title}"`,
        `"${item.url}"`,
      ])).flat();
      dataRows = dataRows.concat(rows)
    }

    const csv: Array<string> = [titleRow.join(',') + '\n'];
    dataRows.forEach((row) => csv.push(row.join(',') + '\n'));
    download(
      new Blob(csv, {type: 'text/csv'}),
      `${chartData.series.map((item) => item.name).join(',')}_${chartData.startDate}-${chartData.endDate}.news.csv`
    );
  }

  function download(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
})();
