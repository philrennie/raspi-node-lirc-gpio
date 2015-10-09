var http = require('http');
var express = require('express');

var app = express();
var port = 8080;

var io = require('socket.io').listen(app.listen(port));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});
