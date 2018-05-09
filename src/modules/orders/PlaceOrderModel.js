
export default {
  namespace: 'placeOrder',
  state: {
   sell:{
     token:null
   },
   buy:{
     token:null
   },
   trade:{
     priceInput: 0,
     amountInput:0,
     availableAmount: 0,
     timeToLivePatternSelect: 'easy',
     timeToLivePopularSetting: true,
     sliderMilliLrcFee:0,
     timeToLive:0,
     timeToLiveUnit:'',
     timeToLiveStart: null,
     timeToLiveEnd: null,
     total:0,
     loading: false,
   }
  },
  effects:{
    // TODO
  },
  reducers: {
    // TODO
  },
};


