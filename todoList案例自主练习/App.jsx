import React, { Component } from 'react'
import Header from './components/Header'
import List from './components/List'
import Footer from './components/Footer'
import './App.css'

export default class App extends Component {
  // 初始化状态
  state = {
    todos: [
      { id: 1, name: '打篮球', done: true },
      { id: 2, name: '读书', done: true },
      { id: 3, name: '看电影', done: false },
      { id: 4, name: '爬山', done: false },
      { id: 5, name: '打游戏', done: true }
    ]
  }
  // 添加一个todo
  addTodo = (todoObj) => {
    const { todos } = this.state
    const newTodos = [todoObj, ...todos]
    this.setState({ todos: newTodos })
  }
  // 更新todo
  updateTodo = (id, done) => {
    const { todos } = this.state
    const newTodos = todos.map(todoObj => {
      if (todoObj.id === id) return { ...todoObj, done }
      else return todoObj

    })
    this.setState({ todos: newTodos })
  }
  // 删除一个todo
  deleteTodo = (id) => {
    const { todos } = this.state
    const newTodos = todos.filter(todoObj => {
      return todoObj.id !== id
    })
    this.setState({ todos: newTodos })
  }
  // 全选/全不选事件
  checkAll = (checked) => {
    const { todos } = this.state
    let newTodos
    if (checked) {
      newTodos = todos.map(todoObj => {
        return { ...todoObj, done: true }
      })
    } else {
      newTodos = todos.map(todoObj => {
        return { ...todoObj, done: false }
      })
    }
    this.setState({ todos: newTodos })
  }
  // 清除已完成
  clearChecked = () => {
    const { todos } = this.state
    const checkedTodos = todos.filter(todoObj => {
      return todoObj.done === false
    })
    this.setState({ todos: checkedTodos })
  }
  render() {
    const { todos } = this.state
    return (
      <div className='todo-container'>
        <div className='todo-wrap'>
          <Header addTodo={this.addTodo} />
          <List todos={todos} updateTodo={this.updateTodo} deleteTodo={this.deleteTodo} />
          <Footer todos={todos} checkAll={this.checkAll} clearChecked={this.clearChecked} />
        </div>
      </div>
    )
  }
}

/*
  组件通信
  父传子->通过props
  子传父->通过回调函数
*/
