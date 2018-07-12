
## About
Circular is a Loopring DEX frontend without accessing to users' private-keys. Users can trade ERC20 tokens with others by scaning order QR code.

Circulr is not responsive and is designed for desktop browsers only. You can try it out on https://circulr.loopring.io.

## Documents in Other Languages

- [Chinese (中文文档)](chinese.md)


## Features
- Loopring protocol: A web-based dex with Loopring protocol integration
- Trade: Sell & Buy tokens, can place order by scanning QR code with Loopr app
- Support multiple languages

## Stack

- React
- React-Router
- Redux
- Redux-saga: An alternative side effect model for Redux apps [Link](https://github.com/redux-saga/redux-saga)
- Roadhog: Cli tool for creating react apps, configurable version of create-react-app. [Link](https://github.com/sorrycc/roadhog)
- Antd: A react UI componnets library. [Link](https://github.com/ant-design/ant-design)
- Dva: Lightweight front-end framework based on redux, redux-saga and react-router. [Link](https://github.com/dvajs/dva)


## Start

```
1. npm install
2. cd src/common/loopringjs && npm install 
3. cd ../../ && npm run start
```

## run for develop with a https dev server

1. cd node_modules/af-webpack/lib/dev.js 
2. find serverConfig at 84 line 
3. add https: true in serverConfig 
4. npm start
5. vist https://localhost:8000 (Note: https)

## Deploy

1. clone our project to local and cd the directory

2. build project

   ```
   npm run build
   ```
   
3. [sign up](https://firebase.google.com/) for your firebase account(if you already have one, please continue to step 4)

4. install firebase-cli  

   ```
   npm install -g firebase-tools
   ```

5. deploy

   ```
   firebase  deploy
   ```
