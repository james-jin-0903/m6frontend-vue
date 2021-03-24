module.exports = {
  productionSourceMap: false,
  lintOnSave: false,
  transpileDependencies: ['vuetify'],
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/scss/_global.scss";'
      }
    }
  },
  devServer: {
    disableHostCheck: true
  }
}
