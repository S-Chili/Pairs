const gameBoard = document.getElementById("game-board");
const levelElement = document.getElementById("level");
const attemptsElement = document.getElementById("attempts");

const cardImages = [
  "images/alien.png",
  "images/astronaut.png",
  "images/astronaut1.png",
  "images/constellation.png",
  "images/moon.png",
  "images/moon1.png",
  "images/planet.png",
  "images/planet1.png",
  "images/planet2.png",
  "images/robot.png",
  "images/rocket.png",
  "images/shooting-star.png",
  "images/star.png",
  "images/sun.png",
  "images/supernova.png",
  "images/ufo.png",
];

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

let currentLevel = 1;
let attempts = 0;
let foundPairs = 0;
let maxAttempts = 5;

function shuffleCards(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard(level) {
  const pairsCount = level * 4;
  const cardsToUse = cardImages.slice(0, pairsCount);
  const gameCards = [...cardsToUse, ...cardsToUse];

  shuffleCards(gameCards);

  gameBoard.innerHTML = "";
  gameCards.forEach((image) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.innerHTML = `
      <div class="front-face"></div>
      <div class="back-face"><img src="${image}" alt="card image" /></div>
    `;
    cardElement.addEventListener("click", flipCard);
    gameBoard.appendChild(cardElement);
  });
}

function updateGameInfo() {
  levelElement.textContent = currentLevel;
  attemptsElement.textContent = `${attempts} / ${maxAttempts}`;
}

function startGame() {
  attempts = 0;
  foundPairs = 0;
  maxAttempts = currentLevel * 2 + 3;
  updateGameInfo();
  createBoard(currentLevel);
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  hasFlippedCard = false;
  checkForMatch();
}

function checkForMatch() {
  updateGameInfo();

  const firstSymbol = firstCard.querySelector(".back-face img").src;
  const secondSymbol = secondCard.querySelector(".back-face img").src;

  if (firstSymbol === secondSymbol) {
    disableCards();
    foundPairs++;
    if (foundPairs === currentLevel * 4) {
      setTimeout(() => {
        alert("🎉 Вітаємо! Ви знайшли всі пари!");
        currentLevel++;
        startGame();
      }, 800);
    }
  } else {
    attempts++;
    unflipCards();
  }

  if (attempts >= maxAttempts) {
    setTimeout(() => {
      alert("😢 На жаль, спроби закінчилися. Спробуйте ще раз!");
      startGame();
    }, 800);
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 800);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

startGame();
