const router = require('express').Router();

const {getUserById,
      validateUser,
      getUserByEmail,
      getRoleByemail,
      getUser,
      getUserDetailsById} = require('../models/user');
const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication,requireAdmin  } = require('../lib/auth');


const {
  getCoursesPage,
  CourseSchema,
  insertNewCourse,
  getCourseById,
  getCourseOfInstructor,
  updatecourseInfo,
  deleteEnroll,
  deleteCourse
} = require('../models/course');

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

router.get('/:id/students', requireAuthentication ,async (req,res,next)=>{
  const cid = req.params.id;
  if(req.usertype == "instructor" || req.usertype == admin){
    console.log(getCourseById(cid));
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

//course/{id}
router.get('/:id', async(req, res, next) => {
      try{
        const course = await getCourseById(parseInt(req.params.id));
        if (user) {
          res.status(200).send(course);
        } else{
          res.status(404).send({
            error: "No such course."
          });
          }
      } catch (err){
          console.log("Course ERROR: ", err);
          res.status(404).send({
            error: "Unable to fetch course."
          });
      }
});

router.put('/:id', requireAuthentication, async(req,res,next) => {
  const userid = await getUserById(req.user);
  const userRole = await getUserById(req.user);
  const teach_id = getCourseOfInstructor(id);
  if (validateAgainstSchema(req.body, CourseSchema)) {
    if(userRole.role == 'admin' || (userRole.role == 'instructor' && userRole.id == teach_id)) {
      try{
        const updated = updatecourseInfo(parseInt(req.params.id), req.body);
        res.status(200).send({});
      }catch(err){
        console.log("put method: ",err);
        res.status(404).send({
          error: "Unable to update course."
        });
      }
    }
    else{
      res.status(403).send({
        error: "Error manager to update course information!"
      });
    }
  }else{
    res.status(400).send({
      error: "Invalid body of course."
    });
  }
});

router.delete('/:id', requireAuthentication, async(req,res,next) => {
    const userRole = await getUserById(req.user);
    if(userRole.role == 'admin'){
      try{
        const courseid = deleteCourse(id);
        const enrolldelete = deleteEnroll(id);
        console.log("enroll delete:", enrolldelete, "course id: ", courseid);
        res.status(204).end();
      }
      catch(err){
        console.log("in delete endpoint: ", err);
        res.status(400).send({
          error: "Error to delete course. "
        });
      }
    }else{
      res.status(403).send({
        error: "No power to delete the course"
      });
    }
});
module.exports = router;
