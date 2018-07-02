const words = {
  all: '全部',
  time: '时间',
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
  gas_limit:'Gas 数量',
  gas_price:'Gas 价格',
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
  format_amount: "{amount,number}",
  back: '返回',
  cancel: "取消",
  previous_page: '前一页',
  next_page: '后一页',
  import: "导入",
  recipient: '接收者',
  help:'帮助',
  feedback:"反馈",
  quit:'退出',
  canceling:'取消中',
  list:{
    no_data:'暂无数据',
  },
  slow:'慢',
  fast:'快',
  expired:'已过期'
}

const types = {
  trade_side: {
    sell: words.sell,
    buy: words.buy,
  },
}

const validation_messages = {
  invalid_number: "请输入合法的数字",
  invalid_integer: '请输入合法的整数',
  token_not_select: "请选择代币",
  invalid_eth_address: "不合法的以太坊地址",
}

const notifications = {
  title: {
    place_order_failed: "订单提交失败 !",
    place_order_success: "下单成功!",
    place_order_warn: '您的订单只能被部分撮合',
    unlock_suc: '解锁成功',
    unlock_fail: "解锁失败",
    to_confirm: "等待您的确认",
    send_failed: '转账失败 !',
    send_succ: '转账成功',
    copy_suc:'复制成功',
    copy_fail:'复制失败',
    not_allowed_place_order_worth: '订单金额过小',
    in_watch_only_mode:'已切换至观察模式',
    using_watch_only_mode:'您正在使用观察模式',
    resend_suc:'重新发送交易成功',
    resend_fail:'重新发送交易失败',
    cancel_suc:'取消交易成功发出',
    cancel_fail:'取消交易失败',
    address_change:'解锁地址改变',
    unlock_first:'请先解锁钱包',
    cancel_order_suc:"取消订单成功",
    cancel_all_order_suc:"取消全部{market}订单成功",
    cancel_order_failed:"取消订单失败",
    cancel_all_order_failed:"取消全部{market}订单失败",
    init_failed: "初始化数据失败",
    sub_failed:"提交失败",
    invalid_wallet_type:"不存在的钱包类型",
    dif_address:'您解锁的地址和当前的钱包地址不同，请选择当前钱包的地址进行签名'
  },
  message: {
    wallet_locked: '您的钱包还未解锁，请先解锁后再继续操作',
    failed_fetch_data_from_server: '从服务器获取数据失败, 请稍后在尝试',
    eth_is_required_when_place_order: '由于需要支付ETH油费, 根据您当前订单需要发送的以太坊交易计算，还需要 {required} ETH',
    lrcfee_is_required_when_place_order: '由于需要支付LRC油费, 汇总您历史订单所需LRC，还需要 {required} LRC',
    some_items_not_signed: "您可能还有一些数据还未签名，请把所有未签名项签名后再继续操作",
    place_order_success: '恭喜, 您的订单已经可以等待交易',
    place_order_balance_not_enough: '为使订单全部成交, 至少还需要{amount} {token}',
    confirm_warn_ledger: "请在您的Ledger设备上确认签名信息, 之后再回来提交订单",
    confirm_warn_trezor: "请在您的Trezor设备上确认签名信息, 之后再回来提交订单",
    confirm_warn_metamask: "您的MetaMask浏览器插件上会提示您签名, 请确认后再回来提交订单",
    send_failed: "您{do} {amount} {token} 失败, 原因:{reason}",
    send_succ: "您转账 {amount} {token} 成功",
    not_allowed_place_order_worth: '由于您当前订单总价值小于{worth}, 无法下单',
    eth_is_required: '由于需要支付ETH油费, 根据您当前订单需要发送的以太坊交易计算，还需要 {required} ETH',
    lrcfee_is_required: '由于需要支付LRC油费, 汇总您历史订单所需LRC，还需要 {required} LRC',
    unlock_by_cookie_address:'Loopr切换您的账户至观察模式，您的私钥对当前网页已失效。当您执行一些操作时可能需要再次解锁钱包。',
    address_change:'解锁地址从{add1}变成{add2}',
    ledger_connect_failed: "与您的Ledger设备连接失败, 您可以参照以下建议. 1、请确保您的设备与电脑连接并解锁. 2、在设备上将该选项设置为'yes': Settings->Browser support 3、在设备上选择'Ethereum app'并进入",
    unlock_diff_address_to_sign: '您正在进行签名操作，请使用地址为{address}的钱包解锁'
  }
}

