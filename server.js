"use strict";
var express = require('express');
var app = express();
var router = express.Router();
var uuid = require('uuid');
var bodyParser = require("body-parser");

app.use(express.static('client'));
app.use(bodyParser.json());

router.use(routerMiddleware);

router.get('/stream', streamGET);

router.post('/room', roomPOST);

app.use('/', router);

app.use(error404);

app.use(error500);

var server = app.listen(3000, '127.0.0.1', initialServerLog);

function routerMiddleware(req, res, next) {
  console.log(req.ip, req.method, req.url);
  next(); 
}

function streamGET(req, res) {
  res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
  res.write("retry: 10000\n");
  res.write("data: " + (new Date()) + "\n\n");
  res.write("data: " + (new Date()) + "\n\n");
}

function roomPOST(req, res) {
  console.log(req.body.room);
}

function error404(req, res, next) {
  res.status(404).send("Sorry, URL not found!");
}

function error500(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke at our end! We regret the inconvenience.");
}

function initialServerLog() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
}