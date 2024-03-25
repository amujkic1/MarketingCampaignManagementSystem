const express = require('express');
const cors = require('cors');
const { pool } = require('./database');

const authRouter = require("./routes/authRouter");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());
app.use("/user", authRouter);

const port = 3000;

const authMiddleware = require('./middleware/authMiddleware.js');

app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
