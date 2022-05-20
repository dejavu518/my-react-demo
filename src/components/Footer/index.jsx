import React, { Component } from 'react'
import './index.css'
export default class Footer extends Component {

  // 勾选/取消勾选
  handleCheck = (event) => {
    console.log(this.props)
    // console.log(event.target.checked)
    this.props.checkAll(event.target.checked)
  }
  // 清除事件
  handleClear = () => {

  }
  render() {
    const { todos } = this.props
    const total = todos.length
    const doneCount = todos.filter(todoObj => {
      return todoObj.done === true
    }).length
    return (
      <div className="todo-footer">
        <label>
          <input type="checkbox" onChange={this.handleCheck} />
        </label>
        <span>
          <span>已完成{doneCount}</span> / 全部{total}
        </span>
        <button className="btn btn-danger" onClick={this.handleClear}>清除已完成任务</button>
      </div>
    )
  }
}
