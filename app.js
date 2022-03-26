const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDb = require('./config/connectDb')

dotenv.config({path: './config/config.env'});

connectDb();


const app = express();

if(process.env.NODE_ENV === "development")
{
    app.use(morgan('dev'));
}

const PORT= process.env.PORT || 5000;

app.listen(PORT, ()=>
                console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));