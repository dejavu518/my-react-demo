import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import axios from 'axios'
export default class Search extends Component {
  search = () => {
    // 获取用户输入
    const { value } = this.keyElement
    // 发送请求前通知List更新状态
    PubSub.publish('atguigu', { isFirst: false, isLoading: true })
    // 发送请求
    axios.get(`https://api.github.com/search/users?q=${value}`).then(
      res => {
        PubSub.publish('atguigu', { isLoading: false, users: res.data.items })

      },
      error => {
        PubSub.publish('atguigu', { isLoading: false, err: error.message })

      }
    )
  }
  render() {
    return (
      <section className="jumbotron">
        <h3 className="jumbotron-heading">Search Github Users</h3>
        <div>
          <input type="text" placeholder="enter the name you search" ref={c => this.keyElement = c} />&nbsp;<button onClick={this.search}>Search</button>
        </div>
      </section>
    )
  }
}
