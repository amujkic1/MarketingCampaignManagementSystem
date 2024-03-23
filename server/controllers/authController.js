const bcrypt = require("bcrypt");
const userService = require("../services/authService");

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

module.exports = {
  login,
};
