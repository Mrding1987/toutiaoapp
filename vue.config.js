const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    // deServer配置项是从网上查询的解决
    /*   devServer: {
        host: '0.0.0.0',
        port: 8080,
        client: {
            WebSocketURL: 'ws://0.0.0.0:8080/ws'
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    },
 */
    /*    devServer: {
           proxy: {
               '/': {
                   ws: false, // proxy websockets
                   target: 'http://192.168.1.11:8080',
                   pathRewrite: {
                       '^/': '/bpp/'
                   },
                   cookiePathRewrite: {
                       '/bpp': '/'
                   }
               }
           }
       },
       baseUrl: process.env.NODE_ENV === 'production' ? '/bpp' : '/', */
    transpileDependencies: true
})