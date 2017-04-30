
// Create SocketIO instance, connect
var ip,socket,sendingTemp;
function init_addr(a){
	console.log("init socket: "+a);
	ip=a;
	socket = io(ip+':8080/');
	sendingTemp = true;

// Add a connect listener
socket.on('connect',function() {
  console.log('Conectado!');
  restartGraph();
});

// Add a disconnect listener
socket.on('disconnect',function() {
  console.log('Desconectado!');
});


socket.on('reset', function(d) {
        var lp = d.lp;
	var lt = d.lt;
        getList(lt, lp);

});

socket.on('data', function(d) {
  	var dat = JSON.parse(d.datos);
  	var temp = dat.temp;
  	var luz = dat.luz;
  	var t = d.time;
  	if(sendingTemp) {
  		getTemp(temp);
  	}
});
}
function askForList() {

	socket.emit('pet', "Peticion de lista");
}

function stopSending(which) {
	switch(which) {
		case "temp":
		sendingTemp = false;
		break;

		default:
		console.log("alguien que no existe pidio stopSending");
		break;
	}
}

function startSending(which) {
	switch(which) {
		case "temp":
		sendingTemp = true;
		break;

		default:
		console.log("alguien que no existe pidio stopSending");
		break;
	}
}
//Botones
function enviarControl(data){
    console.log('Enviado');
    socket.emit('accion',data);
}
