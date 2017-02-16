var express = require('express');
var http = require('http');
var url = require('url');
var session = require('client-sessions');
var ejs = require('ejs');
var session = require('client-sessions');
var QmlWeb = require('qmlweb');
var initQmlWebEngine = require('./js/gzqtjs').initQmlWebEngine;
//var ws = require("nodejs-websocket");
var ws = require("ws");
var InitQrc = require('qmlweb/lib/qmlwebqrc');
var compression = require('compression')


var _qrc = new InitQrc([
  "../bin/qml/content/qrc_biz_greenzone.min.js",
  "../bin/qml/content/qrc_util.min.js",
  "../bin/qml/content/qrc_light.min.js"
]);

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

var document = {
  createElement : function () {
    return {dummy:"dummy"};
  }
};

function start() {
  console.log("Starting QmlWeb server...")
  var glbutl = {
    allQmls:[] // not used
  };
  var usrpmn = {
    digits:5,
    timeZones : [0],
    timeZoneId : "0"
  };
  global.document = document;

  var engine = new QmlWeb.QMLEngine();

  engine.rootContext["globalUtil"] = glbutl;
  engine.rootContext["userAppMain"] = usrpmn;

  initQmlWebEngine(engine);
}



var app = express()

app.set('view engine', 'ejs');

app.use(session({
  cookieName: 'session',
  secret: '1álk3él,ááé$$$$~9₁u1uéd28hs2aihao  q',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));


app.use(compression({
  threshold : 0, // or whatever you want the lower threshold to be
  filter    : shouldCompress
}));

app.use('/', express.static(__dirname+"/../bin"));
app.use('/', express.static(__dirname));

app.get('/hello', function (req, res) {
  res.send('Hello World!')
})

app.get("/qindex", function (req, res) {
  res.render('qindex.ejs', { debug:undefined, title: 'Hey', message: 'Hello there!' })
})

app.get("/index", function (req, res) {
  res.render('index.ejs', { debug:undefined, title: 'Hey', message: 'Hello there!' })
})

app.get("", function (req, res) {
  res.render('index.ejs', { debug:undefined, title: 'Hey', message: 'Hello there!' })
})




start();


//app.listen(3000, function () {
//  console.log('Example app listening on port 3000!')
//})



var server = http.createServer(app);
var wss = new ws.Server({ server : server });

wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(_json) {
    var obj = JSON.parse(_json);
    console.log('received: ', obj);
    if (obj.init) {
      ws.send(JSON.stringify({msg:"Replied to:"+obj.init.toUpperCase()}));
    }
  });

  ws.send(JSON.stringify({msg:"Connected."}));
});

server.listen(3000, function listening() {
  console.log('Listening on %d', server.address().port);
});
