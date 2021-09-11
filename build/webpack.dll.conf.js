const path = require('path')
const webpack = require('webpack')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const multiConfig = require('../config/multi.conf')
const package = require('../package.json')
let dependencies = Object.keys(package.dependencies) || [];

module.exports = {
  entry: {
    vendor: dependencies
  },
  output: {
    path: path.join(__dirname, '../', `static/${multiConfig.process.name}/js/`),
    filename: `dll.[name]_[hash:6].js`,
    library: '[name]_[hash:6]',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../', '[name]-manifest.json'),
      name: '[name]_[hash:6]'
    })
  ]
}