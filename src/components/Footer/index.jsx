import React, { Component } from 'react'
import './index.css'
export default class Footer extends Component {
  // 勾选/取消勾选
  handleCheck = (event) => {
    console.log(this.props)
    this.props.checkAll(event.target.checked)
  }
  // 清除已完成
  handleClear = () => {
    if (window.confirm('是否清除已完成的任务')) {
      this.props.clearChecked()
    }
  }
  render() {
    const { todos } = this.props
    const total = todos.length
    const doneCount = todos.filter(todoObj => {
      return todoObj.done === true
    }).length
    return (
      <div className="todo-footer" style={{ display: total === 0 ? 'none' : 'block' }}>
        <label>
          <input type="checkbox" onChange={this.handleCheck} checked={doneCount === total ? true : false} />
        </label>
        <span>
          <span>已完成{doneCount}</span> / 全部{total}
        </span>
        <button className="btn btn-danger" onClick={this.handleClear}>清除已完成任务</button>
      </div>
    )
  }
}
// 开往银河的列车->带着时间去哪里