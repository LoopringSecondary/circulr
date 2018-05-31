const setCurrent = (market) => {
  let markets = {}
  if (
    localStorage.markets &&
    localStorage.markets !== 'undefined' &&
    localStorage.markets !== 'null'
  ) {
    markets = JSON.parse(localStorage.markets)
  }
  markets.current = market
  localStorage.markets = JSON.stringify(markets)
}
const getCurrent = () => {
  if (localStorage.markets) {
    let markets = JSON.parse(localStorage.markets)
    return markets.current
  } else {
    return 'LRC-WETH'
  }
};

const setRecent = (market) => {
  let markets = localStorage.markets ? JSON.parse(localStorage.markets) :{};
  const recent = getRecent();
  if (!recent.find(item => item.toLowerCase() === market.toLowerCase())) {
    markets.recent = [market,...recent,];
    if (markets.recent.length > 3) {
      markets.recent = markets.recent.slice(0,3)
    }
  }else{
    const index = recent.indexOf(market);
     recent.splice(index,1);
     markets.recent = [market,...recent]
  }
  localStorage.markets = JSON.stringify(markets);
};

const getRecent = () => {
  if (localStorage.markets) {
    let markets = JSON.parse(localStorage.markets);
    return markets.recent ? markets.recent : [];
  }
  return []
};


const toggleFavor = (market) => {
  let markets = {}
  if (
    localStorage.markets &&
    localStorage.markets !== 'undefined' &&
    localStorage.markets !== 'null'
  ) {
    markets = JSON.parse(localStorage.markets)
  }
  if (typeof markets.favors !== 'object') {
    markets.favors = {}
  }
  markets.favors[market] = !markets.favors[market]
  localStorage.markets = JSON.stringify(markets)
}
const getFavors = (market) => {
  if (localStorage.markets) {
    let markets = JSON.parse(localStorage.markets)
    return markets.favors || {}
  } else {
    return {}
  }
}

export default {
  setCurrent,
  getCurrent,
  toggleFavor,
  getFavors,
  setRecent,
  getRecent
}

