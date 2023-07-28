const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/h5p',
    createProxyMiddleware({
      target: 'http://server:8080',
      changeOrigin: true,
    })
  );
};
