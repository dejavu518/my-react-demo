// 该文件是用于创建一个为Count组件服务的reducer,reducer的本质就是一个函数
// reducer函数会接到两个参数，分别为preState,action
const initState = 0

export default function countReducer(preState = initState, action) {
  // if (preState === undefined) preState = 0
  const {
    type,
    data
  } = action
  switch (type) {
    case 'increment': //如果是加
      return preState + data
    case 'decrement': //如果是减
      return preState - data
    default:
      return preState
  }
}