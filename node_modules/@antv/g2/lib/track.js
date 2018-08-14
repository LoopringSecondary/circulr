/**
 * @fileOverview track g2
 * @author dxq613@gmail.com
 */
var Global = require('./global');
var SERVER_URL = 'https://kcart.alipay.com/web/bi.do';

// 延迟发送请求
setTimeout(function () {
  if (Global.trackable) {
    var image = new Image();
    var newObj = {
      pg: document.URL,
      r: new Date().getTime(),
      g2: true,
      version: Global.version,
      page_type: 'syslog'
    };
    var d = encodeURIComponent(JSON.stringify([newObj]));
    image.src = SERVER_URL + '?BIProfile=merge&d=' + d;
  }
}, 3000);