const http = require('http');
const fs = require('fs');

var host;
var port= "80";

function PostCode(path, message) {
  // Build the post string from an object
  var post_data = querystring.stringify();

  // An object of options to indicate where to post to
  var post_options = {
      host: 'www.never-utopia.com',
      port: '80',
      path: path,
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}
