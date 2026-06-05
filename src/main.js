import BootScene from './scenes/BootScene.js';
import WorldScene from './scenes/WorldScene.js';
import DialogScene from './scenes/DialogScene.js';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#1a1a2e',
  antialias: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 500,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [BootScene, WorldScene, DialogScene]
};

new Phaser.Game(config);
