const BundleTracker = require("webpack-bundle-tracker");
/*eslint no-useless-escape: "error"*/
module.exports = {
    transpileDependencies: [
      'vuetify'
    ],
   publicPath: "http://127.0.0.1:8080/",
   outputDir: './dist/',
   chainWebpack: config => {
        config.optimization
            .splitChunks(false)
        config
            .plugin('BundleTracker')
            .use(BundleTracker, [{filename: '../frontend/webpack-stats.json'}])

        config.resolve.alias
            .set('__STATIC__', 'static')

        config.devServer
            .public('http://127.0.0.1:8080')
            .host('127.0.0.1')
            .port(8080)
            .hotOnly(true)
            .watchOptions({poll: 1000})
            .https(false)
            .headers({"Access-Control-Allow-Origin": ["*"]})
   },
}
