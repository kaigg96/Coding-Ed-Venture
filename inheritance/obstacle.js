/**
 * Represents an obstacle in the game environment.
 */
export default class Obstacle {
    /**
     * Create a new Obstacle object.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {number} x - The x-coordinate of the obstacle.
     * @param {number} y - The y-coordinate of the obstacle.
     * @param {number} width - The width of the obstacle.
     * @param {number} height - The height of the obstacle.
     * @param {HTMLImageElement} image - The image representing the obstacle.
     */
    constructor(ctx, x, y, width, height, image) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    /**
     * Update the obstacle's position based on the game speed and frame time.
     * @param {number} speed - The base speed of the obstacle.
     * @param {number} gameSpeed - The current game speed multiplier.
     * @param {number} frameTimeDelta - The time elapsed since the last frame update.
     * @param {number} scaleRatio - The scaling ratio for adapting to different screen sizes.
     */
    update(speed, gameSpeed, frameTimeDelta, scaleRatio) {
        // Move the obstacle to the left proportionally to the game speed, frame time, and scaling ratio.
        this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio;
    }

    // Draw the obstacle on the canvas.
    draw() {
        this.ctx.drawImage(
            this.image, 
            this.x, 
            this.y, 
            this.width, 
            this.height
        );
    }

    /**
     * Perform axis-aligned bounding box (AABB) collision detection with another sprite.
     * @param {object} sprite - The sprite to check for collision with.
     * @returns {boolean} - True if a collision occurs, false otherwise.
     */
    collideWith(sprite) {
        const adjustBy = 1.25;
        if (sprite.x < this.x + this.width / adjustBy &&
            sprite.x + sprite.width / adjustBy > this.x &&
            sprite.y < this.y + this.height / adjustBy &&
            sprite.y + sprite.height / adjustBy > this.y
            ) {
            return true;
        } else {
            return false;
        }
    }
}
