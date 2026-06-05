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
    this.W = 480;
    this.H = 270;
    this.panelH = 110;
    this.panelY = this.H - this.panelH;
  }

  create() {
    const { W, H, panelH, panelY } = this;

    // 半透明面板
    const gfx = this.add.graphics();
    gfx.fillStyle(0x000011, 0.88);
    gfx.fillRect(0, panelY, W, panelH);
    gfx.lineStyle(1, 0x4499cc, 1);
    gfx.strokeRect(1, panelY + 1, W - 2, panelH - 2);

    // NPC名字
    this.nameText = this.add.text(10, panelY + 7, '', {
      fontSize: '9px', fontFamily: 'monospace',
      color: '#88ddff', stroke: '#000000', strokeThickness: 2
    });

    // 对话内容
    this.bodyText = this.add.text(10, panelY + 22, '', {
      fontSize: '8px', fontFamily: 'monospace',
      color: '#eeeeff', wordWrap: { width: W - 20 }, lineSpacing: 3
    });

    // ESC提示
    this.add.text(W - 6, panelY + 6, 'ESC关闭', {
      fontSize: '6px', fontFamily: 'monospace', color: '#556677'
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

    const choiceStartY = this.panelY + 22 + this.bodyText.height + 8;

    node.choices.forEach((choice, i) => {
      const btn = this.add.text(12, choiceStartY + i * 18, `${i + 1}. ${choice.label}`, {
        fontSize: '7px', fontFamily: 'monospace',
        color: '#aaddff', stroke: '#000000', strokeThickness: 2,
        backgroundColor: '#112233bb',
        padding: { x: 5, y: 3 }
      }).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => btn.setColor('#ffffff'));
      btn.on('pointerout',  () => btn.setColor('#aaddff'));
      btn.on('pointerdown', () => this.executeChoice(choice));
      this.choiceButtons.push(btn);
    });

    // 数字键快捷键
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
