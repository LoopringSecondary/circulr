const words = {
  all: '全部',
  status: '状态',
  statuses: '状态',
  side: '方向',
  sides: '方向',
  market: '市场',
  markets: '市场',
  amount: '数量',
  type: '类型',
  types: '类型',
  gas: '油费',
  price: '价格',
  total: '总计',
  lrc_fee: 'LRC 撮合费',
  lrc_fee_tips: 'xxxxx',
  lrc_reward: 'LRC 撮合奖励',
  lrc_reward_tips: 'xxxxx',
  ttl:'订单有效期',
  block: '区块',
  nonce: '随机数',
  sell: '卖出',
  buy: '买入',
  actions: '操作',
  options: '选项',
  balance: '余额',
  balances: '余额',
  send: '转出',
  receive: '转入',
  convert: '转换',
  trade: '买卖',
  password: '密码',
  copy: "复制",
  copy_suc: '复制成功',
  copy_fail: "复制失败"
}
const types = {
  trade_side: {
    sell: words.sell,
    buy: words.buy,
  },
}
const validation_messages = {
  invalid_number: "Please input a valid number value"
}
const time_unit = {
  second: "秒",
  minute: "分钟",
  hour: "小时",
  day: "天",
  week: "周",
  month: "月",
}
export default {
  ...words,
  ...validation_messages,
  ...time_unit,
  // -----------
  // order
  // -----------
  order: {
    hash: '订单',
    market: words.market,
    side: words.side,
    amount: words.amount,
    price: words.price,
    total: words.total,
    lrc_fee: words.lrc_fee,
    filled: '成交',
    created: '提交时间',
    expired: '过期时间',
    status: words.total,
  },
  order_status: {
    open: '撮合中',
    completed: '已完成',
    canceled: '已取消',
    expired: '以过期',
  },
  order_side: {
    sell: words.sell,
    buy: words.buy,
  },
  order_list: {
    actions_cancel_all: 'Cancel All',
  },
  order_detail: {
    detail_title: '订单详情',
    tabs_basic: '基础信息',
    tabs_fill: '成交信息',
  },
  place_order: {

  },
  gas_setting: {
    // TODO
  },
  ttl_setting: {
    // TODO
  },
  lrc_setting: {
    // TODO
  },
  place_order_notification:{
    title:{

    },
    message:{

    }
  },
  place_order_confirm: {
    // TODO
  },
  p2p_order: {
    order_title: '线下点对点交易',
  },
  p2p_order_notification:{
    title:{

    },
    message:{

    }
  },
  // -----------
  // transaction
  // -----------
  tx: {
    type: words.type,
    gas: words.gas,
    block: words.block,
    nonce: words.nonce,
    txHash: '交易Hash',
    created: '提交时间',
    status: words.status,
  },
  tx_status: {
    pending: '处理中',
    success: '成功',
    failed: '失败',
  },
  tx_type: {
    sell: words.sell,
    buy: words.buy,
    transfer: '转出',
    receice: '转入',
    approve: '授权',
    lrc_fee: words.lrc_fee,
    lrc_reward: words.lrc_reward,
    convert: '转换',
  },
  tx_detail: {
    detail_title: '交易详情',
    tabs_basic: '基础信息',
    tabs_fill: '成交信息',
  },
  // -----------
  // ticker
  // -----------
  ticker: {
    market: words.market,
    price: words.price,
    change: '24H 涨跌',
    last: '最新成交价',
    high: '24H 最高价',
    low: '24H 最低价',
    vol: '24H 交易量',
  },
  ticker_list: {
    loopring_tickers_title: 'Loopring DEX Markets',
    reference_tickers_title: 'Reference Markets',
    actions_go_to_trade: '前往交易',
  },
  // -----------
  // token
  // -----------
  token_list: {
    total_value: '总资产',
    actions_hide_small_balance: 'Hide tokens with small balance',
    actions_show_my_favorites: 'Only show my favorites',
    actions_send: words.send,
    actions_receive: words.receive,
    actions_trade: words.trade,
    actions_convert_eth_to_weth: '转换 ETH 为 WETH',
    actions_convert_weth_to_eth: '转换 WETH 为 ETH',
  },
  transfer: {},
  convert: {},
  wallet: {
    types: {
      generate: '生成钱包',
      metamask: "MetaMask 钱包",
      json: "Json 文件",
      mnemonic: '助记词',
      private_key: '私钥',
      trezor: 'TREZOR',
      ledger: 'Ledger 钱包',
    },
    title_generate: '生成钱包',
    password_strength: {
      weak: '弱',
      average: '一般',
      strong: '强'
    },
    default_address: '默认地址',
    actions_unlock: '解锁',
    actions_generate: '生成',
    actions_more_address: '选择其他地址',
    actions_get_metamask: "下载MetaMask插件",
    actions_visit_metaMask: "访问MetaMask官网",
    actions_connect: "连接您的{walletType}钱包",
    actions_select_json: '选择JSON文件',
    actions_paste_mnemonic: '请粘贴您的助记词',
    error_json_tip: '无效的keystore Json ',
    error_mnemonic_tip: "无效的助记词",
    error_password_tip: "请输入密码",
    notifications_unlock_suc: '解锁成功',
    notification_unlock_fail: "解锁失败",
  },
  token: {
    action_options: '{token} 选项',
    action_types: {
      receive: "接收{token}",
      send: "转账{token}",
      trade: "交易{token}",
      convert: '转换成{token}'
    },
    receive_title: '我的以太坊地址',
    receive_value_tip: '推荐值',
    recipient: '接受者',
    continue: '继续',
    convert_eth_tip: '我们为您保留0.1 ETH作为油费以保证后续可以发送交易',
    actions_max: "最大数量",
    actions_cancel_send: "取消转账",
    actions_confirm_send: "确认转账",
    actions_confirm_convert: '确认转换'
  },
  transaction: {


  }
}

