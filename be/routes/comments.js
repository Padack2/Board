//Comment : 댓글과 관련된 정보를 주고받는 페이지.
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

//DB 연결
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '1234',
  port : 3306,
  database: 'treenod',
  debug : false
});


//PostID가 입력되면 해당 Post에 해당하는 댓글 전부 제공
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

//comment/id/아이디 페이지에 연결되면 아이디에 해당하는 정보 제공.
//수정에 사용(원래 있던 정보 미리 입력)
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

//새 댓글 저장
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

//댓글 수정
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

//댓글 삭제
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
