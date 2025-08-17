import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/axiosConfig';

/**
 * Responsive navigation bar.  Uses a dark primary theme.
 * Links vary depending on whether the user is logged in.
 */
const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (role) {
      api.get('/notification/count').then(res => setNotificationCount(res.data)).catch(() => setNotificationCount(0));
    }
  }, [role]);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm navbar-custom fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">
        <img
            src="/logo.png"
            alt="ERP Logo"
            width="100px"
            height="50px"
            className="me-2"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/about">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/contact">Contact Us</Link>
            </li>
            {role && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/notifications">
                    Notifications
                    {notificationCount > 0 && (
                      <span className="badge rounded-pill bg-danger ms-1">
                        {notificationCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to={`/${role.toLowerCase()}`}>Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#" onClick={handleLogout}>Logout</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
