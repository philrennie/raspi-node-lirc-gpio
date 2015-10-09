var lirc_client = require('lirc_client');
var http = require('http');
var express = require('express');

var app = express();
var port = process.env.port || 8080;

var io = require('socket.io').listen(app.listen(port));
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});
 
try {
    lirc_client.connect("testone", true, "test1.lircrc",function(type, data, configFile){
        //console.log("Type:", type);
        //console.log("Data:", data);
        switch (type) {
            //case "rawdata":
            //    console.log("Rawdata received:",data);
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

