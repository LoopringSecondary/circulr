import React from 'react';
import { Tabs } from 'antd';
import Preference from './Preference';
import Trade from './Trade';
import Relay from './Relay';
import {Containers} from 'modules'

function Setting(props) {
  const TabPane = Tabs.TabPane;
  function callback(key) {
    console.log(key);
  }
  return (
    <div className="pd-lg">
	    <div className="popover-content">
        <div className="sidebar-header">
          <h3>Settings</h3>
        </div>
        <Tabs defaultActiveKey="1" onChange={callback} className="tabs-dark">
          <TabPane tab="Preferences" key="1">
            <Containers.Settings>
              <Preference />
            </Containers.Settings>
          </TabPane>
          <TabPane tab="Trading" key="2">
            <Containers.Settings>
              <Trade />
            </Containers.Settings>
          </TabPane>
          <TabPane tab="Relays" key="3">
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
