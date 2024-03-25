const express = require('express');
const cors = require('cors');
const { pool } = require('./database');

const authRouter = require("./routes/authRouter");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());
app.use("/user", authRouter);

const port = 3002;

const authMiddleware = require('./middleware/authMiddleware.js');

app.use(cors());

app.get('/hello', (req, res) => {
  res.send('Hello, world!');
});

app.get('/users', async (req, res) => {
  try {
      console.log('Attempting to fetch users...');
      const client = await pool.connect();
      console.log('Connected to the database.');

      const result = await client.query('SELECT * FROM users');
      console.log('Query executed successfully.');

      const users = result.rows;
      res.json(users);
      client.release();
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
