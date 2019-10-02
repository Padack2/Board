var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '1234',
  port : 3306,
  database: 'treenod',
  debug : false
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query('SELECT id, title, content, view, DATE_FORMAT(date, "%Y-%c-%d") as date, writerID, (select name from user where Post.writerID = User.id) as writer from Post;',
   function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg : rows});
      console.log('The solution is: ', rows);
    }
    else {
      res.send({success:false, msg: err.message});
      console.log('Errors while performing Query.', err);
    }
  });
});

module.exports = router;
