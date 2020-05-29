import React from 'react';
import ReactDOM from 'react-dom';

// TableData handles clicks, drawing and erasing walls, etc. 
class TableData extends React.Component {

  handleClick(val) {

    if (clicked === 1) {

      // allow for visualization while moving end node
      if ((endClick === endNode || startClick === startNode) && visualized) {
        firstTime = false;
        visualize();
      }

      // we only want animation for startNode to happen one time
      if (startClick === startNode && val === lastStart) {
        return; // don't execute rest
      }

      // we only want animation for endNode to happen one time
      if (endClick === endNode && val === lastEnd) {
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

        // clearing where the endNode was last
        last = document.getElementById(lastEnd);
        last.innerHTML = "";
        last.classList.add("unit");
        last.classList.remove("other");
        if (hadWallEnd) {
          last.classList.add("wall");
          last.classList.add("none");
        }
        lastEnd = val; // this will be the new place of the endNode

        // adding the new endNode
        unit = document.getElementById(val);
        unit.classList.remove("unit");
        unit.classList.add("other");
        hadWallEnd = false;
        if (unit.classList.contains("wall")) {
          hadWallEnd = true;
          unit.classList.remove("wall");
          unit.classList.remove("none");
        }
        unit.innerHTML = '<i id="end-icon" class="fas fa-gift start"></i>';

        return; // don't execute rest
      }

      // don't hightlight the startNode or endNode
      if (val === startNode || val === endNode) {
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
        unit.classList.remove("visited");
        unit.classList.remove("animation");
        unit.classList.remove("no-animation");
        unit.classList.remove("path");
        unit.classList.remove("path-animation");
        unit.classList.remove("none");
      }
      
      else if (!listChanged.includes(val) && !unit.classList.contains("wall")) {
        listChanged = [];
        listChanged.push(val);
        unit.classList.add("wall");
        unit.classList.add("none");
        unit.classList.remove("visited");
        unit.classList.remove("animation");
        unit.classList.remove("path");
        unit.classList.remove("path-animation");
        unit.classList.remove("no-animation");
      }
    }
  }

  clicked(val) {

    startClick = val;
    endClick = val;
    
    // if start, don't allow color change
    if (val === startNode || val === endNode) {
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
      unit.classList.remove("visited");
      unit.classList.remove("animation");
      unit.classList.remove("no-animation");
      unit.classList.remove("path");
      unit.classList.remove("path-animation");
    }
    else if (!listChanged.includes(val) && unit.classList.contains("wall")) {
      listChanged.push(val);
      unit.classList.remove("wall");
      unit.classList.remove("none");
      unit.classList.remove("visited");
      unit.classList.remove("animation");
      unit.classList.remove("no-animation");
      unit.classList.remove("path");
      unit.classList.remove("path-animation");
    }
  }

  // setting nodes to where the new position is
  setNodes(val) {
    startNode = lastStart;
    endNode = lastEnd;

    if (visualized && val === endNode && !firstTime) {
      visualize();
    }

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
        if (i === 14 && j === 11) {
          classes = "other";
        }
        if (i === 14 && j === 43) {
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
      <table className="grid" width="810px">
        <thead>
          {table}
        </thead>
      </table>
    );
  }
}

// clears the board
function clearBoard() {
  clearOtherButtons();
  visualized = false;
  var elements = document.getElementsByTagName("td");
  for (var x = 0; x < elements.length; ++x) {
    elements[x].classList.remove("visited");
    elements[x].classList.remove("path");
    elements[x].classList.remove("path-animation");
    elements[x].classList.remove("none");
    elements[x].classList.remove("animation");
    elements[x].classList.remove("no-animation");
    if (elements[x].classList.contains("wall")) {
      elements[x].classList.remove("wall");
    }
  }
  algorithm = "";
}

