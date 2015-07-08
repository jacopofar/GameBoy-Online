'use strict';
var webSocket = new WebSocket("ws://" + location.host + "/visualizer");

webSocket.onmessage = function (event) {
  var msg = JSON.parse(event.data);
  if (msg.command === 'canvas') {
    var screenshot       = document.getElementById("screenshot");
    screenshot.innerHTML = '<img src="' + msg.canvas + '" />';
  }
}


