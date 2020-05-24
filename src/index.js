import React from 'react';
import ReactDOM from 'react-dom';

// TableData handles clicks, drawing and erasing walls, etc. 
class TableData extends React.Component {

  handleClick(val) {

    if (clicked == 1) {

      // we only want animation for startNode to happen one time
      if (startClick === startNode && val == lastStart) {
        return; // don't execute rest
      }

      // we only want animation for endNode to happen one time
      if (endClick === endNode && val == lastEnd) {
        return; // don't execute rest
      }

      // if the starting click was at the startNode
      if (startClick === startNode) {

        // if we ever venture on TOP of the endNode, stop.
        if (val === endNode) {
          return;
        }
        
        // clearing where the startNode was last
        var last = document.getElementById(lastStart);
        last.innerHTML = "";
        last.classList.add("unit");
        last.classList.remove("other");
        if (hadWallStart) {
          last.classList.add("wall");
          last.classList.add("none");
        }
        lastStart = val; // this will be the new place of the startNode

        // adding the new startNode
        var unit = document.getElementById(val);
        unit.classList.remove("unit");
        hadWallStart = false;
        if (unit.classList.contains("wall")) {
          hadWallStart = true;
          unit.classList.remove("wall");
          unit.classList.remove("none");
        }
        unit.classList.add("other");
        unit.innerHTML = '<i id="start-icon" class="far fa-arrow-alt-circle-right start"></i>';

        return; // don't execute rest
      }

      // if the starting click was at the endNode
      if (endClick === endNode) {

        // if we ever venture on TOP of the startNode, stop.
        if (val === startNode) {
          return;
        }

        // clearing where the startNode was last
        last = document.getElementById(lastEnd);
        last.innerHTML = "";
        last.classList.add("unit");
        last.classList.remove("other");
        if (hadWallEnd) {
          last.classList.add("wall");
          last.classList.add("none");
        }
        lastEnd = val; // this will be the new place of the startNode

        // adding the new startNode
        unit = document.getElementById(val);
        unit.classList.remove("unit");
        hadWallEnd = false;
        if (unit.classList.contains("wall")) {
          hadWallEnd = true;
          unit.classList.remove("wall");
          unit.classList.remove("none");
        }
        unit.classList.add("other");
        unit.innerHTML = '<i id="end-icon" class="fas fa-gift start"></i>';

        return; // don't execute rest
      }

      // don't hightlight the startNode
      if (val == startNode) {
        return;
      }

      // don't highlight the endNode
      if (val == endNode) {
        return;
      }

      // only modify <td> once on each click. resets after mouseup.
      unit = document.getElementById(val);
      if (listChanged.includes(val)) {
        return;
      }

      // if wall, remove. if not, add.
      if (!listChanged.includes(val) && unit.classList.contains("wall")) {
        listChanged = [];
        listChanged.push(val);
        unit.classList.remove("wall");
        unit.classList.remove("none");
      }
      
      else if (!listChanged.includes(val) && !unit.classList.contains("wall")) {
        listChanged = [];
        listChanged.push(val);
        unit.classList.add("wall");
        unit.classList.add("none");
      }
    }
  }

  clicked(val) {

    startClick = val;
    endClick = val;
    // if start, don't allow color change

    if (val == startNode || val == endNode) {
      return;
    }

    var unit = document.getElementById(val);
    
    // doesn't allow for color change twice (once on move, once on button down)
    if (listChanged.includes(val)) {
      return;
    }

    if (!listChanged.includes(val) && !unit.classList.contains("wall")) {
      listChanged.push(val);
      unit.classList.add("wall");
      unit.classList.add("none");
    }
    else if (!listChanged.includes(val) && unit.classList.contains("wall")) {
      listChanged.push(val);
      unit.classList.remove("wall");
      unit.classList.remove("none");
    }
  }

  // setting nodes to where the new position is
  setNodes(val) {
    startNode = lastStart;
    endNode = lastEnd;
  }

