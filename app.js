// Optional server for testing this tool, use with nodemon for faster testing cycles than deploying
const path = require('path');

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const http = require('http');
var publicPath = path.join(__dirname, 'docs');
var express = require('express');
var app = express();
const serverPort = argv.port || process.env.port || 8081;


app.use('/', express.static(publicPath));


let serverOptions = {

};

var server = http.createServer(serverOptions, app).listen(serverPort, function(){
    //logger.info("listening for http on port " + serverPort);
});



