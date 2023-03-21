const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require("cors")
app.use(cors())
app.use(express.json());
app.use(cookieParser())
//import product route
const product = require('./routes/productRoute');
const userRoute = require('./routes/userRoute')
const orderRoute = require('./routes/orderRoute')
const errorMiddleware = require('./middleware/error');

//use product route 
app.use('/api/v1',product);
app.use('/api/v1',userRoute);
app.use('/api/v1',orderRoute)

//use middleware for error.
app.use(errorMiddleware)
module.exports = app;