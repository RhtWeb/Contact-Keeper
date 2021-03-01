const express = require('express');
const routes = express.Router();

const auth = require('../middleware/auth');
const User = require('../model/User');
const Contact = require('../model/Contact');
const { check, validationResult } = require('express-validator');

routes.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

routes.post('/', [ auth, [
  check('name', 'Please Enter the name').not().isEmpty()
] ], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.status(400).json({ errors : errors.array() });
  }

  const { name, email, phone, type } = req.body;
  try {
    // const newContact = new Contact({
    //   name,
    //   email,
    //   phone,
    //   type,
    //   user : req.user.id
    // });

    // const contact = await newContact.save();

    const contact = await Contact.create({
      name,
      email,
      phone,
      type,
      user : req.user.id
    })

    res.json(contact);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  } 
});

routes.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  const newContact = {};
    if(name) newContact.name = name;
    if(email) newContact.email = email;
    if(phone) newContact.phone = phone;
    if(type) newContact.type = type;

  try {

    let contact = await Contact.findById(req.params.id);

    if(!contact) return res.status(404).json({ msg : 'Contact Not found'});

    if(contact.user.toString() !== req.user.id){
      return res.status(401).json({ msg : 'User is Not authorised' });
    }

    contact = await Contact.findByIdAndUpdate(req.params.id, 
      { $set: newContact },
      { new : true });
    
    res.json(contact);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

routes.delete('/:id', auth, async (req, res) => {
  try {

    let contact = await Contact.findById(req.params.id);

    if(!contact) return res.status(404).json({ msg : 'Contact Not found'});

    if(contact.user.toString() !== req.user.id){
      return res.status(401).json({ msg : 'User is Not authorised' });
    }

    await Contact.findByIdAndRemove(req.params.id);
    
    res.json({ msg : 'Contact Removed Successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = routes;