/**
 * Manages the game's score and high score display.
 */
export default class Score {
    score = 0;
    HIGH_SCORE_KEY = "highscore";

    /**
     * Create a new Score object.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {number} scaleRatio - The scaling ratio for adapting to different screen sizes.
     */
    constructor(ctx, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
    }

    /**
     * Update the score based on the time elapsed since the last frame update.
     * @param {number} frameTimeDelta - The time elapsed since the last frame update.
     */
    update(frameTimeDelta) {
        this.score += frameTimeDelta * 0.01;
    }

    // Reset the score to zero.
    reset() {
        this.score = 0;
    }

    // Check if the current score is greater than the stored high score and update it if necessary.
    setHighScore() {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        if (this.score > highScore) {
            localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
        }
    }

    getScore() {
        return this.score;
    }

    // Draw the current score and high score on the canvas. 
    draw() {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        const y = 20 * this.scaleRatio;

        const fontSize = 20 * this.scaleRatio;
        this.ctx.font = `${fontSize}px Georgia`;
        this.ctx.fillStyle = "blue"; 

        const scoreX = this.canvas.width - 100 * this.scaleRatio;
        const highScoreX = scoreX - 125 * this.scaleRatio;

        this.ctx.fillText(`${Math.floor(this.score)}`, scoreX, y);
        this.ctx.fillText(`HS ${highScore}`, highScoreX, y);
    }
}
