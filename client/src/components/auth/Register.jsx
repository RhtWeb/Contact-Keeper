import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/auth/authContext'
import AlertContext from '../../context/alert/alertContext';


function Register(props) {

  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { setAlert } = alertContext;
  const { isAuthenticated, error, register, clearErrors } = authContext;

  const [ user, setUser ] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = user;

  useEffect(() => {
    if(isAuthenticated){
      props.history.push('/');
    };

    if (error === 'User Already Exists') {
      setAlert(error, 'danger');
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const handleChange = e => {
    setUser({ ...user, [e.target.name] : e.target.value });
  }



  const handleSubmit = e => {
    e.preventDefault();
    
    if(name === '' || email === '' || password === ''){
      setAlert('Please enter all fields', 'danger');
    } else if(password !== password2){
      setAlert('Passwords do not match', 'danger');
    } else {
      register({
        name,
        email,
        password
      });
    }  
  }

  return (
    <div className='form-container'>
      <h1>
        Account <span className="text-primary">Register</span>
      </h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={name} onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={email} onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor="password2">Confirm Password</label>
          <input type="password" name="password2" value={password2} onChange={handleChange} />
        </div>
        <input type="submit" value="Register" className="btn btn-primary btn-block" />
      </form>
    </div>
  )
}

export default Register;
