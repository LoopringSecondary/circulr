import React from 'react'
import {Card, Steps, Button, Collapse, Icon, Input} from 'antd'
import {connect} from "dva";
import intl from 'react-intl-universal'
import {getXPubKey as getLedgerPublicKey, connect as connectLedger} from "LoopringJS/ethereum/ledger";
import {LedgerAccount} from "LoopringJS/ethereum/account";
import eachLimit from 'async/eachLimit';
import Notification from '../../../common/loopringui/components/Notification'


const steps = [
  {title: intl.get('ledger_sign.steps.qrcode')},
  {title: intl.get('ledger_sign.steps.sign')},
  {title: intl.get('ledger_sign.steps.result')}];


const JobTitle = ({type, token}) => {
  switch (type) {
    case 'cancelOrder':
      return intl.get('order_cancel.title');
    case 'order':
      return intl.get('place_order_sign.type_sign_order');
    case 'approveZero':
      return intl.get('place_order_sign.type_cancel_allowance', {token});
    case 'approve':
      return intl.get('place_order_sign.type_approve', {token});
    case 'convert':
      return token.toLowerCase() === 'eth' ? intl.get('convert.convert_eth_title') : intl.get('convert.convert_weth_title')
    case 'cancelTx':
      return intl.get('tx_actions.cancel_title')
    case 'resendTx':
      return intl.get('tx_resend.title')
  }
};

const JobHeader = ({job, index, sign}) => {
  return (
    <div className="row pl0 pr0 align-items-center">
      <div className="col">
        <div className="fs14 color-black-2">
          <Button type="primary" shape="circle" size="small" className="mr10">{index + 1}</Button>
          <JobTitle type={job.type} token={job.token}/>
        </div>
      </div>
      <div className="col-auto pr20">
        {job.signed &&
        <div className="text-up">
          {intl.get('place_order_sign.signed')} <Icon className="ml5" type="check-circle"/>
        </div>
        }
        {!job.signed &&
        <div className="color-black-3">
          <a onClick={(e) => {
            e.stopPropagation();
            sign(job, index)
          }}>{intl.get('place_order_sign.unsigned')}<Icon className="ml5"
                                                          type="right"/></a>
        </div>
        }
      </div>
    </div>
  )
};
const JobContent = ({job, index}) => {
  return (
    <div className="row p5 zb-b-t">
      <div className="col-6 pr5">
        <div className="fs12 color-black-2 mt5">{intl.get('place_order_sign.unsigned_tx')}</div>
        <Input.TextArea disabled placeholder="" className="fs12 lh20 border-none" autosize={{minRows: 6, maxRows: 10}}
                        value={JSON.stringify(job.raw)}/>
      </div>
      <div className="col-6 pl5">
        <div className="fs12 color-black-2 mt5">{intl.get('place_order_sign.signed_tx')}</div>
        <Input.TextArea disabled placeholder="" className="fs12 lh20 border-none" autosize={{minRows: 6, maxRows: 10}}
                        value={job.signed && JSON.stringify(job.signed)}/>
      </div>
    </div>
  )
}

const dpath = "m/44'/60'/0'";

class SignByLedger extends React.Component {

  state = {
    step: 0,
    account: null,
    result: 0
  };

  componentDidMount() {
    const {wallet} = this.props;
    if (wallet.unlockType === 'ledger') {
      this.setState({account: wallet.account, step: 1})
    } else {
      connectLedger().then(res => {
        if (!res.error) {
          const ledger = res.result;
          getLedgerPublicKey(dpath, ledger).then(resp => {
            if (!resp.error) {
              const {address} = resp.result;
              if (address.toLowerCase() === wallet.address.toLowerCase()) {
                this.setState({account: new LedgerAccount(ledger, dpath.concat('/0')), step: 1})
              }
            }
          });
        }
      });
    }
  }

  chooseAddress = (path) => {
    const {wallet} = this.props;
    connectLedger().then(res => {
      if (!res.error) {
        const ledger = res.result;
        getLedgerPublicKey(path, ledger).then(resp => {
          if (!resp.error) {
            const {address} = resp.result;
            if (address.toLowerCase() === wallet.address.toLowerCase()) {
              this.setState({account: new LedgerAccount(ledger, path), step: 1})
            } else {
              Notification.open({type:'warning',description:intl.get('notifications.title.dif_address')});
            }
          }
        });
      }
    });
  };
  connectToLedger = () => {
    const {account} = this.state;
    const {dispatch} = this.props;
    if (account) {
      this.setState({step: 1})
    } else {
      connectLedger().then(res => {
        if (!res.error) {
          const ledger = res.result;
          getLedgerPublicKey(dpath, ledger).then(resp => {
            if (!resp.error) {
              const {chainCode, publicKey} = resp.result;
              dispatch({
                type: "determineWallet/setHardwareWallet",
                payload: {chainCode, publicKey, dpath, walletType: 'ledger'}
              });
              dispatch({
                type: 'layers/showLayer',
                payload: {id: 'chooseLedgerAddress', chooseAddress: this.chooseAddress}
              });
            }
          });
        }
      });
    }
  };

