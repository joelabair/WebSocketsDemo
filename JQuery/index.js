/* index.js */

const sn = require('sillyname');
const qr = require('qr-image');
const ips = require('./addresses.js');
const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let ip = ips[0];

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

app.use(express.static('public'));

app.get('/qr-code', function(req, res){
  let code = qr.image(`http://${ip}:3040`, { type: 'png', size: 20 });
  res.setHeader('Content-type', 'image/png');
  code.pipe(res);
});

let stack = [];
let users = {};

io.on('connection', function(socket) {
	stack.forEach(function(msg) {
		io.to(`${socket.id}`).emit('chat message', msg);
	});
	socket.on('hello', function(userid) {
		if (!users.hasOwnProperty(userid)) {
			users[userid] = {
				name: sn(),
				color: getRandomColor()
			};
		}
		let user = users[userid];
		socket.emit('greetings', user);
	});
	socket.on('chat message', function(msg) {
		let user = users[msg.u];
		msg.u = user.name;
		msg.c = user.color;
		msg.t = (new Date()).toString();
		stack.push(msg);
		io.emit('chat message', msg);
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
    let status = (err.status || 500);
    let json = {
      status: status,
      message: err.message
    };
    console.error(err);
    res.status(status).send(json);
});

http.listen(3040, function() {
	console.log(`listening on ${ip}:3040`);
	console.log(`go here http://${ip}:3040`);
});
