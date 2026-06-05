import npcData from '../data/npcs.js';
import EventFlags from '../systems/EventFlags.js';
import RelationSystem from '../systems/RelationSystem.js';

export default class DialogScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DialogScene' });
  }

  init(data) {
    this.npcId = data.npcId;
    this.npcDef = npcData[this.npcId];
    this.choiceButtons = [];
    this.W = 800;
    this.H = 500;
    this.panelH = 180;
    this.panelY = this.H - this.panelH;
  }

  create() {
    const { W, H, panelH, panelY } = this;

    const gfx = this.add.graphics();
    gfx.fillStyle(0x000e1a, 0.92);
    gfx.fillRect(0, panelY, W, panelH);
    gfx.lineStyle(2, 0x4499cc, 1);
    gfx.strokeRect(2, panelY + 2, W - 4, panelH - 4);

    this.nameText = this.add.text(20, panelY + 14, '', {
      fontSize: '18px', fontFamily: 'Arial, sans-serif',
      color: '#88ddff', stroke: '#000000', strokeThickness: 2
    });

    this.bodyText = this.add.text(20, panelY + 42, '', {
      fontSize: '14px', fontFamily: 'Arial, sans-serif',
      color: '#eeeeff', wordWrap: { width: W - 40 }, lineSpacing: 5
    });

    this.add.text(W - 14, panelY + 12, 'ESC 关闭', {
      fontSize: '11px', fontFamily: 'Arial, sans-serif', color: '#445566'
    }).setOrigin(1, 0);

    this.input.keyboard.once('keydown-ESC', () => this.closeDialog());

    if (this.npcDef) {
      const startNode = this.npcDef.getStart ? this.npcDef.getStart() : this.npcDef.start;
      this.showNode(startNode);
    } else {
      this.closeDialog();
    }
  }

  showNode(nodeId) {
    this.choiceButtons.forEach(b => b.destroy());
    this.choiceButtons = [];

    if (!nodeId) { this.closeDialog(); return; }
    const node = this.npcDef.nodes[nodeId];
    if (!node) { this.closeDialog(); return; }

    this.nameText.setText(this.npcDef.name);
    this.bodyText.setText(node.text);

    const choiceStartY = this.panelY + 42 + this.bodyText.height + 12;

    node.choices.forEach((choice, i) => {
      const btn = this.add.text(20, choiceStartY + i * 28, i + 1 + '.  ' + choice.label, {
        fontSize: '13px', fontFamily: 'Arial, sans-serif',
        color: '#aaddff', stroke: '#000000', strokeThickness: 2,
        backgroundColor: '#0a2240cc',
        padding: { x: 10, y: 5 }
      }).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => btn.setColor('#ffffff'));
      btn.on('pointerout',  () => btn.setColor('#aaddff'));
      btn.on('pointerdown', () => this.executeChoice(choice));
      this.choiceButtons.push(btn);
    });

    ['ONE', 'TWO', 'THREE'].forEach((key, i) => {
      const k = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key]);
      k.once('down', () => { if (node.choices[i]) this.executeChoice(node.choices[i]); });
    });
  }

  executeChoice(choice) {
    if (choice.action) this.parseAction(choice.action);
    if (choice.next === null) this.closeDialog();
    else this.showNode(choice.next);
  }

  parseAction(actionStr) {
    const parts = actionStr.split(':');
    if (parts[0] === 'setFlag') {
      EventFlags.set(parts[1]);
    } else if (parts[0] === 'addRelation') {
      RelationSystem.add(parts[1], parseInt(parts[2], 10));
    }
  }

  closeDialog() {
    this.scene.stop();
    const world = this.scene.get('WorldScene');
    if (world) world.onDialogClosed();
  }
}
