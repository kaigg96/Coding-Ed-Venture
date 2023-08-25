/**
 * Represents the player character in the game.
 */
export default class Player {
    WALK_ANIMATION_TIMER = 200;
    walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    runImages = [];
    currentRunImageIndex = 0;

    jumpPressed = false;  
    jumpInProgress = false;
    falling = false;
    JUMP_SPEED  = 0.6;
    GRAVITY = 0.4;

    /**
     * Create a new Player object.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {number} width - The width of the player.
     * @param {number} height - The height of the player.
     * @param {number} minJumpHeight - The minimum height to which the player can jump.
     * @param {number} maxJumpHeight - The maximum height to which the player can jump.
     * @param {number} scaleRatio - The scaling ratio for adapting to different screen sizes.
     */
    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;

        this.x = 10 * scaleRatio; // Start 10px (scaled) from the left
        this.y = this.canvas.height - this.height - 1.5 * scaleRatio; // Start 1.5px (scaled) from the bottom
        this.yStandingPos = this.y;

        this.jumpImage = new Image();
        this.jumpImage.src = "images/jumping.png";

        const runImage1 = new Image();
        runImage1.src = "images/run1.png";
        const runImage3 = new Image();
        runImage3.src = "images/run3.png";
        const runImage5 = new Image();
        runImage5.src = "images/run5.png";

        this.runImages.push(runImage1);
        this.runImages.push(runImage3);
        this.runImages.push(runImage5);

        this.image = runImage1;

        // Keyboard event listeners
        window.removeEventListener("keydown", this.keydown); // Remove first to prevent duplication
        window.removeEventListener("keyup", this.keyup);
        window.addEventListener("keydown", this.keydown);
        window.addEventListener("keyup", this.keyup);
    }

    /**
     * Event handler for the "keydown" event. Sets the `jumpPressed` flag when Space key is pressed.
     * @param {KeyboardEvent} event - The keyboard event object.
     */
    keydown = (event) => {
        if (event.code === "Space") {
            this.jumpPressed = true;
        }
    }

    /**
     * Event handler for the "keyup" event. Clears the `jumpPressed` flag when Space key is released.
     * @param {KeyboardEvent} event - The keyboard event object.
     */
    keyup = (event) => {
        if (event.code === "Space") {
            this.jumpPressed = false;
        }
    }

    /**
     * Update the player's state based on game speed and frame time.
     * @param {number} gameSpeed - The current game speed multiplier.
     * @param {number} frameTimeDelta - The time elapsed since the last frame update.
     */
    update(gameSpeed, frameTimeDelta) {
        this.run(gameSpeed, frameTimeDelta);
        if (this.jumpPressed) {
            this.image = this.jumpImage;
        }
        this.jump(frameTimeDelta);
    }

    /**
     * Handle the player's jumping behavior.
     * @param {number} frameTimeDelta - The time elapsed since the last frame update.
     */
    jump(frameTimeDelta) {
        if (this.jumpPressed) {
            this.jumpInProgress = true;
        }

        // If the player has not reached the min jump height, let go of jump, or hit the top of the screen, keep ascending.
        if (this.jumpInProgress && !this.falling) {
            if ((this.y > this.canvas.height - this.minJumpHeight) || ((this.y > this.canvas.height - this.maxJumpHeight) && this.jumpPressed)) {
                this.y -= this.JUMP_SPEED * this.scaleRatio * frameTimeDelta; 
            } else {
                this.falling = true;
            }
        // Else, descend to the base y position.
        } else {
            if (this.y < this.yStandingPos) {
                this.y += this.GRAVITY * this.scaleRatio * frameTimeDelta;
                if (this.y + this.height > this.canvas.height) {
                    this.y = this.yStandingPos;
                }
            } else {
                this.falling = false;
                this.jumpInProgress = false;
            }
        }
    }

    /**
     * Handle the player's running animation by iterating through running images.
     * @param {number} gameSpeed - The current game speed multiplier.
     * @param {number} frameTimeDelta - The time elapsed since the last frame update.
     */
    run(gameSpeed, frameTimeDelta) {
        if (this.walkAnimationTimer <= 0) {
            this.currentRunImageIndex = (this.currentRunImageIndex + 1) % this.runImages.length;
            this.image = this.runImages[this.currentRunImageIndex];
            this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        }
        this.walkAnimationTimer -= gameSpeed * frameTimeDelta;
    }

    // Draw the player on the canvas.
    draw() {
        this.ctx.drawImage(
            this.image, 
            this.x, 
            this.y, 
            this.width, 
            this.height
        );
    }
}
