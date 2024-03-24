const bcrypt = require("bcrypt");
const userService = require("../services/authService");
const User = require('../models/user');
const { pool } = require('../database');
const qrcode = require('qrcode');
const {authenticator} = require('otplib');

async function login(req, res) {

  const { emailOrPhone, password } = req.body;
  console.log(req.body);
  try {
    user = await userService.findUser(emailOrPhone);

    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }

    if (password === user.password) {
      return res.status(200).json({ message: "Your login is successful" });
    } else {
      return res.status(400).json({ message: "Password is not correct" });
    }
  } catch (error) {
    throw error;
  }
}

async function qrCode(req, res) {

  //app.get('/qrimage', async(req,res) => {
    try{
  
      //hardcoded since JWT will be implemented later
      const userId = 2
      const user = await User.getUserById(pool, userId);
  
      const secret = authenticator.generateSecret();
      const uri = authenticator.keyuri(userId, "marketing", secret)
      const image = await qrcode.toDataURL(uri);
  
      user.updateUserSecret(secret);
  
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
  //})

}

module.exports = {
  login,
  qrCode
};
