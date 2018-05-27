const commons = {
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
  lrc_fee:'',
  block:'区块',
  nonce:'随机数',
}
const types = {
  order_status:{

  },
  trade_side:{
    sell:'',
    buy:'',
  },
}
export default {
  types_order:{
    hash:'订单',
    market:commons.market,
    side:commons.side,
    amount:commons.amount,
    price:commons.price,
    total:commons.total,
    lrc_feelrc_fee:commons.lrc_fee,
    filled:'成交',
    created:'提交时间',
    expired:'过期时间',
    status:commons.total,
  },
  types_order_status:{
      open:'',
      completed:'',
      canceled:'',
      expired:'',
  },
  types_order_side:{
      ...types.trade_side
  },
  page_order_list:{
    btns_cancel_all:'Cancel All',
  },
  page_order_detail:{
    title:'订单详情',
    tabs_basic:'基础信息',
    tabs_fill:'成交信息',
  },
}

