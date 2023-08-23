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
  const {setWinnerBox, changeFinishGameUI} = screenControler();

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

  function checkWinner(player, board) {
    
    // Check row
    for(let row = 0; row < 3;row++) {
      if(board[row][0] === player.token &&  board[row][1]  === player.token &&  board[row][2] === player.token) {

        setWinnerBox(row, null, null, player.tokenName);
        changeFinishGameUI(player);
        
      }
    }


    // Check column
    for(let column = 0; column< 3;column++) {
      if(board[0][column] === player.token && board[1][column] === player.token && board[2][column] === player.token) {

        setWinnerBox(null, column, null, player.tokenName);
        changeFinishGameUI(player);
      }
    }


    // Check diagonal right
    if(board[0][0] === player.token && board[1][1] === player.token && board[2][2] === player.token) {

      setWinnerBox(null, null, 'right', player.tokenName);
      changeFinishGameUI(player);
    
    }
    


    // Check diagonal left
    if(board[0][2] === player.token && board[1][1] === player.token && board[2][0] === player.token) {

      setWinnerBox(null, null, 'left', player.tokenName);
      changeFinishGameUI(player);
    }


    return;


  }

  const playRound = (row, column, clickedCell) => {
    

    if(!board.placeToken(row, column, getActivePlayer())) return


    checkWinner(players[0], board.getBoard())
    checkWinner(players[1], board.getBoard())

    renderUI(clickedCell);

    printNewRound();
    switchActivePlayer();
   
    minLenght--;
    console.log(minLenght)
    if(minLenght === 0) changeFinishGameUI();

  }


  return {setPlayersTokenName, getActivePlayer, playRound};
}














function screenControler() {

  const modalContent = document.querySelector('.modal-content');

  const player1Score = document.querySelector('.player-1-score__result');
  const ties = document.querySelector('.ties__result');
  const player2Score = document.querySelector('.player-2-score__result');


  // refacro code
  function setWinnerBox(row, column, diagonal, tokenName) {
    console.log({row, column, diagonal, tokenName})
    console.log(typeof column)
    if(tokenName === 'x') {
      if(row >=0) {
        switch(row) {
          case 0: document.querySelectorAll('.box[data-row="0"]').forEach((box) => box.classList.add('x-winner'));
            break;
          case 1: document.querySelectorAll('.box[data-row="1"]').forEach((box) => box.classList.add('x-winner'));
            break;
          case 2: document.querySelectorAll('.box[data-row="2"]').forEach((box) => box.classList.add('x-winner'));
    
        }
      }

      if(column >=0) {
        switch(column) {
          case 0: 
            console.log('ovde')
            console.log(document.querySelectorAll('.box[data-column="0"]'))
            document.querySelectorAll('.box[data-column="0"]').forEach((box) => box.classList.add('x-winner'));
            break;
          case 1: document.querySelectorAll('.box[data-column="1"]').forEach((box) => box.classList.add('x-winner'));
            break;
          case 2: document.querySelectorAll('.box[data-column="2"]').forEach((box) => box.classList.add('x-winner'));
    
        }
      }


      if(diagonal === 'right') {
        document.querySelectorAll('.box[data-column="0"][data-row="0"]').forEach((box) => box.classList.add('x-winner'));
        document.querySelectorAll('.box[data-column="1"][data-row="1"]').forEach((box) => box.classList.add('x-winner'));
        document.querySelectorAll('.box[data-column="2"][data-row="2"]').forEach((box) => box.classList.add('x-winner'));
      }

      if(diagonal === 'left') {
        document.querySelectorAll('.box[data-column="2"][data-row="0"]').forEach((box) => box.classList.add('x-winner'));
        document.querySelectorAll('.box[data-column="1"][data-row="1"]').forEach((box) => box.classList.add('x-winner'));
        document.querySelectorAll('.box[data-column="0"][data-row="2"]').forEach((box) => box.classList.add('x-winner'));
      }
     
    } else if (tokenName === 'o') {
      if(row >= 0) {
        switch(row) {
          case 0: document.querySelectorAll('.box[data-row="0"]').forEach((box) => box.classList.add('o-winner'));
            break;
          case 1: document.querySelectorAll('.box[data-row="1"]').forEach((box) => box.classList.add('o-winner'));
            break;
          case 2: document.querySelectorAll('.box[data-row="2"]').forEach((box) => box.classList.add('o-winner'));
    
        }
      }

      if(column >=0) {
        switch(column) {
          case 0: document.querySelectorAll('.box[data-column="0"]').forEach((box) => box.classList.add('o-winner'));
            break;
          case 1: document.querySelectorAll('.box[data-column="1"]').forEach((box) => box.classList.add('o-winner'));
            break;
          case 2: document.querySelectorAll('.box[data-column="2"]').forEach((box) => box.classList.add('o-winner'));
    
        }
      }


      if(diagonal === 'right') {
        document.querySelectorAll('.box[data-column="0"][data-row="0"]').forEach((box) => box.classList.add('o-winner'));
        document.querySelectorAll('.box[data-column="1"][data-row="1"]').forEach((box) => box.classList.add('o-winner'));
        document.querySelectorAll('.box[data-column="2"][data-row="2"]').forEach((box) => box.classList.add('o-winner'));
      }

      if(diagonal === 'left') {
        document.querySelectorAll('.box[data-column="2"][data-row="0"]').forEach((box) => box.classList.add('o-winner'));
        document.querySelectorAll('.box[data-column="1"][data-row="1"]').forEach((box) => box.classList.add('o-winner'));
        document.querySelectorAll('.box[data-column="0"][data-row="2"]').forEach((box) => box.classList.add('o-winner'));
      }
    }

  }

  function changeFinishGameUI(score = 'tied') {

    if(score.name ==='player1') {
      player1Score.textContent = Number(player1Score.textContent) + 1;
      displayModalContent(score)

    }


    if(score === 'tied') {
      console.log('sdadasdasdas')
      ties.textContent = Number(ties.textContent) + 1;
      displayModalContent();
      
    }

    if(score.name === 'player2') {
      player2Score.textContent = Number(player2Score.textContent) + 1;
      displayModalContent(score);
    }
  }

  // winnerPlayer je objekat
  function displayModalContent(winnerPlayer) {
    modal.style.display = 'block';
    const div = document.createElement('div');
    div.innerHTML = `${winnerPlayer ? '<p class="modal-content__congr">Congratulation!</p>' : ''}
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
    modalContent.prepend(div);
  }

  

  

  return {setWinnerBox, changeFinishGameUI}
}