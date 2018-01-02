var express = require('express');
var morgan = require('morgan');
var path = require('path');
var mysql = require('mysql');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
  secret : 'someRandomSecretValue',
  cookie : { kmaxAge: 1000 * 60 * 60 * 24 * 30},
  resave : true,
  saveUninitialized : true
}));

var pool = mysql.createPool({
  host : '127.0.0.1',
  user : 'root',
  password : 'nithya98',
  database  : 'hellobookworm'
});

function hash(input,salt){
  //create hash
  var hashed = crypto.pbkdf2Sync(input , salt, 100000, 512, 'sha512');
  return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}

app.post('/register',function (req,res) {
  var username = req.body.username;
  var password = req.body.password;
  if(username.length != 0 && password.length > 6){
    var salt = crypto.randomBytes(120).toString('hex');
    var dbString = hash(password,salt);
    pool.getConnection(function(err,connection){
      connection.query("SELECT * FROM `user` WHERE `username` = ?",[username],function(error,results,fields){ 
        if(err){res.status(500).send(err.toString());}
        else{
          if(results.length === 0){
              connection.query("INSERT INTO `user` (`username`, `password`) VALUES (?,?)",[username,dbString],function(error,results,fields){   
              if(err){res.status(500).send(err.toString());}
              else{
                req.session.auth = {userId:results[0].insertId};
                res.send(JSON.stringify({code:200})); 
              }
            });
          }else{res.status(403).send('invalid username/password');}
        }
      });
    });
  }
  else{res.status(403).send('invalid username/password');}
});

app.post('/login',function (req,res) {
  var username = req.body.username;
  var password = req.body.password;
  pool.getConnection(function(err,connection){
    connection.query("SELECT * FROM `user` WHERE `username` = ?",[username],function(error,results,fields){   
      if(err){res.status(500).send(err.toString());}
      else{
        if(results.length === 0){
          res.status(403).send('invalid username/password');}
        else{
          var dbString = results[0].password;
          var salt = dbString.split('$')[2];
          var hashpass = hash(password,salt);
          if(hashpass === dbString){
            req.session.auth = {userId:results[0].id};
            //console.log(req.session.auth.userId);
            //console.log("login complete");
            res.send(JSON.stringify({code:200})); 
          }
          else{res.status(403).send('invalid username/password');}  
        }
      }
    });
  });
});
app.post('/check-login',function(req,res){
  if(req.session && req.session.auth && req.session.auth.userId){
    pool.getConnection(function(err,connection){
      console.log(req.session.auth.userId);
      console.log("check-login")
      connection.query("SELECT * FROM `user` WHERE id =?",[req.session.auth.userId],function(err,results,fields){
        if(err){res.status(500).send(err.toString());}
        else{
          console.log(results[0].username);
          res.status(200).send("nithya");}
      });
    });
  }
  else{res.status(400).send('error');}
});
app.post('/logout',function(req,res){
  delete req.session.auth;
  res.send('user logged out');
});
app.post('/publish',function (req,res) {
  if(req.session && req.session.auth && req.session.auth.userId){
    pool.getConnection(function(err,connection){
      connection.query("SELECT * FROM `user` WHERE id =?",[req.session.auth.userId],function(err,results,fields){
        if(err){res.status(500).send(err.toString());}
        else{
          var pen=req.body.pen;
          var title=req.body.title;
          var content=req.body.content;
          pool.getConnection(function(err,connection){
            connection.query("INSERT INTO `book_info`(`hasura_id`,`date`) VALUES (?,now())",[req.session.auth.id],function(error,results,fields){   
              if(err){res.status(500).send(err.toString());}
              else{
                if(results.length === 0){
                  res.status(403).send('something is wrong!!');}
                else{
                  pool.getConnection(function(err,connection){
                    connection.query("INSERT INTO `book`(`book_id`,`titile`,`content`) VALUES (?,?,?) ",[results[0].insertId,title,content],function(error,results,fields){   
                      if(err){res.status(500).send(err.toString());}
                      else{
                        pool.getConnection(function(err,connection){
                          connection.query("UPDATE `data` SET `penname` = ? WHERE `hasura_id` = ?",[pen,req.session.auth.id],function(error,results,fields){   
                            if(err){res.status(500).send(err.toString());}
                            else{
                              if(results.length === 0){
                                res.status(403).send('something is wrong!!');}
                              else{
                                console.log("suceess");
                              }
                            }
                          });
                        });
                        res.send(JSON.stringify({msg:results,code:200}));
                      }
                    });
                  }); 
                }
              }
            });
          });
        }
      });
    });
  }
  else{res.status(400).send('You are not logged in');}

  
        
});
app.post('/story',function (req, res) {
  body2=""
  pool.getConnection(function(err,connection){
    connection.query("SELECT * FROM `book` ",function(error,results,fields){   
      if(err){res.status(500).send(err.toString());}
      else{
        if(results.length === 0){
          res.status(403).send('something is wrong!!');}
        else{
          body2=results
          body1=""
          pool.getConnection(function(err,connection){
            connection.query("SELECT * FROM `book_info` ",function(error,results,fields){   
              if(err){res.status(500).send(err.toString());}
              else{
                if(results.length === 0){
                  res.status(403).send('something is wrong!!');}
                else{          
                  body1=results
                  res.send(JSON.stringify({msg1:body2,code:200,msg2:body1}));
                }
              }
            });
          });
        }
      }
    });
  });
  
  
});
app.post('/quote',function (req,res) {
  pool.getConnection(function(err,connection){
    connection.query("SELECT * FROM `quotes` ",function(error,results,fields){   
      if(err){res.status(500).send(err.toString());}
      else{
        if(results.length === 0){
          res.status(403).send('something is wrong!!');}
        else{
          res.send(JSON.stringify({msg:results,code:200}));
        }
      }
    });
  });
});
app.get('/', function (req, res) {
  console.log("nithya");    
  res.sendFile(path.join(__dirname,'ui','temp.html'));
});
app.get('/css/:name',function (req,res) {
  var name = req.params.name;
  res.sendFile(path.join(__dirname,'css',name));
});
app.get('/ui/:name',function (req,res) {
  var name = req.params.name;
  res.sendFile(path.join(__dirname,'ui',name));
});
app.get('/images/:name',function (req,res) {
  var name = req.params.name;
  res.sendFile(path.join(__dirname,'images',name));
});
app.get('/js/:name',function (req,res) {
  var name = req.params.name;
  res.sendFile(path.join(__dirname,'js',name));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`app listening on port ${port}!`);
});
