import {ChartData} from "./models";

export function exportCSV(chartData: ChartData) {
  const titleRow = ['name'].concat(chartData.xAxisData);
  const dataRows = chartData.series.map((item) => [`"${item.name}"`].concat(item.data));

  const csv: Array<string> = [titleRow.join(',') + '\n'];
  dataRows.forEach((row) => csv.push(row.join(',') + '\n'));
  download(
    new Blob(csv, {type: 'text/csv'}),
    `${chartData.series.map((item) => item.name).join(',')}_${chartData.startDate}-${chartData.endDate}.csv`
  );
}

export function exportNewsCSV(chartData: ChartData) {
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
