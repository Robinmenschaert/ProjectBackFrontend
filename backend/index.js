var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

var mongodb = require('mongodb');
var mongoose = require('mongoose');

var jwt =  require('jsonwebtoken');

server.listen(3000);

// ========================================================== EXPRESS API ==================================================

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('localhost:27017/Project');
var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
  username: { type: String},
  password: { type: String}
}, { collection: 'Users' });
var UserData = mongoose.model('student', UserSchema);
var tokens = [];

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/register', function(request, response) {
  console.log("username: " + request.body.username);
  UserData.find()
    .then(function(users){
      for (var i = 0; i < users.length; i++) {
        if (users[i].username === request.body.username) {
          //console.log("username is het zelfde");
          response.send({"code": 401});
        }else if (request.body.username === null || request.body.password === null || request.body.username === "" || request.body.password === "") {
          //console.log("leeg");
          response.send({"code": 400});
        }else {
          var user = {
            username: request.body.username,
            password: request.body.password
          }
          var data = new UserData(user);
          data.save();
          response.send({"code": 200});
        }
      }
    });
  /**/
});

app.post('/login', function(request, response) {
  //console.log(request.body.username);
  UserData.find({username: request.body.username})
    .then(function(user){
      if(user[0].password === request.body.password){
        console.log('loging in');
        var token = jwt.sign({ player: request.body.username}, 'robin');
        tokens.push(token);
        console.log("ok");
        response.send({'token': token,"code": 200});
      }else{
        console.log('not loging in');
        response.send({"code": 400});
      }
    });
});

app.post('/guestLogin', function(request, response) {
  //console.log(request.body.username);
  var token = jwt.sign({ player: request.body.username}, 'robin');
  tokens.push(token);
  response.send({'token': token,"code": 200});
});

// =========================================================== SOCKET.IO ===================================================
const targetCount = 5;
var targets = new Array(targetCount);
var screenWidth = 958;
var screenHieght = 954;
var index = 0;
var letters = ["A","Z","E","R","T","Q","S","D","F","G","W","X","C","V","B"];
for(var i = 0; i < targetCount; i ++) {
  targets[i] = calculateNewTarget(i);
}
function calculateNewTarget() {
  var random = Math.floor((Math.random()*letters.length));
  target = {};
  target.position  = {};
  target.position.x = Math.random() * screenWidth;
  target.position.y = Math.random() * screenHieght;
  target.character = letters[random];
  target.id = ++index;

  return target;
}
io.on('connection', function (socket) {
  console.log("connected");

  socket.on('shoot', function (projectile) {
    socket.broadcast.emit("shoot",projectile);
  });

  socket.on('positionUpdate', function (selfAsEnemy) {
    //self as enemy wordt hier enemy
    socket.broadcast.emit("enemyPositionUpdate", selfAsEnemy, socket.id);
  });

  socket.on('targetHit', function (targetId) {
    socket.broadcast.emit("targetHit", targetId);
    for(var i = 0; i < targetCount; i ++) {
      if (targets[i].id === JSON.parse(targetId)) {
        targets[i] = calculateNewTarget(i);
        io.sockets.emit("newTarget", JSON.stringify(target));
        break;
      }
    }
  });

  socket.on('disconnect', function() {
      console.log('Got disconnect!');
      socket.broadcast.emit("userDisconnected", JSON.stringify("disconect"), socket.id);
   });
  socket.emit("initTargets", JSON.stringify(targets));
});

 /*io.use(function(socket, next){
  //console.log(socket.handshake.query.token);
  checkPermition(socket.handshake.query.token);
});

function checkPermition(token) {
  for (var i = 0; i < tokens.length; i++) {
    if(tokens[i] === token){
      console.log("allowed");
    }else{
      //terug zenden naar login
    }
  }
}*/

//lijst bijhouden alle clients
//alles opvangen van client en broadcasten behalve sender
//target berekenen en broadcasten naar iedereen (per hit event nieuw makken)
//hit verificatie
//(optioneel) kamers
