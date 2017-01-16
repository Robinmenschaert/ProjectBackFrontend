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

app.post('/register', function(request, response) {
  console.log(request.body.username);
  var user = {
    username: request.body.username,
    password: request.body.password
  }
  var data = new UserData(user);
  data.save();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/login', function(request, response) {
  //console.log(request.body.username);
  UserData.find({username: request.body.username})
          .then(function(user){
            //console.log(user[0].username);
            //console.log(user.password + " === " + request.body.password);
            if(user[0].password === request.body.password){
              console.log('loging in');
              //login allowed
              //string(gelijkaardig aan jwt aan maaken)
              //tokenAanmaken(request.body.username);
              var token = jwt.sign({ player: request.body.username}, 'robin');
              tokens.push(token);
              console.log("ok");
              response.send(token);
              //return request.body.username;
              //in een lijst steken en bij elke socket testen als dit wel mag
            }else{
              console.log('not loging in');
            }
          });
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
      socket.broadcast.emit("userDisconnected", JSON.stringify("disconect"));
   });

  socket.emit("initTargets", JSON.stringify(targets));
});
io.use(function(socket, next){
  console.log('----------------------------------------------------------------------------');
  console.log('----------------------------------------------------------------------------');
  console.log('----------------------------------------------------------------------------');
  console.log('----------------------------------------------------------------------------');
  console.log('----------------------------------------------------------------------------');
  console.log(socket.handshake.query.token);
  /*if (socket.request.headers.cookie) return next();
  next(new Error('Authentication error'));*/
});

//lijst bijhouden alle clients
//alles opvangen van client en broadcasten behalve sender
//target berekenen en broadcasten naar iedereen (per hit event nieuw makken)
//hit verificatie
//(optioneel) kamers
