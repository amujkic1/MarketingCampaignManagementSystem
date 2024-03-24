const express = require('express');
const cors = require('cors');
const { pool } = require('./database');
const authRouter = require("./routes/authRouter");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();
const User = require('./models/user');
const qrcode = require('qrcode');
const {authenticator} = require('otplib');

const port = 3002;

app.use(bodyParser.json());
app.use("/user", authRouter);
app.use("/qrimage", authRouter);
app.use(cors());

app.get('/user/set2FA', async (req, res) => {
  try{
    //hardcoded since JWT will be implemented later
    const userId = 2
    //code je hardkodiran, dohvatiti sa klijentske strane kasnije
    const code =  "987922";
    const user = await User.getUserById(pool, userId);
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
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
