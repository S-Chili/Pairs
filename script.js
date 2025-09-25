const gameBoard = document.getElementById("game-board");
const levelElement = document.getElementById("level");
const attemptsElement = document.getElementById("attempts");

const cardSymbols = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
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
  const cardsToUse = cardSymbols.slice(0, pairsCount);
  const gameCards = [...cardsToUse, ...cardsToUse];

  shuffleCards(gameCards);

  gameBoard.innerHTML = "";
  gameCards.forEach((symbol) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.innerHTML = `
            <div class="front-face"></div>
            <div class="back-face">${symbol}</div>
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

  const firstSymbol = firstCard.querySelector(".back-face").innerHTML;
  const secondSymbol = secondCard.querySelector(".back-face").innerHTML;

  if (firstSymbol === secondSymbol) {
    disableCards();
    foundPairs++;
    if (foundPairs === currentLevel * 4) {
      setTimeout(() => {
        alert("Вітаємо! Ви знайшли всі пари!");
        currentLevel++;
        startGame();
      }, 1000);
    }
  } else {
    attempts++;
    unflipCards();
  }
  if (attempts >= maxAttempts) {
    setTimeout(() => {
      alert("На жаль, ваші спроби закінчилися. Спробуйте ще раз!");
      startGame();
    }, 1000);
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
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

startGame();
