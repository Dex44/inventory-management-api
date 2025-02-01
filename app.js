const express = require("express");
const path = require("path");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const MYSQL_CONFIG = require('./models/mysql');
const indexRouter = require("./routes/index");
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    data: 'Inventory management system',
});
});
app.use("/api", indexRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;
MYSQL_CONFIG.DbBootstrap()
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});