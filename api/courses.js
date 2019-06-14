const router = require('express').Router();

const {getUserById, validateUser, getUserByEmail, getRoleByemail, getIdByemail} = require('../models/user');
const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication,requireAdmin  } = require('../lib/auth');


const {
  getCoursesPage,
  CourseSchema,
  insertNewCourse,
  getCourseById
} = require('../models/course');

const {getEnrollmentByCourseId,EnrollmentSchema,addEnrollmentById,removeEnrollmentById,
  getStudentInfoByCourseId,
  getProcessedStudentInfo} = require('../models/enrollment')

router.get('/', async (req, res,next) => {
  try {
    /*
     * Fetch page info, generate HATEOAS links for surrounding pages and then
     * send response.
     */
    const coursePage = await getCoursesPage(parseInt(req.query.page) || 1);
    coursePage.links = {};
    if (coursePage.page < coursePage.totalPages) {
      coursePage.links.nextPage = `/courses?page=${coursePage.page + 1}`;
      coursePage.links.lastPage = `/courses?page=${coursePage.totalPages}`;
    }
    if (coursePage.page > 1) {
      coursePage.links.prevPage = `/courses?page=${coursePage.page - 1}`;
      coursePage.links.firstPage = '/courses?page=1';
    }
    res.status(200).send(coursePage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching courses list.  Please try again later."
    });
  }
});

router.get('/:id/students', requireAuthentication ,requireAdmin,async (req,res,next)=>{
  try{
    const cid = req.params.id;
    const userAdmin = await getUserById(req.user);
    console.log(userAdmin);
    if(userAdmin.role == "instructor" || userAdmin.role == "admin"){
      const course = await getCourseById(cid);
      if(course.length == 0){
        res.status(404).send({
          error: "Course not found."
        });
      }
      if(userAdmin.role == "instructor"){
        console.log(course);
        const courseInstructorNum = course[0].instructor;
        const instructorNum = await getIdByemail(req.user);
        console.log(courseInstructorNum);
        console.log(instructorNum);
        if(courseInstructorNum != instructorNum.id){
          res.status(403).send({
            error: "No permission to checkout students."
          });
        }
      }
      const enrollment = await getEnrollmentByCourseId(cid);
      res.status(200).send({
        students:enrollment
      });
      console.log(course);
    }
    else{
      res.status(403).send({
        error: "No permission to checkout students."
      });
    }
  }catch(err){
    console.error(err);
    res.status(500).send({
      error: "Error inserting course into DB.  Please try again later."
    });
  }

});

router.get('/:id/roster', requireAuthentication ,requireAdmin,async (req,res,next)=>{
  try{
    const cid = req.params.id;
    const userAdmin = await getUserById(req.user);
    console.log(userAdmin);
    if(userAdmin.role == "instructor" || userAdmin.role == "admin"){
      const course = await getCourseById(cid);
      if(course.length == 0){
        res.status(404).send({
          error: "Course not found."
        });
      }
      if(userAdmin.role == "instructor"){
        console.log(course);
        const courseInstructorNum = course[0].instructor;
        const instructorNum = await getIdByemail(req.user);
        console.log(courseInstructorNum);
        console.log(instructorNum);
        if(courseInstructorNum != instructorNum.id){
          res.status(403).send({
            error: "No permission to checkout students."
          });
        }
      }
      //core code part
      const studentInfo = await getStudentInfoByCourseId(cid);
      console.log(studentInfo);
      const processedInfo = getProcessedStudentInfo(studentInfo);
      console.log(processedInfo);
      res.attachment('result.csv');
      res.status(200).send(processedInfo);
      //core code part
    }
    else{
      res.status(403).send({
        error: "No permission to checkout students."
      });
    }
  }catch(err){
    console.error(err);
    res.status(500).send({
      error: "Error inserting course into DB.  Please try again later."
    });
  }

});

router.post('/:id/students', requireAuthentication ,requireAdmin,async (req,res,next)=>{
  if(validateAgainstSchema(req.body,EnrollmentSchema)){
    try{
      const cid = req.params.id;
      const userAdmin = await getUserById(req.user);
      console.log(userAdmin);
      if(userAdmin.role == "instructor" || userAdmin.role == "admin"){
        const course = await getCourseById(cid);
        if(course.length == 0){
          res.status(404).send({
            error: "Course not found."
          });
        }
        if(userAdmin.role == "instructor"){
          console.log(course);
          const courseInstructorNum = course[0].instructor;
          const instructorNum = await getIdByemail(req.user);
          console.log(courseInstructorNum);
          console.log(instructorNum);
          if(courseInstructorNum != instructorNum.id){
            res.status(403).send({
              error: "No permission to manage students."
            });
          }
        }
        //The core code that modify the stuff
        for(var i = 0;i<req.body.add.length;i++){
          let resultAdd = await addEnrollmentById(cid,req.body.add[i]);
          //console.log(req.body.add[i]);
        }
        for(var i = 0;i<req.body.remove.length;i++){
          let resultRemove = await removeEnrollmentById(cid,req.body.remove[i]);

        }

        res.status(200).send({
          message: "Update successful"
        });
        console.log(course);
        //The core code that modify the stuff
      }
      else{
        res.status(403).send({
          error: "No permission to manage students."
        });
      }
    }catch(err){
      console.error(err);
      res.status(500).send({
        error: "Error inserting course into DB.  Please try again later."
      });
    }
  }
  else{
    res.status(400).send({
      error: "Request body is not a valid user object."
    });
  }
});

router.post('/', requireAuthentication, async (req, res,next) => {
  const userid = await getUserById(req.user);
  const userAdmin = await getUserById(req.user);
  console.log(userAdmin);
  if(userAdmin.role == 'admin') {
    if (validateAgainstSchema(req.body, CourseSchema)) {
      try {
        const id = await insertNewCourse(req.body);
        res.status(201).send({
          id: id,
          links: {
            course: `/course/${id}`
          }
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Error inserting course into DB.  Please try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid course object."
      });
    }
  }else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});


module.exports = router;