const actions = {
  receive: "接收",
  submit_order: '提交订单',
  generate_qrcode: '生成二维码',
  reset: '重置',
  continue: '继续',
  to_unlock: '去解锁',
  transfer_cancel: "不，取消发送",
  transfer_send: "是的，马上发送",
  place_buy_order: "提交买单",
  place_sell_order: "提交卖单",
  view_result_etherscan: "在EtherScan查看结果",
  cancel_tx:'取消交易',
  confirm: '确认',
  select_wallet:'选择钱包来授权操作',
  submit:'提交',
  change_gas_price:'调整Gas Price'
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
    LRCFee: words.lrc_fee,
    marginSplit: words.margin_split,
    filled: '成交数量',
    validSince: '订单生效时间',
    validUntil: '订单失效时间',
    status: words.status,
    no:words.cancel,
    canceling:words.canceling,
  },
  order_type: {
    market_order: '公开市场订单',
    p2p_order: '私密点对点订单'
  },
  order_status: {
    opened: '撮合中',
    completed: '已完成',
    canceled: '已取消',
    expired: '已过期',
  },
  order_side: {
    sell: words.sell,
    buy: words.buy,
  },
  order_list: {
    actions_cancel_all: '取消全部',
    my_open_orders:'最近订单',
    my_all_orders:'全部订单',
    order_book:'最新挂单',
  },
  order_detail: {
    title: '订单详情',
    tabs_basic: '基础信息',
    tabs_fills: '成交信息',
  },
  place_order: {
    title: '提交订单',
    order_type: '订单类型',
    order_since: "订单生效时间",
    order_until: "订单失效时间",
    buying: "您正在购买",
    selling: "您正在出售",
    select_wallet: '选择下单钱包'
  },
  place_order_by_loopr: {
    title: '使用Loopr移动端钱包下单',
    step_qrcode: '扫描二维码',
    step_sign: '在Loopr上签名发送',
    step_result: '结果',
    qrcode_overdue: '二维码已过期，请重新下单生成新二维码',
    instruction_download: '下载Loopr-IOS',
    instruction_scan: '打开您的Loopr钱包，扫描二维码，确认信息完成签名，并提交订单',
    instruction_warn: '* 二维码有效时间24小时，请尽快完成扫码操作，过期后请重新下单生成二维码',
    waiting_sign: '等待手机对订单进行签名提交',
  },
  place_order_by_ledger: {
    title: '使用Ledger下单',
    connect: '连接 Leager',
    confirm_unlock_address: '请确认解锁地址',
    step_connect: '连接您的Ledger',
    step_sign: '在Ledger上确认签名',
    step_result: '结果'
  },
  place_order_by_metamask: {
    title: '使用 MetaMask 下单',
    connect: '连接 MetaMask',
    step_connect: '连接MetaMask',
    step_sign: '在MetaMask上确认签名',
    step_result: '结果'
  },
  place_order_sign: {
    unsigned_tx: '未签名信息',
    signed_tx: '签名后信息',
    unsigned: '未签名',
    signed: '已签名',
    type_sign_order: '签名原始订单',
    type_cancel_allowance: '取消{token}授权',
    type_approve: '{token}授权'
  },
  order_cancel:{
    title:'取消订单',
    cancel_title:'您正在取消一笔订单',
    cancel_all_title:"您正在取消全部{pair}订单",
    canceling:words.canceling,
    actions_to_cancel:'确认取消订单',
    manual_cancel_tip:'手动取消订单会消耗ETH Gas',
    order_expire_title: "距离订单自动失效还有",
    expire_duration: "{days,plural,=0{} other {# 天}} {hours,plural,=0{} other {# 小时}} {minutes,plural,=1{1 分钟} other {# 分钟}} {seconds,plural,=1{1 秒} other {# 秒}}",
    order_validity:'订单有效期',
    order_expired_tip:"该订单已经过期",
    actions_wait_expire:'等待订单自动失效',
    auto_expire_title:'订单自动失效不会消耗ETH Gas',
    no_orders:'没有订单需要取消'

  },
  settings: {
    title: '设置',
    preferences: '偏好',
    tradings: '交易',
    relays: '中继',
    language: '语言',
    currency: '货币',
    timezone: '时区',
    select_placeholder: '搜索/选择',
    time_to_live: '订单有效时间',
    trading_fee: '交易费(LRC)',
    margin_split: '默认分润',
    gas_price: '默认Gas价格',
    choose_relay: '切换Relay'
  },
  gas_setting: {
    title: '设置矿工费',
    gas_selector_last: '上一次',
    gas_selector_estimate: '推荐',
    gas_selector_custom: '自定义',
    mode_easy_title: '推荐',
    mode_advanced_title: '高级',
    gas_limit: 'Gas数量',
    gas_price: 'Gas价格',
    gas_fee: '矿工费',
    none: '无'
  },
  setting_ttl: {
    title:'设置订单有效期',
    tabs_basic:'快速设置',
    tabs_advanced:'高级设置',
    more:'更多',
    input_place_holder: '订单有效时间是多久？',
  },
  setting_lrcfee: {
    title:'设置订单的矿工撮合费',
    tabs_basic:'快速设置',
    tabs_advanced:'高级设置',
    custom: '自定义'
  },
  place_order_confirm: {
    qrcode_security: '*为了您订单的安全，二维码只会生成一次并且不会保存在任何地方。请确认妥善保存二维码，任何收到您二维码的人都有可能吃掉您的订单。'
  },
  place_order_result: {
    submit_success: '订单提交成功！',
    view_order: '查看订单',
    continue_place_order: '继续下单',
    submit_failed: '提交失败',
    back_to_trade: '返回交易页'
  },
  p2p_order: {
    order_title: '私密点对点交易',
    amounts_placeholder: '卖出数量',
    amountb_placeholder: '买入数量',
    token_balance: '代币余额',
    order_detail: '订单详情',
    generate_order: '生成订单',
    instruction: '<h4>当您希望与指定的人成交时，可以使用P2P交易模式，中继服务只会展示您的订单但无法完成撮合，因为订单成交的关键信息只有您指定的人能获得。</h4>1. 以您希望的兑换率生成一个订单，把不包含鉴权数据的订单信息提交给relay，同时将生成的订单hash和鉴权信息生成二维码。</br>2. 您可以把这个二维码发送给您的朋友，任何人拿到这个二维码都有可能吃掉您的订单，请注意以安全的方式传播。</br>3. 对方使用Circulr移动端扫描二维码，下一个与您买入卖出量完全匹配的对手单，发送以太坊交易吃掉这个订单，因此吃单方需要消耗以太坊油费。',
    notice: '* P2P订单双方都不需要支付LRC手续费</br>',
    user_center_p2p:'P2P 交易'
  },
  sign: {
    not_signed: "您还未完成签名",
    to_sign: "去签名"
  },
  // -----------
  // transaction
  // -----------
  tx: {
    title:'交易',
    direction:'In & Out',
    type: words.type,
    gas: words.gas,
    block: words.block,
    nonce: words.nonce,
    txHash: '交易Hash',
    created: '提交时间',
    status: words.status,
    confirm_time:'确认时间',
    value:'金额',
    to:'目的地址',
    data:'二进制数据',
    gas_limit:words.gas_limit,
    gas_price:words.gas_price
  },
  tx_status: {
    all:'全部状态',
    pending: '处理中',
    success: '成功',
    failed: '失败',
  },
  tx_type: {
    all:'全部类型',
    sell: words.sell,
    buy: words.buy,
    transfer: '转出',
    receive: '转入',
    approve: '授权',
    lrc_fee: words.lrc_fee,
    lrc_reward: words.lrc_reward,
    convert: '转换',
    cancel_order:'取消订单',
    cancel_all:'取消全部订单',
    cancel_pair_order:'取消市场对订单',
    others:'其他'
  },
  tx_list: {
    type:{
      sell: '卖出 {value} {symbol}',
      buy: '买入 {value} {symbol}',
      transfer: '转出 {value} {symbol}',
      receive: '收到 {value} {symbol}',
      approve: '授权{symbol}进行撮合交易',
      lrc_fee: '支付{value} LRC撮合费',
      lrc_reward: '收到{value}LRC撮合奖励',
      convert_eth: '转换{value} ETH 为 WETH',
      convert_weth:'转换{value} WETH 为 ETH',
      cancel_order:'取消订单',
      cancel_all:'取消全部订单',
      cancel_pair_order:'取消{pair}订单',
      others:'其他'
    }
  },
  tx_detail: {
    detail_title: '交易详情',
    tabs_basic: '基础信息',
    tabs_fill: '成交信息',
  },

  tx_actions:{
    resend_title:'重新发送交易',
    cancel_title:'取消交易',
    action_resend:"重发",
    fail_title:"无法重新发送交易",
    fail_reason:"没有获取该交易的详细信息"
  },

  // -----------
  // fill
  // -----------
  fill: {
    ringIndex: "ID",
    price: words.price,
    amount: words.amount,
    total: words.total,
    lrc_fee: words.lrc_fee,
    lrc_reward: words.lrc_reward,
    margin_split: words.margin_split,
    created:'成交',
  },
  fill_list: {
    my_recent_fills:'最近成交',
    my_all_fills:'全部成交',
    trade_history:'最新成交',
  },
  fill_detail: {
    fill_detail:'成交详情',
  },
  // -----------
  // ring
  // -----------
  ring: {
    ringIndex: "环路ID",
    ringHash: "环路哈希",
    miner: "矿工",
    txHash: "交易Hash",
    block: "快高度",
    recipient: "费用接收地址",
    total_lrc_fee: words.lrc_fee,
    total_lrc_reward: words.lrc_reward,
    total_margin_split: words.margin_split,
    time: words.time,
  },
  ring_detail: {
    ring_detail:'环路详情',
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
    title_loopring_tickers: '路印 DEX 交易所行情',
    title_reference_tickers: '第三方交易所行情',
    title_recent: '最近',
    title_favorites: '收藏',
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
  // -----------
  // transfer
  // -----------
  transfer: {
    token_selector_placeholder: '选择币种',
    data: "数据",
    advanced: "高级",
    send_max: "最大数量",
    from: "发送方",
    to: "发送到",
    gas: "油费",
  },
  token: {
    action_options: '{token} 选项',
    action_types: {
      receive: "接收{token}",
      send: "转账{token}",
      trade: "交易{token}",
      convert: '转换成{token}'
    },
    assets_title: '总资产',
  },
  receive:{
    receive_title: '我的以太坊地址',
    receive_value_tip: '推荐值',
  },
  convert:{
    convert_eth_title:'转换ETH为WETH',
    convert_weth_title:'转换WETH为ETH',
    convert_eth_tip: '我们为您保留0.1 ETH作为油费以保证后续可以发送交易',
    actions_confirm_convert: '确认转换',
    actions_max: "最大数量",
    notification_suc_title:'转换{value} {token}成功',
    notification_fail_title:'转换{value} {token}失败'
  },

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
  unlock_by_loopr: {
    instruction_download: '下载Loopr-IOS',
    instruction_scan: '打开您的Loopr钱包，扫描二维码，确认信息',
    instruction_warn: '* 二维码有效时间10分钟，请尽快扫描确认。过期后请重新扫描',
  },
  wallet_type: {
    generate: '生成钱包',
    address: '地址',
    metamask: "MetaMask 钱包",
    json: "JSON 文件",
    mnemonic: '助记词',
    private_key: '私钥',
    trezor: 'TREZOR',
    ledger: 'Ledger 钱包'
  },

  password: {
    password_strength_title: '密码强度',
    password_strength: {
      weak: '弱',
      average: '一般',
      strong: '强'
    },
    password_tips_weak: '密码强度不足,至少需要7个字符。',
    password_tips_lack: "请输入密码"
  },

  wallet_generate: {
    title_generate: '生成钱包',
    actions_generate: '生成钱包',
    backup_title: '备份钱包',
    backup_tip: 'Circular钱包不会保存用户的私钥、Keystore、助记词，强烈建议您在线下备份这些信息（不联网的USB硬盘或纸质存储）。一旦私钥、Keystore、助记词丢失将无法恢复!',
    actions_backup_json: '我已经明白，下载钱包文件',
    actions_backup_mnemonic: '我已经明白，复制助记词',
    actions_backup_private: '我已经明白，复制私钥',
  },

  wallet_meta: {
    actions_get_metaMask: "下载{browser}浏览器MetaMask插件",
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
    mainnet_tip: '在您使用MetaMask解锁时，我们只支持Ethereum main net，请在您的MetaMask切换',
    logout_title: "您已从MetaMask登出",
    logout_tip: "我们检测到您已经从MetaMask登出, 为了您资金安全您的钱包重新锁定",
    account_change_title: "您切换了MetaMask账户",
    account_change_tip: "我们检测到您刚刚在MetaMask切换了账户, 请注意您账户资产发生了改变",
    install_tip: '您可能需要在浏览器安装MetaMask插件，安装完成后请刷新页面',
    unlock_tip: '与MetaMask连接失败, 请解锁后使用'
  },
  address: {
    placeholder_tip: '地址：',
    paste_address_title: '请粘贴您的地址',
    invalid_address_tip: '不合法的地址',
  },
  wallet_determine: {
    default_address: '默认地址',
    title_deter_address: "选择地址",
    actions_other_address: '选择其他地址',
    title_select_path: '选择dpath',
    custom_path: '自定义dpath',
    no_address_tip: '没有合法的地址',
  },
  json: {
    error_json_tip: '无效的Keystore Json',
    title_json: '选择JSON文件',
  },

  mnemonic: {
    actions_paste_mnemonic: '请粘贴您的助记词',
    error_mnemonic_tip: "无效的助记词",
    mnemonic_tip_lack: "请输入您的助记词"
  },

  key: {
    placeholder: '私钥',
    paste_private_title: "请粘贴您的私钥",
    error_private_tip: '不合法的私钥',
    lack_private_tip: '请输入您的私钥'
  },

  user_center:{
    receive:'收款',
    send:'转账'
  },
  export_keystore:{
    title:'导出Keystore',
    types:{
      file:'文件下载',
      text:'文本',
      qr:'二维码'
    },
    actions:{
      download:'下载Keystore',
      copy:'复制Keystore',
      get:"获得 Keystore"
    }
  },
  kline_chart:{
    kline_chart:'K线图',
  },
  price_chart:{
    price_chart:'价格行情',
  },
  loopr_sign:{
    title:'使用Loopr移动端钱包签名',
    steps:{
      qrcode:'扫描二维码',
      sign:'签名并发送',
      result:'结果'
    },
    tips:{
      download:'下载Loopr-IOS',
      scan: '打开您的Loopr钱包，扫描二维码，确认信息完成签名，并确认操作',
      warn: '请尽快完成扫码操作，过期后请关闭当前页面重新操作',
    }
  },
  metamask_sign:{
    title:'使用MetaMask钱包签名',
    steps:{
      connect:'连接到MetaMask',
      sign:'签名并发送',
      result:'结果'
    },
    uncomplete_tip:'请完成签名以后再提交',
    connect_tip:'请解锁并连接MetaMask'
  },
  ledger_sign:{
    title:'使用Ledger钱包签名',
    steps:{
      connect:'连接到Ledger',
      sign:'签名并发送',
      result:'结果'
    },
    connect:'连接Ledger',
    uncomplete_tip:'请完成签名以后再提交',
    current_unlock_address:'当前解锁地址',
    unlock:{
      title:'选择Ledger地址'
    }
  }
}

