'use strict';
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var fs = require('fs');
app.use(express.static('./static'));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('GameBoy server listening at http://%s:%s', host, port);

  app.ws('/gameboy', function(ws, req) {
    ws.on('message', function(msg) {
      console.log(new Date().toISOString() + msg);
    });
    var initialROM = fs.readFileSync('initrom.gbc', {encoding: 'base64'});
    console.log("read " + initialROM.length + " base64-encoded bytes from the initial ROM");
    ws.send(JSON.stringify({command: 'load ROM', romData: initialROM}));
  });
});