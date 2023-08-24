// ----------------------------------------------------------------
// IMPORTS

import Player from "./player.js";
import Ground from "./ground.js";
import ObstacleController from "./ObstacleController.js";
import Score from "./score.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ----------------------------------------------------------------
// CONSTANTS

const GAME_SPEED_START = 1;
const GAME_SPEED_INCREMENT = 0.00001;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const PLAYER_WIDTH = 88 / 1.75; 
const PLAYER_HEIGHT = 94 / 1.75;
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const GROUND_WIDTH = 859;
const GROUND_HEIGHT = 2;
const GROUND_AND_OBSTACLE_SPEED = 0.5;
const CUTSCENE_INIT_SCORE = 25;

let OBSTACLE_CONFIG = [
    {width: 50, height: 75, image: "images/obstacle_1.png"},
];

// ----------------------------------------------------------------
// GAME OBJECTS
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
let isCutscenePlaying = false;
let cutscenePassed = false;

// ----------------------------------------------------------------
// FUNCTIONS

/**
 * Creates the necessary sprites for the game, including the player, ground, obstacles, and score.
 * It calculates the scaled dimensions for the player and ground based on the scaleRatio,
 * and creates the corresponding objects using the provided context and game settings.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 * @param {number} scaleRatio - The scaling ratio for adapting to different screen sizes.
 */
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

    obstacleController = setObstacleImages();

    score = new Score(ctx, scaleRatio);
}

// Set the screen size based on the window dimensions
function setScreen() {
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio;
    createSprites();
}

// Apply dynamic screen sizing
setScreen();
window.addEventListener("resize", setScreen);

/**
 * Generates an array of obstacle images with scaled dimensions based on the current scaleRatio.
 * @returns {ObstacleController} The initialized ObstacleController instance with the scaled obstacle images.
 */
function setObstacleImages() {
    const obstacleImages = OBSTACLE_CONFIG.map(obstacle => {
        const image = new Image();
        image.src = obstacle.image;
        return {
            image:image,
            width: 50 * scaleRatio,
            height: 75 * scaleRatio
        };
    });

    obstacleController = new ObstacleController(ctx, obstacleImages, scaleRatio, GROUND_AND_OBSTACLE_SPEED);
    return obstacleController;
}

/**
 * Returns the factor to multiply width/height to fit screen dimensions.
 * @returns {number} The scaling ratio to fit the game canvas on the screen.
 */
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

// Display game over screen
function showGameOver() {
    const fontSize = 70 * scaleRatio;
    ctx.font = `${fontSize}px Georgia`;
    ctx.fillStyle = "red";
    const x = canvas.width / 4.5;
    const y = canvas.height / 2;
    ctx.fillText("GAME OVER", x, y);
  }

/**
 * Sets up the game for a reset after game over or cutscene.
 * @param {number} delayTime - The delay time (in milliseconds) before the event listener is added.
 *                             This delay prevents immediate accidental restarts.
 */
function setupGameReset(delayTime) {
    if (!hasAddedEventListenersForRestart) {
        hasAddedEventListenersForRestart = true;
        setTimeout(() =>{
            window.addEventListener("keyup", reset, {once: true});
        }, delayTime);
    }
}

// Resets game state after game over
function reset() {
    hasAddedEventListenersForRestart = false;
    gameOver = false;
    waitingToStart = false; 
    isCutscenePlaying = false;
    ground.reset();
    obstacleController.reset(); 
    score.reset();
    gameSpeed = GAME_SPEED_START;
}

// Displays the "PRESS SPACE TO START" message on the canvas
function showStartGameText() { 
    const fontSize = 50 * scaleRatio;
    ctx.font = `${fontSize}px Georgia`;
    ctx.fillStyle = "blue";
    const x = canvas.width / 7.5;
    const y = canvas.height / 1.75;
    ctx.fillText("PRESS SPACE TO START", x, y);
}

/**
 * Increment the game speed according to the elapsed time since the last frame.
 * Pause the game if the score hits 250 and trigger the cutscene.
 * @param {number} frameTimeDelta - The time difference (in milliseconds) between the current and previous frames.
 */
function updateGameSpeed(frameTimeDelta) {
    if (!isCutscenePlaying) {
        gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;

        if (score.getScore() >= CUTSCENE_INIT_SCORE && cutscenePassed == false) {
            // Pause the game
            isCutscenePlaying = true;
        }
    }
}

// Displays the cutscene
function displayCutscene() {
    const fontSize = 70 * scaleRatio;
    ctx.font = `${fontSize}px Georgia`;
    ctx.fillStyle = "yellow";
    const x = canvas.width / 4;
    const y = canvas.height / 2;
    ctx.fillText("CUTSCENE", x, y);
}

// Clear the screen for next frame rendering
function clearScreen() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Add an obstacle to the 
function addObstacle(images) {
    for (let i = 0; i < images.length; i++) {
        OBSTACLE_CONFIG.push({width:50, height:75, image:images[i]});
    }
    obstacleController = setObstacleImages();
}

/**
 * Main game loop; updates and renders the game.
 * This function is responsible for the continuous execution of the game, rendering the game objects,
 * updating their positions and interactions, and managing the game state.
 * @param {DOMHighResTimeStamp} currentTime - The current timestamp representing the start of the current frame.
 */
function gameLoop(currentTime) {
    // Init
    if (prevTime == null) {
        prevTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }

    const frameTimeDelta = currentTime - prevTime; // used to standardize frame rate between systems
    prevTime = currentTime;
    clearScreen();

    if (!gameOver && !waitingToStart && !isCutscenePlaying) {
        // Update game objects
        ground.update(gameSpeed, frameTimeDelta);
        obstacleController.update(gameSpeed, frameTimeDelta); 
        player.update(gameSpeed, frameTimeDelta);
        updateGameSpeed(frameTimeDelta);
        score.update(frameTimeDelta);
    }

    if (!gameOver && obstacleController.collideWith(player)) {
        gameOver = true;
        setupGameReset(500);
        score.setHighScore();
    }

    if (isCutscenePlaying) {
        displayCutscene();
        setupGameReset(5000);
        addObstacle(["images/obstacle_1.png", "images/fence.png"]);
        cutscenePassed = true;
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