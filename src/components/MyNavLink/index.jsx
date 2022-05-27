import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
export default class MyNavLink extends Component {
  render() {
    const { props } = this
    return (
      <div>
        <NavLink {...props} />
      </div>
    )
  }
}
