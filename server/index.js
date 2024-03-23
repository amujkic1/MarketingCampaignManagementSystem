const express = require("express");
const authRouter = require("./routes/authRouter");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());
app.use("/user", authRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
