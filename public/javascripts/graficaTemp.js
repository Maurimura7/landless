var title = "Temperatura";
var labelX = "tiempo";
var labelY = "temperatura";

var mediciones = 200;
var tempHis;

var fontSz = 30;
var paddingX = 80;
var paddingY = 50;

var graphXsz, graphYsz;
var ox, oy;

var maxYValue = 1000;
var maxAcceptable = 90;
var minAcceptable = 60;
var yScl;

var bgColor;
var graphColor;

var dot; //punto para medir

var restartButton;
var restartButtonSz = 50;
var running; //corriendo en tiempo real

function setup() {
  var canvas = createCanvas(600, 600);
  canvas.parent("graf-holder");
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont("Hind");

  tempHis = new lCircular(mediciones);
  
  graphXsz = width - 2*paddingX;
  graphYsz = width - 3*paddingY - fontSz;
  ox = paddingX;
  oy = paddingY + fontSz;

  yScl = graphYsz / maxYValue;

  dot = createVector(ox, oy);
  
  bgColor = color(250);
  graphColor = color(220, 200, 50);
  
  restartGraph();
  
  restartButton = createVector(0.7 * width, -height + paddingY);
  running = true;

}

function draw() {
  translate(0, width);

  //parte estatica
  background(bgColor);
  drawGraphFill();
  drawGraphStroke();
  drawEjes();

  if(running) {
    //console.log("corriendo");
  } else {
    drawDot();
    drawRestartButton();
  }
  resetMatrix();
}

function mousePressed() {
  if(running) {
    running = false;
    stopSending("temp");
  } else {
    handleClick(mouseX, mouseY);
  }
}

function handleClick(x, y) {
  var restartButtonY = restartButton.y + height; 
  if(x > restartButton.x - restartButtonSz/2 &&
     x < restartButton.x + restartButtonSz/2 &&
     y > restartButtonY - restartButtonSz/2 &&
     y < restartButtonY + restartButtonSz/2) {
    restartGraph();
  } else if(x > ox && x < ox + graphXsz) {
    var initPos = tempHis.getLastPos();
    var closerX = ox;
    var closerIndex = initPos;

    for(var i = 0; i < mediciones; i++) {
      var px = map(i, 0, mediciones-1, ox, ox + graphXsz);
      var index = (initPos + i) % mediciones;

      if(abs(px - x) < abs(closerX - x)) {
        closerX = px;
        closerIndex = index;
      }
    }
    var closerY = -tempHis.getNth(closerIndex) * yScl - oy;

    dot.set(closerX, closerY);
  }
}

function restartGraph() {
  running = true;
  askForList();
  dot.set(ox, oy);
  startSending("temp");
}

