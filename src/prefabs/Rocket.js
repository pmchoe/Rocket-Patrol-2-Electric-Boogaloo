// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
    
        scene.add.existing(this);   // add object to existing scene
        this.isFiring = false;      // track rocket's firing status
        this.moveSpeed = 2;         // pixels per frame
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx

        // add pointerdown event listener
        scene.input.on('pointerdown', (pointer) => {
            if(!this.isFiring) {
                this.isFiring = true;
                this.sfxRocket.play({volume:0.15});     // play sfx
            }
        });
    }

    update() {
        // left/right movement
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }

        // fire button
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play({volume:0.15});     // play sfx
        }
        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
            fireLeft.alpha = 1;
        }
        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();    
        }
    }

    // reset rocket to "ground" and hides "FIRE" text
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
        fireLeft.alpha = 0;        // hides "FIRE" text
    }
}