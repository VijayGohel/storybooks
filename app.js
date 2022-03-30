const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDb = require('./config/connectDb')
const passport = require("passport")
const session  = require("express-session")

dotenv.config({path: './config/.env'});

connectDb();

require("./config/passport-config")(passport);

const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

if(process.env.NODE_ENV === "development")
{
    app.use(morgan('dev'));
}

app.use(express.static(__dirname+"/public"));

app.set("view engine", "ejs" );

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const PORT= process.env.PORT || 5000;

app.listen(PORT, ()=>
                console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));