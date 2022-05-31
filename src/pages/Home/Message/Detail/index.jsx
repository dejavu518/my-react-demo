import React, { Component } from 'react'
import { qs } from 'querystring'

const DetailData = [
  { id: 1, content: '我喜欢打篮球' },
  { id: 2, content: '我喜欢看电视' },
  { id: 3, content: '我喜欢吃东西' }
]
export default class Detail extends Component {
  render() {
    // 接收search参数
    const { search } = this.props.location
    const { id, title } = qs.parse(search.slice(1))
    const findResult = DetailData.find(detailObj => {
      return detailObj.id == id
    })
    return (
      <div>
        <ul>
          <li>{id}</li>
          <li>{title}</li>
          <li>{findResult.content}</li>
        </ul>
      </div>
    )
  }
}
