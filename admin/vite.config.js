import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import path from 'path-browserify'
import path from 'path'

import { viteMockServe } from 'vite-plugin-mock'


// svg-icon插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
export default defineConfig({
    plugins: [
        vue(),
        createSvgIconsPlugin({
            // 指定要缓存的图标文件夹
            iconDirs: [path.resolve('./src/icons/svg')],
            // 执行icon name的格式
            symbolId: 'icon-[name]',
        }),
        viteMockServe({
            supportTs: false,
            logger: true,
            enable: false,
            mockPath: "./src/mock/",

        })
    ],
    base: "./", //打包路径
    resolve: {
        alias: {
            '@': path.resolve('./src')
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
        host: '0.0.0.0',
        port: 9998,
        open: true,
        cors: true,
        proxy: {
            '/admin': {
                target: 'https://sc.szhxch.com', // 后端真实地址（或 80/你的 TP 端口）
                changeOrigin: true,
                secure: false
            }
        }
    }


})
