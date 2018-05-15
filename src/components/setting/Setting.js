import React from 'react';
import { Tabs } from 'antd';
import Perfenrence from './Preference';
import Trade from './Trade';
import Relay from './Relay';
import {Containers} from 'modules'

function Setting(props) {
  const TabPane = Tabs.TabPane;
  function callback(key) {
    console.log(key);
  }
  return (
    <div>
	    <div className="popover-content">
        <div className="sidebar-header">
          <h3>Settings</h3>
        </div>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Preferences" key="1">
            <Containers.Settings>
              <Perfenrence />
            </Containers.Settings>
          </TabPane>
          <TabPane tab="Trading" key="2">
            <Trade />
          </TabPane>
          <TabPane tab="Relays" key="3">
            <Relay />
          </TabPane>
        </Tabs>
	    </div>
    </div>
  )
}
export default Setting
