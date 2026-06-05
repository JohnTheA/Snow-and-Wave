import EventFlags from '../systems/EventFlags.js';
import RelationSystem from '../systems/RelationSystem.js';
import TriggerSystem from '../systems/TriggerSystem.js';
import NPC from '../entities/NPC.js';
import npcData from '../data/npcs.js';

const TILE = 16;
const MAP_W = 50;
const MAP_H = 30;

// Tile indices in the tileset
const SNOW  = 0; // x offset 0
const PATH  = 1; // x offset 16
const WATER = 2; // x offset 32
const HOUSE = 3; // x offset 48

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene');
  }

  create() {
    // ── Build tile map ───────────────────────────────────────────────
    this._buildMap();

    // ── Houses (decorative rects) ────────────────────────────────────
    this._buildHouses();

    // ── Player ──────────────────────────────────────────────────────
    const startX = MAP_W * TILE / 2;
    const startY = (MAP_H - 4) * TILE; // near bottom (ocean edge)
    this.player = this.add.sprite(startX, startY - TILE, 'player').setOrigin(0.5, 1);
    this.playerSpeed = 120;

    // ── NPCs ────────────────────────────────────────────────────────
    this.npcMap = {};
    this._spawnNPCs();

    // ── Camera ──────────────────────────────────────────────────────
    this.cameras.main.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // ── Input ───────────────────────────────────────────────────────
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // ── State ────────────────────────────────────────────────────────
    this.nearestNPC = null;
    this.dialogOpen = false;

    // Village entrance position (for guardian text)
    this.villageEntranceX = Math.floor(MAP_W / 2) * TILE;
    this.villageEntranceY = (MAP_H - 8) * TILE;

    // ── UI labels ───────────────────────────────────────────────────
    this._buildUI();

    // Initial trigger check
    TriggerSystem.check(this);
  }

  _buildMap() {
    // Fill the entire map with snow first, then carve paths, water, etc.
    // We draw tiles manually using the 'tiles' tileset texture.
    // The tileset is 64x16 with frames [0,1,2,3] each 16x16.
    // We use a static group of images for the tiles.

    this.tileLayer = this.add.group();

    for (let ty = 0; ty < MAP_H; ty++) {
      for (let tx = 0; tx < MAP_W; tx++) {
        const tileType = this._getTileType(tx, ty);
        const frameX = tileType * TILE; // offset in tileset
        // We'll use a RenderTexture per row for efficiency, but
        // for simplicity just place individual images.
        const img = this.add.image(tx * TILE + 8, ty * TILE + 8, 'tiles')
          .setOrigin(0.5)
          .setCrop(frameX, 0, TILE, TILE);
        // Note: setCrop won't work for picking frame from a wide texture.
        // Use setTexture with frame. We need a proper frame key approach.
        // Instead, regenerate each tile type as its own texture in BootScene.
        // For now, use tint to differentiate: draw colored rectangles.
        img.destroy();
      }
    }

    // Draw map as colored graphics (simpler and reliable)
    const mapGfx = this.add.graphics();
    for (let ty = 0; ty < MAP_H; ty++) {
      for (let tx = 0; tx < MAP_W; tx++) {
        const t = this._getTileType(tx, ty);
        let color;
        switch (t) {
          case SNOW:  color = 0xd8eeff; break;
          case PATH:  color = 0x9aabb8; break;
          case WATER: color = 0x1155cc; break;
          case HOUSE: color = 0x8B5E3C; break;
          default:    color = 0xd8eeff;
        }
        mapGfx.fillStyle(color, 1);
        mapGfx.fillRect(tx * TILE, ty * TILE, TILE, TILE);

        // Subtle grid outline for snow
        if (t === SNOW) {
          mapGfx.fillStyle(0xc0d8f0, 0.3);
          mapGfx.fillRect(tx * TILE, ty * TILE, TILE, 1);
          mapGfx.fillRect(tx * TILE, ty * TILE, 1, TILE);
        }
        // Water shimmer
        if (t === WATER) {
          mapGfx.fillStyle(0x3377ee, 0.5);
          mapGfx.fillRect(tx * TILE + 2, ty * TILE + 4, 4, 2);
          mapGfx.fillRect(tx * TILE + 9, ty * TILE + 9, 5, 2);
        }
      }
    }

    // Snow sparkles
    mapGfx.fillStyle(0xffffff, 0.8);
    for (let i = 0; i < 120; i++) {
      const sx = Phaser.Math.Between(0, MAP_W * TILE - 2);
      const sy = Phaser.Math.Between(0, (MAP_H - 3) * TILE - 2);
      const t = this._getTileType(Math.floor(sx / TILE), Math.floor(sy / TILE));
      if (t === SNOW) {
        mapGfx.fillRect(sx, sy, 1, 1);
      }
    }
  }

  _getTileType(tx, ty) {
    // Water strip at bottom 2 rows
    if (ty >= MAP_H - 2) return WATER;

    // Shore transition row
    if (ty === MAP_H - 3) {
      return tx % 3 === 0 ? WATER : SNOW;
    }

    // Village center path (cross-shaped)
    const cx = Math.floor(MAP_W / 2);
    const cy = Math.floor(MAP_H / 2);
    if (ty >= cy - 1 && ty <= cy + 1 && tx >= cx - 8 && tx <= cx + 8) return PATH;
    if (tx >= cx - 1 && tx <= cx + 1 && ty >= cy - 6 && ty <= cy + 6) return PATH;

    // Path from village down to shore
    if (tx >= cx - 1 && tx <= cx + 1 && ty >= cy + 6 && ty <= MAP_H - 3) return PATH;

    return SNOW;
  }

  _buildHouses() {
    const gfx = this.add.graphics();
    const houses = [
      { tx: 20, ty: 12 },
      { tx: 26, ty: 11 },
      { tx: 22, ty: 8  },
      { tx: 30, ty: 13 },
      { tx: 17, ty: 9  }
    ];
    for (const h of houses) {
      const hx = h.tx * TILE;
      const hy = h.ty * TILE;
      // Wall
      gfx.fillStyle(0x7a4a28, 1);
      gfx.fillRect(hx, hy, TILE * 2, TILE * 2);
      // Roof
      gfx.fillStyle(0x4a2a10, 1);
      gfx.fillRect(hx - 2, hy - 4, TILE * 2 + 4, 6);
      gfx.fillStyle(0xffffff, 0.4);
      gfx.fillRect(hx - 2, hy - 4, TILE * 2 + 4, 2); // snow on roof
      // Door
      gfx.fillStyle(0x2a1a08, 1);
      gfx.fillRect(hx + TILE / 2 + 1, hy + TILE, 6, 8);
      // Window
      gfx.fillStyle(0xffee99, 0.8);
      gfx.fillRect(hx + 3, hy + 4, 5, 5);
      gfx.fillRect(hx + TILE + 3, hy + 4, 5, 5);
    }
  }

  _spawnNPCs() {
    const cx = Math.floor(MAP_W / 2) * TILE;
    const cy = Math.floor(MAP_H / 2) * TILE;

    const defs = [
      { id: 'elder',    key: 'npc_elder',    x: cx,          y: cy - TILE,      name: npcData.elder.name },
      { id: 'hunter',   key: 'npc_hunter',   x: cx + 3*TILE, y: (MAP_H/2-5)*TILE, name: npcData.hunter.name },
      { id: 'reindeer', key: 'npc_reindeer', x: 5*TILE,      y: 6*TILE,         name: npcData.reindeer.name },
      { id: 'child',    key: 'npc_child',    x: cx - 2*TILE, y: cy + TILE,      name: npcData.child.name }
    ];

    for (const d of defs) {
      const npc = new NPC(this, d.x, d.y, d.key, d.id, d.name);
      this.npcMap[d.id] = npc;
    }
  }

  _buildUI() {
    this.hud = this.add.text(4, 4, '雪与浪 | WASD移动 E交互', {
      fontSize: '7px',
      fontFamily: 'monospace',
      color: '#aaccee',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#00000066',
      padding: { x: 4, y: 2 }
    }).setScrollFactor(0).setDepth(10);

    this.statusText = this.add.text(4, this.scale.height - 12, '', {
      fontSize: '6px',
      fontFamily: 'monospace',
      color: '#88aacc',
      stroke: '#000000',
      strokeThickness: 2
    }).setScrollFactor(0).setDepth(10);
  }

  update(time, delta) {
    if (this.dialogOpen) return;

    const dt = delta / 1000;
    const spd = this.playerSpeed;

    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown  || this.wasd.left.isDown)  vx = -spd;
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx =  spd;
    if (this.cursors.up.isDown    || this.wasd.up.isDown)    vy = -spd;
    if (this.cursors.down.isDown  || this.wasd.down.isDown)  vy =  spd;

    // Diagonal normalisation
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    // Clamp to map bounds
    const newX = Phaser.Math.Clamp(this.player.x + vx * dt, 8, MAP_W * TILE - 8);
    const newY = Phaser.Math.Clamp(this.player.y + vy * dt, 16, MAP_H * TILE - 4);
    this.player.setPosition(newX, newY);

    // Flip sprite based on direction
    if (vx < 0) this.player.setFlipX(true);
    if (vx > 0) this.player.setFlipX(false);

    // NPC proximity and interaction
    this._updateNPCInteraction();

    // Update status HUD
    this._updateStatus();
  }

  _updateNPCInteraction() {
    let closest = null;
    let closestDist = Infinity;

    for (const [id, npc] of Object.entries(this.npcMap)) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (d < 40 && d < closestDist) {
        closest = npc;
        closestDist = d;
      }
    }

    // Update hints
    for (const [id, npc] of Object.entries(this.npcMap)) {
      if (npc === closest) {
        npc.showHint();
      } else {
        npc.hideHint();
      }
    }

    // E key press
    if (closest && Phaser.Input.Keyboard.JustDown(this.eKey)) {
      this._openDialog(closest.npcId);
    }

    this.nearestNPC = closest;
  }

  _openDialog(npcId) {
    this.dialogOpen = true;
    this.scene.launch('DialogScene', { npcId });
    // Pause input but don't pause update entirely (camera still works)
  }

  onDialogClosed() {
    this.dialogOpen = false;
    TriggerSystem.check(this);
  }

  // 世界事件浮动提示：在世界坐标 (wx, wy) 显示文字后淡出
  showWorldEvent(msg, wx, wy) {
    const txt = this.add.text(wx, wy, msg, {
      fontSize: '7px',
      fontFamily: 'monospace',
      color: '#ffffaa',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#00000099',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setDepth(20);

    this.tweens.add({
      targets: txt,
      y: wy - 30,
      alpha: 0,
      duration: 2500,
      ease: 'Power2',
      onComplete: () => txt.destroy()
    });
  }

  _updateStatus() {
    const elderRel = RelationSystem.get('elder');
    const hunterRel = RelationSystem.get('hunter');
    const helpedReindeer = EventFlags.get('helped_reindeer') ? '✓' : '✗';
    const repelled = EventFlags.get('repelled_attack') ? '✓' : '✗';
    this.statusText.setText(
      `村长好感:${elderRel}  猎人好感:${hunterRel}  助驯鹿:${helpedReindeer}  护村:${repelled}`
    );
  }
}
