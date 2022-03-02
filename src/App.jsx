import React, { Component } from 'react'
import axios from 'axios'
export default class App extends Component {
  getStudentData = () => {
    axios.get('http://localhost:3000/api1/recipe/search', { params: { keyword: '白菜', num: 10, appkey: 'de323cfd759fa942' } }).then(res => {
      console.log(res)
    }, error => {
      console.log(error)
    })
  }
  render() {
    return (
      <div>
        <button onClick={this.getStudentData}>点我获取学生数据</button>
      </div>
    )
  }
}