  render() {
    return (
      <td 
        draggable="false"
        id={this.props.id} 
        className={this.props.className}
        onMouseMove={() => this.handleClick(this.props.id)}
        onMouseDown={() => this.clicked(this.props.id)}
        onMouseUp={() => this.setNodes(this.props.id)}
      ></td>
    );
  }
} // end TableData Component

// simple rendering of the entire grid
class Body extends React.Component {
  constructor(props) {
    super(props); // always needed
    this.state = {
      dataValue: true,
    };
  }

  render() {

    // creates rows of table
    let table = [];
    for (var i = 0; i < 30; ++i) {

      // creates each row
      let row = [];
      for (var j = 0; j < 55; ++j) {
        var idValue = "" + String(i) + "-" + String(j);
        var classes = "unit ";
        if (j === 54) {
          classes += "b-right ";
        }
        if (i === 29) {
          classes += "b-bottom ";
        }
        if (i == 14 && j == 11) {
          classes = "other";
        }
        if (i == 14 && j == 43) {
          classes = "other";
        }
        row.push(
          <TableData 
            id={idValue} 
            key={idValue} 
            className={classes}
          />
        );
      }
      table.push(<tr row={i} key={i}>{row}</tr>);
    }

    return (
      <table className="grid">
        <thead>
          {table}
        </thead>
      </table>
    );
  }
}

// clears the board
function clearBoard() {
  var elements = document.getElementsByTagName("td");
  for (var x = 0; x < elements.length; ++x) {
    elements[x].classList.remove("visited");
    if (elements[x].classList.contains("wall")) {
      elements[x].classList.remove("wall");
      elements[x].classList.remove("none");
    }
  }
}

// find coordinate on graph, can use to find <td>
function findCoords(position) {
  var row = "";
  var col = "";

  if (startNode.length === 3) { // X-X
    row = startNode.substring(0, 1);
    col = startNode.substring(2);
  }

  else if (startNode.length === 5) { // XX-XX
    row = startNode.substring(0, 2);
    col = startNode.substring(3);
  }

  // two scenarios: XX-X or X-XX
  else if (startNode.length === 4) {

    if (startNode.substring(1, 2) === "-") { // X-XX
      row = startNode.substring(0, 1);
      col = startNode.substring(2);
    }
    else if (startNode.substring(2, 3) === "-" ) { // XX_X
      row = startNode.substring(0, 2);
      col = startNode.substring(3);
    }
  }

  // convert to integers
  row = parseInt(row, 10);
  col = parseInt(col, 10);

  return [row, col];
}

// calculating NESW
function calcNorth(coord) {
  if (coord[0] - 1 >= 0) {
    var north = "" + String(coord[0] - 1) + "-" + String(coord[1]);
    var northCell = document.getElementById(north);
    return northCell;
  }
  return false;
}

function calcEast(coord) {
  if (coord[1] + 1 < 55) {
    var east = "" + String(coord[0]) + "-" + String(coord[1] + 1);
    var eastCell = document.getElementById(east);
    return eastCell;
  }
  return false;
}

function calcSouth(coord) {
  if (coord[0] + 1 < 30) {
    var south = "" + String(coord[0] + 1) + "-" + String(coord[1]);
    var southCell = document.getElementById(south);
    return southCell;
  }
  return false;
}

function calcWest(coord) {
  if (coord[1] - 1 >= 0) {
    var west = "" + String(coord[0]) + "-" + String(coord[1] - 1);
    var westCell = document.getElementById(west);
    return westCell;
  }
  return false;
}

