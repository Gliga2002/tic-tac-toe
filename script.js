const gameControl = GameController();
const board = Gameboard();

// Game logic

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(0);
    }
  }

  const restartBoard = ()=> {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(0);
      }
    }
  }

  const getBoard = () => board;

  const placeToken = (row,column,player) => {
    if(board[row][column]) return
    board[row][column] = player.token;
    return true;
  }
  
  return {getBoard, placeToken, restartBoard};
}




function GameController(playerOneName = 'player1', playerTwoName = 'player2') {
  const {setWinnerBoxes, changeFinishGameUI, updateScreen} = screenControler();

  const players = [
    {
      name: playerOneName,
      token: 1,
      // by default player one can select x
      tokenName: 'x'
    },
    {
      name: playerTwoName,
      token: 2,
      tokenName: 'o'
    }
  ]

  let minLenght = 9;

  let activePlayer = players[0];

  const setPlayersTokenName = (tokenName) => {
    players[0].tokenName = tokenName;
    players[1].tokenName = players[0].tokenName === "x" ? "o" : "x";

    activePlayer = players[0].tokenName === 'x' ? players[0] : players[1];


  }

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]
  }
  // ovo cu da export
  const getActivePlayer = () =>  activePlayer;
  
  const printNewRound = () => {
    board.getBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  function checkWinner(player, board) {
    // Check row
    for(let row = 0; row < 3;row++) {
      if(board[row][0] === player.token &&  board[row][1]  === player.token &&  board[row][2] === player.token) {

        setWinnerBoxes(row, null, null, player.tokenName);
        changeFinishGameUI(player);
        
      }
    }
    // Check column
    for(let column = 0; column< 3;column++) {
      if(board[0][column] === player.token && board[1][column] === player.token && board[2][column] === player.token) {

        setWinnerBoxes(null, column, null, player.tokenName);
        changeFinishGameUI(player);
      }
    }
    // Check diagonal right
    if(board[0][0] === player.token && board[1][1] === player.token && board[2][2] === player.token) {

      setWinnerBoxes(null, null, 'right', player.tokenName);
      changeFinishGameUI(player);
    
    }
    // Check diagonal left
    if(board[0][2] === player.token && board[1][1] === player.token && board[2][0] === player.token) {

      setWinnerBoxes(null, null, 'left', player.tokenName);
      changeFinishGameUI(player);
    }

    return;
  }

  const playRound = (row, column, clickedCell) => {
    if(!board.placeToken(row, column, getActivePlayer())) return

    checkWinner(players[0], board.getBoard())
    checkWinner(players[1], board.getBoard())

    updateScreen(clickedCell);

    printNewRound();
    switchActivePlayer();
   
    minLenght--;

    if(minLenght === 0) changeFinishGameUI();
  }

  const resetGame = function() {
    board.restartBoard();
    minLenght = 9;
  }


  return {setPlayersTokenName, getActivePlayer, playRound, resetGame};
}



