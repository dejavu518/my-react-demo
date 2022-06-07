
// 专用于创建redux中最为核心的store对象
import { createStore } from 'redux'
import countReducer from './count_reducer'
export default createStore(countReducer)