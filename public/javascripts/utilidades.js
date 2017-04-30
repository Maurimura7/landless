
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

lCircular.prototype.setList = function(l, p) {
  var lista = l.list;
  for(var i = 0; i < this.len; i++) {
    this.list[i] = lista[i];
  }
  this.lastPos = p;
}

