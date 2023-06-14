/*
Philip Choe
Rocket Patrol 2: The Electric Boogaloo
approx time: xx hours

Mods:
    - All five of the 15-point tier mods
        - Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points
        - Implement an alternating two-player mode
        - Implement a new timing/scoring mechanism that adds time to the clock for successful hits
        - Implement mouse control for player movement and mouse click to fire
        - Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship
    - Three 10-point tier mods
        - Display the time remaining (in seconds) on the screen
        - Create 4 new explosion sound effects and randomize which one plays on impact
        - Implement parallax scrolling for the background
    - Two 5-point tier mods
        - Add your own (copyright-free) background music to the Play scene
        - Track a high score that persists across scenes and display it in the UI
*/

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