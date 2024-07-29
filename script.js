const cardsArray = [
    { name: 'girl', img: 'image/girl.png' },
    { name: 'Dona-duck', img: 'image/Donal-duck.png' },
    { name: 'minimouse', img: 'image/minimouse.png' },
    { name: 'agnes', img: 'image/agnes.png' },
    { name: 'oggy', img: 'image/oggy.png' },
    { name: 'olaf', img: 'image/olaf.png' },
    { name: 'pooh', img: 'image/pooh.png' },
    { name: 'goofy', img: 'image/goofy.png' },
    { name: 'girl', img: 'image/girl.png' },
    { name: 'Dona-duck', img: 'image/Donal-duck.png' },
    { name: 'minimouse', img: 'image/minimouse.png' },
    { name: 'agnes', img: 'image/agnes.png' },
    { name: 'oggy', img: 'image/oggy.png' },
    { name: 'olaf', img: 'image/olaf.png' },
    { name: 'pooh', img: 'image/pooh.png' },
    { name: 'goofy', img: 'image/goofy.png' }
];

let firstCard, secondCard;
let lockBoard = false;
let hasFlippedCard = false;
let matches = 0;
let flips = 0;

const gameContainer = document.getElementById('game-container');
const flipCountElement = document.getElementById('flip-count');
const restartButton = document.getElementById('restart-button');

// Load audio files
const flipSound = new Audio('image/flip.mp3');
const matchSound = new Audio('image/match.mp3');
const winSound = new Audio('image/win.mp3');

restartButton.addEventListener('click', restartGame);

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    const shuffledCards = shuffle(cardsArray);
    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');

        const cardImage = document.createElement('img');
        cardImage.src = card.img;
        cardBack.appendChild(cardImage);

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);

        cardElement.addEventListener('click', flipCard);
        gameContainer.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    // Reset flipSound to play from the start
    flipSound.currentTime = 0;
    flipSound.play(); // Play flip sound

    this.classList.add('flipped');
    flips++;
    flipCountElement.textContent = flips;

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    // Reset matchSound to play from the start
    matchSound.currentTime = 0;
    matchSound.play(); // Play match sound

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
    matches++;
    if (matches === cardsArray.length / 2) {
        setTimeout(() => {
            onGameWin(); // Call onGameWin when all matches are found
        }, 500);
    }
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function onGameWin() {
    winSound.play(); // Play win sound
    showFireworks();
}

function restartGame() {
    gameContainer.innerHTML = '';
    matches = 0;
    flips = 0;
    flipCountElement.textContent = flips;
    createBoard();
}

function showFireworks() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    const particles = [];
    const particleCount = 300;
    const colors = ['#ff0000', '#ff9900', '#ffff00', '#33cc33', '#0066ff', '#6600cc'];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 5 + 2,
            angle: Math.random() * 2 * Math.PI,
            alpha: 1,
            decay: Math.random() * 0.01 + 0.005
        });
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle, index) => {
            particle.x += particle.speed * Math.cos(particle.angle);
            particle.y += particle.speed * Math.sin(particle.angle);
            particle.alpha -= particle.decay;

            if (particle.alpha <= 0) {
                particles.splice(index, 1);
            }

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = `rgba(${hexToRgb(particle.color)}, ${particle.alpha})`;
            ctx.fill();
        });

        if (particles.length > 0) {
            requestAnimationFrame(render);
        } else {
            canvas.style.display = 'none';
        }
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r}, ${g}, ${b}`;
    }

    render();
}

createBoard();