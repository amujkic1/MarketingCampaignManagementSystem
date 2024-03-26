const express = require('express');
const cors = require('cors');
const { pool } = require('./database');
const authRouter = require("./routes/authRouter");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');



const authMiddleware = require('./middleware/authMiddleware.js');


app.use(bodyParser.json());
app.use("/user", authRouter);
app.use("/qrimage", authRouter);
app.use("/set2FA", authRouter);
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());


app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use("/", authRouter);

const port = 3000;

app.use(cors());


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
