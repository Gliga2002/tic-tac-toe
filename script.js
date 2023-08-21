// Get the modal
const modal = document.getElementById("myModal");

const introSection = document.querySelector('.intro');
const mainSection = document.querySelector('.main');

const startGameEl = document.querySelector('.btn--intro');

startGameEl.addEventListener('click', (e) => {
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