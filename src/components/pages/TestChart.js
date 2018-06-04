import React from 'react'
import {Button} from 'antd'
import { Containers } from 'modules'
import UiContianers from 'LoopringUI/containers'
import Charts from '../charts'

const TestChart = (props)=>{
  return (
    <div>
      <Charts.KlineChart />
    </div>
  )
}
export default TestChart
