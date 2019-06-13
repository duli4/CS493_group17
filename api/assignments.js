const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const {requireAuthentication}=require('../lib/auth');
const { extractValidFields } = require('../lib/validation');
const AssignmentsSchema = {
    courseid: { required: true },
    title: { required: true },
    points: { required: true },
    due: { required: true }
};
const {PushTheFileInFs,getAssignmentsById,updateAssignment,getCourseByid,getSumbitByAsgid,insertNewAssignments,insertNewSumbit,deleteAssignmentByid} = require("../models/assignments");
const fs = require('fs');

const upload = multer({
    storage: multer.diskStorage({
        destination: `${__dirname}/uploads`,
        filename: (req, file, callback) => {
            const basename = crypto.pseudoRandomBytes(16).toString('hex');
            const extension = imageTypes[file.mimetype];
            callback(null, `${basename}.${extension}`);
        }
    }),
    fileFilter: (req, file, callback) => {
        callback(null, !!imageTypes[file.mimetype])
    }
});
function removeUploadedFile(file) {
    return new Promise((resolve, reject) => {
        fs.unlink(file.path, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

}


router.post("/",requireAuthentication,async(req,res)=>{
    if(req.usertype=="admin"){
        try{
            if(extractValidFields(req.body,AssignmentsSchema)){
                const id=await insertNewAssignments(req.body);
                res.status(201).send({
                    id: id,
                    links: {
                        url: `/assignments/${id}`
                    }
                });
            }else{
                res.status(400).send({
                    error:"Not a vaild assignment object"
                })
            }
        }catch (err) {
            console.error(err);
            res.status(500).send({
                error: "Error inserting photo into DB.  Please try again later."
            });
        }

    }
    if(req.usertype=="instructor"){
        if(req.body.courseid){
            const courseinfo=await getCourseByid(parseInt(req.body.courseid));
            if(courseinfo.instructor==req.user){
                try{
                    if(extractValidFields(req.body,AssignmentsSchema)){
                        const id=await insertNewAssignments(req.body);
                        res.status(201).send({
                            id: id,
                            links: {
                                url: `/assignments/${id}`
                            }
                        });
                    }else{
                        res.status(400).send({
                            error:"Not a vaild assignment object"
                        })
                    }
                }catch(err){
                    console.error(err);
                    res.status(500).send({
                        error: "Error inserting photo into DB.  Please try again later."
                    });
                }
            }else{
                res.status(401).send({
                   error:"NotPermission"
                });
            }
        }
    }
});

router.get("/:id",async(req,res)=>{
    const id=parseInt(req.params.id);
    const assignment=await getAssignmentsById(id);
    res.status(200).send(assignment);
});

router.patch("/:id",async(req,res)=>{
    if(req.usertype=='admin'){
        try{
            if(extractValidFields(req.body,AssignmentsSchema)){
                result=await updateAssignment(req.body,parseInt(req.params.id));
                if(result){
                    const id=parseInt(req.params.id);
                    res.status(200).send({
                        id: id,
                        links: {
                            url: `/assignments/${id}`
                        }
                    });
                }else{
                    next();
                }

            }else{
                res.status(400).send({
                    error:"Not a vaild assignment object"
                })
            }
        }catch(err){
            console.error(err);
            res.status(500).send({
                error: "Error on updating the assignment"
        });
        }
    }
    if(req.usertype=="instructor"){

        if(req.body){
            const id=parseInt(req.params.id);
            const asg=await getAssignmentsById(id);
            const courseid=parseInt(asg.courseid);
            const courseinfo=await getCourseByid(courseid);
            //const courseinfo=await getCourseByid(parseInt(req.body.courseid));
            if(courseinfo.instructor==req.user){
                try{
                    if(extractValidFields(req.body,AssignmentsSchema)){
                        result=await updateAssignment(req.body,parseInt(req.params.id));
                        if(result){

                            res.status(200).send({
                                id: id,
                                links: {
                                    url: `/assignments/${id}`
                                }
                            });
                        }

                    }else{
                        res.status(400).send({
                            error:"Not a vaild assignment object"
                        })
                    }
                }catch(err){
                    console.error(err);
                    res.status(500).send({
                        error: "Error on updating the assignment"
                    });
                }
            }else{
                res.status(401).send({
                    error:"NotPermission"
                });
            }
        }
    }
    }
);

router.delete("/:id",async(req,res)=>{
    if(req.usertype=="admin"){
        const id=parseInt(req.params.id);
        const result=await deleteAssignmentByid(id);
        if(result){
            res.status(204).end()
        }
    }
    if(req.usertype=="instructor"){
        const id=parseInt(req.params.id);
        const asg=await getAssignmentsById(id);
        const courseid=parseInt(asg.courseid);
        const course=await getCourseByid(courseid);
        if(parseInt(course.instructor)==parseInt(req.user)){
            const result=await deleteAssignmentByid(id);
            if(result){
             res.status(204).end();
            }
        }
    }
});


router.get("/:id/submissions",async(req,res)=>{
    const id =parseInt(req.params.id);
    const asg=await getAssignmentsById(id);
    const courseid=parseInt(asg.courseid);
    const course=await getCourseByid(courseid);
    if(req.usertype=="admin"||parseInt(course.instructor)==parseInt(req.user)){
        const result=await getSumbitByAsgid(id);
        res.status(200).send(result);
    }else{
        res.status(401).send({
            error:"Not Autorized"
        })
    }
});

router.post("/:id/submissions",upload.single("file"),async(req,res)=>{
    assignmentid=parseInt(req.params.id);
    if(req.file){
        const subf = {
                path: req.file.path,
                filename: req.file.filename,
        }

        const fid = await PushTheFileInFs(subf);
        const sub={
            assignmentid:assignmentid,
            studentid:req.user,
            file:'/assignment/media/${fid}'
        }
        try{
            const subid=await insertNewSumbit(sub);
            res.statusI(201).send({
                submissionid:subid
            });
        }catch(err){
            res.status(500).send({
               error:"Err when submit the assignment"
            });
        }
    }else{
        res.status(400).send({
            error:"Not a vaild assignment object"
        });
    }
});
module.exports = router;
