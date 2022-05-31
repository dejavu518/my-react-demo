import React, { Component } from 'react'
import { Button } from 'antd'
import 'antd/dist/antd.css'
import { CaretLeftOutlined } from '@ant-design/icons'
export default class App extends Component {
  render() {
    return (
      < div >
        <Button type='primary'>哈哈哈</Button>
        <CaretLeftOutlined />
      </div >
    )
  }
}
