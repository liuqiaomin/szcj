let filePath = 'static/js/';// 打包后 js 文件保存目录
let timeStamp = new Date().getTime();// 当前时间戳

if (process.env.UNI_PLATFORM === 'h5') {
    // 由于这种方式的打包，会导致编译生成微信小程序（只验证了微信小程序）无法正常使用，所以判断只针对 h5 发行的情况采用重构
    module.exports = {
        // webpack 相关配置
        filenameHashing: false, // 文件名是否加上hash值
        configureWebpack: {
            // webpack 配置 解决js缓存的问题，目前只适配H5端打包
            output: {
                // 输出重构  打包编译后的 文件目录 文件名称 【模块名称.时间戳】，更多参数参考 vue webpack 配置
                filename: `${filePath}[name].${timeStamp}.js`,
                chunkFilename: `${filePath}[name].${timeStamp}.js`
            },
        }
    }
} else {
    // 其他打包需要的相关配置
    module.exports = {
        // webpack 相关配置
        filenameHashing: false, // 文件名是否加上hash值
    }
}
