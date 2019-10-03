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
    }
    else {
      res.send({success:false, msg: err.message});
      console.log('Errors while performing Query.', err);
    }
  });
});

router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  console.log(id);
  connection.query(`SELECT id, title, content, view, DATE_FORMAT(date, "%Y-%c-%d") as date, writerID, (select name from user where Post.writerID = User.id) as writer from Post WHERE id = '${id}'`,
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
  const { title, content, writerID } = req.body;
  connection.query(`INSERT INTO Post(title, content, date, writerID) VALUES('${title}', '${content}', NOW(), '${writerID}')`, function(err, rows, fields) {
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
  const { title, content } = req.body;
  console.log(id);
  connection.query(`UPDATE Post SET title='${title}', content='${content}' WHERE id = ${id}`,
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

router.put('/view/:id', (req, res, next) => {
  const id = req.params.id;
  connection.query(`UPDATE Post SET view = view + 1 WHERE id = ${id}`,
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
  connection.query(`DELETE FROM Post WHERE id = '${id}'`, function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg: rows});
    }
    else {
      res.send({success:false, msg: err.message});
    }
  });
});

router.get('/count/:id', function(req, res, next) {
  const id = req.params.id
  connection.query(`SELECT COUNT(*) as count FROM Post WHERE writerID = '${id}'`, function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg: rows[0]});
    }
    else {
      res.send({success:false, msg: err.message});
    }
  });
});

router.get('/user/:id', function(req, res, next) {
  const id = req.params.id
  connection.query(`SELECT id, title, content, view, DATE_FORMAT(date, "%Y-%c-%d") as date, writerID FROM Post WHERE writerID = '${id}'`, function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg: rows});
    }
    else {
      res.send({success:false, msg: err.message});
    }
  });
});

router.get('/search/user/:search', function(req, res, next) {
  const search = req.params.search;
  connection.query(`SELECT id, title, content, view, DATE_FORMAT(date, "%Y-%c-%d") as date, writerID, (select name from user where Post.writerID = User.id) as writer from Post WHERE (select name from user where id = writerID) LIKE '%${search}%'`,
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

router.get('/search/title/:search', function(req, res, next) {
  const search = req.params.search;
  connection.query(`SELECT id, title, content, view, DATE_FORMAT(date, "%Y-%c-%d") as date, writerID, (select name from user where Post.writerID = User.id) as writer from Post WHERE title LIKE '%${search}%'`,
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



module.exports = router;
