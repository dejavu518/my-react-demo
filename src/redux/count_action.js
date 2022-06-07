

// 该文件专门为Count组件生成action对象
export const createIncrementAction = data => ({
  type: 'increment',
  data
})

export const createDecrementAction = data => ({
  type: 'decrement',
  data
})
export const createIncrementAsyncAction = (data, time) => {
  return (() => {
    setTimeout((dispatch) => {
      sdispatch(createIncrementAction(data))
    },time)
  })
}