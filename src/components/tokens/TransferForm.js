import React from 'react';
import { Input,Button,Form,Select} from 'antd';
import intl from 'react-intl-universal';
import config from 'common/config'
import * as datas from 'common/config/data'
import * as fm from 'LoopringJS/common/formatter'
import * as tokenFormatter from 'modules/tokens/TokenFm'

var _ = require('lodash');

function TransferForm(props) {
  const {transfer, balance, wallet, marketcap, form} = props

  let tokenSelected = {}
  if(transfer.token) {
    tokenSelected = tokenFormatter.getBalanceBySymbol({balances:balance.items, symbol:transfer.token, toUnit:true})
  }

  function validateTokenSelect(value) {
    const result = form.validateFields(["amount"], {force:true});
    if(value) {
      return true
    } else {
      return false
    }
  }

  function validateAmount(value) {
    let tokenSymbol = this.state.tokenSymbol
    if(this.state.showTokenSelector) {
      tokenSymbol = form.getFieldValue("token")
    }
    if(tokenSymbol && _.isNumber(value)) {
      const token = tokenFormatter.getBalanceBySymbol({balances:balance.items, symbol:tokenSymbol, toUnit:true})
      const v = fm.toBig(value)
      return !v.lessThan(fm.toBig('0')) && !v.greaterThan(token.balance)
    } else {
      return false
    }
  }

  function handleChange(v) {
    if(v) {
      transfer.tokenChange({token:v})
    }
  }

  const assetsSorted = balance.items.map((token,index) => {
    return tokenFormatter.getBalanceBySymbol({balances:balance.items, symbol:token.symbol, toUnit:true})
  })
  assetsSorted.sort(tokenFormatter.sorter);

  return (
    <div className="form-dark">
        <div className="card-header bordered">
            <h4 className="text-dark">Send {tokenSelected && tokenSelected.symbol}</h4>
            <a href="#" className="close close-lg close-inverse" id="sendClose"></a>
        </div>
        <div className="card-body form-inverse">
            <Form>
              {
                !transfer.to &&
                <Form.Item colon={false}>
                  {form.getFieldDecorator('token', {
                    initialValue: '',
                    rules: [
                      {message: intl.get("token.token_select_verification_message"),
                        validator: (rule, value, cb) => validateTokenSelect(value) ? cb() : cb(true)
                      }
                    ]
                  })(
                    <Select
                      size="large"
                      showSearch={false}
                      allowClear
                      style={{ width: 300 }}
                      placeholder={intl.get('token.token_selector_placeholder')}
                      optionFilterProp="children"
                      onChange={handleChange.bind(this)}
                      onFocus={()=>{}}
                      onBlur={()=>{}}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      {assetsSorted.map((token,index) => {
                        const tokenBalance = tokenFormatter.getBalanceBySymbol({balances:balance.items, symbol:token.symbol, toUnit:true})
                        return <Select.Option value={token.symbol} key={index}>
                          <div className="row mr0">
                            <div className="col color-black-2">{token.symbol}</div>
                            <div className="col-atuo color-black-3">{tokenBalance.balance.gt(0) ? tokenBalance.balance.toString(10) : ''}</div>
                          </div>
                        </Select.Option>}
                      )}
                    </Select>
                  )}
                </Form.Item>
              }
              <Form.Item>
                <Input prefix="Recipient" />
              </Form.Item>
              <Form.Item>
                <Input prefix="Amount" />
              </Form.Item>
            </Form>
            <div className="text-color-dark-1">
                <div className="form-control-static d-flex justify-content-between mr-0">
                    <span>Gas Fee</span><span className="font-bold"><i className="icon-pencil gasfee"></i><span>0</span><span className="offset-md">0.00189 ETH ≈ $1.15</span></span>
                </div>
            </div>
            <Button className="btn btn-o-dark btn-block btn-xlg">Continue</Button>
        </div>
        <div id="gasFee" style={{display: "none"}}>
            <div className="form-group">
                <div className="tab-pane active" id="popularOption1">
                    <div className="d-flex justify-content-between align-items-center webui-popover-title">
                        <span className="font-weight">Custom Gas For This Order<i className="icon-question text-secondary offset-sm"></i></span><span><a href="#more1" data-toggle="tab" className="text-primary">Custom Settings</a></span>
                    </div>
                    <div className="blk"></div>
                    <p className="text-secondary">we advice you to set 0.00090000</p>
                    <div className="blk"></div>
                    <div className="range-slider">
                        <i className="range-slider-dot"></i><i className="range-slider-dot" style={{left: "100%"}}></i>
                    </div>
                    <div className="d-flex justify-content-between range-progress">
                        <div>Slower</div>
                        <div>Faster</div>
                    </div>
                </div>
                <div className="tab-pane" id="more1">
                    <div className="d-flex justify-content-between align-items-center webui-popover-title">
                        <span className="font-weight">Adjust Gas<i className="icon-question text-secondary offset-sm"></i></span><span><a href="#popularOption1" data-toggle="tab" className="text-primary">Fast Settings</a></span>
                    </div>
                    <div className="blk"></div>
                    <p className="text-secondary">we advice you to set GasLimit to 90000, set GasPrice to 10</p>
                    <div className="blk"></div>
                    <div>
                        <div className="form-group ">
                            <label>Gas Limit</label>
                            <input className="form-control form-control-md" />
                        </div>
                        <div className="form-group ">
                            <label>Gas Price</label>
                            <div className="range-slider">
                                <i className="range-slider-dot"></i><i className="range-slider-dot" style={{left: "100%"}}></i>
                            </div>
                            <div className="d-flex justify-content-between range-progress">
                                <div>Slower</div>
                                <div>Faster</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}
export default Form.create()(TransferForm);
