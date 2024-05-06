import './style.css';
import {ChartType} from "./models";
import {loadExportTrendFeature} from "./features/export-trend-feature";
import {loadExportFeedFeature} from "./features/export-feed-feature";
import {loadExportBrandFeature} from "./features/export-brand-feature";

const chartType = (() => {
  const hash = window.location.hash;
  if (hash.startsWith('#/trend/')) return ChartType.TREND;
  else if (hash.startsWith('#/brand/')) return ChartType.BRAND;
  else return ChartType.TREND as const;
})();

(() => {
  switch (chartType) {
    case ChartType.BRAND:
      loadExportBrandFeature('brandDatas');
      break;
    case ChartType.TREND:
      loadExportTrendFeature('chartDatas');
      loadExportFeedFeature('chartDatas2');
      break;
  }
})();
