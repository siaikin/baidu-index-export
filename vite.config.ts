import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: '百度指数数据导出工具',
        description: '这是一个 Tampermonkey 的脚本，用于将 baidu index 的数据导出为 csv',
        author: 'siaikin',
        copyright: 'https://github.com/siaikin',
        namespace: 'http://tampermonkey.net/',
        homepage: 'https://github.com/siaikin/baidu-index-export',
        supportURL: 'https://github.com/siaikin/baidu-index-export/issues',
        match: [
          '*://index.baidu.com/*',
        ],
      },
    }),
  ],
});
