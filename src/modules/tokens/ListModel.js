import config from 'common/config'
import storage from 'modules/storage'
const initTokens = storage.tokens.getTokens();
const configTokens = config.getTokens();
export default {
  namespace: 'tokens',
  state: {
    items: [...configTokens],
    loading: false,
    loaded: false,
    page:{
      total:0,
      size:10,
      current:0,
    },
    filters:initTokens.filters || {},
    selected: "LRC",
    favored:initTokens.favored || {},
  },
  reducers: {
    pageChange(state,action){
      let page = state.page;
      return {...state,page:{
        ...page,...action.payload.page
      }}
    },
    filtersChange(state,action){
      let filters = state.filters;
      let page = state.page;
      return {
        ...state,
        filters:{
          ...filters,...action.payload.filters
        },
        page:{
          ...page,
          current:1,
        }
      }
    },
    columnsChange(state,action){
      return {...state,columns:action.payload.columns}
    },
    sortChange(state,action){
      return {...state,sort:action.payload.sort}
    },
    queryChange(state,action){
      let filters = state.filters;
      let page = state.page;
      return {
        ...state,
        filters:{
          ...filters,
          ...action.payload.filters
        },
        page:{
          ...page,
          current:1,
        },
        sort:{
          ...action.payload.sort
        }
      }
    },
    itemsChange(state,{payload}){
      return {
        ...state,
        ...payload,
      }
    },
    itemChange(state,{payload}){
    },
    nodeChange(state,action){
      return {
        ...state,
        ...action.payload,
      }
    }
  },
}


