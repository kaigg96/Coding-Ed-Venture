export default class Player {
    constructor(ctx, width, height, minJumpHeight,  maxJumpHeight, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;

        this.x = 10 * scaleRatio; // start 10px (scaled) from left
        this.y = this.canvas.height - this.height - 1.5 * scaleRatio; // start 1.5px (scaled) from bottom

        this.stillImage = new Image();
        this.stillImage.src = "images/standing_still.png";

        this.image = this.stillImage;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}