  sign = async (job, index) => {
    const {dispatch} = this.props;
    const wallet = this.state.account;
    switch (job.type) {
      case 'convert':
      case 'resendTx':
      case 'approve':
      case 'approveZero':
      case 'cancelTx':
        wallet.signEthereumTx(job.raw).then(res => {
          if (!res.error) {
            job.signed = res;
            dispatch({type: 'signByLedger/updateJob', payload: {job, index}})
          }
        }).catch(err => {
          Notification.open({type: 'error', description: err.message})
        });
        break;
      case 'order':
        wallet.signOrder(job.raw).then(res => {
          if (!res.error) {
            job.signed = res;
            dispatch({type: 'signByLedger/updateJob', payload: {job, index}})
          }
        }).catch(err => {
          Notification.open({type: 'error', description: err.message})
        });
        break;
      case 'cancelOrder':
        wallet.signMessage(job.raw.timestamp).then(res => {

          job.signed = {sign: {...res, owner:this.props.wallet.address, timestamp: job.raw.timestamp}, ...job.raw};
          dispatch({type: 'signByLedger/updateJob', payload: {job, index}})
        }).catch(err => {
          Notification.open({type: 'error', description: err.message})
        });
        break;
      default:
        wallet.signMessage(job.raw).then(res => {
          job.signed = res;
          dispatch({type: 'signByLedger/updateJob', payload: {job, index}})
        }).catch(err => {
          Notification.open({type: 'error', description: err.message});
        })
    }
  };

  submit = () => {
    const {jobs, completed, wallet} = this.props;
    if (!completed) {
      Notification.open({type: 'warning', message: intl.get('ledger_sign.uncomplete_tip')});
      return;
    }
    eachLimit(jobs, 1, async (job, callback) => {
      switch (job.type) {
        case 'convert':
        case 'resendTx':
        case 'approve':
        case 'approveZero':
        case 'cancelTx':
          window.ETH.sendRawTransaction(job.signed).then(res => {
            if (!res.error) {
              window.RELAY.account.notifyTransactionSubmitted({
                txHash: res.result,
                rawTx: job.raw,
                from: wallet.address
              });
              callback()
            } else {
              callback(res.error)
            }
          });
          break;
        case 'order':
          console.log('cancel',job.signed);
          window.RELAY.order.placeOrder(job.signed).then(res => {
            if (!res.error) {
              callback()
            } else {
              callback(res.error)
            }
          });
          break;
        case 'cancelOrder':
          window.RELAY.order.cancelOrder(job.signed).then(res => {
            if (!res.error) {
              callback()
            } else {
              callback(res.error)
            }
          })
      }

    }, (error) => {
      if (error) {
        Notification.open({
          type: 'error',
          message: intl.get('notifications.title.sub_failed'),
          description: error.message
        });
        this.setState({step: 2, result: 2})
      } else {
        this.setState({step: 2, result: 1})
      }
    })

  };


  render() {
    const {step, result} = this.state;
    const {jobs, wallet} = this.props;
    return (
      <Card title={intl.get('ledger_sign.title')} className="rs">
        <div className="p15">
          <div className="mb20 mt15">
            <Steps current={step}>
              {steps.map((item, index) => <Steps.Step key={index} title={item.title}/>)}
            </Steps>
          </div>
          {step === 0 && <div>
            <div className="mt15">
              <div className="zb-b">
                <div className="text-center p15">
                  <span className="label">{intl.get('ledger_sign.current_unlock_address')}:{wallet.address}</span>
                  <div className="blk"/>
                  <Button className="mt15" type="primary"
                          onClick={this.connectToLedger}>{intl.get('ledger_sign.connect')}</Button>
                </div>
              </div>
            </div>
          </div>}
          {step === 1 &&
          <div className="zb-b mt20">
            <Collapse accordion bordered={false} defaultActiveKey={[]}>
              {
                jobs.map((job, index) => {
                  return (
                    <Collapse.Panel header={<JobHeader job={job} index={index} sign={this.sign}/>} key={index}
                                    showArrow={false}>
                      <JobContent job={job} index={index}/>
                    </Collapse.Panel>
                  )
                })
              }
            </Collapse>
            <div className="p10 mt10">
              <Button className="w-100 d-block" size="large"
                      type="primary" onClick={this.submit}> {intl.get('actions.submit')} </Button>
            </div>
          </div>}
          {step === 2 && <div className="zb-b">
            {
              result === 1 &&
              <div className="text-center p35">
                <i className={`fs50 icon-success`}></i>
                <div className="fs18 color-black-1">{intl.get('notifications.title.sub_suc')}</div>
              </div>
            }
            {
              result === 2 &&
              <div className="text-center p35">
                <Icon type="close-circle" className="fs50 text-error" />
                <div className="fs18 color-black-1 mt15 mb10">{intl.get('notifications.title.sub_failed')}</div>
              </div>
            }
          </div>}
        </div>
      </Card>
    )
  }


}

function mapStateToProps(state) {

  return {
    wallet: state.wallet,
    jobs: state.signByLedger.jobs,
    completed: state.signByLedger.completed
  }

}

export default connect(mapStateToProps)(SignByLedger)

