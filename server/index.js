const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { pool } = require("./database");
const authRouter = require("./routes/authRouter");
const campaignRouter = require("./routes/campaignRouter.js");
const channelRouter = require("./routes/channelRouter.js");
const mediaRouter = require("./routes/mediaRouter");
const userRouter = require("./routes/userRouter");
const superAdminRouter = require("./routes/superAdminRouter.js"); 
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
require("./models/channel.js");

const authMiddleware = require("./middleware/authMiddleware.js");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
//app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
/*
app.use(cors({
  origin: 'https://marketing-campaign-management-system-client.vercel.app',
  credentials: true
}));
*/
app.use("/user", authRouter);
app.use("/qrimage", authRouter);
app.use("/set2FA", authRouter);
app.use("/getUser", authRouter);
app.use("/", channelRouter);
app.use("/", campaignRouter);

//za super admina
app.use("/super", superAdminRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());

app.use("/", authRouter);
app.use("/", mediaRouter);
app.use("/", userRouter);

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
