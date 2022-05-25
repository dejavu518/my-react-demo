import React, { Component } from 'react'
import Header from './components/Header'
import List from './components/List'
import Footer from './components/Footer'
import './App.css'

export default class App extends Component {
  /*** 状态在哪里，操作状态的方法就在哪里 ***/
  /**初始化状态**/
  state = {
    todos: [
      { id: 1, name: '吃饭', done: true },
      { id: 2, name: '睡觉', done: true },
      { id: 3, name: '敲代码', done: false },
      { id: 4, name: '逛街', done: false },
    ]
  }
  /**addTodo用于添加一个todo，接收的参数是todo对象**/
  addTodo = (todoObj) => {
    // 获取原todo
    const { todos } = this.state
    // 追加一个todo
    const newTodos = [todoObj, ...todos]
    // 更新状态
    this.setState({ todos: newTodos })
  }
  /**用于更新一个todo对象**/
  updateTodo = (id, done) => {
    // 获取状态中的todos
    const { todos } = this.state
    // 加工数据
    const newTodos = todos.map((todoObj) => {
      if (todoObj.id === id) return { ...todoObj, done }
      else return todoObj
    })
    this.setState({ todos: newTodos })
  }
  /**用于删除一个todo**/
  deleteTodo = (id) => {
    const { todos } = this.state
    // 删除指定id的todo对象(过滤)
    const newTodos = todos.filter((todoObj) => {
      return todoObj.id !== id
    })
    // 更新状态
    this.setState({ todos: newTodos })
  }
  // 用于全选
  checkAllTodo = (done) => {
    const { todos } = this.state
    // 加工数据
    const newTodos = todos.map((todoObj) => {
      return { ...todoObj, done }
    })
    // 更新状态
    this.setState({ todos: newTodos })
  }
  // 用于清除所有已完成
  clearAllDone = () => {
    const { todos } = this.state
    // 过滤数据
    const newTodos = todos.filter((todoObj) => {
      return !todoObj.done
    })
    // 更新状态
    this.setState({ todos: newTodos })
  }
  render() {
    const { todos } = this.state
    return (
      <div className="todo-container">
        <div className="todo-wrap">
          <Header addTodo={this.addTodo} />
          <List todos={todos} updateTodo={this.updateTodo} deleteTodo={this.deleteTodo} />
          <Footer todos={todos} checkAllTodo={this.checkAllTodo} clearAllDone={this.clearAllDone} />
        </div>
      </div>
    )
  }
}
