// server.js
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

//  we will load the io-handler module and will attach the connection listeners
require('./io-handler')(io);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index2.html');
});


server.listen(3003);