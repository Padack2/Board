const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '1234',
  port : 3306,
  database: 'treenod',
  debug : false
});

let upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});


router.get('/show/:postID', (req, res, next) => {
  const id = req.params.postID;

  connection.query(`SELECT * FROM File WHERE '${id}' = postID`, function (err, rows, fields) {
    res.send({success:true, msg: rows});
  });
})
/*
router.post('/create', multer().array("files"), (req, res, next) =>{
  let files = req.files

  let result = {
    originalName : file.originalName,
    size : file.size,
  }

  res.json(result);
})*/

router.post("/create/:writerID", upload.array("files"), function (req, res) {
    const writer = req.params.writerID;

    connection.query(`SELECT id FROM Post WHERE '${writer}' = writerID`, function (err, rows, fields) {
      if(!err){
        var postId = rows[rows.length - 1].id;
        for(var i = 0; i < req.files.length; i++)
        {
          connection.query(`INSERT INTO File(name, id, postID) VALUES('${req.files[i].originalname}', '${req.files[i].filename}', '${postId}')`, (err, rows, fields) => {
            if(!err){
              console.log("성공!");
            }
            else {
              console.log(err);
            }
          });
        }
      }
      else {
        console.log(err.message);
      }
    });

    return res.sendStatus(200);
});

router.get('/download/:id/:name', function(req, res){
  var id = req.params.id;
  var name = req.params.name;
  console.log(name);
  var file = __dirname + `/../upload/${id}`;
  res.download(file, name); // Set disposition and send it.
});
module.exports = router;
