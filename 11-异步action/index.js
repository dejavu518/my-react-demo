//引入react核心库
import React from 'react'
//引入ReactDOM
import ReactDOM from 'react-dom'
//引入App
import App from './App'
import store from './redux/store'
ReactDOM.render( <
  App / > , document.getElementById('root'))
store.subscribe(() => {
  ReactDOM.render( <
    App / > , document.getElementById('root'))
})