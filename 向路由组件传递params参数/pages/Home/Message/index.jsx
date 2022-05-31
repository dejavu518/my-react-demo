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
                <Link to={`/home/message/detail/${messageObj.id}/${messageObj.title}`}>{messageObj.title}</Link>
              </li>
            )
          })}
        </ul>
        <Route path="/home/message/detail/:id/:title" component={Detail} />
      </div>
    )
  }
}
