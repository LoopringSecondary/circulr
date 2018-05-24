const namespace = 'layers'
export default {
  namespace,
  state: {
  },
  effects:{
    *changeLayer({payload},{call, select,put}){
      yield put({
        type:'layerChange',
        payload:{
          ...payload,
        }
      })
    },
    *showLayer({payload},{call, select,put}){
      // yield put({type:'currentChange',payload})
      yield put({
        type:'layerChange',
        payload:{
          ...payload,
          visible:true,
        }
      })
    },
    *hideLayer({payload},{call, select,put}){
      yield put({
        type:'layerChange',
        payload:{
          ...payload,
          visible:false,
        }
      })
      yield put({type:'resetLayer',payload})
    },
    *resetLayer({payload},{call, select,put}){
      yield put({
        type:'layerChange',
        payload:{
          id:payload.id,
        }
      })
    }
  },
  reducers: {
    layerChange(state, { payload }) {
      const { id:layerId } = payload
      const thisLayer = state[layerId]
      delete payload.id
      return {
       ...state,
       [layerId]:{
        ...thisLayer,
        ...payload,
       }
      }
    },
  },
};
