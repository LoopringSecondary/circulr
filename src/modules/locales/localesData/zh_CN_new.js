const glossary = {
  all:'全部',
  status:'状态',
  statuses:'状态',
  side:'方向',
  sides:'方向',
  market:'市场',
  markets:'市场',
  amount:'数量',
  type:'类型',
  types:'类型',
  gas:'油费',
  price:'',
  total:'总计',
  lrc_fee:'LRC 撮合费',
  lrc_fee_tips:'xxxxx',
  lrc_reward:'LRC 撮合奖励',
  lrc_fee_tips:'xxxxx',
  block:'区块',
  nonce:'随机数',
  sell:'买入',
  buy:'卖出',
  buy:'卖出',
  actions:'操作',
  options:'选项',
  balance:'余额',
  balances:'余额',
  send:'转出',
  receive:'转入',
  convert:'转换',
  trade:'买卖',
}
const common_types = {
  trade_side:{
    sell:glossary.sell,
    buy:glossary.buy,
  },
}
export default {
  // -----------
  // order
  // -----------
  type_order:{
    hash:'订单',
    market:glossary.market,
    side:glossary.side,
    amount:glossary.amount,
    price:glossary.price,
    total:glossary.total,
    lrc_feelrc_fee:glossary.lrc_fee,
    filled:'成交',
    created:'提交时间',
    expired:'过期时间',
    status:glossary.total,
  },
  type_order_status:{
    open:'撮合中',
    completed:'已完成',
    canceled:'已取消',
    expired:'以过期',
  },
  type_order_side:{
    sell:glossary.sell,
    buy:glossary.buy,
  },
  ui_order_list:{
    actions_cancel_all:'Cancel All',
  },
  ui_order_detail:{
    detail_title:'订单详情',
    tabs_basic:'基础信息',
    tabs_fill:'成交信息',
  },
  ui_place_order:{
    // TODO
  },
  ui_gas_setting:{
    // TODO
  },
  ui_ttl_setting:{
    // TODO
  },
  ui_lrc_setting:{
    // TODO
  },
  ui_place_order_confirm:{
    // TODO
  },
  // -----------
  // transaction
  // -----------
  type_tx:{
    type:glossary.type,
    gas:glossary.gas,
    block:glossary.block,
    nonce:glossary.nonce,
    txHash:'交易Hash',
    created:'提交时间',
    status:glossary.status,
  },
  type_tx_status:{
    pending:'处理中',
    success:'成功',
    failed:'失败',
  },
  type_tx_type:{
    sell:glossary.sell,
    buy:glossary.buy,
    transfer:'转出',
    receice:'转入',
    approve:'授权',
    lrc_fee:glossary.lrc_fee,
    lrc_reward:glossary.lrc_reward,
    convert:'转换',
  },
  ui_tx_detail:{
    detail_title:'交易详情',
    tabs_basic:'基础信息',
    tabs_fill:'成交信息',
  },
  // -----------
  // ticker
  // -----------
  type_ticker:{
    market:glossary.market,
    price:glossary.price,
    change:'24H 涨跌',
    last:'最新成交价',
    high:'24H 最高价',
    low:'24H 最低价',
    vol:'24H 交易量',
  },
  ui_ticker_list:{
    loopring_tickers_title:'Loopring DEX Markets',
    reference_tickers_title:'Reference Markets',
    actions_go_to_trade:'前往交易',
  },
  // -----------
  // token
  // -----------
  ui_token_list:{
    total_value:'总资产',
    actions_hide_small_balance:'Hide tokens with small balance',
    actions_show_my_favorites:'Only show my favorites',
    actions_send:glossary.send,
    actions_receive:glossary.receive,
    actions_trade:glossary.trade,
    actions_convert_eth_to_weth:'转换 ETH 为 WETH',
    actions_convert_weth_to_eth:'转换 WETH 为 ETH',
  },
  ui_transfer:{

  },
  ui_convert:{

  },
}

