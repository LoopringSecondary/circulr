import React from 'react';
import { Tabs } from 'antd';
import Preference from './Preference';
import Trade from './Trade';
import Relay from './Relay';
import {Containers} from 'modules'
import intl from 'react-intl-universal';

function Setting(props) {
  const TabPane = Tabs.TabPane;
  function callback(key) {

  }
  return (
    <div className="pd-lg">
	    <div className="popover-content">
        <div className="sidebar-header">
          <h3>{intl.get('settings.title')}</h3>
        </div>
        <Tabs defaultActiveKey="1" onChange={callback} className="tabs-dark">
          <TabPane tab={intl.get('settings.preferences')} key="1">
            <Containers.Settings>
              <Preference />
            </Containers.Settings>
          </TabPane>
          <TabPane tab={intl.get('settings.tradings')} key="2">
            <Containers.Settings>
              <Trade />
            </Containers.Settings>
          </TabPane>
          <TabPane tab={intl.get('settings.relays')} key="3">
            <Containers.Settings>
              <Relay />
            </Containers.Settings>
          </TabPane>
        </Tabs>
	    </div>
    </div>
  )
}
export default Setting
