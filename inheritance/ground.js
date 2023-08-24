/**
 * Represents the ground in the game environment.
 */
export default class Ground {
    /**
     * Create a new Ground object.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {number} width - The width of the ground.
     * @param {number} height - The height of the ground.
     * @param {number} speed - The base speed of the ground.
     * @param {number} scaleRatio - The scaling ratio for adapting to different screen sizes.
     */
    constructor(ctx, width, height, speed, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = 0;
        this.y = this.canvas.height - this.height; // Position the ground at the bottom of the screen

        this.groundImg = new Image();
        this.groundImg.src = 'images/ground.png';
    }

    /**
     * Draw the ground on the canvas.
     * This method draws two ground images side by side and resets the x position when the second image is reached.
     */
    draw() {
        // Draw the first ground image
        this.ctx.drawImage(
            this.groundImg, 
            this.x, 
            this.y, 
            this.width, 
            this.height
        );

        // Draw the second ground image with an offset equal to the width of the first image
        this.ctx.drawImage(
            this.groundImg, 
            this.x + this.width,
            this.y, 
            this.width, 
            this.height
        );

        // Check if the first ground image is fully off the screen and reset its position to create an illusion of infinite scrolling.
        if (this.x < -this.width) {
            this.x = 0;
        }
    }

    /**
     * Update the ground position based on the game speed and frame time.
     * @param {number} gameSpeed - The current game speed multiplier.
     * @param {number} frameTimeDelta - The time elapsed since the last frame update.
     */
    update(gameSpeed, frameTimeDelta) {
        // Move the ground to the left proportionally to the game speed, frame time, and scaling ratio.
        this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
    }

    /**
     * Reset the ground position when the game is restarted.
     * This method sets the x position of the ground to 0.
     */
    reset() {
        this.x = 0;
    }
}
