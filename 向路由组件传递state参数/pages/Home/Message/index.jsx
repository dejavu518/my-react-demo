import React, { Component } from 'react'
import Detail from './Detail'
import { Link, Route } from 'react-router-dom'

export default class Message extends Component {
  state = {
    messageArr: [
      { id: 1, title: '消息1' },
      { id: 2, title: '消息2' },
      { id: 3, title: '消息3' }
    ]
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.messageArr.map(messageObj => {
            return (
              <li key={messageObj.id}>
                <Link to={{ pathname: '/home/message/detail', state: { id: messageObj.id, title: messageObj.title } }}>{messageObj.title}</Link>
              </li>
            )
          })}
        </ul>
        {/* state参数无需声明接收，正常注册即可 */}
        <Route path="/home/message/detail" component={Detail} />
      </div>
    )
  }
}
