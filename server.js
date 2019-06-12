const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const api = require('./api');
// const { connectToDB } = require('./lib/mongo');

const app = express();
const port = process.env.PORT || 8000;

/*
 * Morgan is a popular logger.
 */
app.use(morgan('dev'));
// const { connectToRabbitMQ, getChannel } = require('./lib/rabbitmq');
app.use(bodyParser.json());
app.use(express.static('public'));

/*
 * All routes for the API are written in modules in the api/ directory.  The
 * top-level router lives in api/index.js.  That's what we include here, and
 * it provides all of the routes.
 */
app.use('/', api);

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
});

// 
// connectToDB(async () => {
//   while(1){
//     try{
//       await connectToRabbitMQ('images');
//       console.log("RabbitMQ Connect Success");
//       break;
//     }catch (e) {
//       //console.log("connection err",e,"retrying");
//     }
//   }
//   app.listen(port, () => {
//     console.log("== Server is running on port", port);
//   });
// });

app.listen(port, function() {
  console.log("== Server is running on port", port);
});