// visualize depth first search
async function depthFirst() {

  // remove previous visited
  var elements = document.getElementsByTagName("td");
  for (var x = 0; x < elements.length; ++x) {
    elements[x].classList.remove("visited");
  }

  // stack
  var array = [];

  // calculating row and column
  array.push(findCoords(startNode));

  while (array.length != 0) {
    var next = array.pop();
    var north = calcNorth(next);
    var east = calcEast(next);
    var south = calcSouth(next);
    var west = calcWest(next);
      
    var nextId = "" + String(next[0]) + "-" + String(next[1]);
    var nextElement = document.getElementById(nextId);
    
    if (nextElement.innerHTML == '<i id="end-icon" class="fas fa-gift start" aria-hidden="true"></i>') {
      nextElement.classList.add("visited");
      return;
    }
    else {
      nextElement.classList.add("visited");
    }
    
    await sleep(10);

    // calculating north, east, south, west
    if (north != false) {
      if (!north.classList.contains("wall") && !north.classList.contains("visited")) {
        array.push([next[0] - 1, next[1]]);
      }
    }

    if (east != false) {
      if (!east.classList.contains("wall") && !east.classList.contains("visited")) {
        array.push([next[0], next[1] + 1]);
      }
    }

    if (south != false) {
      if (!south.classList.contains("wall") && !south.classList.contains("visited")) {
        array.push([next[0] + 1, next[1]]);
      }
      
    }

    if (west != false) {
      if (!west.classList.contains("wall") && !west.classList.contains("visited")) {
        array.push([next[0], next[1] - 1]);
      }
    }

  }
}

// set visualization to depth first search
function setDepthFirst() {
  algorithm = "depth-first";
}

// calls correct algorithm to visualize
function visualize() {
  if (algorithm === "depth-first") {
    depthFirst();
  }
  else {
    alert("Choose an algorithm on the left!");
  }
}

// sleep function allowing users to see search 
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// creating random maze
async function randomMaze() {
  clearBoard();
  for (var i = 0; i < 30; ++i) {
    for (var j = 0; j < 55; ++j) {
      var idValue = "" + String(i) + "-" + String(j);
      var random = document.getElementById(idValue);
      if (Math.floor(Math.random() * 6) == 1) {
        if (!(idValue === lastStart || idValue === lastEnd)) {
          random.classList.add("wall");
          random.classList.add("none");
          await sleep(15);
        }
      }
    }
  }
}

// modifying where the startNode is
let startNode = "14-11";
let startClick = "";
let lastStart = "14-11";
let hadWallStart = false;

// modifying where the endNode is
let endNode = "14-43";
let endClick = "";
let lastEnd = "14-43";
let hadWallEnd = false;

// modifying making and clearing walls
let clicked = 0;
let listChanged = [];
let element = document.getElementsByTagName("body")[0];

// setting which algorithm
let algorithm = "";

// entire body mouseup/down, keeping track when creating walls
element.addEventListener("mousedown", function() {
  clicked = 1;
});
element.addEventListener("mouseup", function() {
  clicked = 0;
  listChanged = [];
});

function Start(props) {
  return(
    <i id="start-icon" className="far fa-arrow-alt-circle-right start"></i>
  );
}

function End(props) {
  return(
    <i id="end-icon" className="fas fa-gift start"></i>
  );
}

function Random(props) {
  return(
    <button onClick={props.onClick} className="random-maze pt-1 pb-1 pl-2 pr-2 mr-5"> Random Maze </button>
  );
}

function Visualize(props) {
  return(
    <button onClick={props.onClick} className="btn btn-success"> Visualize! </button>
  );
}

function DepthFirst(props) {
  return(
    <button onClick={props.onClick} className="random-maze pt-1 pb-1 pl-2 pr-2 mr-5"> Depth First Search </button>
  );
}

ReactDOM.render(
  <Body />,
  document.getElementById('table')
);

ReactDOM.render(
  <Start 
  />,
  document.getElementById('14-11')
);

ReactDOM.render(
  <End />,
  document.getElementById('14-43')
);

ReactDOM.render(
  <Random 
    onClick={() => randomMaze()}
  />,
  document.getElementById('maze-generation')
);

ReactDOM.render(
  <Visualize
    onClick={() => visualize()}
  />,
  document.getElementById('visualize')
)

ReactDOM.render(
  <DepthFirst
    onClick={() => setDepthFirst()}
  />,
  document.getElementById('depth-first')
)