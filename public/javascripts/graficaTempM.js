var dot,
    mediciones = 200,
    temHis;

Plotly.plot('graf-holder', [{
  x: 0,
  y: 0,
  line: {simplify: true},
}]);


/*
  function restartGraph() {
  running = true;
  askForList();
  startSending("temp");
}
*/

function getList(l, p) {

  tempHis = new lCircular(mediciones);
  var newList = new lCircular(mediciones);
  var a = JSON.parse(l);
  for(var i = 0; i < mediciones; i++) {

    var json = a[i];
    var temp = 0;
    try {
		var d = JSON.parse(json.datos);
		temp = d.temp;
	} catch(e) {

	}
  	var t = json.time;
    newList.pushl(temp);
  }

  tempHis.setList(newList, p);
}

function getTemp(t) {
  tempHis.pushl(t);
}


var restartGraph = function() {
  Plotly.animate('graf-holder', {
    data: [{x: [Math.random(), Math.random(), Math.random()]}],
    traces: [0],
    layout: {}
  }, {
    transition: {
      duration: 500,
      easing: 'cubic-in-out'
    }
  })
}
