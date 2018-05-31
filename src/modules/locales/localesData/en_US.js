const words = {
  all: 'All',
  status: 'Status',
  statuses: '状态',
  side: 'Side',
  sides: '方向',
  market: 'Market',
  markets: '市场',
  amount: 'Amount',
  type: 'Type',
  types: '类型',
  gas: 'Gas',
  price: 'Price',
  total: 'Total',
  worth: "Worth",
  lrc_fee: 'LRC fee',
  lrc_fee_tips: 'xxxxx',
  lrc_reward: 'LRC reward',
  lrc_reward_tips: 'xxxxx',
  ttl: 'Time to Live',
  block: 'Block',
  nonce: 'Nonce',
  sell: 'Sell',
  buy: 'Buy',
  buying: "You are buying",
  selling: "You are selling",
  actions: '操作',
  options: '选项',
  balance: 'Balance',
  balances: '余额',
  send: 'Send',
  receive: 'Receive',
  convert: 'Convert',
  trade: 'Trade',
  password: 'Password',
  copy: "Copy",
  copy_suc: 'Copy Successfully',
  copy_fail: "Copy Failed",
  token:'Token',
  order_type:'Order Type',
  margin_split: "Margin Split",
  order_since: "Valid Since",
  order_until: "Valid Until",
}
const types = {
  trade_side: {
    sell: words.sell,
    buy: words.buy,
  },
};

const validation_messages = {
  invalid_number: "Please input a valid number value"
}

const notifications = {
  title:{
    place_order_failed: "Whoops, order submission somehow failed!",
    place_order_success: "Order placed successfully.",
    place_order_warn: "Your order can not be fully filled.",
  },
  message:{
    wallet_locked: 'Your wallet seems unlocked yet, please unlock first',
    failed_fetch_data_from_server: 'Failed fetch data from server, you could wait a moment and come back later',
    eth_is_required_when_place_order: 'ETH is required to pay Ethereum transaction fees, calculated with your current order cost that need to send Ethereum transactions, totally required {required} ETH.',
    lrcfee_is_required_when_place_order: 'LRC is required to pay trade fees, added on your history orders need LRC, totally required {required} LRC.',
    some_items_not_signed:"You may have some items not signed, please signed all items then continue",
    place_order_success: 'Good job. Your order has been submitted for ring-matching.',
    place_order_balance_not_enough: 'In order for your order to be fully filled, {amount} more {token} is required.',
  }
}

const actions = {
  receive: "Receive",
  submit_order: 'Submit Order',
  generate_qrcode: 'Generate QR Code'
}

const time_unit = {
  second: "Second",
  minute: "Minute",
  hour: "Hour",
  day: "Day",
  week: "Week",
  month: "Month",
}

export default {
  common:{
    ...words,
    ...validation_messages,
    ...time_unit,
  },
  notifications,
  actions,

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
  order_type:{
    market_order : 'Open Market Order',
    p2p_order : 'Privacy P2P Order'
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
  place_order: {},
  gas_setting: {
    // TODO
  },
  ttl_setting: {
    // TODO
  },
  lrc_setting: {
    // TODO
  },
  place_order_confirm: {
    qrcode_security:'*For your order\'s security, your QR code will only generated once and not be stored locally. Make sure to save it properly, any one who received your QR code could take your order',
  },
  p2p_order: {
    order_title: 'Privacy P2P Trade',
    amounts_placeholder: 'Amount to sell',
    amountb_placeholder: 'Amount to buy',
    token_balance: 'Token Balance',
    order_detail: 'Order Detail',
    generate_order: 'Generate Order',
    instruction:'1. 以您希望的兑换率生成一个订单，把不包含鉴权数据（没有这部分数据任何人都无法撮合您的订单）的订单信息提交给relay，同时将生成的订单hash和鉴权信息生成二维码。</br>2. 您可以把这个二维码发送给您的朋友，任何人拿到这个二维码都有可能吃掉您的订单，请注意以安全的方式传播。</br>3. 对方扫描二维码，下一个与您买入卖出量完全匹配的对手单，发送以太坊交易吃掉这个订单，因此吃单方需要消耗油费。',
    notice: '* P2P订单不需要支付LRC手续费</br>'
  },
  sign: {
    not_signed : "You may have some items not signed",
    to_sign: "To Sign"
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
  // -----------
  // wallet
  // -----------
  unlock:{
    has_not_unlocked: 'Your wallet hasn\'t unlocked yet',
    to_unlock:'To Unlock'
  },
  wallet: {
    types: {
      generate: 'Generate',
      metamask: "MetaMask Wallet",
      json: "Json ",
      mnemonic: 'Mnemonic',
      private_key: 'Private Key',
      trezor: 'TREZOR',
      ledger: 'Ledger Wallet',
    },
    title_generate: 'Generate Wallet',
    password_strength_title: 'Password Strength',
    password_strength: {
      weak: 'weak',
      average: 'average',
      strong: 'strong'
    },
    password_tips_weak: 'Password is too weak, at least 7 characters',
    backup_title: 'Backup Wallet',
    backup_tip: 'Circular doesn\'t keep a copy of your privatekey, keystore file, or mnemonic words. Make sure you back up these information immediately.',
    default_address: 'Default Address',
    paste_address_title:'Paste Your Address Here',
    title_json:'Select JSON File',
    actions_backup_json: 'I understand，download the wallet file',
    actions_backup_mnemonic: 'I understand, copy mnemonic',
    actions_backup_private: 'I understand, copy private key',
    actions_unlock: 'Unlock',
    actions_generate: 'Generate Now',
    actions_more_address: 'More Addresses',
    actions_get_metamask: "下载MetaMask插件",
    actions_visit_metaMask: "访问MetaMask官网",
    actions_connect: "连接您的{walletType}钱包",
    actions_select_json: '选择JSON文件',
    actions_paste_mnemonic: '请粘贴您的助记词',
    error_json_tip: '无效的keystore Json ',
    error_mnemonic_tip: "无效的助记词",
    error_password_tip: "请输入密码",
    error_address_tip: "Invalid Address",
    notification_unlock_suc: 'Unlock Successfully',
    notification_unlock_fail: "Unlock Failed",
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
  transaction: {}
}
