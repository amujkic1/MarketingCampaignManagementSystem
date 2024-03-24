const bcrypt = require("bcrypt");
const userService = require("../services/authService");
const generateUserJwtToken = require("./jwtController");

async function login(req, res) {
  const { emailOrPhone, password } = req.body;
  console.log(req.body);
  try {
    user = await userService.findUser(emailOrPhone);

    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }
   // const passwordMatch = await bcrypt.compare(password, user.password);
    if (password === user.password) {
      const authToken = generateUserJwtToken(user);
      return res.status(200).json({ message: "Your login is successful" ,  emailOrPhone: user.email || user.phone , authToken: authToken});
    } else {
      return res.status(400).json({ message: "Password is not correct" });
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  login,
};
