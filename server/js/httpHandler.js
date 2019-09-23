const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
var backgroundImageFile = path.join('.', 'background.jpg');
// module.exports.backgroundImageFile = path.join('.', 'background.jpg');
module.exports.backgroundImageFile = backgroundImageFile;
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  // console.log('Serving request type ' + req.method + ' for url ' + req.url);
  if (req.url === '/') {
    res.writeHead(200, headers);
    if (req.method === 'GET') {
      var cmd = messageQueue.dequeue();
      if (cmd) {
        console.log(`Responding to GET request with cmd: ${cmd}`);
        res.write(cmd);
      }
    }
    if (req.method === 'POST') {
      // set uploaded image as background
      console.log('set background image');
    }
    res.end();
    next();
  } else if (req.url === '/' + backgroundImageFile) {
    fs.readFile(`../server/js/${backgroundImageFile}`, 'base64', function(err, data) {
      if (err) {
        res.writeHead(404, headers);
        res.end();
        next();
      } else {
        res.writeHead(200, headers);
        res.write(new Buffer(data, 'base64'));
        res.end();
        next();
      }
    });
  }
  else {
    res.writeHead(404, headers);
    res.end();
    next();
  }
};
