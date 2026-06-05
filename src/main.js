import BootScene from './scenes/BootScene.js';
import WorldScene from './scenes/WorldScene.js';
import DialogScene from './scenes/DialogScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  backgroundColor: '#1a1a2e',
  pixelArt: true,
  antialias: false,
  zoom: 2,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [BootScene, WorldScene, DialogScene]
};

new Phaser.Game(config);
