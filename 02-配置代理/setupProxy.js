const proxy = require('http-proxy-middleware')
module.exports = function(app) {
  app.use(
    proxy('/api1', {
      target: 'https://api.binstd.com',
      changeOrigin: true,
      pathRewrite: { '^/api1': '' }
    })
  )
}