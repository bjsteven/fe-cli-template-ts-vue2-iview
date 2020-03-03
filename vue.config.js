const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = dir => path.join(__dirname, 'src', dir)

module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/': {
        target: 'http://api.project-dev.com',
        changeOrigin: true,
        ws: false,
        bypass(req) {
          if (req.headers.accept.indexOf('html') !== -1) {
            return '/index.html'
          }
        },
        onProxyRes(proxy) {
          // dev环境同源cookie
          const cookies = proxy.headers['set-cookie']
          if (cookies) {
            const newCookies = cookies.map(it =>
              it.replace(/Domain=[^\s;]+;?/i, 'Domain=localhost;'))
            proxy.headers['set-cookie'] = newCookies
          }
        }
      }
    }
  },

  chainWebpack: config => {
    const isDev = process.env.NODE_ENV === 'development'
    // 开发|测试|仿真|生产：dev|test|qas|prd
    ; [
      {
        env: 'dev',
        baseUrl: isDev ? '/' : '//www.project-dev.com',
        ajaxBaseUrl: isDev ? '/' : '//api.project-dev.com',
      },
      {
        env: 'test',
        baseUrl: isDev ? '/' : '//www.project-dev.com',
        ajaxBaseUrl: isDev ? '/' : '//api.project-test.com',
      },
      {
        env: 'qas',
        baseUrl: isDev ? '/' : '//www.project-dev.com',
        ajaxBaseUrl: isDev ? '/' : '//api.project-qas.com',
      },
      {
        env: 'prd',
        baseUrl: isDev ? '/' : '//www.project-dev.com',
        ajaxBaseUrl: isDev ? '/' : '//api.project-prd.com',
      }
    ].forEach(it => {
      const { env } = it
      config.plugin(env === 'dev' ? 'html' : `html-${env}`).use(HtmlWebpackPlugin, [{
        template: 'public/index.html',
        filename: isDev && env === 'dev'
          ? 'index.html'
          : `index-project-${env}.html`,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          removeAttributeQuotes: true,
        },
        VAR: it,
      }])
    })

    config.performance.hints(false)
  }
}
