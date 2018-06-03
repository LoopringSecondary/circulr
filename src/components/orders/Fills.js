import React from 'react'
import FillFormater from '../../modules/fills/formatters'
import {Spin,Pagination} from 'antd'
import intl from 'react-intl-universal'

export default class Fills extends React.Component {

  state = {
    pageSize: 10,
    pageIndex: 1,
    total: 0,
    loading: true,
    fills: []
  };

  componentDidMount() {
    const {pageSize, pageIndex} = this.state;
    const {order} = this.props;
    window.RELAY.ring.getFills({pageSize, pageIndex, orderHash: order.originalOrder.hash}).then(res => {
      if (!res.error) {
        this.setState({fills: res.result.data, loading: false, total: res.result.total})
      }else{
        this.setState({loading: false})
      }
    })
  }

   onChange = (page, pageSize) => {
     const {order} = this.props;
    this.setState({
      loading: true,
      pageIndex: page,
      pageSize: pageSize
    }, () =>   window.RELAY.ring.getFills({pageIndex: page, pageSize: pageSize, orderHash: order.originalOrder.hash}).then(res => {
      if (!res.error) {
        this.setState({fills: res.result.data, loading: false, total: res.result.total})
      }else{
        this.setState({fills: [], loading: false, total: 0})
      }
    }));
  };

  render(){
    const {fills,loading,pageSize,pageIndex,total} = this.state;
    return(
      <Spin spinning={loading}>
      <table style={{overflow:'auto'}} className="table table-dark table-striped table-hover table-compact text-left">
        <thead>
        <tr>
          <th>{intl.get('fill.ringIndex')}</th>
          <th>{intl.get('fill.amount')}</th>
          <th>{intl.get('fill.price')}</th>
          <th>{intl.get('fill.total')}</th>
          <th>{intl.get('fill.lrc_fee')}</th>
          <th>{intl.get('fill.lrc_reward')}</th>
          <th>{intl.get('fill.created')}</th>
        </tr>
        </thead>
        <tbody>
        {fills.length > 0 && fills.map((fill,index) =>{
          const fm = new FillFormater.FillFm(fill);
           return <tr key={index}>
              <td>{fm.getRingIndex()}</td>
              <td>{fm.getAmount()}</td>
              <td>{fm.getPrice()}</td>
              <td>{fm.getTotal()}</td>
              <td>{fm.getLRCFee()}</td>
              <td>{fm.getLRCReward()}</td>
              <td>{fm.getCreateTime()}</td>
            </tr>
        })}
        {
          fills.length ===0 && <div>
            {intl.get('common.list.no_data')}
          </div>
        }
        </tbody>
      </table>
        {fills.length > 0 &&  <Pagination total={total} current={pageIndex} pageSize={pageSize} onChange={this.onChange}
                      className='text-right'/>}
      </Spin>
    )
  }
}
