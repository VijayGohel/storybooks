const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDb = require('./config/connectDb')
const methodOverride = require("method-override")
const passport = require("passport")
const mongoose = require("mongoose")
const session  = require("express-session")
const MongoStore = require("connect-mongo")

dotenv.config({path: './config/.env'});

connectDb();

require("./config/passport-config")(passport);

const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )
  
if(process.env.NODE_ENV === "development")
{
    app.use(morgan('dev'));
}

app.use(express.static(__dirname+"/public"));

app.set("view engine", "ejs" );

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT= process.env.PORT || 5000;

app.listen(PORT, ()=>
                console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));