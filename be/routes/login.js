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



router.post('/', (req, res, next) => {
  const { id, password} = req.body;
  connection.query(`SELECT * FROM User WHERE id = '${id}' and password = '${password}'`, function(err, rows, fields) {
    if(!err){
      if(rows.length == 0)
        res.send({success:true, login: false});
      else
      {
        res.send({success:true, login: true});
      }
    }
    else {
      res.send({success:false, msg: err.message});
    }
  });
});

module.exports = router;
