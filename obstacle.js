export default class Obstacle {
    constructor(ctx, x, y, width, height, image) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    update(speed, gameSpeed, frameTimeDelta, scaleRatio) {
        this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio;
    }

    draw() {
        this.ctx.drawImage(
            this.image, 
            this.x, 
            this.y, 
            this.width, 
            this.height);
    }

    // Axis aligned bounding box collision detection
    // AjustBy sets a tolerance for overlapping
    // Returns true if collision
    collideWith(sprite) {
        const adjustBy = 1.5;
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