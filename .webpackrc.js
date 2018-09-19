export default {
	"extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }],
	],
  disableCSSModules: true,
  hash:true,
	"alias":{
    "LoopringJS":`loopring.js/lib`,
    "LoopringUI":`${__dirname}/src/common/loopringui/`,
    "common":`${__dirname}/src/common`,
    "modules":`${__dirname}/src/modules`,
	},
  "theme": {
    "@font-family-no-number"  : "Roboto ,PingFang SC",
    "@font-family"            : "@font-family-no-number",
    "@primary-color": "#0077FF",
    "@link-color": "#0077FF",
    "@border-radius-base": "0px",
    "@line-height-base" : 1.6,
    "@normal-color" :"#eee",
    "@border-color-base" : "hsv(0, 0, 90%)",
  },
  "html": {
    "template": "./public/index.ejs",
    "favicon": './src/assets/images/favicon.ico'
  },
  sass:{},
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },

}


