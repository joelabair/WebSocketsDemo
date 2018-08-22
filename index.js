/* index.js */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

var stack = [];

io.on('connection', function(socket) {
	stack.forEach(function(msg) {
		io.to(`${socket.id}`).emit('chat message', msg);
	});
	socket.on('chat message', function(msg) {
		stack.push(msg);
		io.emit('chat message', msg);
	});
});

http.listen(3000, function() {
	console.log('listening on 0.0.0.0:3000');
});