/*
Philip Choe
Rocket Patrol 2: The Electric Boogaloo
approx time: 19 hours

Mods:
    - Three 15-point tier mods (45 total)
        - (done) Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points
        - (done) Implement a new timing/scoring mechanism that adds time to the clock for successful hits
        - (done) Implement mouse control for player movement and mouse click to fire
    - Three 10-point tier mods (30 total)
        - (done) Display the time remaining (in seconds) on the screen
        - (done) Implement parallax scrolling for the background
        - (done) Create 4 new explosion sound effects and randomize which one plays on impact
    - Five 5-point tier mods (30 total)
        - (done) Add your own (copyright-free) background music to the Play scene
        - (done) Track a high score that persists across scenes and display it in the UI
        - (done) Create a new scrolling tile sprite for the background
        - (done) Randomize each spaceship's movement direction at the start of each play
        - (done) Implement the 'FIRE' UI text from the original game
        - (done) Allow the player to control the Rocket after it's fired (mouse only)

Citations/Credits:
    - Copyright-free bgm from Lesiakower (https://pixabay.com/music/video-games-epic-battle-153400/)
*/


// NOTE: make it so that when fire is active, "FIRE" shows up and then disappears
//       timer doesnt work, idky
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// initialize highscore
let highscore = 0;

// initialize fireLeft for "FIRE" text
let fireLeft;