
const namespace = 'ttl'
export default {
  namespace,
  state: {
    timeToLivePatternSelect: 'easy',
    timeToLivePopularSetting: true,
    timeToLive: 0,
    timeToLiveUnit: '',
    timeToLiveStart: null,
    timeToLiveEnd: null,
  },
  effects:{
    *timeToLivePatternChangeEffects({ payload={} }, { select, put }) {
      const {timeToLivePatternSelect} = payload
      if(timeToLivePatternSelect === 'advance') { //[easy, advance]
        let {timeToLiveStart, timeToLiveEnd} = payload
        if(timeToLiveStart && timeToLiveEnd) {
          yield put({ type: 'timeToLivePatternChange',payload:{timeToLivePatternSelect}});
          yield put({ type: 'timeToLiveStartEndChange',payload:{timeToLiveStart, timeToLiveEnd}});
        }
      } else {
        yield put({ type: 'timeToLivePatternChange',payload:{timeToLivePatternSelect}});
      }
    },
    *timeToLiveEasyTypeChangeEffects({ payload={} }, { select, put }) {
      const {type, timeToLive, timeToLiveUnit} = payload
      if(type === 'popular') {
        yield put({ type: 'timeToLiveEasyPopularSettingChange',payload:{timeToLivePopularSetting:payload.timeToLivePopularSetting}});
        yield put({ type: 'timeToLiveEasyPopularValueChange',payload:{timeToLive, timeToLiveUnit}});
      } else {
        yield put({ type: 'timeToLiveEasyPopularValueChange',payload:{timeToLive, timeToLiveUnit}});
      }
    },
  },
  reducers: {
    milliLrcFeeChange(state, action) {
      const {payload} = action
      let {milliLrcFee} = payload
      return {
        ...state,
        sliderMilliLrcFee:milliLrcFee
      }
    },
    timeToLivePatternChange(state, action) {
      const {payload} = action
      let {timeToLivePatternSelect} = payload
      return {
        ...state,
        timeToLivePatternSelect
      }
    },
    timeToLiveStartEndChange(state, action) {
      const {payload} = action
      let {timeToLiveStart, timeToLiveEnd} = payload
      return {
        ...state,
        timeToLiveStart,
        timeToLiveEnd
      }
    },
    timeToLiveEasyPopularSettingChange(state, action) {
      const {payload} = action
      let {timeToLivePopularSetting} = payload
      return {
        ...state,
        timeToLivePopularSetting
      }
    },
    timeToLiveEasyPopularValueChange(state, action) {
      const {payload} = action
      let {timeToLive, timeToLiveUnit} = payload
      return {
        ...state,
        timeToLive,
        timeToLiveUnit
      }
    },
  }
}
