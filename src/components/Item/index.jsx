import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.css'
export default class index extends Component {
  static propTypes = {
    updateTodo: PropTypes.func.isRequired
  }
  state = {
    mouse: false
  }
  // 鼠标移入移出事件
  handleMouse = (flag) => {
    return () => {
      this.setState({ mouse: flag })
    }
  }
  // 勾选与取消勾选事件
  handleChecked = (id) => {
    return (event) => {
      const { updateTodo } = this.props
      updateTodo(id, event.target.checked)
    }
  }
  // 点击删除事件
  handleDelete = (id) => {
    if (window.confirm('确定删除吗')) {
      this.props.deleteTodo(id)
    }
  }
  render() {
    const { name, done, id } = this.props
    const { mouse } = this.state
    return (
      <li onMouseEnter={this.handleMouse(true)} onMouseLeave={this.handleMouse(false)} style={{ background: mouse ? '#ddd' : 'white' }}>
        <label>
          <input type="checkbox" checked={done} onChange={this.handleChecked(id)} />
          <span>{name}</span>
        </label>
        <button className="btn btn-danger" style={{ display: mouse ? 'block' : 'none' }} onClick={() => { this.handleDelete(id) }}>删除</button>
      </li >
    )
  }
}