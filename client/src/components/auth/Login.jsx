import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';

function Login(props) {

  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { isAuthenticated, login, error, clearErrors } = authContext;
  const { setAlert } = alertContext;

  const [ user, setUser ] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;

  useEffect(() => {
    if(isAuthenticated) {
      props.history.push('/');
    }

    if(error === 'Invalid Crediantials') {
      setAlert(error, 'danger');
      clearErrors();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, error, props.history]);

  const handleChange = e => {
    setUser({ ...user, [e.target.name] : e.target.value });
  }

  const handleSubmit = e => {
    e.preventDefault();
    // console.log('User Login');
    // console.log(user);
    if(email === '' || password === ''){
      setAlert('Please Enter all Fields', 'danger');
    } else {
      // console.log(user)
      login({
        email,
        password
      })
    }
  }

  return (
    <div className='form-container'>
      <h1>
        Account <span className="text-primary">Login</span>
      </h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={email} onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={handleChange} />
        </div>
        <input type="submit" value="Login" className="btn btn-primary btn-block" />
      </form>
    </div>
  )
}

export default Login;

