const express = require('express');
const routes = express.Router();

const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/User');
const auth = require('../middleware/auth');

routes.get('/', auth, async (req, res) => {

  try {
    const user = await User.findById(req.user.id).select('-password');
    // console.log(user);
    res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

// Auth user and get the token 
routes.post('/', [
  check("email", "Please Enter a email").isEmail(),
  check('password', 'Please enter a password').exists()
], async (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.status(400).json({ errors : errors.array() });
  }

  const { email, password } = req.body;
  
  try {
    let user = await User.findOne({ email });

    if(!user){
      return res.status(400).json({ msg: "Invalid Crediantials" });
    }

    // if(password !== user.password){
    //   return res.status(400).json({ msg: "Invalid Crediantials" });
    // }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({ msg: "Invalid Crediantials" });
    }


    const payload = {
      user : {
        id: user.id
      }
    }

    jwt.sign(payload, config.get("jwtSecret"), {
      expiresIn : 3600000
    }, (err, token) => {
      if(err) throw err;
      res.status(200).json({ token });
    });


  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }

});


module.exports = routes;