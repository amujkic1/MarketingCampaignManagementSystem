const express = require('express');
const cors = require('cors');
const { pool } = require('./database');

const app = express();
const port = 3000;

app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
