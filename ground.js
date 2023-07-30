export default class Ground {
    constructor(ctx, width, height, speed, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = 0;
        this.y = this.canvas.height - this.height; //bottom of screen pos

        this.groundImg = new Image();
        this.groundImg.src = 'images/ground.png';
    }

    // Draws the ground image by placing two side by side, then resetting the x pos when you reach the 2nd img
    draw() {
        this.ctx.drawImage(
            this.groundImg, 
            this.x, 
            this.y, 
            this.width, 
            this.height
        );

        this.ctx.drawImage(
            this.groundImg, 
            this.x + this.width, //offset 2nd img by width 
            this.y, 
            this.width, 
            this.height
        );

        if (this.x < -this.width) {
            this.x = 0;
        }
    }

    // Update ground position proportionally to game speed and screen size
    update(gameSpeed, frameTimeDelta) {
        this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
    }

    // Reset the ground position upon game restart by setting x pos to 0
    reset() {
        this.x = 0;
    }
}