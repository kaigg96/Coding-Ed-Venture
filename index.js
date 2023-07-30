import Player from "./player.js";
import Ground from "./ground.js";
import ObstacleController from "./ObstacleController.js";
import Score from "./score.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_SPEED_START = 1;
const GAME_SPEED_INCREMENT = 0.00001;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const PLAYER_WIDTH = 88 / 1.5; 
const PLAYER_HEIGHT = 94 / 1.5;
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_AND_OBSTACLE_SPEED = 0.5;

const OBSTACLE_CONFIG = [
    {width: 48 / 1.5, height: 100 / 1.5, image: "images/cactus_1.png"},
    {width: 98 / 1.5, height: 100 / 1.5, image: "images/cactus_2.png"},
];

// Game objects
let player = null;
let ground = null;
let obstacleController = null;
let score = null;

let scaleRatio = null;
let prevTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

function createSprites() {
    const scaledPlayerWidth = PLAYER_WIDTH * scaleRatio;
    const scaledPlayerHeight = PLAYER_HEIGHT * scaleRatio;
    const scaledMinJumpHeight = MIN_JUMP_HEIGHT * scaleRatio;
    const scaledMaxJumpHeight = MAX_JUMP_HEIGHT * scaleRatio;

    const scaledGroundWidth = GROUND_WIDTH * scaleRatio;
    const scaledGroundHeight = GROUND_HEIGHT * scaleRatio;

    player = new Player(
        ctx, 
        scaledPlayerWidth, 
        scaledPlayerHeight, 
        scaledMinJumpHeight, 
        scaledMaxJumpHeight, 
        scaleRatio
    );

    ground = new Ground(
        ctx, 
        scaledGroundWidth, 
        scaledGroundHeight, 
        GROUND_AND_OBSTACLE_SPEED, 
        scaleRatio
    );

    const obstacleImages = OBSTACLE_CONFIG.map(obstacle => {
        const image = new Image();
        image.src = obstacle.image;
        return {
            image:image,
            width: obstacle.width * scaleRatio,
            height: obstacle.height * scaleRatio
        };
    });

    obstacleController = new ObstacleController(ctx, obstacleImages, scaleRatio, GROUND_AND_OBSTACLE_SPEED);

    score = new Score(ctx, scaleRatio);
}

function setScreen() {
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio;
    createSprites();
}

// Apply dynamic screen sizing
setScreen();
window.addEventListener("resize", setScreen);

// Returns factor to multiply width/height to fit screen dimensions
// Used to apply screen sizing
function getScaleRatio() {
    const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight); //min between browser content area and viewport height
    const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth); //min between browser content area and viewport width

    // if screen is wider than tall, use ratio of width, else use ratio of height
    if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
        return screenWidth / GAME_WIDTH;
    } else {
        return screenHeight / GAME_HEIGHT;
    }
}

// display game over screen
function showGameOver() {
    const fontSize = 70 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "grey";
    const x = canvas.width / 4.5;
    const y = canvas.height / 2;
    ctx.fillText("GAME OVER", x, y);
  }

function setupGameReset() {
    if (!hasAddedEventListenersForRestart) {
        hasAddedEventListenersForRestart = true; 
        // delay by 1s to prevent accidental restart
        setTimeout(() =>{
            window.addEventListener("keyup", reset, {once: true});
        }, 1000);
        
    }
}

function reset() {
    hasAddedEventListenersForRestart = false;
    gameOver = false;
    waitingToStart = false; 
    ground.reset();
    obstacleController.reset(); 
    score.reset();
    gameSpeed = GAME_SPEED_START;
}

function showStartGameText() { 
    const fontSize = 50 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "grey";
    const x = canvas.width / 7.5;
    const y = canvas.height / 2;
    ctx.fillText("PRESS SPACE TO START", x, y);
}

function updateGameSpeed(frameTimeDelta) {
    gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

//
function clearScreen() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Updates the screen 
function gameLoop(currentTime) {
    console.log(gameSpeed);
    // Init
    if (prevTime == null) {
        prevTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }

    const frameTimeDelta = currentTime - prevTime; // used to standardize frame rate between systems
    prevTime = currentTime;
    clearScreen();

    if (!gameOver && !waitingToStart) {
        // Update game objects
        ground.update(gameSpeed, frameTimeDelta);
        obstacleController.update(gameSpeed, frameTimeDelta); 
        player.update(gameSpeed, frameTimeDelta);
        updateGameSpeed(frameTimeDelta);
        score.update(frameTimeDelta);
    }

    if (!gameOver && obstacleController.collideWith(player)) {
        gameOver = true;
        setupGameReset();
        score.setHighScore();
    }
    // Draw game objects
    ground.draw();
    obstacleController.draw();
    player.draw();
    score.draw();

    if (gameOver) {
        showGameOver();
    }

    if (waitingToStart) {
        showStartGameText();
    }

    requestAnimationFrame(gameLoop);

}

// Calls method when it's ready to repaint the screen
requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, {once: true});