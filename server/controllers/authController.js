const bcryptjs = require("bcryptjs");
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
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (passwordMatch) {
      const authToken = generateUserJwtToken(user);
      return res
          .cookie('uname', user.username)
          .cookie('token', authToken).status(200).json({ message: "Your login is successful" ,  username: user.username, role: user.role, authToken: authToken});
    } else {
      return res.status(400).json({ message: "Password is not correct" });
    }
  } catch (error) {
    throw error;
  }
}

async function qrCode(req, res) {

    try{
      
      const username = req.body.uname
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
   
    const username = await req.body.uname;
    const code = await req.query.code

    const user = await User.getUser(pool, username);
    const tempSecret = user.two_factor_secret;
    const verified = authenticator.check(code, tempSecret)
    
    if(!verified) throw false;

    await user.enable2FA();

    return res.send({
      success: true
    })

  }catch{
    return res.status(500).send({
      success: false
    });
  }

}

async function getUser(req, res){
  
  try{

      const username = await req.body.uname;
      //const username = "john_doe";

      const user = await User.getUser(pool, username);
      const enabled = user.two_factor_enabled;

      return res.status(200).send({
        success: true,
        enabled: enabled
      });

    } catch(error) {
      console.error('Error fetching user from database:', error);
      return res.status(500).send({
        success: false,
        message: 'Internal server error'
    });
  }

}


module.exports = {
  login,
  qrCode,
  set2FA,
  getUser
};
