const express = require("express");
const router = express.Router();
const {ensureAuth} = require("../middleware/auth")
const Story = require("../models/Story")

const {stripTags, truncate , editIcon, formateDate} = require("../helpers/helper");

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

router.
    get("/edit/:id",ensureAuth, async (req,res)=>{
        try {
            const story = await Story.findById(req.params.id).lean();
            
            
            if(!story)
            {
                res.render("Errors/404");
            }
            else if(story.user.toString() !== req.user._id.toString())
            {
                res.redirect("/");
            }
            else
            {
                res.render("stories/edit",{story});
            }
        } catch (err) {
            res.render("Errors/500");
            console.error(err);
            
        }
    });

router
    .get("/:id",ensureAuth, async (req,res)=>{
        try {
            const story = await Story.findById(req.params.id).populate('user').lean();

            if(!story)
                res.render("Errors/404");
            
            if(req.user._id.toString() !== story.user._id.toString() && story.status === 'private')
            {
                res.redirect("/");
            }
            else
            {
                res.render("stories/show", {story, user:req.user, stripTags, formateDate, editIcon});
            }
        } catch (err) {
            res.render("Errors/404");
            console.error(err);
        }
    })

router
    .put("/:id",ensureAuth, async (req,res)=>{
        try {
            
            let story = await Story.findById(req.params.id).lean();

            if (!story) {
                res.render("Errors/404");
            } else if(req.user._id.toString() !== story.user.toString()){
                res.redirect("/");
            }
            else{
                story = await Story.findOneAndUpdate( {_id: req.params.id }, req.body, {
                    new:true,
                    runValidators:true
                })
 
                res.redirect("/dashboard");
            }
        } catch (err) {
            res.render("Errors/500")
            console.log(err);
        }
    })

router. 
    delete("/:id", ensureAuth , async (req,res)=>{
        try {
            
            let story = await Story.findById(req.params.id).lean();

            if (!story) {
                res.render("Errors/404");
            } else if(req.user._id.toString() !== story.user.toString()){
                res.redirect("/");
            }
            else{
                story = await Story.deleteOne( {_id: req.params.id });
 
                res.redirect("/dashboard");
            }
        } catch (err) {
            res.render("Errors/500");
            console.error(err);
        }
    })

router 
    .get("/user/:id", ensureAuth , async (req,res)=>{
        try {
            const stories = await Story.find({user : req.params.id , status: 'public'})
                                    .populate('user').lean();
            
            if(!stories)
                res.render("stories/nostory");
            
                res.render("stories/index", {stories,user:req.user, stripTags, truncate , editIcon});

        } catch (err) {
            res.render("Errors/500");
            console.error(err);
        }
    })
module.exports = router;