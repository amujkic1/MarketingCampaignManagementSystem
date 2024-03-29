const userService = require("../services/authService");
const generateUserJwtToken = require("./jwtController");
const User = require('../models/user');
const { pool } = require('../database');
const qrcode = require('qrcode');
const {authenticator} = require('otplib');

/*async function login(req, res) {

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
}*/

async function login(req, res) {
  const { emailOrPhone, password } = req.body;
  try {
    const user = await userService.findUser(emailOrPhone);
    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }
    if (password === user.password) {
      const authToken = generateUserJwtToken(user);
      return res
        .cookie('uname', user.username) // Set 'uname' cookie with the username
        .cookie('token', authToken)
        .status(200)
        .json({ message: "Your login is successful", username: user.username, authToken: authToken });
    } else {
      return res.status(400).json({ message: "Password is not correct" });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: "Internal server error" });
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
  try {
    const { emailOrPhone } = req.body; // Get email and code from request body
    
    const user = await userService.findUser(emailOrPhone);
    const code = await req.query.code
    
    //const user = await User.getUser(pool, email); // Fetch user using email

    const tempSecret = user.two_factor_secret;
    const verified = authenticator.check(code, tempSecret);

    if (!verified) throw false;

    await user.enable2FA();

    return res.send({
      success: true
    });
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    return res.status(500).send({
      success: false
    });
  }
}



/*async function set2FA(req, res) {

  try{
   
    const username = await req.cookies.uname;
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

}*/

async function getUser(req, res) {
  try {
    const { username } = req.body; // Expect username in the request body
    const user = await User.getUser(pool, username);
    const enabled = user.two_factor_enabled;
    return res.status(200).send({
      success: true,
      enabled: enabled
    });
  } catch (error) {
    console.error('Error fetching user from database:', error);
    return res.status(500).send({
      success: false,
      message: 'Internal server error'
    });
  }
}

/*async function getUser(req, res){
  
  try{

      const username = await req.cookies.uname;
      //const username = "john_doe";
      console.log(username);

      const user = await User.getUser(pool, username);
      const enabled = user.two_factor_enabled;

      console.log(user.username);

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

}*/


module.exports = {
  login,
  qrCode,
  set2FA,
  getUser
};
