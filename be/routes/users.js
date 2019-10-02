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
  console.log(id);
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

router.post('/login', (req, res, next) => {
  const { id, password} = req.body;
  connection.query(`SELECT * FROM User WHERE id = '${id}' and password = '${password}'`, function(err, rows, fields) {
    if(!err){
      if(rows.length == 0)
        res.send({success:true, login: false});
      else
      {
        res.cookie("user", rows[0].id, {
          expires: new Date(Date.now() + 900000),
          httpOnly: true
        });
        console.log(req.cookie.user);

        res.send({success:true, login: true});
      }
    }
    else {
      res.send({success:false, msg: err.message});
    }
  });
});

router.get('/login', function(req, res, next) {
    res.send({user:req.cookie.user});
});

module.exports = router;
