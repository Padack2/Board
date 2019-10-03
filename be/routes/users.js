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
  connection.query('SELECT * from User', function(err, rows, fields) {
    if(!err){
      res.send({success:true, msg: rows});
    }
    else {
      res.send({success:false, msg: err.message});
    }
  });
});

router.get('/:id', function(req, res, next) {
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
