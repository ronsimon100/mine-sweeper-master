"use strict";

function onInit() {
  resetTimer();

  gBoard = buildBoard(gLevel.SIZE);
  renderBoard(gBoard);
  handleRightClick();

  gGame = {
    isOn: false,
    isHint: false,
    markedCount: 0,
    mainesCount: gLevel.MINES,
    lives: 3,
  };

  renderMinesRemain();
  updatedLives();
}

function resetTimer() {
  clearInterval(gTimer);
  gTimer = null;
  (timeBegan = null),
    (timeStopped = null),
    (stoppedDuration = 0),
    (gTimer = null);
  var elTimer = document.querySelector(".timer");
  elTimer.innerHTML = `<P>00</P>`;
}

function buildBoard(size) {
  const board = [];

  for (var i = 0; i < size; i++) {
    board.push([]);

    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }
  return board;
}

function addMines(minesNum, board) {
  for (var i = 0; i < minesNum; i++) {
    var emptyPos = emptyCell(board);

    board[emptyPos.i][emptyPos.j].isMine = true;
  }
  return board;
}

function setMinesNegsCount(board) {
  var minesNegsCount;

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      var currCell = board[i][j];
      minesNegsCount = countNegs(i, j, board);
      currCell.minesAroundCount = minesNegsCount;
    }
  }

  return board;
}

function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board.length; j++) {
      const className = `cell cell-${i}-${j}`;

      strHTML += `<td class="${className}" oncontextmenu="onCellMarked(${i}, ${j})" onclick="onCellClicked(this, ${i}, ${j})"></td>`;
    }
    strHTML += "</tr>";
  }

  const elContainer = document.querySelector(".board tbody");
  elContainer.innerHTML = strHTML;
  console.log(board);
}

function renderCell(location, value) {
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;

  var currCell = gBoard[location.i][location.j];
  if (currCell.isShown) elCell.classList.add("shown");
  else elCell.classList.remove("shown");
}

function setLevel(elbtn) {
  var minesLeft = document.querySelector(".mines-left");

  if (elbtn.innerText === "Easy") {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    minesLeft.innerText = `002`;
  }
  if (elbtn.innerText === "Medium") {
    gLevel.SIZE = 8;
    gLevel.MINES = 14;
    minesLeft.innerText = `014`;
  }
  if (elbtn.innerText === "Hard") {
    gLevel.SIZE = 12;
    gLevel.MINES = 32;
    minesLeft.innerText = `032`;
  }

  onInit();
}

function renderMinesRemain() {
  var minesRemainShow = document.querySelector(".mines-left");
  var minesRemainCount = gGame.mainesCount - gGame.markedCount;

  if (minesRemainCount < 0) return;
  else minesRemainShow.innerText = `0${minesRemainCount}`;
}

function resetGame(elResetBtn) {
  elResetBtn.innerText = NORMAL;
  onInit();
}

function updatedLives() {
  var elLivesRemain = document.querySelector(".hearts");
  var strHTML = "";

  for (var i = 0; i < gGame.lives; i++) {
    strHTML += LIVE;
  }

  elLivesRemain.innerText = strHTML;
}

function checkGameOver() {
  var elResetBtn = document.querySelector(".reset-btn");
  var elShownCells = document.querySelectorAll(".shown");
  const MAXSHOWNCELLS = elShownCells.length + gGame.markedCount;

  if (gLevel.SIZE ** 2 === MAXSHOWNCELLS && gGame.lives > 0) {
    elResetBtn.innerText = WINNER;
    gGame.isOn = false;
    clearInterval(gTimer);
  }
  if (gGame.lives === 0) {
    elResetBtn.innerText = DEAD;
    gGame.isOn = false;
    clearInterval(gTimer);
  }
}