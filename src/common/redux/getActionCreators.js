function getActionCreators({namespace,keys = [],id}) {
  let actionCreators = {}
  keys.forEach(key=>{
    function actionCreator(payload,custom){
        let action = {}
        let type =''
        if(namespace){
          type= namespace+"/"+key
        }else{
          type=key
        }
        if(id){
          payload = {
            id,
            ...payload,
          }
        }
        action = {
          type,
          payload
        }
        console.log('action',action)
        return action;
    }
    actionCreators[key]= actionCreator
  })
  return  actionCreators
}

export default getActionCreators
