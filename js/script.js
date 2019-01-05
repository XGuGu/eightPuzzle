
document.addEventListener("DOMContentLoaded", game);

function game() {
  var parentX = document.querySelector(".sliding-puzzle").clientHeight;
  var baseDistance = 34.5;
  var tileMap = {
    1: {
      tileNumber: 1,
      position: 1,
      top: 0,
      left: 0
    },
    2: {
      tileNumber: 2,
      position: 2,
      top: 0,
      left: baseDistance * 1
    },
    3: {
      tileNumber: 3,
      position: 3,
      top: 0,
      left: baseDistance * 2
    },
    4: {
      tileNumber: 4,
      position: 4,
      top: baseDistance,
      left: 0
    },
    5: {
      tileNumber: 5,
      position: 5,
      top: baseDistance,
      left: baseDistance
    },
    6: {
      tileNumber: 6,
      position: 6,
      top: baseDistance,
      left: baseDistance * 2
    },
    7: {
      tileNumber: 7,
      position: 7,
      top: baseDistance * 2,
      left: 0
    },
    8: {
      tileNumber: 8,
      position: 8,
      top: baseDistance * 2,
      left: baseDistance
    },
    empty: {
      position: 9,
      top: baseDistance * 2,
      left: baseDistance * 2
    }
  }

  var history = [];

  function movementMap(position) {
    if (position == 9) return [6, 8];
    if (position == 8) return [5, 7, 9];
    if (position == 7) return [4, 8];
    if (position == 6) return [3, 5, 9];
    if (position == 5) return [2, 4, 6, 8];
    if (position == 4) return [1, 5, 7];
    if (position == 3) return [2, 6];
    if (position == 2) return [1, 3, 5];
    if (position == 1) return [2, 4];
  }

  document.querySelector('#shuffle').addEventListener('click', shuffle , true);
  document.querySelector('#solve').addEventListener('click', solve , true);
  var tiles = document.querySelectorAll('.tile');
  var delay = -50;
  for(var i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', tileClicked ,true );

    var tileId = tiles[i].innerHTML;
    delay += 50;
    setTimeout(setup, delay, tiles[i]);
  }

  function setup(tile) {
    var tileId = tile.innerHTML;
    var xMovement = parentX * (tileMap[tileId].left/100);
    var yMovement = parentX * (tileMap[tileId].top/100);
    var translateString = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)"
    tile.style.webkitTransform = translateString;
    recolorTile(tile, tileId);
  }

  function tileClicked(event) {
    var tileNumber = event.target.innerHTML;
    moveTile(event.target);

    if (checkSolution()) {
      console.log("You win!");
    }
  }

  function moveTile(tile, recordHistory = true) {
    var tileNumber = tile.innerHTML;
    if (!tileMovable(tileNumber)) {
      console.log("Tile " + tileNumber + " can't be moved.");
      return;
    }

    if (recordHistory == true) {

      if (history.length >= 3) {
        if (history[history.length-1] != history[history.length-3]) history.push(tileNumber);
      } else {
        history.push(tileNumber);
      }
    }

    var emptyTop = tileMap.empty.top;
    var emptyLeft = tileMap.empty.left;
    var emptyPosition = tileMap.empty.position;
    tileMap.empty.top = tileMap[tileNumber].top;
    tileMap.empty.left = tileMap[tileNumber].left;
    tileMap.empty.position = tileMap[tileNumber].position;

    var xMovement = parentX * (emptyLeft/100);
    var yMovement = parentX * (emptyTop/100);
    var translateString = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)"
    tile.style.webkitTransform = translateString;

    tileMap[tileNumber].top = emptyTop;
    tileMap[tileNumber].left = emptyLeft;
    tileMap[tileNumber].position = emptyPosition;

    recolorTile(tile, tileNumber);
  }


  function tileMovable(tileNumber) {
    var selectedTile = tileMap[tileNumber];
    var emptyTile = tileMap.empty;
    var movableTiles = movementMap(emptyTile.position);

    if (movableTiles.includes(selectedTile.position)) {
      return true;
    } else {
      return false;
    }



  }

  function getBlankPosition() {
    for (var i = 0; i < this.dimension; i++) {
      for (var j = 0; j < this.dimension; j++) {
        if (this.board[i][j] === 0) {
          return [i, j];
        }
      }
    }
  }

  function swap(i1, j1, i2, j2) {
    let temp = this.board[i1][j1];
    this.board[i1][j1] = this.board[i2][j2];
    this.board[i2][j2] = temp;
  }

  function getMove(grid) {
    let blankGrid = this.getBlankPosition();
    let row = blankGrid[0];
    let column = blankGrid[1];
    if (row > 0 && this.board[row - 1][column] == grid) {
      return "down";
    } else if (row < this.dimension - 1 && this.board[row + 1][column] == grid) {
      return "up";
    } else if (column > 0 && this.board[row][column - 1] == grid) {
      return "right";
    } else if (column < this.dimension - 1 && this.board[row][column + 1] == grid) {
      return "left";
    }
  }

  // function move(grid) {
  //   let move = this.getMove(grid);
  //   if (move != null) {
  //     var blankGrid = this.getBlankPosition();
  //     var row = blankGrid[0];
  //     var column = blankGrid[1];
  //     switch (move) {
  //       case "down":
  //         this.swap(row, column, row - 1, column);
  //         break;
  //       case "up":
  //         this.swap(row, column, row + 1, column);
  //         break;
  //       case "right":
  //         this.swap(row, column, row, column - 1);
  //         break;
  //       case "left":
  //         this.swap(row, column, row, column + 1);
  //         break;
  //     }
  //     if (move != null) {
  //         this.lastMove = grid;
  //     }
  //     return move;
  //   }
  // }

  function getCopy() {
    let newPuzzle = new Puzzle(this.dimension)
    for (var i = 0; i < this.dimension; i++) {
      for (var j = 0; j < this.dimension; j++) {
        newPuzzle.board[i][j] = this.board[i][j];
      }
    }
    for (var i = 0; i < this.path.length; i++) {
      newPuzzle.path.push(this.path[i]);
    }
    return newPuzzle;
  }

  function getAllowedMoves() {
    let allow = [];
    for (var i = 0; i < this.dimension; i++) {
      for (var j =0; j < this.dimension; j++) {
        let grid = this.board[i][j];
        if (this.getMove(grid) != null) {
          allow.push(grid);
        }
      }
    }
    return allow;
  }

  function visit() {
    let children = [];
    let allowed = this.getAllowedMoves();
    for (var i = 0; i < allowed.length; i++) {
      let move = allowed[i];
      if (move != this.lastMove) {
        let newPuzzle = this.getCopy();
        newPuzzle.move(move);
        newPuzzle.path.push(move);
        children.push(newPuzzle);
      }
    }
    return children;
  }

  function bfs() {
    // debugger
    // console.log("bfs");
    let initState = this.getCopy();
    initState.path = [];
    let states = [initState];
    while (states.length > 0) {
      let state = states[0];
      states.shift();
      if (state.isDone()) {
        return state.path;
      }
      states = states.concat(state.visit());
    }
  }

  function checkSolution() {
    if (tileMap.empty.position !== 9) return false;

    for (var key in tileMap) {
      if ((key != 1) && (key != "empty")) {
        if (tileMap[key].position < tileMap[key-1].position) return false;
      }
    }

    history = [];
    return true;
  }

  function recolorTile(tile, tileId) {
    if (tileId == tileMap[tileId].position) {
      tile.classList.remove("error");
    } else {
      tile.classList.add("error");
    }
  }


  shuffleTimeouts = [];
  function shuffle() {
    clearTimers(solveTimeouts);
    var boardTiles = document.querySelectorAll('.tile');
    var shuffleDelay = 200;
    shuffleLoop();

    var shuffleCounter = 0;
    while (shuffleCounter < 20) {
      shuffleDelay += 200;
      shuffleTimeouts.push(setTimeout(shuffleLoop, shuffleDelay));
      shuffleCounter++;
    }
  }

  var lastShuffled;

  function shuffleLoop() {
    var emptyPosition = tileMap.empty.position;
    var shuffleTiles = movementMap(emptyPosition);
    var tilePosition = shuffleTiles[Math.floor(Math.floor(Math.random()*shuffleTiles.length))];
    var locatedTile;
    for(var i = 1; i <= 8; i++) {
      if (tileMap[i].position == tilePosition) {
        var locatedTileNumber = tileMap[i].tileNumber;
        locatedTile = tiles[locatedTileNumber-1];
      }
    }
    if (lastShuffled != locatedTileNumber) {
      moveTile(locatedTile);
      lastShuffled = locatedTileNumber;
    } else {
      shuffleLoop();
    }

  }


  function clearTimers(timeoutArray) {
    for (var i = 0; i < timeoutArray.length; i++) {
      clearTimeout(timeoutArray[i])
    }
  }


  solveTimeouts = []
  function solve() {
    clearTimers(shuffleTimeouts);


    repeater = history.length;

    for (var i = 0; i < repeater; i++) {
      console.log("started");
      solveTimeouts.push(setTimeout(moveTile, i*100, tiles[history.pop()-1], false));
    }
  }

}
