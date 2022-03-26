const express = require("express")
const router = express.Router();

router.
    route("/")
    .get((req,res)=>{
        res.send("login")
    });

router.
    route("/dashboard")
    .get((req,res)=>{
        res.send("dashboard")
    });

module.exports = router;