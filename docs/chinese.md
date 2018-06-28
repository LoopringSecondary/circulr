
## 介绍

## 特色
- 路印协议: 集成了路印协议的去中心化交易所。
- 交易: 买卖token,可以采用loopr APP 进行扫码下单
- 支持多种语言

## 技术栈

- React
- React-Router
- Redux
- [Redux-saga]( https://github.com/redux-saga/redux-saga): redux-saga 是一个用于管理应用程序 Side Effect（副作用，例如异步获取数据，访问浏览器缓存等）的 library。
- [Roadhog](https://github.com/sorrycc/roadhog): Roadhog 是一个包含 dev、build 和 test 的命令行工具。
- [Antd](https://github.com/ant-design/ant-design): 一个react 组件库。
- [Dva](https://github.com/dvajs/dva):基于 redux、redux-saga 和 react-router 的轻量级前端框架。


## start

1. npm install
2. cd src/common/loopringjs && npm install 
3. cd ../../ && npm run start

## 以开发模式启动https服务

1. 进入 node_modules/af-webpack/lib/dev.js 
2. 在文件84行找到serverConfig
3. 在 serverConfig 中加入 https: true
4. npm start
5. 访问 https://localhost:8000 (注意: https)

## 部署

1. clone 项目到本地

2. build项目

   ```
   npm run build
   ```

3. [注册](https://firebase.google.com/)firebase account(如果已经有账号，请继续下一步)

4. 安装 firebase-cli  

   ```
   npm install -g firebase-tools
   ```

5. deploy

   ```
   firebase  deploy
   ```
