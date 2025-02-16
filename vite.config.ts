import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // 保持图片和音乐资源的原始名称
          if (/\.(png|jpe?g|gif|svg|mp3|wav|ogg)$/.test(assetInfo.name || '')) {
            return assetInfo.name || '';
          }
          return '[name].[hash][extname]'; // 其他资源使用默认命名
        },
      },
    },
  },
});