const bcrypt = require("bcrypt");
const userService = require("../services/authService");
const generateUserJwtToken = require("./jwtController");
const User = require('../models/user');
const { pool } = require('../database');
const qrcode = require('qrcode');
const {authenticator} = require('otplib');

async function login(req, res) {

  const { emailOrPhone, password } = req.body;
  
  try {
    user = await userService.findUser(emailOrPhone);

    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }
   // const passwordMatch = await bcrypt.compare(password, user.password);
    if (password === user.password) {
      const authToken = generateUserJwtToken(user);
      return res
          .cookie('uname', user.username)
          .cookie('token', authToken).status(200).json({ message: "Your login is successful" ,  username: user.username, authToken: authToken});
    } else {
      return res.status(400).json({ message: "Password is not correct" });
    }
  } catch (error) {
    throw error;
  }
}

async function qrCode(req, res) {

    try{
      
      const username = req.cookies.uname
      console.log(username)
      const user = await User.getUser(pool, username);
      console.log(user);
      const secret = authenticator.generateSecret();
      const uri = authenticator.keyuri(user.id, "marketing", secret)
      const image = await qrcode.toDataURL(uri);
      
      await user.updateUserSecret(secret);
  
      return res.send({
        success: true,
        image
      })
  
    }catch(error) {
      console.error('Error generating QR image:', error);
      return res.status(500).send({
        success: false,
        message: 'Internal server error'
      });
    }
}

async function set2FA(req, res) {

  try{
   
    const username = "john_doe";
    const password = "password123"
    //code je hardkodiran, dohvatiti sa klijentske strane kasnije
    const code = "653786";
    const user = await User.getUser(pool, username, password);

    console.log(user);

    const tempSecret = user.two_factor_secret;

    const verified = authenticator.check(code.toString(), tempSecret.toString())
    
    if(!verified) throw false;

    user.enable2FA();

    return res.send({
      success: true
    })

  }catch{
    return res.status(500).send({
      success: false
    });
  }

}

module.exports = {
  login,
  qrCode,
  set2FA
};
