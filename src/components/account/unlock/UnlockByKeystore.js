import React from 'react';
import {Upload, Button, Input, Icon} from 'antd';
import {connect} from 'dva';
import routeActions from 'common/utils/routeActions'
class Keystore extends React.Component {

  state = {
    fileList: [],
    visible:false
  };

  handleRemove = (file) => {
    this.setState(({fileList}) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  };
  beforeUpload = (file) => {
    const {dispatch} = this.props;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      try{
        const keystore = fileReader.result;
        dispatch({type: 'keystore/setKeystore', payload: {keystore}})
      }catch (e){

      }
    };
    fileReader.readAsText(file, "utf-8");
    this.setState({fileList: []});
    return false;
  };

  handleStoreChange = (e) => {
    const {dispatch} = this.props;
    const keystore = e.target.value;
    dispatch({type: 'keystore/setKeystore', payload: {keystore}})
  };

  unlock = () => {
    const {keystore, isPasswordRequired, password, isValid} = this.props;
    if(isValid){
      if((isPasswordRequired && password) || !isPasswordRequired){
        this.props.dispatch({type:'wallet/unlockKeyStoreWallet',payload:{keystore,password,cb:(e) =>{
          if(!e){
            this.props.dispatch({type:"keystore/reset"});
            routeActions.gotoPath('/wallet');
          }else{
            console.log(e.message)
          }
        }}});
      }
    }
  };

  handlePassChange = (e) =>{
    const password = e.target.value;
    this.props.dispatch({type: 'keystore/setPassword', payload: {password}})
  };
  togglePassword = () => {
    const {visible} = this.state;
    this.setState({visible:!visible})
  };
  render() {
    const {isPasswordRequired, password, keystore,isValid} = this.props;
    const {fileList,visible} = this.state;
    const uploadProps = {
      action: '',
      onRemove: this.handleRemove,
      beforeUpload: this.beforeUpload,
      fileList
    };

    const visibleIcon = (
      <div className="fs14 pl5 pr5">
        {visible &&
        <i className="icon-eye" onClick={this.togglePassword}/>
        }
        {!visible &&
        <i className="icon-eye-slash" onClick={this.togglePassword}/>
        }
      </div>
    );

    return (
      <div>
        <div className="text-inverse">
          <div className='row align-items-center'>
            <div className='col'><h2 className="text-center text-primary">Select JSON File</h2></div>
            <Upload className='col-auto' {...uploadProps}>
              <Button><Icon type="folder"/>Select JSON File</Button>
            </Upload>
          </div>
          <div className='mb20'>
            <Input.TextArea autosize={{minRows: 3, maxRows: 8}} size="large" className='d-block fs12' value={keystore} onChange={this.handleStoreChange}/>
          </div>
          {keystore && !isValid && <div className="d-flex justify-content-between align-items-center up-file"><small className="truncation" style={{width: "440px"}}>Invalid JSON </small></div>}
          {isPasswordRequired &&
          <Input   type={visible ? 'text' : 'password'} className='mb10'  addonAfter={visibleIcon} value={password} onChange={this.handlePassChange}/>}
          <Button type="primary" className="btn-block btn-xlg btn-token" onClick={this.unlock}>Unlock</Button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    keystore: state.keystore.keystore,
    isPasswordRequired: state.keystore.isPasswordRequired,
    password: state.keystore.password,
    isValid: state.keystore.isValid,
  }
}

export default connect(mapStateToProps)(Keystore)






