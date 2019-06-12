const router = require('express').Router();

const { getBusinessesByOwnerId } = require('../models/user');
// const { getReviewsByUserId } = require('../models/review');
// const { getPhotosByUserId } = require('../models/photo');
const {insertNewUser, getUserById, validateUser, getUserByEmail, getRoleByemail} = require('../models/user')
//
const { generateAuthToken, requireAuthentication,requireAdmin  } = require('../lib/auth')


/*
 * Route to list all of a user's businesses.
 */
// router.get('/:id/businesses', requireAuthentication,async (req, res, next) => {
//   const userid = await getUserByEmail(req.user);
//   const userAdmin = await getRoleByemail(req.user);
//   if(req.params.id  == userid.id || userAdmin.admin == 1) {
//     try {
//       const businesses = await getBusinessesByOwnerId(parseInt(req.params.id));
//       if (businesses) {
//         res.status(200).send({ businesses: businesses });
//       } else {
//         next();
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).send({
//         error: "Unable to fetch businesses.  Please try again later."
//       });
//     }
//   }else {
//       res.status(403).send({
//         error: "Unauthorized to access the specified resource"
//       });
//   }
// });

/*
 * Route to list all of a user's reviews.
 */
// router.get('/:id/reviews',requireAuthentication, async (req, res, next) => {
//   const userid = await getUserByEmail(req.user);
//   const userAdmin = await getRoleByemail(req.user);
//   if(req.params.id  == userid.id || userAdmin.admin == 1) {
//     try {
//       const reviews = await getReviewsByUserId(parseInt(req.params.id));
//       if (reviews) {
//         res.status(200).send({ reviews: reviews });
//       } else {
//         next();
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).send({
//         error: "Unable to fetch reviews.  Please try again later."
//       });
//     }
//   }else {
//       res.status(403).send({
//         error: "Unauthorized to access the specified resource"
//       });
//   }
// });

/*
 * Route to list all of a user's photos.
 */
// router.get('/:id/photos',requireAuthentication, async (req, res, next) => {
//   const userid = await getUserByEmail(req.user);
//   const userAdmin = await getRoleByemail(req.user);
//   if(req.params.id  == userid.id || userAdmin.admin == 1) {
//     try {
//       const photos = await getPhotosByUserId(parseInt(req.params.id));
//       if (photos) {
//         res.status(200).send({ photos: photos });
//       } else {
//         next();
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).send({
//         error: "Unable to fetch photos.  Please try again later."
//       });
//     }
//   }else {
//       res.status(403).send({
//         error: "Unauthorized to access the specified resource"
//       });
//   }
// });

/*
 Post a new user
*/

router.post('/',requireAdmin,async(req,res,next) => {
  try{
  // console.log("body admin: ", req.body.admin);
    if(req.body.role == 'student'){
      const id = await insertNewUser(req.body);
      res.status(201).send(
        {
          _id: id
        }
      );
    }
    else if(req.body.role == 'admin'  || req.body.role == 'instructor'){
      const userAdmin = await getRoleByemail(req.user);
      if(userAdmin == 'student' || userAdmin == 'instructor'){
        res.status(401).send({
          error: "Invalid authentication token provided, only admin user can create another admin or instructor"
        });
      }
      else{
      const id = await insertNewUser(req.body);
      console.log("id is---------------------: ", id);
      res.status(201).send(
        {
          _id: id
        }
      );}
    }
  }catch(err){
    console.error(" -- ERROR:", err);
    res.status(500).send({
      error: "Error insert new user, try again later."
    })
  }
});

router.get('/:id',requireAuthentication, async(req, res, next) => {
  const userid = await getUserByEmail(req.user);
  const userRole = await getRoleByemail(req.user);
  if(req.params.id  == userid.id || userRole == 'admin') {
      try{
        const user = await getUserDetailsById(parseInt(req.params.id));
        if (user) {
          res.status(200).send(user);
        } else{
            next();
          }
      } catch (err){
          console.log("ERROR: ", err);
          res.status(500).send({
            error: "Unable to fetch user."
          });
      }
  } else {
      res.status(403).send({
        error: "Unauthorized to access the specified resource"
      });
  }
});

/*
 User login
*/

router.post('/login', async(req,res) => {
    if (req.body && req.body.email && req.body.password) {
      try {
        const authenticated = await validateUser(req.body.email, req.body.password);
        console.log(authenticated);
        if (authenticated) {
          const token = generateAuthToken(req.body.email);
          res.status(200).send({
            token: token
          });
        } else {
          res.status(401).send({
            error: "Invalid credentials"
          });
        }
      } catch (err) {
        res.status(500).send({
          error: "Error validating user.  Try again later."
        });
      }
  } else {
    res.status(400).send({
      error: "Request body was invalid"
    });
  }
});

module.exports = router;
