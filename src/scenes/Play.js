class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('smallspaceship', './assets/smallspaceship.png');
        this.load.image('background', './assets/backgroundstarfield.png'); 
        this.load.image('foreground', './assets/foregroundstarfield.png');  
        // this.load.image('particles', './assets/particles.png');
        
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        
        // load sounds/songs
        this.load.audio('bgm', './assets/bgm.mp3');
    }

    create() {
        // place background tile sprite
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
        this.foreground = this.add.tileSprite(0, 0, 640, 480, 'foreground').setOrigin(0, 0);
        
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        
        // bgm
        this.music = this.sound.add('bgm', {loop: true});
        this.music.play({volume:0.15});

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4 + 150, 'spaceship', 0, 10).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 20).setOrigin(0,0);

        // add small spaceship
        this.ship04 = new SmallSpaceship(this, game.config.width, borderUISize*4, 'smallspaceship', 0, 10).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        /*  depreciated Phaser 3.55 code, uses ParticleEmitterManager which was phased out in 3.60
        // create particle emitter
        this.kaboomParticles = this.add.particles('particles').createEmitter({
            lifespan: 1000,
            speed: { min: 100, max: 200 },
            scale: { start: 1, end: 0 },
            quantity: { min: 50, max: 100 }
        });*/

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);   
        
        // display timer (to the right of score)
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#00FF00',
            color: '#000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timeLeft = this.add.text((borderUISize + borderPadding + this.scoreLeft.width), borderUISize + borderPadding*2, Math.ceil(game.settings.gameTimer / 1000), timeConfig);   

        // display highscore at rightmost side
        let highscoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.highscoreLeft = this.add.text((game.config.width - (borderUISize*3 + borderPadding*4)), borderUISize + borderPadding*2, highscore, highscoreConfig);   

        // display "FIRE" text in the middle and hides it
        let fireConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        fireLeft = this.add.text((game.config.width / 2) - borderUISize - borderPadding, borderUISize + borderPadding*2, "FIRE", fireConfig);   
        fireLeft.alpha = 0;        

        // GAME OVER flag
        this.gameOver = false;

        scoreConfig.fixedWidth = 0;
        highscoreConfig.fixedWidth = 0;
        timeConfig.fixedWidth = 0;
        fireConfig.fixedWidth = 0;

        // 60 or 45 sec play clock
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
                this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
                this.gameOver = true;
        }, null, this);
    }

        update() {
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        scoreConfig.fixedWidth = 0;

        // mouse controls 
        this.input.on('pointermove', (pointer) => {
            this.p1Rocket.x = pointer.x;
        });

        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        // check key input for menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.background.tilePositionX -= 1;      // parallax background tile sprite
        this.foreground.tilePositionX -= 2;      
        
        if(!this.gameOver) {
            this.p1Rocket.update();             // update player rocket
            this.ship01.update();               // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();               // update small spaceship
        }
    
        // check collisions, adds time
        if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
            // add time to the clock
            this.clock.elapsed -= this.addTime(this.ship04);
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
            // add time to the clock
            this.clock.elapsed -= this.addTime(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            // add time to the clock
            this.clock.elapsed -= this.addTime(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            // add time to the clock
            this.clock.elapsed -= this.addTime(this.ship01);
        }

        // updates timer to remaining time in seconds
        game.settings.gameTimer -= this.clock.elapsed;
        this.timeLeft.text = Math.ceil(game.settings.gameTimer / 1000).toString(); 
        
        this.clock.remove(false);                                       // removes existing timer
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {  // re-adds timer
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if(ship.direction == 1) {
            if(rocket.x < ship.x + ship.width && 
                rocket.x + rocket.width > ship.x && 
                rocket.y < ship.y + ship.height &&
                rocket.height + rocket.y > ship. y) {
                return true;
            } else {
                return false;
            }
        } else {
            if(rocket.x < ship.x  && 
                rocket.x + rocket.width > ship.x && 
                rocket.y < ship.y + ship.height &&
                rocket.height + rocket.y > ship. y) {
                return true;
            } else {
                return false;
            }
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;

        // create explosion sprite at ship's position
        if(ship.direction == 1) {
            let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
            boom.anims.play('explode');             // play explode animation
            boom.on('animationcomplete', () => {    // callback after anim completes
                ship.reset();                       // reset ship position
                ship.alpha = 1;                     // make ship visible again
                boom.destroy();                     // remove explosion sprite
            });
        } else {
            let boom = this.add.sprite(ship.x - ship.width, ship.y, 'explosion').setOrigin(0, 0);
            boom.anims.play('explode');             // play explode animation
            boom.on('animationcomplete', () => {    // callback after anim completes
                ship.reset();                       // reset ship position
                ship.alpha = 1;                     // make ship visible again
                boom.destroy();                     // remove explosion sprite
            });
        }

        /*  depreciated, refer to line 60
        // release particles at ship's position
        this.kaboomParticles.setPosition(this.ship.x, this.ship.y);
        this.kaboomParticles.explode();
        */

        // score & highscore add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        highscore += ship.points;
        this.highscoreLeft.text = highscore;

        // randomly plays one of the five explosion sfxs 
        this.randomExplosion = 'sfx_explosion' + Phaser.Math.Between(0, 4);
        this.sound.play(this.randomExplosion, {volume:0.15});
    }

    addTime(ship) {
        // returns time to be added to timer depending on which ship was kabloomed
        this.timeInMS = ship.points * 100;
        return this.timeInMS;
    }
}