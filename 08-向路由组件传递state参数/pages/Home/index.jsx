import React, { Component } from 'react'
import MyNavLink from '../../components/MyNavLink'
import { Route, Switch, Redirect } from 'react-router-dom'
import News from './News'
import Message from './Message'
export default class Home extends Component {
  render() {
    return (
      <div>
        <div>我是Home</div>
        <div>
          <ul className='nav nav-tabs'>
            <MyNavLink to="/home/news">News</MyNavLink>
            <MyNavLink to="/home/message">Message</MyNavLink>
          </ul>
        </div>
        {/* 注册路由 */}
        <Switch>
          <Route path='/home/news' component={News} />
          <Route path='/home/message' component={Message} />
          <Redirect to='/home/news' />
        </Switch>
      </div >
    )
  }
}
