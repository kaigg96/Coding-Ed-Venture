export default class Player {

    WALK_ANIMATION_TIMER = 200;
    walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    dinoRunImages = [];

    jumpPressed = false;  
    jumpInProgress = false;
    falling = false;
    JUMP_SPEED  = 0.6;
    GRAVITY = 0.4;

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
        this.yStandingPos = this.y;

        this.stillImage = new Image();
        this.stillImage.src = "images/standing_still.png";
        this.image = this.stillImage;

        const dinoRunImage1 = new Image();
        dinoRunImage1.src = "images/dino_run1.png";
        const dinoRunImage2 = new Image();
        dinoRunImage2.src = "images/dino_run2.png";
        this.dinoRunImages.push(dinoRunImage1);
        this.dinoRunImages.push(dinoRunImage2);

        //keyboard EL
        window.removeEventListener("keydown", this.keydown); // remove first to prevent duplication
        window.removeEventListener("keyup", this.keyup);
        window.addEventListener("keydown", this.keydown);
        window.addEventListener("keyup", this.keyup);
    }

    keydown = (event)=> {
        if(event.code === "Space") {
            this.jumpPressed = true;
        }
    }

    keyup = (event)=> {
        if(event.code === "Space") {
            this.jumpPressed = false;
        }
    }

    update(gameSpeed, frameTimeDelta) {
        this.run(gameSpeed, frameTimeDelta);
        if (this.jumpPressed) {
            this.image = this.stillImage;
        }
        this.jump(frameTimeDelta);
    }

    jump(frameTimeDelta) {
        if (this.jumpPressed) {
            this.jumpInProgress = true;
        }

        // if player has not reached min jump height, let go of jump, or hit the top of the screen keep ascending
        if (this.jumpInProgress && !this.falling) {
            if ((this.y > this.canvas.height - this.minJumpHeight) || ((this.y > this.canvas.height - this.maxJumpHeight) && this.jumpPressed)) {
                this.y -= this.JUMP_SPEED * this.scaleRatio * frameTimeDelta; 
            } else {
                this.falling = true;
            }
        // else descend if to the base y pos
        } else {
            if (this.y < this.yStandingPos) {
                this.y += this.GRAVITY * this.scaleRatio * frameTimeDelta;
                if ( this.y + this.height > this.canvas.height) {
                    this.y = this.yStandingPos;
                }
            } else {
                this.falling = false;
                this.jumpInProgress = false;
            }
        }
    }

    run(gameSpeed, frameTimeDelta) {
        if (this.walkAnimationTimer <= 0) {
            if (this.image === this.dinoRunImages[0]) {
                this.image = this.dinoRunImages[1];
            } else {
                this.image = this.dinoRunImages[0];
            }
            this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        }
        this.walkAnimationTimer -= gameSpeed * frameTimeDelta;
    }

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