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

router.get('/:postID', function(req, res, next) {
  const postID = req.params.postID;
  connection.query(`SELECT id, postid, content, DATE_FORMAT(date, "%Y-%c-%d %T") as date, writerID, (select name from user where writerID = User.id) as writer FROM comment WHERE postid = '${postID}'`,
   function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg : rows});
    }
    else {
      res.send({success:false, msg: err.message});
      console.log('Errors while performing Query.', err);
    }
  });
});

router.get('/id/:id', function(req, res, next) {
  const id = req.params.id;
  connection.query(`SELECT id, postid, content, DATE_FORMAT(date, "%Y-%c-%d %T") as date, writerID, (select name from user where writerID = User.id) as writer FROM comment WHERE id = '${id}'`,
   function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg : rows[0]});
    }
    else {
      res.send({success:false, msg: err.message});
      console.log('Errors while performing Query.', err);
    }
  });
});

router.post('/', (req, res, next) => {
  const { postID, content, writerID } = req.body;
  connection.query(`INSERT INTO Comment(postID, content, date, writerID) VALUES('${postID}', '${content}', NOW(), '${writerID}')`, function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg: rows});
    }
    else {
      res.send({success:false, msg: err.message});
    }
  });
});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const content = req.body.content;
  console.log(id);
  connection.query(`UPDATE Comment SET content='${content}' WHERE id = ${id}`,
   function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg : rows[0]});
    }
    else {
      res.send({success:false, msg: err.message});
      console.log('Errors while performing Query.', err);
    }
  });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  connection.query(`DELETE FROM Comment WHERE id = '${id}'`, function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg: rows});
    }
    else {
      res.send({success:false, msg: err.message});
    }
  });
});

module.exports = router;
