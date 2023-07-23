import Player from "./player.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const PLAYER_WIDTH = 88 / 1.5; 
const PLAYER_HEIGHT = 94 / 1.5;
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;

// Game objects
let player = null;

let scaleRatio = null;
let prevTime = null;

function createSprites() {
    const scaledPlayerWidth = PLAYER_WIDTH * scaleRatio;
    const scaledPlayerHeight = PLAYER_HEIGHT * scaleRatio;
    const scaledMinJumpHeight = MIN_JUMP_HEIGHT * scaleRatio;
    const scaledMaxJumpHeight = MAX_JUMP_HEIGHT * scaleRatio;
    player = new Player(
        ctx, 
        scaledPlayerWidth, 
        scaledPlayerHeight, 
        scaledMinJumpHeight, 
        scaledMaxJumpHeight, 
        scaleRatio
    );
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

//
function clearScreen() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Updates the screen 
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

    // Update game objects

    
    // Draw game objects
    player.draw();

    requestAnimationFrame(gameLoop);
}

// Calls method when it's ready to repaint the screen
requestAnimationFrame(gameLoop);