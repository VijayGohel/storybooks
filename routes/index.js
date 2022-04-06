const express = require("express");
const router = express.Router();
const {ensureAuth, ensureGuest} = require("../middleware/auth")
const Story = require("../models/Story")

const { formateDate, editIcon } = require("../helpers/helper");



router
    .get("/",ensureGuest,(req,res)=>{
        res.render("login"); 
    });

router
    .get("/dashboard",ensureAuth, async (req,res)=>{

        try {

            const stories = await Story.find({user: req.user.id}).lean();
            
            res.render("dashboard", 
                {user:req.user, stories , formateDate, editIcon});

        } catch (err) {
            res.render("/Errors/500");
        }
        
    });

module.exports = router;