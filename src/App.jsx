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
      { id: 4, name: '爬山', done: false }
    ]
  }
  // 添加一个todo
  addTodo = (todoObj) => {
    const { todos } = this.state
    const newTodos = [todoObj, ...todos]
    this.setState({ todos: newTodos })
  }
  render() {
    const { todos } = this.state
    return (
      <div className='todo-container'>
        <div className='todo-wrap'>
          <Header addTodo={this.addTodo} />
          <List todos={todos} />
          <Footer />
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
