var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

const targetCount = 5;
var targets = new Array(targetCount);
var screenWidth = 958;
var screenHieght = 954;
var index = 0;
var letters = ["A","Z","E","R","T","Q","S","D","F","G","W","X","C","V","B"];
for(var i = 0; i < targetCount; i ++) {
  var random = Math.floor((Math.random()*letters.length));
  getTarget(i);
}
function getTarget(i) {
  targets[i] = {};
  targets[i].position  = {};
  targets[i].position.x = Math.random() * screenWidth;
  targets[i].position.y = Math.random() * screenHieght;
  targets[i].character = letters[random];
  targets[i].id = i;
}

console.log(targets);
io.on('connection', function (socket) {

  socket.on('shoot', function (projectile) {
    socket.broadcast.emit("shoot",projectile);
  });

  socket.on('positionUpdate', function (selfAsEnemy) {
    //self as enemy wordt hier enemy
    socket.broadcast.emit("enemyPositionUpdate", selfAsEnemy, socket.id);
  });

  socket.on('targetHit', function (targetId) {
    //self as enemy wordt hier enemy

    for(var i = 0; i < targetCount; i ++) {
      if (targets[i].id === targetId) {
        getTarget(i)
      }
    }
    console.log(targets);

    //socket.broadcast.emit("targetAdd" );
  });

  socket.emit("initTargets", JSON.stringify(targets));
});


//lijst bijhouden alle clients
//alles opvangen van client en broadcasten behalve sender
//target berekenen en broadcasten naar iedereen (per hit event nieuw makken)
//hit verificatie
//(optioneel) kamers
