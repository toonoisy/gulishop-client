module.exports = {
  lintOnSave: false,
  devServer: {
    // 正向代理处理跨域
    proxy: {
      '/api': {
        target: 'http://182.92.128.115/',
      }
    }
  }
}