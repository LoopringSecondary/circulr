import STORAGE from './modules/storage';
import request, {id} from 'LoopringJS/common/request';

export function getSupportedToken() {
  const host = STORAGE.settings.get().relay.selected;
  if(host) {
    let body = {};
    body.method = 'loopring_getLooprSupportedTokens';
    body.params = [{}];
    body.id = id();
    body.jsonrpc = '2.0';
    return request(host, {
      method: 'post',
      body
    })
  }
}

export function getSupportedMarkets() {
  const host = STORAGE.settings.get().relay.selected;
  if(host) {
    let body = {};
    body.method = 'loopring_getLooprSupportedMarket';
    body.params = [{}];
    body.id = id();
    body.jsonrpc = '2.0';
    return request(host, {
      method: 'post',
      body
    })
  }
}

