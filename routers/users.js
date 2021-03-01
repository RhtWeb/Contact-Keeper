const express = require('express');
const routes = express.Router();

const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/User');




// Register a User and return a token having User ID 
routes.post('/', [
    check('name', 'Please Enter Your Name').not().isEmpty(),
    check('email', 'Please Enter a Valid Email').isEmail(),
    check('password', 'Please Enter Password with more than 6 element').isLength({ min : 6 })
  ], async (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.status(400).json({errors : errors.array()});
  }

  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if(user){
      res.status(400).json({ msg : 'User Already Exists' });
    }

    user = new User({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user : {
        id : user.id
      }
    }

    jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: 360000
    }, (err, token) => {
      if(err) throw err;
      res.status(200).json({ token });
    });
  
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  

});

module.exports = routes;