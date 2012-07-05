express = require('express');


var app = express.createServer();

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

app.configure(function(){
    app.set("view options", { layout: false, pretty: true });
    app.use(express.favicon());
    app.use(express.static(__dirname + '/public'));
    }
);

var nowjs = require("now");
var everyone = nowjs.initialize(app, {
    socketio: { transports: ["xhr-polling"],
    'polling duration': 10}
});



var fs = require('fs');

var buffer = new Buffer(5050);

var fd;

fs.open('pi.txt','r', 0666, function(err, fd_cb) {
  fd = fd_cb;
});

everyone.now.nextChunk = function(cursor) {
    var self = this;
    fs.read(fd, buffer, 0, 5050, cursor, function(err, bytesRead, buf) {
    if (bytesRead > 0) {
      var content = buffer.toString();
      content = content.replace(/\n/g, "<br />");
    } else {
      content = 'EOF'
    }
    self.now.appendContent(content);
  });
}