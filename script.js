const gameContainer = document.getElementById('gameContainer');
const player = document.getElementById('player');
const item = document.getElementById('item');
const scoreDisplay = document.getElementById('score');

let playerPosition = { top: 225, left: 225 };
let itemPosition = { top: getRandomPosition(), left: getRandomPosition() };
let score = 0;
let rageMode = false;

function getRandomPosition() {
    return Math.floor(Math.random() * 470);
}

function updatePositions() {
    player.style.top = `${playerPosition.top}px`;
    player.style.left = `${playerPosition.left}px`;
    item.style.top = `${itemPosition.top}px`;
    item.style.left = `${itemPosition.left}px`;
}

function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    return !(
        playerRect.top > itemRect.bottom ||
        playerRect.bottom < itemRect.top ||
        playerRect.left > itemRect.right ||
        playerRect.right < itemRect.left
    );
}

function movePlayer(event) {
    const previousPosition = { ...playerPosition };

    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            playerPosition.top = Math.max(0, playerPosition.top - 60); // Increase speed to 60 pixels
            break;
        case 'ArrowDown':
        case 's':
            playerPosition.top = Math.min(450, playerPosition.top + 60); // Increase speed to 60 pixels
            break;
        case 'ArrowLeft':
        case 'a':
            playerPosition.left = Math.max(0, playerPosition.left - 60); // Increase speed to 60 pixels
            break;
        case 'ArrowRight':
        case 'd':
            playerPosition.left = Math.min(450, playerPosition.left + 60); // Increase speed to 60 pixels
            break;
    }

    updatePositions();
    showMoveFeedback(previousPosition);

    if (checkCollision()) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        itemPosition.top = getRandomPosition();
        itemPosition.left = getRandomPosition();
        updatePositions();
        showCollectFeedback();
    }
}


function showCollectFeedback() {
    const feedback = document.createElement('div');
    feedback.id = 'collectFeedback';
    feedback.style.top = `${itemPosition.top}px`;
    feedback.style.left = `${itemPosition.left}px`;
    gameContainer.appendChild(feedback);
    
    feedback.addEventListener('animationend', () => {
        feedback.remove();
    });
    feedback.style.animation = 'collectFeedback 0.5s forwards';
}

function showMoveFeedback(previousPosition) {
    const feedback = document.createElement('div');
    feedback.className = 'moveFeedback';
    feedback.style.top = `${previousPosition.top}px`;
    feedback.style.left = `${previousPosition.left}px`;
    gameContainer.appendChild(feedback);
    
    feedback.addEventListener('animationend', () => {
        feedback.remove();
    });
}

function activateRageMode() {
    if (!rageMode) {
        rageMode = true;
        const rageOverlay = document.createElement('div');
        rageOverlay.id = 'rageMode';
        document.body.appendChild(rageOverlay);

        document.body.classList.add('rage');
        document.body.classList.add('shake');
        document.body.classList.add('zoom');
        
        setTimeout(() => {
            rageOverlay.remove();
            rageMode = false;
            document.body.classList.remove('rage');
            document.body.classList.remove('shake');
            document.body.classList.remove('zoom');
        }, 3000);
    }
}


document.addEventListener('keydown', (event) => {
    if (event.key === 'r') {
        activateRageMode();
    } else {
        movePlayer(event);
    }
});

updatePositions();


let botPosition = { top: getRandomPosition(), left: getRandomPosition() };
let botScore = 100;

function moveBot() {
    const itemCenterX = itemPosition.left + 15; // Calculate the center of the item horizontally
    const itemCenterY = itemPosition.top + 15; // Calculate the center of the item vertically

    const botCenterX = botPosition.left + 30; // Calculate the center of the bot horizontally
    const botCenterY = botPosition.top + 30; // Calculate the center of the bot vertically

    // Calculate the distance between the bot and the item
    const dx = itemCenterX - botCenterX;
    const dy = itemCenterY - botCenterY;

    // Determine the direction of movement
    let directionX = dx > 0 ? 1 : -1;
    let directionY = dy > 0 ? 1 : -1;

    // Move the bot towards the item based on the distance
    if (Math.abs(dx) > Math.abs(dy)) {
        // Move horizontally
        botPosition.left += directionX * 30; // Move 30px at a time
    } else {
        // Move vertically
        botPosition.top += directionY * 30; // Move 30px at a time
    }

    // Update the bot's position
    updateBotPosition();

    // Check if the bot has collected the item
    const botRect = { top: botPosition.top, bottom: botPosition.top + 60, left: botPosition.left, right: botPosition.left + 60 };
    const itemRect = { top: itemPosition.top, bottom: itemPosition.top + 30, left: itemPosition.left, right: itemPosition.left + 30 };

    if (botRect.top < itemRect.bottom && botRect.bottom > itemRect.top && botRect.left < itemRect.right && botRect.right > itemRect.left) {
        botScore++;
        updateBotScore();
        // Do not update item position here
    }
}

function respawnItem() {
    itemPosition.top = getRandomPosition();
    itemPosition.left = getRandomPosition();
    updateItemPosition();
}



function updateItemPosition() {
    item.style.top = `${itemPosition.top}px`;
    item.style.left = `${itemPosition.left}px`;
}



function updateBotPosition() {
    const botElement = document.getElementById('botPlayer');
    botElement.style.top = `${botPosition.top}px`;
    botElement.style.left = `${botPosition.left}px`;
}

function updateBotScore() {
    const botScoreDisplay = document.getElementById('botScore');
    botScoreDisplay.textContent = `Bot Score: ${botScore}`;
}

setInterval(() => {
    moveBot();
}, 1000);

