'use strict';
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var fs = require('fs');
app.use(express.static('./static'));
var irc    = require('irc');
var config = require('./config.js');



fs.open('play_log.txt', 'a',function(err,fd_log){
  if(err){
    console.log("cannot open the log file!");
    return;
  }
  var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('GameBoy server listening at http://%s:%s', host, port);

    var ircClient         = new irc.Client(config.server, config.irc_nick, {
      channels: [config.irc_channel]
    });

    ircClient.addListener('message', function (from, channel, message) {
      fs.write(fd_log, JSON.stringify({message: message, from: from, ts: Date.now()}) + "\n");
      if (message.toLowerCase() === '!help') {
        ircClient.say(config.irc_channel, 'See the game at http://' + config.host_address + ':3000/game_img.html Available moves: "right", "left", "up", "down", "a", "b", "select", "start"');
      }

      if (["right", "left", "up", "down", "a", "b", "select", "start"].indexOf(message.toLowerCase()) !== -1) {
        expressWs.getWss('/gameboy').clients.forEach(function (client) {
          client.send(JSON.stringify({command: "pressOnce", key: message}));
        });
      }

    });

    ircClient.addListener('error', function (message) {
      console.log('error: ', message);
    });
    app.ws('/gameboy', function(ws, req) {
      ws.on('message', function (msg_raw) {
        var msg = JSON.parse(msg_raw);

        if (msg.type === 'canvas') {
          fs.writeFile('canvas_' + msg.ts + '.png', msg.content.replace(/^data:image\/png;base64,/, ""), {encoding: 'base64'}, function (err) {
            if (err)
              console.log("error saving screenshot");
          });
          return;
        }
        fs.write(fd_log, JSON.stringify(msg)+"\n");
        console.log(JSON.stringify(msg));
        if (msg.type === 'keyUp' || msg.type === 'keyDown') {
          ws.send(JSON.stringify({command: 'screenshot'}));
        }

      });
      var initialROM = fs.readFileSync('initrom.gbc', {encoding: 'base64'});
      console.log("read " + initialROM.length + " base64-encoded bytes from the initial ROM");
      ws.send(JSON.stringify({command: 'load ROM', romData: initialROM}));
    });


  });
});

