// Get the modal
const modal = document.getElementById("myModal");

const introSection = document.querySelector('.intro');
const mainSection = document.querySelector('.main');
const mainContent = document.querySelector('.main-content');
const mainShowTurnEl = document.querySelector('.main-show-turn')

const selectXEl = document.querySelector('.choice--x');
const selectOEl = document.querySelector('.choice--o');
const startGameEl = document.querySelector('.btn--intro');

const gameControl = GameController();

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
  unclikedCell.classList.add('hovered');
  const activePlayer = gameControl.getActivePlayer().tokenName;
  if(activePlayer === 'x') unclikedCell.classList.add('x-hovered');
  if(activePlayer === 'o') unclikedCell.classList.add('o-hovered');
})

mainContent.addEventListener('mouseout', function(e) {
  const hoveredCell = e.target.closest('.hovered')
  if(!hoveredCell) return
  hoveredCell.classList.remove('hovered','x-hovered','o-hovered');
  // const activePlayer = gameControl.getActivePlayer().tokenName;
  // if(activePlayer === 'x') unclikedCell.classList.add('x-hovered');
  // if(activePlayer === 'o') unclikedCell.classList.add('o-hovered');
})

function toggleSignSelect(hideEl) {
  this.classList.add('choiced');
  hideEl.classList.remove('choiced');
}

function startGame() {
  introSection.classList.add('hidden');
  mainSection.classList.remove('hidden');
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}



function setImgTurn(img, url) {
  img.setAttribute('src', url)
}


 




// Game logic

function Gameboard() {
  console.log(`GAME BOARD EXECTUION COUNT`);
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(0);
    }
  }

  const getBoard = () => {
    // console.log(board);
    return board;
  }

  const placeToken = (row,column,player) => {
    if(board[row][column]) return
    console.log(board);
    board[row][column] = player.token;
    return true;
  }
  
  return {getBoard, placeToken};
}


function GameController(playerOneName = 'player1', playerTwoName = 'player2') {

  const board = Gameboard();

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

    activePlayer = players[0];

    console.log(players);
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

  function renderUI(clickedCell) {
    clickedCell.classList.remove('unclicked','x-hovered','o-hovered');
    const activePlayer = gameControl.getActivePlayer();
  
    const showTurnImgEl = mainShowTurnEl.firstElementChild
    
    if(activePlayer.tokenName === 'x') {
      setImgTurn(showTurnImgEl, './assets/icon-o-gray.svg');
      clickedCell.classList.remove('hovered','x-hovered');
      clickedCell.classList.add('clicked', 'x-clicked')
    }
    if(activePlayer.tokenName === 'o') {
      setImgTurn(showTurnImgEl, './assets/icon-x-gray.svg');
      clickedCell.classList.remove('hovered','o-hovered')
      clickedCell.classList.add('clicked', 'o-clicked')
    }
  
  }

  function checkWinner(playerToken, board) {
    
    // Check row
    for(let row = 0; row < 3;row++) {
      if(board[row][0] === playerToken &&  board[row][1]  === playerToken &&  board[row][2] === playerToken) {
        console.log(`Player ${playerToken} win!`);
      }
    }


    // Check column
    for(let column = 0; column< 3;column++) {
      if(board[0][column] === playerToken && board[1][column] === playerToken && board[2][column] === playerToken) {
        console.log(`Player ${playerToken} win!`);
      }
    }


    // Check diagonal
    if(board[0][0] === playerToken && board[1][1] === playerToken && board[2][2] === playerToken) console.log(`Player ${playerToken} win!`);

    if(board[0][2] === playerToken && board[1][1] === playerToken && board[2][0] === playerToken) console.log(`Player ${playerToken} win!`);

    return;


  }

  const playRound = (row, column, clickedCell) => {
    

    if(!board.placeToken(row, column, getActivePlayer())) return


    checkWinner(players[0].token, board.getBoard())
    checkWinner(players[1].token, board.getBoard())

    renderUI(clickedCell);

    printNewRound();
    switchActivePlayer();
    console.log(minLenght);
    minLenght--;
    if(minLenght === 0) console.log("It's tie")

  }






  return {setPlayersTokenName, getActivePlayer, playRound,};
}