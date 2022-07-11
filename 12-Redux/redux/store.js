// 专用于创建redux中最为核心的store对象
import {createStore,applyMiddleware} from 'redux'
import countReducer from './count_reducer'
import thunk from 'redux-thunk'
export default createStore(countReducer, applyMiddleware(thunk))