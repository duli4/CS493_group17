const mysql = require('mysql');
const mysqlPool = require('../lib/mysqlPool');

async function getEnrollmentByCourseId(id) {
    return new Promise((resolve, reject) => {
      mysqlPool.query(
        'SELECT studentid FROM enrollment where courseid = ?',
        id,
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };
  exports.getEnrollmentByCourseId= getEnrollmentByCourseId;