export interface ChartData {
  xAxisData: Array<string>;
  series: Array<{ name: string; data: Array<string>; }>;
  startDate: string;
  endDate: string;
  area: string;
  newDatas: {
    [key: string]: Array<{ news: Array<{ date: string; source: string; title: string; url: string }>; xAxis: string }>
  };
}

export enum ChartType {
  TREND,
  BRAND,
}