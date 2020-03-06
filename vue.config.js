// vue.config.js 中配置的内容，会覆盖默认的webpack配置

module.exports = {
  devServer: {
    open: true,
    port: 3000
    // 配置代理
    // 只要请求的路径中，包含/aaa，就会被代理
    // /aaa/login => http://localhost:8888/api/private/v1/aaa/login

    // 默认不配置，路径重写，会多一个 /aaa，需要去掉/aaa
    // proxy: {
    //   '/aaa': {
    //     target: 'http://localhost:8888/api/private/v1/',
    //     pathRewrite: { '^/aaa': '' }
    //   }
    // }
  }
}
