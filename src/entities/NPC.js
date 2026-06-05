export default class NPC extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, npcId, name) {
    super(scene, x, y, key);
    this.npcId = npcId;
    this.npcName = name;

    scene.add.existing(this);
    this.setOrigin(0.5, 1);

    // Name label above sprite
    this.nameText = scene.add.text(x, y - 20, name, {
      fontSize: '9px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5, 1);

    // Interaction hint
    this.interactHint = scene.add.text(x, y - 32, 'E键交互', {
      fontSize: '8px',
      fontFamily: 'monospace',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#00000088',
      padding: { x: 3, y: 2 }
    }).setOrigin(0.5, 1).setVisible(false);
  }

  showHint() {
    this.interactHint.setVisible(true);
  }

  hideHint() {
    this.interactHint.setVisible(false);
  }

  // Keep text anchored to sprite position
  syncText() {
    this.nameText.setPosition(this.x, this.y - 20);
    this.interactHint.setPosition(this.x, this.y - 32);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.syncText();
  }
}
