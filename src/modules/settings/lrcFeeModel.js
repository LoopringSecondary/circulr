
const namespace = 'lrcFee'
export default {
  namespace,
  state: {
    pattern: 'basic',
    lrcFeeSlider:1,
    milliLrcFee: 1,
  },
  effects:{

  },
  reducers: {
    patternChange(state, action) {
      const {payload} = action
      let {pattern} = payload
      return {
        ...state,
        pattern
      }
    },
    lrcFeeSliderChange(state, action) {
      const {payload} = action
      let {lrcFeeSlider} = payload
      return {
        ...state,
        lrcFeeSlider
      }
    },
    milliLrcFeeChange(state, action) {
      const {payload} = action
      let {milliLrcFee} = payload
      return {
        ...state,
        milliLrcFee
      }
    },
  }
}
