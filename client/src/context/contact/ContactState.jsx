import React, { useReducer } from 'react';
import axios from 'axios';

import contactReducer from './contactReducer';
import ContactContext from './contactContext';

import {
  GET_CONTACTS,
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  FILTER_CONTACTS,
  CLEAR_CONTACTS,
  CLEAR_FILTER,
  CONTACT_ERROR,
  UPDATE_CONTACT
} from '../types';

const ContactState = (props) => {

  const initialState = {
    contacts : null,
    current : null,
    filtered : null,
    error : null
  };

  const [state, dispatch] = useReducer(contactReducer, initialState);

  const getContacts = async () => {
    try {
      const res = await axios.get('/api/contacts');
      
      dispatch({
        type : GET_CONTACTS,
        payload : res.data
      })
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err.response.data
      })
    }
  }

  const addContact = async (contactData) => {

    const config = {
      headers : {
        "Content-Type" : "application/json"
      }
    }

    try {
      const res = await axios.post('/api/contacts', contactData, config);

      // console.log(res);
      // console.log(res.data);

      dispatch({
        type: ADD_CONTACT,
        payload: res.data
      });

    } catch (err) {
      // console.log(err.response.data);
      dispatch({
        type: CONTACT_ERROR,
        payload: err.response.data
      })
    }
  }

  const deleteContact = async (id) => {
    try {
      await axios.delete(`/api/contacts/${id}`);

      dispatch({
        type: DELETE_CONTACT,
        payload: id
      })
      
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err.response.data
      })
    }
  }
  
  const setCurrent = (contact) => {
    dispatch({
      type : SET_CURRENT,
      payload : contact
    })
  }
  
  const clearCurrent = () => {
    dispatch({
      type : CLEAR_CURRENT
    })
  }
  
  const updateContact = async (contact) => {
    const config = {
      headers : {
        'Content-Type' : 'application/json'
      }
    }

    try {
      const res = await axios.put(`/api/contacts/${contact._id}`, contact, config);

      dispatch({
        type: UPDATE_CONTACT,
        payload: res.data
      });
      
    } catch (err) {
      dispatch({
        type: CONTACT_ERROR,
        payload: err.response.data
      })
    }
  }
  
  const filterContacts = (text) => {
    dispatch({
      type : FILTER_CONTACTS,
      payload : text
    });
  }
  
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };
  
  const clearContacts = () => {
    dispatch({
      type : CLEAR_CONTACTS
    })
  }


  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addContact,
        deleteContact,
        setCurrent,
        clearCurrent,
        updateContact,
        filterContacts,
        clearFilter,
        getContacts,
        clearContacts
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
