//Post : 게시글과 관련된 정보를 주고받는 페이지.
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');

//DB 연결
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '1234',
  port : 3306,
  database: 'treenod',
  debug : false
});


// 모든 게시글 정보 전달
router.get('/', function(req, res, next) {
  connection.query('SELECT id, title, content, view, DATE_FORMAT(date, "%Y-%c-%d") as date, writerID, (SELECT name FROM user WHERE Post.writerID = User.id) as writer FROM Post;',
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


//정렬된 정보 전달
router.get('/align/:align', function(req, res, next) {
  var align = req.params.align;
  if(align == 'view') align = 'view DESC'
  console.log(align);
  connection.query(`SELECT id, title, content, view, DATE_FORMAT(date, "%Y-%c-%d") as date, writerID, (SELECT name FROM user WHERE Post.writerID = User.id) as writer FROM Post ORDER BY ${align}`,
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

//해당 id에 해당하는 게시글 반환
router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  connection.query(`SELECT id, title, content, view, DATE_FORMAT(date, "%Y-%c-%d") as date, writerID, (SELECT name FROM user WHERE Post.writerID = User.id) as writer FROM Post WHERE id = '${id}'`,
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

//새 게시글 저장
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

//게시글 수정
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

//게시글 조회수 수정
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

//게시글 삭제
router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  connection.query(`DELETE FROM Post WHERE id = '${id}'`, function(err, rows, fields) {
    if(!err){
      connection.query(`SELECT id FROM File WHERE postID = '${id}'`, function(err, rows, fields) {
        if(!err){
          for(var i = 0; i < rows.length; i++)
          {
            fs.unlinkSync(`${__dirname}/../upload/${rows[i].id}`);
          }
          connection.query(`DELETE FROM File WHERE postID = '${id}'`, function(err, rows, fields) {
            if(!err){
              res.send({success:true})
            }else {
              res.send({success:false, msg:err.message});
            }
          });
        }
        else {
          res.send({success:false, msg:err.message});
        }
      });
    }
    else {
      res.send({success:false, msg: err.message});
    }
  });
});

//id에 대당하는 유저의 게시글 수 전달
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

//user의 id에 대항하는 게시글 모두 전달
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

//작성자검색과 정렬 동시 사용
router.get('/search/user/:search/:align', function(req, res, next) {
  const search = req.params.search;
  var align = req.params.align;
  if(align == 'view') align = 'view DESC'
  connection.query(`SELECT id, title, content, view, DATE_FORMAT(date, "%Y-%c-%d") as date, writerID, (SELECT name FROM user WHERE Post.writerID = User.id) as writer FROM Post WHERE (SELECT name FROM user WHERE id = writerID) LIKE '%${search}%' ORDER BY ${align}`,
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

//제목 검색과 정렬 동시 사용
router.get('/search/title/:search/:align', function(req, res, next) {
  const search = req.params.search;
  var align = req.params.align;
  if(align == 'view') align = 'view DESC'
  connection.query(`SELECT id, title, content, view, DATE_FORMAT(date, "%Y-%c-%d") as date, writerID, (SELECT name FROM user WHERE Post.writerID = User.id) as writer FROM Post WHERE title LIKE '%${search}%' ORDER BY ${align}`,
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
