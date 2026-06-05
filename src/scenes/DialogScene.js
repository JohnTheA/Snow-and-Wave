import npcData from '../data/npcs.js';
import EventFlags from '../systems/EventFlags.js';
import RelationSystem from '../systems/RelationSystem.js';

export default class DialogScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DialogScene' });
  }

  init(data) {
    this.npcId = data.npcId;
    this.currentNodeId = null;
    this.npcDef = npcData[this.npcId];
    this.panelGraphics = null;
    this.nameText = null;
    this.bodyText = null;
    this.choiceButtons = [];
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;
    const panelH = Math.floor(H * 0.38);
    const panelY = H - panelH;

    // Semi-transparent dark panel
    this.panelGraphics = this.add.graphics();
    this.panelGraphics.fillStyle(0x000000, 0.82);
    this.panelGraphics.fillRect(0, panelY, W, panelH);
    this.panelGraphics.lineStyle(2, 0x4488cc, 1);
    this.panelGraphics.strokeRect(1, panelY + 1, W - 2, panelH - 2);

    // NPC name
    this.nameText = this.add.text(20, panelY + 12, '', {
      fontSize: '13px',
      fontFamily: 'monospace',
      color: '#88ddff',
      stroke: '#000000',
      strokeThickness: 3
    });

    // Dialogue body
    this.bodyText = this.add.text(20, panelY + 34, '', {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: '#eeeeff',
      wordWrap: { width: W - 40 },
      lineSpacing: 4
    });

    // Close hint
    this.add.text(W - 10, panelY + 10, '[ESC关闭]', {
      fontSize: '8px',
      fontFamily: 'monospace',
      color: '#667788'
    }).setOrigin(1, 0);

    // ESC to close
    this.input.keyboard.once('keydown-ESC', () => this.closeDialog());

    // Render starting node
    if (this.npcDef) {
      this.showNode(this.npcDef.start);
    } else {
      this.closeDialog();
    }
  }

  showNode(nodeId) {
    this.currentNodeId = nodeId;

    // Clear previous choice buttons
    this.choiceButtons.forEach(b => b.destroy());
    this.choiceButtons = [];

    if (nodeId === null) {
      this.closeDialog();
      return;
    }

    const node = this.npcDef.nodes[nodeId];
    if (!node) {
      this.closeDialog();
      return;
    }

    this.nameText.setText(this.npcDef.name);
    this.bodyText.setText(node.text);

    const W = this.scale.width;
    const H = this.scale.height;
    const panelH = Math.floor(H * 0.38);
    const panelY = H - panelH;

    // Place choices below body text
    const bodyBottom = panelY + 34 + this.bodyText.height + 12;

    node.choices.forEach((choice, i) => {
      const btnY = bodyBottom + i * 28;
      const btn = this.add.text(30, btnY, `▶ ${choice.label}`, {
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#aaddff',
        stroke: '#000000',
        strokeThickness: 2,
        backgroundColor: '#112233aa',
        padding: { x: 8, y: 4 }
      }).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => btn.setColor('#ffffff'));
      btn.on('pointerout', () => btn.setColor('#aaddff'));
      btn.on('pointerdown', () => {
        this.executeChoice(choice);
      });

      // Also allow number keys 1-3
      this.choiceButtons.push(btn);
    });

    // Number key shortcuts
    ['ONE', 'TWO', 'THREE'].forEach((key, i) => {
      const kbKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key]);
      kbKey.once('down', () => {
        if (node.choices[i]) this.executeChoice(node.choices[i]);
      });
    });
  }

  executeChoice(choice) {
    // Execute action if present
    if (choice.action) {
      this.parseAction(choice.action);
    }

    // Advance dialogue
    if (choice.next === null) {
      this.closeDialog();
    } else {
      this.showNode(choice.next);
    }
  }

  parseAction(actionStr) {
    const parts = actionStr.split(':');
    const cmd = parts[0];
    if (cmd === 'setFlag') {
      EventFlags.set(parts[1]);
    } else if (cmd === 'addRelation') {
      const npcId = parts[1];
      const amount = parseInt(parts[2], 10);
      RelationSystem.add(npcId, amount);
    }
  }

  closeDialog() {
    // Signal WorldScene that dialog ended
    this.scene.stop();
    const worldScene = this.scene.get('WorldScene');
    if (worldScene) {
      worldScene.onDialogClosed();
    }
  }
}
