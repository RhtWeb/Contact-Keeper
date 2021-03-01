import React, { useReducer } from 'react';
import axios from 'axios';

import authReducer from './authReducer';
import AuthContext from './authContext';

import setAuthToken from '../../utility/setAuthToken';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from '../types';

const AuthState = props => {

  const initialState = {
    token : localStorage.getItem('token'),
    loading: true,
    isAuthenticated : null,
    user : null,
    error : null
  }

  const [ state, dispatch ] = useReducer(authReducer, initialState);

  const loadUser = async() =>{
    // Add token to the header 
    if(localStorage.getItem('token')){
      setAuthToken(localStorage.getItem('token'))
    }

    try {
      const res = await axios.get('/api/auth');

      // console.log(res.data);
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
      
    } catch (err) {
      // console.log(err.response.data.msg);
      dispatch({
        type: AUTH_ERROR,
        payload: err.response.data.msg
      });
    };
  }; 

  const register = async (userDetails) => {
    const config = {
      headers : {
        "Content-Type" : "application/json"
      }
    }
    try {
      const res = await axios.post('/api/users', userDetails, config);

      // console.log(res.data);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      loadUser();
      
    } catch (err) {
      // console.log(err.response.data.msg);
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg
      })
    }
  };

  const login = async userlogin => {
    const config = {
      headers: {
        'Content-Type' : 'application/json'
      }
    }

    try {
      const res = await axios.post('/api/auth', userlogin, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      
      loadUser();

    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.msg
      });
    };
  };

  const logout = () => {
    dispatch({
      type: LOGOUT
    });
  };

  const clearErrors = () => {
    dispatch({
      type: CLEAR_ERRORS
    });
  };


  return (
    <AuthContext.Provider value={
      {
        token : state.token,
        loading : state.loading,
        isAuthenticated : state.isAuthenticated,
        user : state.user,
        error : state.error,
        loadUser,
        register,
        login,
        logout,
        clearErrors
      }
    }>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthState;
