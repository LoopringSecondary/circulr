import React from 'react';
import { Input,Button,Form,Select} from 'antd';
function Perfenrence(props) {
  return (
  	<div className="form-dark">
        <Form.Item label="Language">
            <Select defaultValue="English" dropdownMatchSelectWidth={false} className="d-block">
                <option value="English">English</option>
                <option value="简体中文">简体中文</option>
            </Select>
        </Form.Item>
        <Form.Item label="Currency">
            <Select defaultValue="USD" dropdownMatchSelectWidth={false} className="d-block">
                <option value="USD">USD</option>
                <option value="CNY">CNY</option>
            </Select>
        </Form.Item>
        <Form.Item label="Timezone">
            <Select defaultValue="1" dropdownMatchSelectWidth={false} className="d-block">
                <option value="1">UTC+00:00) (Accra, Casablanca, Dakar, Dublin, Lisbon, London</option>
                <option value="2">UTC−06:00) (Chicago, Guatemala City, Mexico City, San José, San Salvador, Winnipeg</option>
            </Select>
        </Form.Item>
        <div className="blk"></div>
        <Button className="btn btn-o-dark btn-block btn-xlg">I Understand, Copy Private Key</Button>
    </div>
  )
}
export default Perfenrence
