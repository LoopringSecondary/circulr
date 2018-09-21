//const config = require('./config.json');
import fetch from 'dva/fetch';
import STORAGE from 'modules/storage';
import moment from 'moment';

const data = require('./data')
const config = data.configs
const tokensIcons = require('./tokens_icons.json');

const txs = config.txs;
const projects =  data.projects;

function requestWhiteList() {
  const url = "//raw.githubusercontent.com/Loopring/mock-relay-data/master/whiteList.json";
  return fetch(url, {method:'GET'}).then((res) => res.json())
}

async function  isinWhiteList(address) {
 return await requestWhiteList().then(whiteList =>{
    const result = whiteList.find(add => add.toLowerCase() === address.toLowerCase());
    return !!result;
  });
}

function getChainId(){
  return config.chainId
}

function getTokenBySymbol(symbol){
  if(!symbol){ return {} }
  return getTokens().find(token=>token.symbol.toLowerCase()===symbol.toLowerCase()) || {}
}

function getTokenByAddress(address){
  if(!address){ return {} }
  return getTokens().find(token=>token.address.toLowerCase()===address.toLowerCase())
}

function getCustomTokens(){
  return getTokens().filter(token=>token.custom)
}

function getTokens(){
  const cacheConfigs = STORAGE.settings.getConfigs()
  if(cacheConfigs && cacheConfigs.tokens) {
    return cacheConfigs.tokens
  }
  return []
  // return [{
  //   "symbol": "ETH",
  //   "digits": 18,
  //   "address": "",
  //   "precision": 6,
  // }, ...STORAGE.settings.getTokensConfig().map(item=>{
  //   item.icon = tokensIcons[item.symbol]
  //   item.precision = item.digits > 6 ? 6 : item.digits
  //   return item
  // })].filter(item=>{
  //   return !config.ignoreTokens || !config.ignoreTokens.includes(item.symbol)
  // })
}

function getMarketByPair(pair) {
  if (pair) {
    const pairArr = pair.split('-')
    if(pairArr && pairArr.length === 2) {
      return getMarketBySymbol(pairArr[0], pairArr[1])
    }
  }
}

function getProjectByName(name) {
  if(!name){return {}}
 return  projects.find(project=> project.name.toLowerCase() === name.toLowerCase())
}

function getProjectById(id) {
  if(!id){return {}}
  return projects.find(project=> project.projectId === id)
}
function getProjectByLrx(lrx) {
  if(!lrx){return {}}
  return  projects.find(project=> project.lrx.toLowerCase() === lrx.toLowerCase())
}

function getSupportedMarketsTokenR() {
  // return config.supportedTokenRInMarkets
  const cacheConfigs = STORAGE.settings.getConfigs()
  if(cacheConfigs && cacheConfigs.supportedTokenRInMarkets) {
    return cacheConfigs.supportedTokenRInMarkets
  }
  return []
}

function isSupportedMarket(market) {
  if(!market) return false
  const pair = market.split('-')
  if(pair.length !== 2) return false
  return getMarkets().find(m=> {
    return (m.tokenx === pair[0].toUpperCase() && m.tokeny === pair[1].toUpperCase()) || (m.tokenx === pair[1].toUpperCase() && m.tokeny === pair[0].toUpperCase())
  })
}

function getMarketBySymbol(tokenx, tokeny) {
  if (tokenx && tokeny) {
    return getMarkets().find(market=> {
      return (market.tokenx === tokenx && market.tokeny === tokeny) || (market.tokenx === tokeny && market.tokeny === tokenx)
    }) || {
      "pricePrecision": 8
    }
  }else{
    return {
      "pricePrecision": 8
    }
  }
}

function getMarketsByTokenR(token) {
  return getMarkets().filter(item=>item.tokeny === token)
}

function getMarketsByTokenL(token) {
  return getMarkets().filter(item=>item.tokenx === token)
}

function getTokenSupportedMarket(token) {
  const supportedToken = getSupportedMarketsTokenR()
  let foundMarket = ''
  if(supportedToken) {
    if(supportedToken.includes(token)) {
      const markets = getMarketsByTokenR(token)
      if(markets) {
        foundMarket = markets[0].tokenx + "-" + markets[0].tokeny
      }
    } else {
      const tokenR = supportedToken.find((x,i) =>{
        const market = token + "-" + x
        if(isSupportedMarket(market)) {
          return true
        }
      })
      if(tokenR) foundMarket = token + "-" + tokenR
    }
  }
  return foundMarket
}

function getTokenSupportedMarkets(token) {
  const leftMarket = getMarketsByTokenL(token)
  const rightMarket = getMarketsByTokenR(token)
  return [...leftMarket, ...rightMarket]
}

function getMarkets() {
  const cacheConfigs = STORAGE.settings.getConfigs()
  if(cacheConfigs && cacheConfigs.markets && cacheConfigs.newMarkets) {
    return cacheConfigs.markets.concat(cacheConfigs.newMarkets)
  }
  return []
}

function getGasLimitByType(type) {
  if(type){
    return txs.find(tx => type === tx.type)
  }
}

function getWalletAddress() {
  return config.walletAddress
}

function getDelegateAddress() {
  return config.delegateAddress;
}

function getWallets() {
  return data.wallets
}

function getRemoteConfig() {
  const random = moment().format('YYMMDDhhmm')
  return fetch(`https://config.loopring.io/circulr/config.json?${random}`, {
    method:'get',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
    }
  })
    .then(res => {
      return res.json()
    })
    .then(res => {
      console.log(`https://config.loopring.io/circulr/config.json response:`, res);
      return res
    })
}

export default {
  getTokenBySymbol,
  getTokenByAddress,
  getTokens,
  getMarketBySymbol,
  getMarketByPair,
  getProjectByName,
  getProjectById,
  getProjectByLrx,
  getGasLimitByType,
  isinWhiteList,
  getChainId,
  isSupportedMarket,
  getSupportedMarketsTokenR,
  getMarketsByTokenR,
  getTokenSupportedMarket,
  getTokenSupportedMarkets,
  getMarkets,
  getWalletAddress,
  getDelegateAddress,
  getWallets,
  getCustomTokens,
  getRemoteConfig
}
