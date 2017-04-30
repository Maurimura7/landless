// app/routes.js
var path=require("path");
module.exports = function(app, rpio,io , time, ipaddress) {
	io.on('connection', function(socket) {
		var t_ = time.create().format('H:M:S');
		console.log(t_+' Cliente web conectado');

		socket.on('disconnect', function(){
			var t_ = time.create().format('H:M:S');
			console.log(t_+" Cliente web desconectado");
		});
		socket.on('pet', function(a){

			var u= {'lp': cache.getLastPos(), 'lt': JSON.stringify( cache.getList() )};

			io.sockets.emit('reset', u);
		});

		//BOTONES

		  socket.on('accion', function (data) {
		    switch(data.id){
			case 'intensidad' :
				if(data.val>0){
					rpio.open(33,rpio.OUTPUT , rpio.HIGH);
					if(data.val>1){
						rpio.open(35,rpio.OUTPUT , rpio.HIGH);;
						if(data.val>2){
							rpio.open(37,rpio.OUTPUT , rpio.HIGH);
						}else{
							rpio.open(37,rpio.OUTPUT , rpio.LOW);
						}
					}else{
						rpio.open(35,rpio.OUTPUT , rpio.LOW);
						rpio.open(37,rpio.OUTPUT , rpio.LOW);
					}
				}else{
					rpio.open(35,rpio.OUTPUT , rpio.LOW);
					rpio.open(37,rpio.OUTPUT , rpio.LOW);
					rpio.open(33,rpio.OUTPUT , rpio.LOW);
				}
				break;
			}
		  });
	});
	//inicio lista circular con 200 valores 
	var cache = new lCircular(200);

	//Inicio conexion serie con el adquisidor
	var SerialPort = require('serialport');
    var portName = '/dev/ttyUSB0';
	var sp = new SerialPort(portName,
	  {  baudRate: 9600,
		  dataBits: 8,
		  flowControl:false}
	);
    sp.on("open", function () {
		var t_ = time.create().format('H:M:S');
		console.log (t_+" Adquisidor conectado");
	});
	sp.on("data", function (a) {
		var u={'time':time.create().format('H:M:S'), 'datos': a.toString()}
		cache.pushl(u);
		io.sockets.emit('data', u);
	});



	//seteo ip de server tcp para el autoconnect del cliente web
	var glIp= ""+ipaddress[0]+"";
	//router
	console.log("Send url tcp server to Client web: "+glIp);
	app.get('/', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('index', {url_tcp : glIp });

	});

	//defino lista circular

	function lCircular(l) {
	  this.len = l;
	  this.lastPos = 0;
	  this.list = [];
	  for(var i = 0; i < this.len; i++) {
		this.list.push(0);
	  }
	}

	lCircular.prototype.pushl = function(e) {
	  this.list[this.lastPos] = e;
	  this.lastPos = (this.lastPos + 1) % this.len;
	}

	lCircular.prototype.getLastPos = function() {
	  return this.lastPos;
	}

	lCircular.prototype.getNth = function(n) {
	  return this.list[n];
	}

	lCircular.prototype.length = function() {
	  return this.len;
    }
	lCircular.prototype.getList = function() {
	  return this.list;
	}
	lCircular.prototype.setList = function(l, p) {
	  for(var i = 0; i < this.len; i++) {
		this.list[i] = l[i];
	  }
	  this.lastPos = p;
	}
	


};


