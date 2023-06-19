// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
    
        scene.add.existing(this);   // add object to existing scene
        this.points = pointValue;   // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed;  // pixels per frame
        this.direction = Phaser.Math.Between(0, 1);     // 0 means ship comes in from left side, 1 comes in from right side
        if(this.direction == 0) {                       // flips direction if ship comes in from left side
            this.setScale(-1, 1);
        }
    }

    update() {
        // moves spaceship depending on their direction, determined in Menu.js
        if(this.direction == 0) {
            // move spaceship to the right
            this.x += this.moveSpeed;
            // wrap around from right edge to left edge
            if(this.x >= game.config.width + this.width) {
                this.reset();
            }
        } else {
            // move spaceship to the left
            this.x -= this.moveSpeed;
            // wrap around from left edge to right edge
            if(this.x <= 0 - this.width) {
                this.reset();
            }
        }
    }

    // position reset
    reset() {
        // resets spaceship depending on their direction, determined in Menu.js
        if(this.direction == 0) {
            this.x = 0;
        } else {
            this.x = game.config.width;
        }
    }
}