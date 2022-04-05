const express = require("express");
const router = express.Router();
const {ensureAuth} = require("../middleware/auth")
const Story = require("../models/Story")

const {stripTags, truncate , editIcon} = require("../helpers/helper");

router
    .get("/add",ensureAuth,(req,res)=>{
        res.render("stories/add"); 
    });

router
    .post("/",ensureAuth,async (req,res)=>{

        try {
            req.body.user = req.user.id;

            await Story.create(req.body);

            res.redirect("/dashboard"); 
        } catch (err) {
            res.render("Errors/500");
            console.error(err);
            
        }
        
    });

router
    .get("/",ensureAuth,async (req,res)=>{

        try {
            const stories = await Story.find({status: "public"})
                .populate('user')
                .sort({ createdAt: 'desc' })
                .lean();
            
            res.render("stories/index", {stories,user:req.user, stripTags, truncate , editIcon});
                
        } catch (err) {
            res.render("Errors/500");
            console.error(err); 
        }
        
    });
module.exports = router;