const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const db = require('./config/db/index.js'); //Kết nối db
const authRoute = require('./routes/auth');

const app = express();
db.connect(); // Gọi hàm kết nối db

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//morgan: kiểm tra req để gửi lên được server hay chưa
app.use(morgan('combined'));

//ROUTES
app.use('/v1/auth', authRoute);

const port = 8000;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
