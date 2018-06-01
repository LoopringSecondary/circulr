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
  worth: "价值",
  lrc_fee: 'LRC 撮合费',
  lrc_fee_tips: 'xxxxx',
  lrc_reward: 'LRC 撮合奖励',
  lrc_reward_tips: 'xxxxx',
  ttl: '订单有效期',
  block: '区块',
  nonce: '随机数',
  sell: '卖出',
  buy: '买入',
  buying: "您正在购买",
  selling: "您正在出售",
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
  copy_fail: "复制失败",
  token: '代币',
  order_type: '订单类型',
  margin_split: "分润",
  order_since: "订单生效时间",
  order_until: "订单失效时间",
  format_amount: "{amount,number}",
  back: '返回',
  cancel:"取消",
  previous_page: '前一页',
  next_page: '后一页',
  import: "导入"
}
const types = {
  trade_side: {
    sell: words.sell,
    buy: words.buy,
  },
}

const validation_messages = {
  invalid_number: "请输入合法的数字"
}

const notifications = {
  title: {
    place_order_failed: "订单提交失败 !",
    place_order_success: "下单成功!",
    place_order_warn: '您的订单只能被部分撮合',
    unlock_suc: '解锁成功',
    unlock_fail: "解锁失败",
  },
  message: {
    wallet_locked: '您的钱包还未解锁，请先解锁后再继续操作',
    failed_fetch_data_from_server: '从服务器获取数据失败, 请稍后在尝试',
    eth_is_required_when_place_order: '由于需要支付ETH油费, 根据您当前订单需要发送的以太坊交易计算，还需要 {required} ETH',
    lrcfee_is_required_when_place_order: '由于需要支付LRC油费, 汇总您历史订单所需LRC，还需要 {required} LRC',
    some_items_not_signed: "您可能还有一些数据还未签名，请把所有未签名项签名后再继续操作",
    place_order_success: '恭喜, 您的订单已经可以等待交易',
    place_order_balance_not_enough: '为使订单全部成交, 至少还需要{amount} {token}',
  }
}

const actions = {
  receive: "接收",
  submit_order: '提交订单',
  generate_qrcode: '生成二维码'
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
  common: {
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
  order_type: {
    market_order: '公开市场订单',
    p2p_order: '私密点对点订单'
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
    qrcode_security: '*为了您订单的安全，二维码只会生成一次并且不会保存在任何地方。请确认妥善保存二维码，任何收到您二维码的人都有可能吃掉您的订单。'
  },
  p2p_order: {
    order_title: '私密点对点交易',
    amounts_placeholder: '卖出数量',
    amountb_placeholder: '买入数量',
    token_balance: '代币余额',
    order_detail: '订单详情',
    generate_order: '生成订单',
    instruction: '1. 以您希望的兑换率生成一个订单，把不包含鉴权数据（没有这部分数据任何人都无法撮合您的订单）的订单信息提交给relay，同时将生成的订单hash和鉴权信息生成二维码。</br>2. 您可以把这个二维码发送给您的朋友，任何人拿到这个二维码都有可能吃掉您的订单，请注意以安全的方式传播。</br>3. 对方使用Circulr移动端扫描二维码，下一个与您买入卖出量完全匹配的对手单，发送以太坊交易吃掉这个订单，因此吃单方需要消耗油费。',
    notice: '* P2P订单双方都不需要支付LRC手续费</br>'
  },
  sign: {
    not_signed: "您还未完成签名",
    to_sign: "去签名"
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
  unlock: {
    has_not_unlocked: '您的钱包还未解锁',
    to_unlock: '解锁钱包',
    title_connect: '连接{walletType}',
    actions_unlock: '解锁',
    actions_connect: "连接您的{walletType}",
    connect_ledger_tip: "请连接您的Ledger钱包",
    connect_trezor_tip: "请连接您的TREZOR",
    error_invalid_tip: "信息不合法",
  },
  wallet_type:{
    generate: '生成钱包',
    metamask: "MetaMask 钱包",
    json: "Json 文件",
    mnemonic: '助记词',
    private_key: '私钥',
    trezor: 'TREZOR',
    ledger: 'Ledger 钱包'
  },

  password:{
    password_strength_title: '密码强度',
    password_strength: {
      weak: '弱',
      average: '一般',
      strong: '强'
    },
    password_tips_weak: '密码强度不足,至少需要7个字符。',
    password_tips_lack: "请输入密码"
  },

  wallet_generate:{
    title_generate: '生成钱包',
    backup_title: '备份钱包',
    backup_tip: 'Circular钱包不会保存用户的私钥、Keystore、助记词，强烈建议您在线下备份这些信息（不联网的USB硬盘或纸质存储）。一旦私钥、Keystore、助记词丢失将无法恢复!',
    actions_backup_json: '我已经明白，下载钱包文件',
    actions_backup_mnemonic: '我已经明白，复制助记词',
    actions_backup_private: '我已经明白，复制私钥',
    actions_generate: '生成钱包',
  },

  wallet_meta:{
    actions_get_metaMask: "下载MetaMask插件",
    actions_visit_metaMask: "访问MetaMask官网",
    browser_tip: '您的浏览器不支持MetaMask解锁，推荐您使用Chrome',
    unlock_metaMask_tip: '解锁MetaMask',
    install_metaMask_tip: '安装MetaMask',
    unlock_steps_title: '你要做的步骤',
    unlock_refresh_button: '全做完了？刷新Circular',
    unlock_step_install_title: '安装MetaMask',
    unlock_step_install_content: '为你的浏览器安装MetaMask插件',
    unlock_step_unlock_title: '解锁MetaMask',
    unlock_step_unlock_content: '在MetaMask上创建一个账号或解锁已有账号',
    unlock_step_refresh_title: '刷新Circular',
    unlock_step_refresh_content: '刷新Circular钱包使MetaMask生效',
  },
  address:{
    paste_address_title: '请粘贴您的地址',
    invalid_address_tip: '不合法的地址',
  },
  wallet_determine:{
    default_address: '默认地址',
    title_deter_address: "选择地址",
    actions_other_address: '选择其他地址',
    title_select_path: '选择dpath',
    custom_path: '自定义dpath',
    no_address_tip: '没有合法的地址',
  },
  json:{
    error_json_tip: '无效的Keystore Json',
    title_json: '选择JSON文件',
  },

  mnemonic:{
    actions_paste_mnemonic: '请粘贴您的助记词',
    error_mnemonic_tip: "无效的助记词",
    mnemonic_tip_lack: "请输入您的助记词"
  },

  key: {
    paste_private_title: "请粘贴您的私钥",
    error_private_tip: '不合法的私钥',
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

