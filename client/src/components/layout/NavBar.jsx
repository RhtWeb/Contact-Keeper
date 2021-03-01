import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AuthContext from '../../context/auth/authContext';
import ContactContext from '../../context/contact/contactContext';

function NavBar({ title, icon }) {

  const authContext = useContext(AuthContext);
  const contactContext = useContext(ContactContext);

  const { isAuthenticated, loadUser, logout, user } = authContext;

  const { clearContacts } = contactContext;

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    logout();
    clearContacts();
  }

  const authLinks = (
        <ul>
          <li>Hello {user && user.name}</li>
          <li>
            <a href='#!' onClick={handleLogout}>Logout</a>
          </li>
        </ul>
    )

  const guestLinks = (
      <ul>
        <li>
          <Link to='/register'>Register</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
        <li>
          <Link to='/about'>About</Link>
        </li>
      </ul>
    )


  return (
    <div>
      <div className='navbar bg-primary'>
      <h1>
        <Link to='/'>
          <i className={icon} /> {title}
        </Link>
      </h1>
      { isAuthenticated ? authLinks : guestLinks }
    </div>
    </div>
  )
}

NavBar.prototype = {
  title : PropTypes.string.isRequired,
  icon : PropTypes.string,
}

NavBar.defaultProps = {
  title: 'Contact Keeper',
  icon: 'fas fa-id-card-alt'
};

export default NavBar;
