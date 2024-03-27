const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const { pool } = require('./database');
const authRouter = require("./routes/authRouter");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const User = require('./models/user');
const bcrypt = require('bcrypt');

const authMiddleware = require('./middleware/authMiddleware.js');

app.use(cookieParser());
app.use(bodyParser.json());
app.use("/user", authRouter);
app.use("/qrimage", authRouter);
app.use("/set2FA", authRouter);
app.use("/getUser", authRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use("/", authRouter);

const port = 3000;

/*(async () => {
  try {
    await User.hashAllPasswords();
    console.log("All passwords hashed successfully.");
  } catch (error) {
    console.error('Error hashing passwords:', error);
  } finally {
    await pool.end();
  }
})();*/

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