function screenControler() {
  const introSection = document.querySelector('.intro');
  const selectXEl = document.querySelector('.choice--x');
  const selectOEl = document.querySelector('.choice--o');
  const startGameEl = document.querySelector('.btn--intro');


  const mainSection = document.querySelector('.main');
  const mainContent = document.querySelector('.main-content');
  const mainShowTurnEl = document.querySelector('.main-show-turn')
  
  const modal = document.getElementById("myModal");
  const modalContent = document.querySelector('.modal-content');
  const btnQuit = document.querySelector('.btn--quit');
  const btnNextRount = document.querySelector('.btn--next-round');
  const restartEl = document.querySelector('.main-restart');

  const playerXScore = document.querySelector('.player-x-score__result');
  const ties = document.querySelector('.ties__result');
  const playerOScore = document.querySelector('.player-o-score__result');

  const boxAll = document.querySelectorAll('.box');

  
  mainContent.addEventListener('click', function(e) {
    let clickedCell = e.target.closest('.box');
    if(!clickedCell) return;
  
    const clickedCellRow = clickedCell.dataset.row;
    const clickedCellColumn = clickedCell.dataset.column;
  
    gameControl.playRound(clickedCellRow, clickedCellColumn, clickedCell);
  })
  
  mainContent.addEventListener('mouseover', function(e) {
    const unclikedCell = e.target.closest('.unclicked')
    if(!unclikedCell) return

    const activePlayer = gameControl.getActivePlayer().tokenName;

    if(activePlayer === 'x') addClasses(unclikedCell,'x-hovered','hovered');
    if(activePlayer === 'o') addClasses(unclikedCell,'o-hovered','hovered');
  })
  
  mainContent.addEventListener('mouseout', function(e) {
    const hoveredCell = e.target.closest('.hovered')
    if(!hoveredCell) return
    removeClasses(hoveredCell,'hovered','x-hovered','o-hovered')
  })

  selectXEl.addEventListener('click', function(e) {
    // Igrac 1 je izabrao x
    toggleSignSelect.call(this, selectOEl);
    
    gameControl.setPlayersTokenName('x');
  })
  
  selectOEl.addEventListener('click', function(e)  {
    // Igrac 1 je izabrao o
    toggleSignSelect.call(this, selectXEl);
  
    gameControl.setPlayersTokenName('o');
    
  })
  
  startGameEl.addEventListener('click',(e) => {


    startGame();
  })

  
  btnQuit.addEventListener('click' , (e) => {
    modal.style.display= "none";
    playAgain();
    resetResultDisplay();
    endGame();
  })

  btnNextRount.addEventListener('click' , (e) => {
    modal.style.display= "none";
    playAgain();
  })

  restartEl.addEventListener('click',(e) => {
    playAgain();
  })


  const updateScreen = function (clickedCell) {
    clickedCell.classList.remove('unclicked','x-hovered','o-hovered');
    const activePlayer = gameControl.getActivePlayer();

    const showTurnImgEl = mainShowTurnEl.firstElementChild
    
    if(activePlayer.tokenName === 'x') {
      // ovo mi je sus
      setImgTurn(showTurnImgEl, './assets/icon-o-gray.svg');

      addClasses(clickedCell,'clicked', 'x-clicked');
    }
    if(activePlayer.tokenName === 'o') {
      setImgTurn(showTurnImgEl, './assets/icon-x-gray.svg');

      addClasses(clickedCell,'clicked', 'o-clicked');
    }
  
  }

  


  const changeFinishGameUI = function(score = 'tied') {
    if(score.tokenName ==='x') {
      // set display result
      playerXScore.textContent = Number(playerXScore.textContent) + 1;
      displayModalContent(score)
    }
    if(score === 'tied') {
      // set display result
      ties.textContent = Number(ties.textContent) + 1;
      displayModalContent();
    }
    if(score.tokenName === 'o') {
      // set display result
      playerOScore.textContent = Number(playerOScore.textContent) + 1;
      displayModalContent(score);
    }
  }

  // refacro code
  const setWinnerBoxes = function (row, column, diagonal, tokenName) {
    const winnerBoxesData = {
      row: row,
      column: column,
      diagonal: diagonal,
      tokenName: tokenName
    }

    checkTokenName(winnerBoxesData, 'x');
    checkTokenName(winnerBoxesData, 'o');
  }

  
  function toggleSignSelect(hideEl) {
    this.classList.add('choiced');
    hideEl.classList.remove('choiced');
  }
  
  function startGame() {
    introSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
  }

  function endGame() {
    introSection.classList.remove('hidden')
    mainSection.classList.add('hidden');
}
  function resetResultDisplay() {
    player1Score.textContent = 0;
    ties.textContent = 0;
    player2Score.textContent = 0;
  }

  function playAgain() {
    modal.firstElementChild.firstElementChild.innerHTML = ''
    
    removeBoxContent();
    gameControl.resetGame();
  }

  function setImgTurn(img, url) {
    img.setAttribute('src', url)
  }

  function removeClasses(el, ...args) {
    args.forEach((arg) => el.classList.remove(arg))
  }

  function addClasses(el, ...args) {
    args.forEach((arg) => el.classList.add(arg))
  }

  function removeBoxContent() {
    boxAll.forEach((box) => {
      removeClasses(box, 'clicked','x-winner','o-winner','x-clicked', 'o-clicked');
      addClasses(box, 'unclicked');
    })
  }

  // winnerPlayer je objekat
  function displayModalContent(winnerPlayer) {
    modal.style.display = 'block';
    modalContent.firstElementChild.innerHTML = 
    `${winnerPlayer ? '<p class="modal-content__congr">Congratulation!</p>' : ''}
                       <h2 class="flex center gap--sm">
                      ${winnerPlayer ? 
                        `<section class="mg-btm--md">
                          <img
                            src=${winnerPlayer.tokenName === 'x' ?  "./assets/icon-x.svg" : "./assets/icon-o.svg"}
                            alt=${winnerPlayer.tokenName === 'x' ? 'x' :'o'}>
                         </section>` : ""}
                        <section class="modal-content__text">${winnerPlayer ? "takes the round" : "It's tie"} </section
                      </h2> 
                   `

  }

  function checkTokenName(boardInfo, xOro) {
    console.log('OVDE');
    if(boardInfo.tokenName === xOro) {
      if(boardInfo.row >=0) {
        switch(boardInfo.row) {
          case 0: document.querySelectorAll('.box[data-row="0"]').forEach((box) => box.classList.add(`${xOro}-winner`));
            break;
          case 1: document.querySelectorAll('.box[data-row="1"]').forEach((box) => box.classList.add(`${xOro}-winner`));
            break;
          case 2: document.querySelectorAll('.box[data-row="2"]').forEach((box) => box.classList.add(`${xOro}-winner`));
    
        }
      }

      if(boardInfo.column >=0) {
        switch(boardInfo.column) {
          case 0: 
            document.querySelectorAll('.box[data-column="0"]').forEach((box) => box.classList.add(`${xOro}-winner`));
            break;
          case 1: document.querySelectorAll('.box[data-column="1"]').forEach((box) => box.classList.add(`${xOro}-winner`));
            break;
          case 2: document.querySelectorAll('.box[data-column="2"]').forEach((box) => box.classList.add(`${xOro}-winner`));
    
        }
      }


      if(boardInfo.diagonal === 'right') {
        document.querySelectorAll('.box[data-column="0"][data-row="0"]').forEach((box) => box.classList.add(`${xOro}-winner`));
        document.querySelectorAll('.box[data-column="1"][data-row="1"]').forEach((box) => box.classList.add(`${xOro}-winner`));
        document.querySelectorAll('.box[data-column="2"][data-row="2"]').forEach((box) => box.classList.add(`${xOro}-winner`));
      }

      if(boardInfo.diagonal === 'left') {
        document.querySelectorAll('.box[data-column="2"][data-row="0"]').forEach((box) => box.classList.add(`${xOro}-winner`));
        document.querySelectorAll('.box[data-column="1"][data-row="1"]').forEach((box) => box.classList.add(`${xOro}-winner`));
        document.querySelectorAll('.box[data-column="0"][data-row="2"]').forEach((box) => box.classList.add(`${xOro}-winner`));
      }

    }
  }


  return {setWinnerBoxes, changeFinishGameUI, updateScreen}
}