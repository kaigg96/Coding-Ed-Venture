import Obstacle from "./obstacle.js";

/**
 * Controls the generation, update, and collision detection of obstacles in the game.
 */
export default class ObstacleController {
    
    OBSTACLE_INTERVAL_MIN = 500;
    OBSTACLE_INTERVAL_MAX = 2000;

    nextObstacleInterval = null;
    obstacles = [];
    
    /**
     * Create a new ObstacleController object.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {Array} obstacleImages - An array of obstacle images and their dimensions.
     * @param {number} scaleRatio - The scaling ratio for adapting to different screen sizes.
     * @param {number} speed - The base speed of the obstacles.
     */
    constructor(ctx, obstacleImages, scaleRatio, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.obstacleImages = obstacleImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextObstacleTime();
    }

    /**
     * Set the time until the next obstacle is generated.
     * The next obstacle interval is randomized between the specified minimum and maximum values.
     */
    setNextObstacleTime() {
        const num = this.getRandomNumer(this.OBSTACLE_INTERVAL_MIN, this.OBSTACLE_INTERVAL_MAX);
        this.nextObstacleInterval = num;
    }

    /**
     * Generate a random number between the given min and max (inclusive).
     * @param {number} min - The minimum value of the range.
     * @param {number} max - The maximum value of the range.
     * @returns {number} - The generated random number.
     */
    getRandomNumer(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // Create a new obstacle and add it to the list of obstacles
    createObstacle() {
        const index = this.getRandomNumer(0, this.obstacleImages.length - 1);
        const obstacleImage = this.obstacleImages[index];
        const x  = this.canvas.width * 1.5; //draw offscreen 
        const y = this.canvas.height - obstacleImage.height;

        const obstacle = new Obstacle(
            this.ctx, 
            x, 
            y, 
            obstacleImage.width, 
            obstacleImage.height, 
            obstacleImage.image
        );

        this.obstacles.push(obstacle);
    }

    /**
     * Update the obstacles' positions based on the game speed and frame time.
     * @param {number} gameSpeed - The current game speed multiplier.
     * @param {number} frameTimeDelta - The time elapsed since the last frame update.
     */
    update(gameSpeed, frameTimeDelta) {
        if (this.nextObstacleInterval <= 0) {
            this.createObstacle();
            this.setNextObstacleTime(); 
        } 
        this.nextObstacleInterval -= frameTimeDelta;

        this.obstacles.forEach((obstacle)=>{
            obstacle.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
        });

        this.obstacles = this.obstacles.filter(obstacle => obstacle.x > -obstacle.width) // remove passed obstacles
    }

    // Draw all the obstacles on the canvas
    draw() {
        this.obstacles.forEach(obstacle=>obstacle.draw());
    }

    /**
     * Check if the sprite collides with any of the obstacles.
     * @param {object} sprite - The sprite to check for collision with.
     * @returns {boolean} - True if a collision occurs with any obstacle, false otherwise.
     */
    collideWith(sprite) {
        return this.obstacles.some((obstacle)=>obstacle.collideWith(sprite));
    }

    // Reset the obstacles upon game restart by clearing the obstacles array
    reset() {
        this.obstacles = [];
    }
}