// find coordinate on graph, can use to find <td>
function findCoords(position) {
  var row = "";
  var col = "";

  if (position.length === 3) { // X-X
    row = position.substring(0, 1);
    col = position.substring(2);
  }

  else if (position.length === 5) { // XX-XX
    row = position.substring(0, 2);
    col = position.substring(3);
  }

  // two scenarios: XX-X or X-XX
  else if (position.length === 4) {

    if (position.substring(1, 2) === "-") { // X-XX
      row = position.substring(0, 1);
      col = position.substring(2);
    }
    else if (position.substring(2, 3) === "-" ) { // XX_X
      row = position.substring(0, 2);
      col = position.substring(3);
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

function resolve(point, direction, next, classToAdd) {
  if (point !== false) {

    // is the inside of this the end node?
    if (point.id === lastEnd) {

      if (direction === "north") {
        backtrack[next[0] - 1][next[1]] = "n";
      }
      else if (direction === "east") {
        backtrack[next[0]][next[1] + 1] = "e";
      }
      else if (direction === "south") {
        backtrack[next[0] + 1][next[1]] = "s";
      }
      else if (direction === "west") {
        backtrack[next[0]][next[1] - 1] = "w";
      }

      point.classList.add('visited');
      element.classList.remove("unclickable");
      point.classList.add(classToAdd);
      printPath();
      return 'stop';
    }

    // if not, then only mark visited if not wall, not already visited, and not the start node
    if (!point.classList.contains("wall") && !point.classList.contains("visited") && point.innerHTML === "") {
      point.classList.add("visited");
      point.classList.add(classToAdd);
      if (direction === "north") {
        array.push([next[0] - 1, next[1]]);
        backtrack[next[0] - 1][next[1]] = "n";
      }
      else if (direction === "east") {
        array.push([next[0], next[1] + 1]);
        backtrack[next[0]][next[1] + 1] = "e";
      }
      else if (direction === "south") {
        array.push([next[0] + 1, next[1]]);
        backtrack[next[0] + 1][next[1]] = "s";
      }
      else if (direction === "west") {
        backtrack[next[0]][next[1] - 1] = "w";
        array.push([next[0], next[1] - 1]);
      }
    }
  }
}

function resolveDepth(point, direction, next, classToAdd) {
  if (point !== false) {

    // is the inside of this the end node?
    if (point.id === lastEnd) {

      if (direction === "north") {
        backtrack[next[0] - 1][next[1]] = "n";
      }
      else if (direction === "east") {
        backtrack[next[0]][next[1] + 1] = "e";
      }
      else if (direction === "south") {
        backtrack[next[0] + 1][next[1]] = "s";
      }
      else if (direction === "west") {
        backtrack[next[0]][next[1] - 1] = "w";
      }

      point.classList.add('visited');
      element.classList.remove("unclickable");
      point.classList.add(classToAdd);
      printPath();
      return 'stop';
    }

    // if not, then only mark visited if not wall, not already visited, and not the start node
    if (!point.classList.contains("wall") && !point.classList.contains("visited") && point.innerHTML === "") {
      point.classList.add("visited");
      point.classList.add(classToAdd);
      if (direction === "north") {
        array.push([next[0] - 1, next[1]]);
        backtrack[next[0] - 1][next[1]] = "n";
      }
      else if (direction === "east") {
        array.push([next[0], next[1] + 1]);
        backtrack[next[0]][next[1] + 1] = "e";
      }
      else if (direction === "south") {
        array.push([next[0] + 1, next[1]]);
        backtrack[next[0] + 1][next[1]] = "s";
      }
      else if (direction === "west") {
        backtrack[next[0]][next[1] - 1] = "w";
        array.push([next[0], next[1] - 1]);
      }
      return "continue";
    }
  }
  return "nothing";
}

async function breadth() {
  var classToAdd = "no-animation";
  if (firstTime) {
    classToAdd = "animation";
    element.classList.add("unclickable");
  }
  // remove previous markings and creates 2d array for backtrack
  backtrack = [];
  var row = [];
  var elements = document.getElementsByTagName("td");
  for (var x = 0; x < elements.length; ++x) {
    if (row.length !== 54) {
      row.push('');
    }
    else {
      row = [];
      backtrack.push(row);
    }
    elements[x].classList.remove("visited");
    elements[x].classList.remove("path");
    elements[x].classList.remove("path-animation");
    elements[x].classList.remove("animation");
    elements[x].classList.remove("no-animation");
    if (!elements[x].classList.contains("wall")) {
      elements[x].classList.remove("none");
    }
  }
  
  // stack/queue
  array = [];
  
  // calculating row and column
  var startCoordinates = findCoords(lastStart);
  backtrack[startCoordinates[0]][startCoordinates[1]] = "*";
  array.push(startCoordinates);
  document.getElementById(lastStart).classList.add("visited");
  document.getElementById(lastStart).classList.add(classToAdd);

  // while array not empty on depth-first
  var breadthCounter = 0;
  while (array.length != 0) {
    var next;
    
    // for breadth-first, don't change array (expensive), just iterate through and add.
    // until we reach the end
    if (breadthCounter === array.length) {
      return;
    }
    next = array[breadthCounter];
    ++breadthCounter;

    // calculates nesw
    var north = calcNorth(next);
    var east = calcEast(next);
    var south = calcSouth(next);
    var west = calcWest(next);

    // nice animation
    if (firstTime) {
      await sleep(speed);
    }

    if (resolve(north, "north", next, classToAdd) === 'stop') {
      return;
    }
    if (resolve(east, "east", next, classToAdd) === 'stop') {
      return;
    }
    if (resolve(south, "south", next, classToAdd) === 'stop') {
      return;
    }
    if (resolve(west, "west", next, classToAdd) === 'stop') {
      return;
    }

    if (breadthCounter === array.length) {
      element.classList.remove('unclickable');
    }
  }
}

async function depth() {
  var classToAdd = "no-animation";
  if (firstTime) {
    classToAdd = "animation";
    element.classList.add("unclickable");
  }
  // remove previous markings and creates 2d array for backtrack
  backtrack = [];
  var row = [];
  var elements = document.getElementsByTagName("td");
  for (var x = 0; x < elements.length; ++x) {
    if (row.length !== 54) {
      row.push('');
    }
    else {
      row = [];
      backtrack.push(row);
    }
    elements[x].classList.remove("visited");
    elements[x].classList.remove("path");
    elements[x].classList.remove("path-animation");
    elements[x].classList.remove("animation");
    elements[x].classList.remove("no-animation");
    if (!elements[x].classList.contains("wall")) {
      elements[x].classList.remove("none");
    }
  }
  
  // stack/queue
  array = [];
  
  // start depth first search, add start node/visited.
  var startCoordinates = findCoords(lastStart);
  backtrack[startCoordinates[0]][startCoordinates[1]] = "*";
  array.push(startCoordinates);
  document.getElementById(lastStart).classList.add("visited");
  document.getElementById(lastStart).classList.add(classToAdd);
  
  // while array not empty on depth-first
  while (array.length != 0) {
    var next;
    
    // gets last element like stack
    next = array[array.length - 1];

    // calculates nesw, if visited or DNE, skip. if not, add north and explore.
    var north = calcNorth(next);
    var east = calcEast(next);
    var south = calcSouth(next);
    var west = calcWest(next);

    // nice animation
    if (firstTime) {
      await sleep(speed);
    }

    var ansNorth = resolveDepth(north, "north", next, classToAdd);
    if (ansNorth === 'stop') {
      return;
    }
    else if (ansNorth === 'continue') {
      continue;
    }

    var ansEast = resolveDepth(east, "east", next, classToAdd);
    if (ansEast === 'stop') {
      return;
    }
    else if (ansEast === 'continue') {
      continue;
    }

    var ansSouth = resolveDepth(south, "south", next, classToAdd);
    if (ansSouth === 'stop') {
      return;
    }
    else if (ansSouth === 'continue') {
      continue;
    }

    var ansWest = resolveDepth(west, "west", next, classToAdd);
    if (ansWest === 'stop') {
      return;
    }
    else if (ansWest === 'continue') {
      continue;
    }

    // if reached here, no neighbors. just pop.
    array.pop();

    if (array.length === 0) {
      element.classList.remove("unclickable");
    }
  }
}

async function printPath() {
  var endCoords = findCoords(lastEnd);
  
  var forwardPath = [];
  // go back until we find the start node
  while (backtrack[endCoords[0]][endCoords[1]] !== "*") {
    forwardPath.push(endCoords);
    
    // we came here from NORTH, to backtrack, so SOUTH
    if (backtrack[endCoords[0]][endCoords[1]] === "n") {
      endCoords = [endCoords[0] + 1, endCoords[1]];
    }

    else if (backtrack[endCoords[0]][endCoords[1]] === "e") {
      endCoords = [endCoords[0], endCoords[1] - 1];
    }

    else if (backtrack[endCoords[0]][endCoords[1]] === "s") {
      endCoords = [endCoords[0] - 1, endCoords[1]];
    }

    else if (backtrack[endCoords[0]][endCoords[1]] === "w") {
      endCoords = [endCoords[0], endCoords[1] + 1];
    }
  }
  forwardPath.push(endCoords);

  for (var x = forwardPath.length - 1; x >= 0; --x) {
    if (firstTime) {
      await sleep(20);
      document.getElementById(''+String(forwardPath[x][0])+'-'+String(forwardPath[x][1])).classList.add('path-animation');
    }
    else {
      document.getElementById(''+String(forwardPath[x][0])+'-'+String(forwardPath[x][1])).classList.add('path');
    }
  }
  

}

// clear all other buttons
function clearOtherButtons() {
  var buttons = document.getElementsByClassName("algorithms");
  for (var x = 0; x < buttons.length; ++x) {
    buttons[x].classList.remove("selected");
  }
}

// set visualization to depth first search
function setDepthFirst() {
  clearOtherButtons();
  algorithm = "depth-first";
  var buttons = document.getElementsByClassName("depth-first");
  buttons[0].classList.add("selected");
}

function setBreadthFirst() {
  clearOtherButtons();
  algorithm = "breadth-first";
  var buttons = document.getElementsByClassName("breadth-first");
  buttons[0].classList.add("selected");
}

// calls correct algorithm to visualize
function visualize() {
  visualized = true;
  if (algorithm === "depth-first") {
    depth();
    if (document.getElementById(lastEnd).classList.contains("visited")) {
      printPath();
    }
    // element.classList.remove("unclickable");
  }
  else if (algorithm === "breadth-first") {
    breadth();
    if (document.getElementById(lastEnd).classList.contains("visited")) {
      printPath();
    }
    // element.classList.remove("unclickable");
  }
  else {
    visualized = false;
    alert("Choose an algorithm on the left!");
  }
}

// sleep function allowing users to see search 
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// creating random maze
async function randomMaze(value) {
  clearBoard();
  for (var i = 0; i < 30; ++i) {
    for (var j = 0; j < 55; ++j) {
      var idValue = "" + String(i) + "-" + String(j);
      var random = document.getElementById(idValue);
      if (Math.floor(Math.random() * value) === 1) {
        if (!(idValue === lastStart || idValue === lastEnd)) {
          random.classList.add("wall");
          random.classList.add("none");
          await sleep(15);
        }
      }
    }
  }
}

function clearFirstTime() {
  firstTime = true;
}

function resetSpeed() {
  document.getElementById('button-fast').classList.remove('select-speed');
  document.getElementById('button-normal').classList.remove('select-speed');
  document.getElementById('button-slow').classList.remove('select-speed');
}

function setFast() {
  resetSpeed();
  document.getElementById('button-fast').classList.add('select-speed');
  speed = 5;
}

function setNormal() {
  resetSpeed();
  document.getElementById('button-normal').classList.add('select-speed');
  speed = 35;
}

function setSlow() {
  resetSpeed();
  document.getElementById('button-slow').classList.add('select-speed');
  speed = 85;
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

// setting which algorithm, and put backtracking
let algorithm = "";
let visualized = false;
let backtrack = [];
let array = [];
let firstTime = true;

// speed
let speed = 5;

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

function RandomSparse(props) {
  return(
    <button onClick={props.onClick} className="random-maze pt-1 pb-1 pl-2 pr-2 mr-5 mb-2 mazes"> Sparse Random Maze </button>
  );
}

function RandomDense(props) {
  return(
    <button onClick={props.onClick} className="random-maze pt-1 pb-1 pl-2 pr-2 mr-5 mb-2 mazes"> Dense Random Maze </button>
  );
}

function Visualize(props) {
  return(
    <button onClick={props.onClick} onMouseDown={props.onMouseDown} className="btn btn-success bold"> Visualize! </button>
  );
}

function DepthFirst(props) {
  return(
    <button onClick={props.onClick} className="search depth-first pt-1 pb-1 pl-2 pr-2 mr-5 mb-2 algorithms"> Depth First Search </button>
  );
}

function BreadthFirst(props) {
  return(
    <button onClick={props.onClick} className="search breadth-first pt-1 pb-1 pl-2 pr-2 mr-5 mb-2 algorithms"> Breadth First Search </button>
  );
}

function ClearBoard(props) {
  return(
    <button className="btn btn-danger bold" onClick={props.onClick}> Clear Board </button>
  )
}

function Fast(props) {
  return(
    <button id="button-fast" className="speed bold pt-1 pb-1 pl-3 pr-3 mb-2 select-speed" onClick={props.onClick}> Fast </button>
  )
}

function Normal(props) {
  return(
    <button id="button-normal" className="speed bold pt-1 pb-1 pl-2 pr-2 mb-2 " onClick={props.onClick}> Normal </button>
  )
}

function Slow(props) {
  return(
    <button id="button-slow" className="speed bold pt-1 pb-1 pl-3 pr-3 mb-2 " onClick={props.onClick}> Slow </button>
  )
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
  <RandomSparse 
    onClick={() => randomMaze(12)}
  />,
  document.getElementById('sparse-maze-generation')
);

ReactDOM.render(
  <RandomDense 
    onClick={() => randomMaze(4)}
  />,
  document.getElementById('dense-maze-generation')
);

ReactDOM.render(
  <Visualize
    onClick={() => visualize()}
    onMouseDown={() => clearFirstTime()}
  />,
  document.getElementById('visualize')
)

ReactDOM.render(
  <DepthFirst
    onClick={() => setDepthFirst()}
  />,
  document.getElementById('depth-first')
)

ReactDOM.render(
  <BreadthFirst
    onClick={() => setBreadthFirst()}
  />,
  document.getElementById('breadth-first')
)

ReactDOM.render(
  <ClearBoard
    onClick={() => clearBoard()}
  />,
  document.getElementById('clearBoard')
)

ReactDOM.render(
  <Fast
    onClick={() => setFast()}
  />,
  document.getElementById('fast')
)

ReactDOM.render(
  <Normal
    onClick={() => setNormal()}
  />,
  document.getElementById('normal')
)

ReactDOM.render(
  <Slow
    onClick={() => setSlow()}
  />,
  document.getElementById('slow')
)