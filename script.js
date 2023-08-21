// Get the modal
const modal = document.getElementById("myModal");

const introSection = document.querySelector('.intro');
const mainSection = document.querySelector('.main');

const selectXEl = document.querySelector('.choice--x');
const selectOEl = document.querySelector('.choice--o');
const startGameEl = document.querySelector('.btn--intro');

selectXEl.addEventListener('click', function(e) {
  toggleSignSelect.call(this, selectOEl);
  
})

selectOEl.addEventListener('click', function(e)  {
  toggleSignSelect.call(this, selectXEl);
})

function toggleSignSelect(hideEl) {
  this.classList.add('choiced');
  hideEl.classList.remove('choiced');
}

startGameEl.addEventListener('click',(e) => {
  startGame();
})





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