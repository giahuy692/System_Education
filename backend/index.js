const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const db = require("./config/db/index.js"); //Kết nối db

const app = express();
db.connect(); // Gọi hàm kết nối db

app.use(cors());
app.use(cookieParser());
app.use(express.json());

const port = 8000;
app.listen(port, ()=>{
    console.log(`App listening at http://localhost:${port}`);
})