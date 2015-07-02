'use strict';
var webSocket = new WebSocket("ws://localhost:3000/gameboy");

function serverNotify(event){
  webSocket.send(JSON.stringify(event));
}

webSocket.onmessage = function (event) {
  var msg = JSON.parse(event.data);
  if (msg.command === 'load ROM') {
    var mainCanvas = document.getElementById("mainCanvas");
    initPlayer();
    start(mainCanvas, base64_decode(msg.romData));
  }
}


