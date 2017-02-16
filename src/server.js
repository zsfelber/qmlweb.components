var express = require('express');
var http = require('http');
var url = require('url');
var compression = require('compression')


function shouldCompress (req, res) {
  var cext = /(^|\.)\w+$/.exec(req.originalUrl);
  if (!cext || req.originalUrl === "") {
    res.set("Content-Type", "text/html; charset=UTF-8");
  } else {
    switch (cext[0]) {
    case ".png" : res.set("Content-Type", "image/png; charset=UTF-8"); break;
    case ".gif" : res.set("Content-Type", "image/gif; charset=UTF-8"); break;
    case ".jpg" : res.set("Content-Type", "image/jpg; charset=UTF-8"); break;
    case ".svg" : res.set("Content-Type", "image/svg; charset=UTF-8"); break;
    case ".ico" : res.set("Content-Type", "image/x-icon; charset=UTF-8"); break;
    case ".html" :
    case "qindex" :
    case "index" :  res.set("Content-Type", "text/html; charset=UTF-8"); break;
    case ".css" : res.set("Content-Type", "text/css; charset=UTF-8"); break;
    case ".js" : res.set("Content-Type", "text/javascript; charset=UTF-8"); break;
    case ".swf" : res.set("Content-Type", "application/x-shockwave-flash; charset=UTF-8"); break;
    }
  }

  if (req.headers['x-no-compression']) {
    console.warn('x-no-compression: '+req.originalUrl);
    // don't compress responses with this request header
    return false;
  }
  var type = res.get('Content-Type');
  if (!type) type = res.getHeader('Content-Type')
  if (!type) {
    console.warn('no content-type : '+req.originalUrl);
  }

  // fallback to standard filter function
  if (!compression.filter(req, res)) {
    if (!/^image[/]/.test(type)) {
      console.warn('not compressible (filtered, non-image) : '+req.originalUrl);
    }
    return false;
  }

  return true;
}


var app = express()

app.use(compression({
  threshold : 0, // or whatever you want the lower threshold to be
  filter    : shouldCompress
}));

app.use('/qmlweb', express.static(__dirname+"/../../qmlweb"));
app.use('/', express.static(__dirname));



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
