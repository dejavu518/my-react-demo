import React, { Component } from 'react'
import './index.css'

export default class Item extends Component {
  state = { mouse: false }//标识鼠标移入/移出 
  /**鼠标移入/移出的回调**/
  handleMouse = (flag) => {
    // 为什么要return一个函数？因为调用时带括号立即执行，需要利用闭包
    return () => {
      this.setState({ mouse: flag })
    }
  }
  /**勾选/取消勾选某一个todo的回调**/
  handleCheck = (id) => {
    return (event) => {
      // 不能拿event.target.value是因为input的类型是checkbox
      // console.log(event.target.checked, 888)
      this.props.updateTodo(id, event.target.checked)
    }
  }
  /**删除一个todo的回调**/
  handleDelete = (id) => {
    if (window.confirm('确定删除吗')) {
      this.props.deleteTodo(id)
    }
  }
  render() {
    const { name, done, id } = this.props
    const { mouse } = this.state
    return (
      <li onMouseLeave={this.handleMouse(false)} onMouseEnter={this.handleMouse(true)} style={{ backgroundColor: mouse ? '#ddd' : 'white' }}>
        <label>
          <input type="checkbox" checked={done} onChange={this.handleCheck(id)} />
          <span>{name}</span>
        </label>
        <button className="btn btn-danger" style={{ display: mouse ? 'block' : 'none' }} onClick={() => this.handleDelete(id)}>删除</button>
      </li>
    )
  }
}