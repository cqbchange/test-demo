const path = require('path')
const argvs = process.argv.slice(2)

var lifecycleEvents = String(process.env.npm_lifecycle_event).split(':')
//var moduleName = getParams('name')[1] || lifecycleEvents[1]

var moduleName = 'xcxmanage';

var devConfig = null;

try {
  devConfig = require("./local.env.js")
} catch (e) {
  devConfig = require('./dev.env.js')
}

let baseUrl = devConfig.baseUrl[moduleName];
let host = devConfig.host[moduleName];

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

function getParams(key) {
  let item = argvs.find(item => item.split('=')[0] === key)
  return item ? item.split('=') : []
}

function getModuleAlias(name) {
  let alias = {
    'vue$': 'vue/dist/vue.esm.js',
    '@': resolve(`src/${name}`),
    '@img': resolve(`src/${name}/assets/images`),
    '@view': resolve(`src/${name}/views`),
    '@lib': resolve(`src/${name}/lib`),
    '@font': resolve(`src/${name}/assets/fonts`),
    '@css': resolve(`src/${name}/assets/css`),
    '@js': resolve(`src/${name}/assets/js`),
    '@common': resolve(`src/common`),
  }
  return alias
}

function getModuleConfg(name, opts) {
  let base = {
    port: 8082,
    host: host,
    baseUrl: baseUrl,
    assetsPublicPath: `/Static/${name}/`,
    assetsSubDirectory: name,
    entry: ["babel-polyfill", `./src/${name}/main.js`],
    assetsSubDirectory: `/Static/${name}/`,
    buildoutDir: `../dist/Static/${name}/`,
    buildoutDirTpl: `../dist/Static/${name}/vuebase.tpl`,
    tplname: 'index.html',
  }
  return Object.assign(base, opts)
}


const multiConfig = {
  moduleAlias: getModuleAlias(moduleName),
  process: getModuleConfg(moduleName),
  moduleName
}

module.exports = multiConfig
