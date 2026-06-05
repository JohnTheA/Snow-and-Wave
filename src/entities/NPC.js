export default class NPC extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, npcId, name) {
    super(scene, x, y, key);
    this.npcId = npcId;
    this.npcName = name;

    scene.add.existing(this);
    this.setOrigin(0.5, 1);

    this.nameText = scene.add.text(x, y - 34, name, {
      fontSize: '11px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5, 1);

    this.interactHint = scene.add.text(x, y - 46, '[E] 交互', {
      fontSize: '10px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffff44',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#00000099',
      padding: { x: 3, y: 2 }
    }).setOrigin(0.5, 1).setVisible(false);
  }

  showHint() { this.interactHint.setVisible(true); }
  hideHint()  { this.interactHint.setVisible(false); }

  syncText() {
    this.nameText.setPosition(this.x, this.y - 34);
    this.interactHint.setPosition(this.x, this.y - 46);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.syncText();
  }
}