function getList(l, p) {
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

function drawRestartButton() {
  stroke(lerpColor(color(0), bgColor, 0.75));
  strokeWeight(1);
  fill(lerpColor(color(0), bgColor, 0.9));
  rect(restartButton.x, restartButton.y, restartButtonSz, restartButtonSz);

  noStroke();
  fill(20);
  textSize(0.33 * fontSz);
  text("Restart", restartButton.x, restartButton.y, restartButtonSz, restartButtonSz);
}

function drawDot() {
  stroke(graphColor);
  strokeWeight(1);
  var inc = 6;
  //linea punteada vertical
  for(var y = -oy; y > dot.y; y -= inc) {
    line(dot.x, y, dot.x, y - 0.5*inc);
  }
  //linea punteada horizontal
  for(var x = ox; x < dot.x; x += inc) {
    line(x, dot.y, x + 0.5*inc, dot.y);
  }

  //dot
  stroke(graphColor);
  strokeWeight(8);
  point(dot.x, dot.y);

  //databox
  var dbSz = 80;
  var centroX = dot.x - 0.66*dbSz;
  var centroY = dot.y + 0.66*dbSz;


  stroke(20, 50);
  strokeWeight(1);
  fill(20, 20);
  rect(centroX, centroY, dbSz, dbSz);

  noStroke();
  fill(20, 150);
  textSize(0.5 * fontSz);
  text("23:41:22", centroX, centroY - 0.15*dbSz, dbSz, dbSz);
  text("38ºC", centroX, centroY + 0.15*dbSz, dbSz, dbSz);
}


function drawGraphFill() {
  //fondo del grafico
  fill(lerpColor(graphColor, bgColor, 0.75));
  noStroke();

  var initPos = tempHis.getLastPos();  //el primer elemento está acá
  var initX = ox;
  var initY = -tempHis.getNth(initPos) * yScl - oy;
  beginShape();
  for(var i = 0; i < mediciones; i++) {
    var index = (initPos + i) % mediciones;
    var px = map(i, 0, mediciones-1, initX, initX + graphXsz);
    
    var py = -tempHis.getNth(index) * yScl - oy;
    
    vertex(px, py);
  }
  vertex(ox + graphXsz, -oy);
  vertex(ox, -oy);
  endShape(CLOSE);
}


function drawGraphStroke() {
  //pinto el fondo de color graphColor con opacidad 0.5
  stroke(graphColor);
  strokeWeight(1.5);
  noFill();

  var initPos = tempHis.getLastPos();  //el primer elemento está acá
  var initX = ox;
  var initY = -tempHis.getNth(initPos) * yScl - oy;

  beginShape();
  for(var i = 0; i < mediciones; i++) {
    var index = (initPos + i) % mediciones;
    var px = map(i, 0, mediciones-1, initX, initX + graphXsz);
    var py = -tempHis.getNth(index) * yScl - oy;
    vertex(px, py);
  }
  endShape();
}

function drawEjes() {
  //Titulo
  noStroke();
  fill(20);
  textSize(fontSz);
  text(title, width/2, -height + paddingY, width, 2*fontSz);

  //eje X
  stroke(0);
  strokeWeight(1);
  line(ox - 10, -oy, ox + graphXsz + 10, -oy);
  line(ox + graphXsz + 10, -oy, ox + graphXsz + 5, -oy - 5);
  line(ox + graphXsz + 10, -oy, ox + graphXsz + 5, -oy + 5);
  //Marcas del eje X
  line(ox + graphXsz/2, -oy, ox + graphXsz/2, -oy + 10);
  line(ox + graphXsz/4, -oy, ox + graphXsz/4, -oy + 5);
  line(ox + 3*graphXsz/4, -oy, ox + 3*graphXsz/4, -oy + 5);

  //eje Y1
  line(ox, -oy + 10, ox, -oy - graphYsz - 10);
  line(ox, -oy - graphYsz - 10, ox - 5, -oy - graphYsz - 5);
  line(ox, -oy - graphYsz - 10, ox + 5, -oy - graphYsz - 5);
  //Marcas del eje Y1
  line(ox - 10, -oy - graphYsz/2, ox, -oy - graphYsz/2);
  line(ox - 5, -oy - graphYsz/4, ox, -oy - graphYsz/4);
  line(ox - 5, -oy - 3*graphYsz/4, ox, -oy - 3*graphYsz/4);

  //eje Y2
  line(ox + graphXsz, -oy + 10, ox + graphXsz, -oy - graphYsz - 10);
  line(ox + graphXsz, -oy - graphYsz - 10, ox + graphXsz - 5, -oy - graphYsz - 5);
  line(ox + graphXsz, -oy - graphYsz - 10, ox + graphXsz + 5, -oy - graphYsz - 5);
  //Marcas del eje Y2
  line(ox + graphXsz + 10, -oy - graphYsz/2, ox + graphXsz, -oy - graphYsz/2);
  line(ox + graphXsz + 5, -oy - graphYsz/4, ox + graphXsz, -oy - graphYsz/4);
  line(ox + graphXsz + 5, -oy - 3*graphYsz/4, ox + graphXsz, -oy - 3*graphYsz/4);

  //label X
  noStroke();
  fill(20);
  textSize(0.75*fontSz);
  text(labelX, width/2, -paddingY, width, 2*fontSz);

  //label Y
  noStroke();
  fill(20);
  textSize(0.75*fontSz);
  push();
  translate(paddingX/2, -height/2);
  rotate(-HALF_PI);
  text(labelY, 0, 0, width, 2*fontSz);
  pop();
}
