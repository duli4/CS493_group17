const router = require('express').Router();

const {getUserById, validateUser, getUserByEmail, getRoleByemail, getUser, getUserDetailsById} = require('../models/user');
const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication,requireAdmin  } = require('../lib/auth');


const {
  getCoursesPage,
  CourseSchema,
  insertNewCourse,
  getCourseById
} = require('../models/course');

const{ requireAuthentication } = require('../lib/auth');

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
  const userid = await getUserByEmail(req.user);
  const userAdmin = await getRoleByemail(req.user);
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
