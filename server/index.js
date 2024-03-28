const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { pool } = require('./database');
const authRouter = require("./routes/authRouter");
const { Pool } = require("pg");
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const authMiddleware = require('./middleware/authMiddleware.js');

app.use(cookieParser());
app.use(bodyParser.json());
app.use("/user", authRouter);
app.use("/qrimage", authRouter);
app.use("/set2FA", authRouter);
app.use("/getUser", authRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());

// Allow requests from specific origin
const allowedOrigins = ['https://marketing-campaign-management-system-client.vercel.app', 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use("/", authRouter);

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
