import React, { Component } from 'react'
import './index.css'
export default class List extends Component {
  render() {
    const { users, isFirst, isLoading, err } = this.props
    return (
      <div className="row">
        {
          isFirst ? <h2>欢迎使用</h2> :
            isLoading ? <h2>Loading...</h2> :
              users.map(userObj => {
                return (
                  <div className="card" key={userObj.id}>
                    <a href={userObj.html_url} target="_blank" rel="noreferrer">
                      <img src={userObj.avatar_url} style={{ width: '100px' }} alt="user-img" />
                    </a>
                    <p className="card-text">{userObj.login}</p>
                  </div>
                )
              })
        }
      </div>
    )
  }
}