import React, { useState, useEffect, useContext } from 'react';
import ContactContext from '../../context/contact/contactContext';

const ContactForm = () => {

  const contactContext = useContext(ContactContext);
  const { current, addContact, clearCurrent, updateContact } = contactContext;

  const [ contact, setContact ] = useState({
    name : '',
    email : '',
    phone : '',
    type : 'personal'
  });

  useEffect(() => {
    if(current) {
      setContact({ ...current });
    } else {
      setContact({
        name: '',
        email: '',
        phone: '',
        type: 'personal'
      });
    }
  }, [current, contactContext]);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name] : e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(contact);
    if(current){
      updateContact(contact);
    } else {
      addContact(contact);
    }
    handleClear();
  }
  
  const handleClear = () => {
    clearCurrent();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='text-primary'>Title</h2>
      <input type="text" name="name" value={contact.name} onChange={handleChange} placeholder="Name" />
      <input type="email" name="email" value={contact.email} onChange={handleChange} placeholder="Email" />
      <input type="text" name="phone" value={contact.phone} onChange={handleChange} placeholder="Phone" />
      <h5>Contact type</h5>
      <input type="radio" name="type" value="personal" onChange={handleChange} checked={contact.type === 'personal'} />{" "} Personal {" "}
      <input type="radio" name="type" value="professional" onChange={handleChange} checked={contact.type === 'professional'} />{" "} professional

      <div>
        <input type="submit" value={ current ? "Update Contact" : "Add Contact" } className='btn btn-primary btn-block'/>
      </div>
      {current && <div>
        <button onClick={handleClear} className='btn btn-light btn-block'>
          Clear
        </button>
      </div>}
      
      </form>
  )
}

export default ContactForm;
