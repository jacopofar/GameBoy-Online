'use strict';
var webSocket = new WebSocket("ws://localhost:3000/gameboy");

function serverNotify(event){
  webSocket.send(JSON.stringify(event));
}