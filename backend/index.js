var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  /*socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });*/

  socket.on('shoot', function () {
    socket.broadcast.emit("shoot")
  })

  socket.on('drawEnemy', function () {
    socket.broadcast.emit("drawEnemy")
  })
});


//lijst bijhouden alle clients
//alles opvangen van client en broadcasten behalve sender
//target berekenen en broadcasten naar iedereen (per hit event nieuw makken)
//hit verificatie
//(optioneel) kamers
