import React, { Component } from 'react'
import { Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Header from './components/Header'
import MyNavLink from './components/MyNavLink'
export default class App extends Component {
  render() {
    return (
      < div >
        <div className="row">
          <div className="col-xs-offset-2 col-xs-8">
            <div className="page-header">
              <Header />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-2 col-xs-offset-2">
            <div className="list-group">
              {/* <a className="list-group-item active" href="./about.html">About</a>
              <a className="list-group-item" href="./home.html">Home</a> */}
              {/* 在React靠路由链接切换组件 */}
              <MyNavLink to="/about" className="list-group-item" children="About" />
              <MyNavLink to="/home" className="list-group-item" children="Home" />
            </div>
          </div>
          <div className="col-xs-6">
            <div className="panel">
              <div className="panel-body">
                {/* 注册路由 */}
                <Route path='/about' component={About} />
                <Route path='/home' component={Home} />
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  }
}
