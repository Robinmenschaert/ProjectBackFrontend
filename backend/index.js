var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');
var bodyParser = require('body-parser')
var express = require('express');

app.listen(3000);

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());

app.post('/register', function(req, res) {
  console.log("register toegekomen");
});

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
      if (targets[i].id === targetId) {
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


//lijst bijhouden alle clients
//alles opvangen van client en broadcasten behalve sender
//target berekenen en broadcasten naar iedereen (per hit event nieuw makken)
//hit verificatie
//(optioneel) kamers
