//引入react核心库
import React from 'react'
//引入ReactDOM
import ReactDOM from 'react-dom'
//引入App
import App from './App'
import store from './redux/store'
ReactDOM.render( <
  App />, document.getElementById('root'))
  // 检测Redux中状态的改变，若改变，重新渲染APP组件
store.subscribe(() => {
  ReactDOM.render( <
    App / > , document.getElementById('root'))
})