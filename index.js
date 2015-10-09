var lirc_client = require('lirc_client');
var http = require('http');
var express = require('express');
var moment = require('moment');

var now = moment();
now.set({'minute':10, 'second':0});

var app = express();
var port = process.env.port || 8080;

var io = require('socket.io').listen(app.listen(port));
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

io.on('connection', function(socket){
  socket.emit('button', now.format("mm:ss"));
});

var Gpio = require('onoff').Gpio,
  //led = new Gpio(14, 'out'),
  button = new Gpio(4, 'in', 'both');

var pressed = 0;

function dec(){
    if(pressed == 1){
      now.subtract(10, 'ms');
      io.sockets.emit('button', now.format("mm:ss"));
      setTimeout(dec, 10);
    }   
}

button.watch(function(err, value) {
  //led.writeSync(value);
  if(value == 1){
     pressed = 1;
     dec();
  } else {
    pressed = 0;
  }
});

function exit() {
  button.unexport();
  process.exit();
}
 
try {
    lirc_client.connect("testone", true, "test1.lircrc",function(type, data, configFile){
        switch (type) {
            //case "rawdata":
            //    break;
            case "data":
                io.sockets.emit('button', data);
                console.log("Data received '%s' from configFile '%s'",data, configFile);
                break;
            case "closed":
                console.log("Lircd closed connection to us.");
                break;
        }
    });
 
    console.log("lirc_client.isConnected:", lirc_client.isConnected);
    console.log("lirc_client.mode:", lirc_client.mode);
    console.log("lirc_client.configFiles:", lirc_client.configFiles);
 
    // console.close();
    console.log("lirc_client.isConnected:", lirc_client.isConnected);
}
catch (err) {
    console.log("Error on connect:",err);
}

process.on('SIGINT', exit);
