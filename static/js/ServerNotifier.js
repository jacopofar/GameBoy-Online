'use strict';
var webSocket = new WebSocket("ws://" + location.host + "/gameboy");

function serverNotify(event){
  event.ts = Date.now();
  webSocket.send(JSON.stringify(event));
}

webSocket.onmessage = function (event) {
  var msg = JSON.parse(event.data);
  if (msg.command === 'load ROM') {
    var mainCanvas = document.getElementById("mainCanvas");
    initPlayer();
    start(mainCanvas, base64_decode(msg.romData));
  }
  if (msg.command === 'screenshot') {
    webSocket.send(JSON.stringify({ts:Date.now(),type: 'canvas', content: gameboy.canvas.toDataURL()}));
  }
}


