import React, { Fragment, useEffect, useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ContactContext from '../../context/contact/contactContext';
import Spinner from '../layout/Spinner';
import ContactItem from './ContactItem';

const Contacts = () => {

  const contactContext =  useContext(ContactContext);
  const { contacts, filtered, getContacts, loading } = contactContext;


  useEffect(() => {
    getContacts();
  }, []);

  if (contacts !== null && contacts.length === 0 && !loading) {
    return <h4>Please add a contact</h4>;
  }

  return (
    <Fragment>
      {contacts !== null && !loading ? (
        <TransitionGroup>
          {filtered !== null
            ? filtered.map(contact => (
                <CSSTransition
                  key={contact._id}
                  timeout={500}
                  classNames='item'
                >
                  <ContactItem contact={contact} />
                </CSSTransition>
              ))
            : contacts.map(contact => (
                <CSSTransition
                  key={contact._id}
                  timeout={500}
                  classNames='item'
                >
                  <ContactItem contact={contact} />
                </CSSTransition>
              ))}
        </TransitionGroup>
      ) : (
        <Spinner />
      )}
    </Fragment>
  )
}

export default Contacts;