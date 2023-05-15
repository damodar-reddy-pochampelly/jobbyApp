import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-bar-bg">
      <div className="nav-responsive-container">
        <Link to="/" className="link">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="nav-bar-logo"
          />
        </Link>
        <ul className="nav-bar-icons-container">
          <Link to="/" className="link">
            <li className="nav-list-item">
              <AiFillHome className="nav-bar-icon" />
            </li>
          </Link>
          <Link to="/jobs" className="link">
            <li className="nav-list-item">
              <BsBriefcaseFill className="nav-bar-icon" />
            </li>
          </Link>
          <li className="nav-list-item">
            <button
              type="button"
              onClick={onLogout}
              className="logout-icon-btn"
            >
              <FiLogOut className="logout-icon" />
            </button>
          </li>
        </ul>
        <div className="nav-bar-options-container">
          <ul className="nav-bar-options">
            <Link to="/" className="link">
              <li className="options">Home</li>
            </Link>
            <Link to="/jobs" className="link">
              <li className="options">Jobs</li>
            </Link>
          </ul>
          <button type="button" className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default withRouter(Header)
