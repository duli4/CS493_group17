const mysql = require('mysql');
const mysqlPool = require('../lib/mysqlPool');

const EnrollmentSchema = {
  add:{required: true},
  remove:{required: true}
};
exports.EnrollmentSchema = EnrollmentSchema;

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

  async function addEnrollmentById(cid,sid) {
    return new Promise((resolve, reject) => {
      mysqlPool.query(
        'INSERT INTO enrollment (courseid, studentid) VALUES (?, ?)',
        cid,
        sid,
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };
  exports.addEnrollmentById= addEnrollmentById;