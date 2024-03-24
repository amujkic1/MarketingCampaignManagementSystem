const express = require('express');
const cors = require('cors');
const { pool } = require('./database');
const authRouter = require("./routes/authRouter");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();

const port = 3002;

app.use(bodyParser.json());
app.use("/user", authRouter);
app.use("/qrimage", authRouter);
app.use("/set2FA", authRouter);
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
