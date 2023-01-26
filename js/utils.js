"use strict";

const FLAG = "🚩";
const MINE = "💣";
const EMPTY = "";

const NORMAL = "😃";
const DEAD = "🤯";
const WINNER = "😎";

const LIVE = "❤️";


var gBoard = [];

var gLevel = {
  SIZE: 4,
  MINES: 2,
};

var gGame = {};
var gLives = [];
var gPreviousMove = [];

var timeBegan = 0,
  timeStopped = 0,
  stoppedDuration = 0,
  gTimer = null;

var gHintInterval;

function handleRightClick() {
  const cells = document.querySelectorAll(".cell");
  for (var i = 0; i < cells.length; i++) {
    cells[i].addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
  }
}

function countNegs(rowIdx, colIdx, board) {
  var neighborsCount = 0;

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= board[i].length) continue;
      if (board[i][j].isMine) neighborsCount++;
    }
  }
  return neighborsCount;
}

function emptyCell(board) {
  var emptyCells = [];

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (isEmptyCell(i, j, board)) {
        emptyCells.push({ i, j });
      }
    }
  }

  var randIdx = getRandomInt(0, emptyCells.length - 1);

  return emptyCells[randIdx];
}

function isEmptyCell(i, j, board) {
  return board[i][j].isMine === false;
}



function startTimer() {
  if (timeBegan === null) {
    timeBegan = new Date();
  }

  if (timeStopped !== null) {
    stoppedDuration += new Date() - timeStopped;
  }

  gTimer = setInterval(runningTimer, 40);
}

function runningTimer() {
  var currentTime = new Date(),
    timeElapsed = new Date(currentTime - timeBegan - stoppedDuration),
    sec = timeElapsed.getUTCSeconds();
  document.querySelector(".timer").innerText = sec > 9 ? sec : "00" + sec;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}