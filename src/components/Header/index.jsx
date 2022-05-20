import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'
import './index.css'

export default class Header extends Component {
  // 对接收到的props进行类型的限制
  static propTypes = {
    addTodo: PropTypes.func.isRequired
  }

  // 键盘事件
  handleKeyUp = (event) => {
    const { target, keyCode } = event
    const reg = /^\w+$/
    if (keyCode !== 13) return
    if (target.value.trim() === '') {
      alert('输入不能为空')
      return
    }
    if (reg.test(target.value)) {
      alert('请输入合法字符')
      target.value = ''
      return
    }
    const todoObj = { id: nanoid(), name: target.value, done: false }
    this.props.addTodo(todoObj)
    target.value = ''
  }
  render() {
    return (
      <div className="todo-header">
        <input type="text" placeholder="请输入你的任务名称，按回车键确认" onKeyUp={this.handleKeyUp} />
      </div>
    )
  }
}