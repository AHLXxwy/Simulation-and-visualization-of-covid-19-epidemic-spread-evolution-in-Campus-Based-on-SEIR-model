// from http://bl.ocks.org/nitaku/8947871

var LSystem = window.LSystem = {}


LSystem.fractalize = function(config) {
  var char, i, input, output, _i, _len, _ref;
  input = config.axiom;
  for (i = 0, _ref = config.steps; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
    output = '';
    for (_i = 0, _len = input.length; _i < _len; _i++) {
      char = input[_i];
      if (char in config.rules) {
        output += config.rules[char];
      } else {
        output += char;
      }
    }
    input = output;
  }
  return output;
};

/* convert a Lindenmayer string into an SVG path string
*/
LSystem.path = function(config) {
  var angle, char, path, _i, _len, _ref;
  angle = 0.0;
  path = 'M0 0';
  _ref = config.fractal;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    char = _ref[_i];
    if (char === '+') {
      angle += config.angle;
    } else if (char === '-') {
      angle -= config.angle;
    } else if (char === 'F') {
      path += "l" + (config.side * Math.cos(angle)) + " " + (config.side * Math.sin(angle));
    }
  }
  return path;
};

LSystem.grid = function(config) {
  var angle, char, i, j, len, ref, x, y;
  angle = 0.0;
  j = 1;
  var grid = [{x: 0, y: 0, j: 0}];
  ref = config.fractal;
  for (i = 0, len = ref.length; i < len; i++) {
    //if(j >= config.data.length) return grid;
    char = ref[i];
    if (char === '+') {
      angle += config.angle;
    } else if (char === '-') {
      angle -= config.angle;
    } else if (char === 'F') {
      x = config.side * Math.cos(angle);
      y = config.side * Math.sin(angle);
      x += grid[j-1].x;
      y += grid[j-1].y;
      grid.push({
        x: x,
        y: y,
        //data: config.data[j],
        j: j
      });
      j++
    }
  }
  return grid;
}


function hilbert() {
  var angle = 270 * Math.PI / 180;
  var nodes = [];
  var grid = [];
  var data = [];
  var sideLength = 20;
  var steps, hilbertConfig, hilbertFractal;

  function calculate() {
    steps = Math.ceil(Math.log2(data.length || 1) / 2)
    hilbertConfig = {
      steps: steps,
      axiom: 'A',
      rules: {
        A: '-BF+AFA+FB-',
        B: '+AF-BFB-FA+'
      }
    }
    hilbertFractal = LSystem.fractalize(hilbertConfig);
  }

  function newNodes() {
    calculate();
    nodes = [];
    grid = LSystem.grid({
      fractal: hilbertFractal,
      side: sideLength,
      angle: angle
    })
    //console.log(data, grid)
    data.forEach(function(d,i) {
      var node = {
        x: grid[i].x,
        y: grid[i].y,
        data: d,
        index: i
      }
      nodes.push(node);
    })
  }

  this.nodes = function(val) {
    if(val) {
      data = val
    }
    newNodes();
    return nodes;
  }
  this.sideLength = function(val) {
    if(val) {
      sideLength = val;
      return this;
    }
    return sideLength;
  }

}

function grid() {
  var data = []
  var nodes;
  var width = 100;
  var cellWidth = 10;
  var cellHeight = 10;
  var nColumns = 10;
  var offset = [0,0];
  var margin = [1,1];
  var brick = false;


  function getX(d,i) {
    return offset[0] + (i % nColumns) * (cellWidth + margin[0])
  }
  function getY(d,i) {
    return offset[1] + Math.floor(i/nColumns) * (cellHeight + margin[1])
  }

  function newNodes() {
    nodes = [];
    data.forEach(function(d,i) {
      var node = {
        x: getX(d,i),
        y: getY(d,i),
        data: d,
        index: i
      }
      nodes.push(node);
    })
  }
  newNodes();

  function calculate() {
    nodes.forEach(function(node, i) {
      node.x = getX(node, node.index);
      node.y = getY(node, node.index);
      // calculate the center for convenience
      node.cx = node.x + cellWidth/2;
      node.cy = node.x + cellHeight/2;
    })
  }

  this.nodes = function(val) {
    if(val) {
      data = val;
      newNodes();
    }
    calculate();
    return nodes;
  }
  this.columns = function(val) {
  }
  this.cellWidth = function(val) {
    if(val) {
      cellWidth = val;
      this.width(width);
      return this;
    }
    return cellWidth;
  }
  this.cellHeight = function(val) {
    if(val) {
      cellHeight = val;
      return this;
    }
    return cellHeight;
  }
  this.width = function(val) {
    if(val) {
      width = val;
      nColumns = Math.floor((width) / (cellWidth + margin[0])) + (brick ? 0.5 : 0);
      //cellWidth = val / nColumns;
      return this;
    }
    return width;
  }
  this.margin = function(val) {
    if(val) {
      margin = val;
      this.width(width);
      return this;
    }
    return margin;
  }

  this.offset = function(val) {
    if(val) {
      offset = val;
      return this;
    }
    return offset;
  }
  this.brick = function(val) {

    if(val === null || val === undefined) return brick;
    if(val !== null) {
      brick = val;
      this.width(width);
      return this;
    }
    return brick;
  }

  return this;
}
