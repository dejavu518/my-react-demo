import React, { Component } from 'react'
// import Count from './components/Count'
// import store from './redux/store'
import DropdownToAdd from './components/Count/Port'
export default class App extends Component {
  render() {
    return (
      < div >
        {/* 给容器组件传递store */}
        {/* <Count store={store} /> */}
        <DropdownToAdd/>
      </div >
    )
  }
}
