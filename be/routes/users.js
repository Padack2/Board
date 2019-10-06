//Users : 유저와 관련된 정보를 주고받는 페이지.
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

//모든 유저 정보 전달
router.get('/', function(req, res, next) {
  connection.query('SELECT * from User', function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg: rows});
    }
    else {
      res.send({success:false, msg: err.message});
    }
  });
});

//id가 존재하는지 체크
router.get('/count/:id', function(req, res, next) {
  const id = req.params.id
  connection.query('SELECT COUNT(*) as count FROM User WHERE id = "'+id+'"', function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg: rows[0].count == 0});
    }
    else {
      res.send({success:false, msg: err.message});
    }
  });
});

//id에 해당하는 정보 제공
router.get('/:id', function(req, res, next) {
  const id = req.params.id
  connection.query(`SELECT * FROM User WHERE id = '${id}'`, function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg: rows[0]});
    }
    else {
      res.send({success:false, msg: err.message});
    }
  });
});

//회원가입
router.post('/', (req, res, next) => {
  const { id, password, name } = req.body;
  connection.query(`INSERT INTO User(id, password, name) VALUES('${id}', '${password}', '${name}')`, function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg: rows});
    }
    else {
      res.send({success:false, msg: err.message});
    }
  });
});

//회원탈퇴
router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  connection.query(`DELETE FROM User WHERE id = '${id}'`, function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg: rows});
    }
    else {
      res.send({success:false, msg: err.message});
    }
  });
});

module.exports = router;
