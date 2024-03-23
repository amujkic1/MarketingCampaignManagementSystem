const express = require('express');
const cors = require('cors');
const { pool } = require('./database');

const authRouter = require("./routes/authRouter");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

app.use(bodyParser.json());
app.use("/user", authRouter);


const app = express();
const port = 3002;

// Allow requests from all origins (you can customize this based on your requirements)
app.use(cors());

app.get('/hello', (req, res) => {
  res.send('Hello, world!');
});

app.get('/users', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM users');
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
