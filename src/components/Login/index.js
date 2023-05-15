import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', errMsg: '', showSubmitError: false}

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onFormSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const loginApiUrl = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const jwtToken = data.jwt_token
      this.onSubmitSuccess(jwtToken)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onSubmitFailure = errMsg => {
    this.setState({errMsg, showSubmitError: true})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 15, path: '/'})
    history.replace('/')
  }

  render() {
    const {username, password, errMsg, showSubmitError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      const {history} = this.props
      history.replace('/')
    }

    return (
      <div className="login-bg">
        <form className="form-bg" onSubmit={this.onFormSubmit}>
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="app-logo"
            />
          </div>
          <div className="input-container">
            <label htmlFor="USERNAME" className="input-label">
              USERNAME
            </label>
            <input
              placeholder="Username"
              type="text"
              id="USERNAME"
              className="input"
              onChange={this.onChangeUserName}
              value={username}
            />
          </div>
          <div className="input-container">
            <label htmlFor="PASSWORD" className="input-label">
              PASSWORD
            </label>
            <input
              placeholder="Password"
              type="password"
              id="PASSWORD"
              className="input"
              onChange={this.onChangePassword}
              value={password}
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="login-error">*{errMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
