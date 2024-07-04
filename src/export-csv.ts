import {ChartData} from "./models";

const BOM = new Uint8Array([0xEF, 0xBB, 0xBF])

export function exportCSV(chartData: ChartData, withBOM = false) {
  const titleRow = ['name'].concat(chartData.xAxisData);
  const dataRows = chartData.series.map((item) => [`"${item.name}"`].concat(item.data));

  const csv: Array<string> = [titleRow.join(',') + '\n'];
  dataRows.forEach((row) => csv.push(row.join(',') + '\n'));
  download(
    new Blob(withBOM ? [BOM, ...csv] : csv, {type: 'text/csv'}),
    `${chartData.series.map((item) => item.name).join(',')}_${chartData.startDate}-${chartData.endDate}.csv`
  );
}

export function exportNewsCSV(chartData: ChartData, withBOM = false) {
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
    new Blob(withBOM ? [BOM, ...csv] : csv, {type: 'text/csv'}),
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
