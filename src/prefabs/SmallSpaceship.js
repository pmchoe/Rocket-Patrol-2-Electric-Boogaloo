class SmallSpaceship extends Spaceship {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
    
        this.points = pointValue + 30;   // store pointValue
        this.moveSpeed = game.settings.spaceshipSpeed + Phaser.Math.Between(5, 15);  // pixels per frame
    }
}