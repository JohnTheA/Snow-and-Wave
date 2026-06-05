import BootScene from './scenes/BootScene.js';
import WorldScene from './scenes/WorldScene.js';
import DialogScene from './scenes/DialogScene.js';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#1a1a2e',
  pixelArt: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 480,
    height: 270,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [BootScene, WorldScene, DialogScene]
};

new Phaser.Game(config);
