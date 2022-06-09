import React, { Component } from 'react'
import store from '../../redux/store'
export default class Count extends Component {
  // // 加法
  increment = () => {
    const { value } = this.selectNumber
  }
  // // 减法
  decrement = () => {
    const { value } = this.selectNumber
  }
  // // 奇数再加
  incrementIfOdd = () => {
    const { value } = this.selectNumber
  }
  // // 异步加
  incrementAsync = () => {
    const { value } = this.selectNumber
  
  }

  render() {
    return (
      < div >
        <h1>当前求和为：{store.getState()}</h1>
        <select ref={c => this.selectNumber = c}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
        <button onClick={this.incrementIfOdd}>当前求和为奇数</button>
        <button onClick={this.incrementAsync}>异步加</button>
      </div >
    )
  }
}