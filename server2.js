// server.js

// set up ======================================================================
// get all the tools we need
var http = require('http');
var express  = require('express');
var app      = express();
var port_http     = process.env.PORT || 8080;
var port_tcp= 8081;
var path = require('path');
var flash    = require('connect-flash');
var request = require('request');
var favicon = require('serve-favicon');
var time = require('node-datetime');
var net = require('net');

//control de pines
//var rpio = require("rpio");

//modulo para recuperar ip address
var os = require('os');

// http ======================================================================
console.log('Configurando servidor http...');
app.configure(function() {
	app.use(express.bodyParser());
	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));
//	app.use(favicon('public/images/favicon.png'));
	app.use(express.session({ secret: 'impresionwifi' })); // session secret
	app.use(flash()); // use connect-flash for flash messages stored in session
});
var server_http = http.createServer(app);
// tcp  ======================================================================
console.log('Configurando servidor tcp...');
var io = require('socket.io').listen(server_http);






//obtengo ip address de interfaz de red
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

//inicio router de peticiones con modulos rpio / io
require('./app/routes.js')(app, io, time, addresses);

//comienzo a escuchar puertos ======================================================================
server_http.listen(port_http, function(){
	//imprimo direccion donde corre el sv
	var t_ = time.create().format('H:M:S');
	console.log(t_+' Servidor http inicado en: '+addresses+':'+ port_http);
});





