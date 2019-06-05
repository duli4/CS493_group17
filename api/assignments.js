const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const {requireAuthentication}=require('../lib/auth');
const AssignmentsSchema = {
    courseid: { required: true },
    title: { required: true },
    points: { required: true },
    due: { required: true }
};

router.post("/",requireAuthentication,async(req,res)=>{
    if(req.usertype=="admin"){

    }
    if(req.usertype=="instructor"){

    }

});

router.get("/:id",async(req,res)=>{

});

router.patch("/:id",async(req,res)=>{

});

router.delete("/:id",async(req,res)=>{

});


router.get("/:id/submissions",async(req,res)=>{

});

router.post("/:id/submissions",async(req,res)=>{

});

