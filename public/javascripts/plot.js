Plotly.plot('myDiv', [{
  x: 0,
  y: 0,
  line: {simplify: true},
}]);

var randomize = function() {
    console.log('callback');
  Plotly.animate('myDiv', {
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
