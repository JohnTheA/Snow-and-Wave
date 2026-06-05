import EventFlags from '../systems/EventFlags.js';
import RelationSystem from '../systems/RelationSystem.js';
import TriggerSystem from '../systems/TriggerSystem.js';
import NPC from '../entities/NPC.js';
import npcData from '../data/npcs.js';

const TILE = 32;
const MAP_W = 30;
const MAP_H = 20;

// Tile indices
const SNOW  = 0;
const PATH  = 1;
const WATER = 2;
const HOUSE = 3;

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
    this.playerSpeed = 160;

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
    const mapGfx = this.add.graphics();

    for (let ty = 0; ty < MAP_H; ty++) {
      for (let tx = 0; tx < MAP_W; tx++) {
        const t = this._getTileType(tx, ty);
        const px = tx * TILE;
        const py = ty * TILE;

        switch (t) {
          case SNOW: {
            // Smooth snow — light blue-white base
            mapGfx.fillStyle(0xddeeff, 1);
            mapGfx.fillRect(px, py, TILE, TILE);
            // Gentle highlight variation: top-left corner brightening
            mapGfx.fillStyle(0xffffff, 0.18);
            mapGfx.fillRect(px, py, TILE, TILE / 3);
            // Subtle cool shadow at bottom
            mapGfx.fillStyle(0xaaccdd, 0.15);
            mapGfx.fillRect(px, py + TILE * 2 / 3, TILE, TILE / 3);
            break;
          }
          case PATH: {
            // Warm gray path — smooth
            mapGfx.fillStyle(0xb0bec5, 1);
            mapGfx.fillRect(px, py, TILE, TILE);
            // Subtle center highlight
            mapGfx.fillStyle(0xcfd8dc, 0.4);
            mapGfx.fillRect(px + 4, py + 4, TILE - 8, TILE - 8);
            break;
          }
          case WATER: {
            // Rich deep blue
            mapGfx.fillStyle(0x1565c0, 1);
            mapGfx.fillRect(px, py, TILE, TILE);
            // Wave accent — lighter blue stripe
            mapGfx.fillStyle(0x1e88e5, 0.6);
            mapGfx.fillRect(px + 2, py + 6, TILE - 6, 5);
            mapGfx.fillRect(px + 6, py + 18, TILE - 10, 4);
            // Foam highlight
            mapGfx.fillStyle(0xbbdefb, 0.3);
            mapGfx.fillRect(px + 4, py + 4, TILE - 8, 2);
            break;
          }
          default: {
            mapGfx.fillStyle(0xddeeff, 1);
            mapGfx.fillRect(px, py, TILE, TILE);
          }
        }
      }
    }

    // Soft white snow sparkles scattered over snow tiles
    mapGfx.fillStyle(0xffffff, 0.75);
    for (let i = 0; i < 200; i++) {
      const sx = Phaser.Math.Between(0, MAP_W * TILE - 3);
      const sy = Phaser.Math.Between(0, (MAP_H - 3) * TILE - 3);
      const t = this._getTileType(Math.floor(sx / TILE), Math.floor(sy / TILE));
      if (t === SNOW) {
        mapGfx.fillRect(sx, sy, 2, 2);
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
      { tx: 10, ty: 6  },
      { tx: 13, ty: 5  },
      { tx: 11, ty: 4  },
      { tx: 15, ty: 7  },
      { tx: 8,  ty: 5  }
    ];
    for (const h of houses) {
      const hx = h.tx * TILE;
      const hy = h.ty * TILE;
      const hw = TILE * 2;
      const hh = TILE * 2;

      // Wall — warm wood color
      gfx.fillStyle(0xc8a882, 1);
      gfx.fillRoundedRect(hx, hy, hw, hh, 4);
      // Wall shading — right side darker
      gfx.fillStyle(0xa07850, 0.25);
      gfx.fillRect(hx + hw * 0.6, hy, hw * 0.4, hh);

      // Roof — dark triangle via polygon
      gfx.fillStyle(0x5d3a1a, 1);
      gfx.fillTriangle(
        hx - 6, hy,
        hx + hw / 2, hy - TILE * 0.9,
        hx + hw + 6, hy
      );
      // Snow on roof
      gfx.fillStyle(0xeef5ff, 0.85);
      gfx.fillTriangle(
        hx - 2, hy - 2,
        hx + hw / 2, hy - TILE * 0.9 + 4,
        hx + hw + 2, hy - 2
      );

      // Door — centered, dark
      const doorW = 10;
      const doorH = 16;
      const doorX = hx + hw / 2 - doorW / 2;
      const doorY = hy + hh - doorH;
      gfx.fillStyle(0x3e2000, 1);
      gfx.fillRoundedRect(doorX, doorY, doorW, doorH, 3);
      gfx.fillStyle(0xd4a855, 0.6);
      gfx.fillCircle(doorX + doorW - 3, doorY + doorH / 2, 1.5); // door knob

      // Windows — warm glow
      gfx.fillStyle(0xfff9c4, 0.85);
      gfx.fillRoundedRect(hx + 5, hy + 6, 10, 10, 2);
      gfx.fillRoundedRect(hx + hw - 15, hy + 6, 10, 10, 2);
      // Window cross
      gfx.fillStyle(0xc8a882, 0.5);
      gfx.fillRect(hx + 5, hy + 10, 10, 2);
      gfx.fillRect(hx + 10, hy + 6, 2, 10);
      gfx.fillRect(hx + hw - 15, hy + 10, 10, 2);
      gfx.fillRect(hx + hw - 10, hy + 6, 2, 10);
    }
  }

  _spawnNPCs() {
    const cx = Math.floor(MAP_W / 2) * TILE;
    const cy = Math.floor(MAP_H / 2) * TILE;

    const defs = [
      { id: 'elder',    key: 'npc_elder',    x: cx,            y: cy - TILE,          name: npcData.elder.name },
      { id: 'hunter',   key: 'npc_hunter',   x: cx + 3 * TILE, y: (MAP_H / 2 - 5) * TILE, name: npcData.hunter.name },
      { id: 'reindeer', key: 'npc_reindeer', x: 5 * TILE,      y: 6 * TILE,           name: npcData.reindeer.name },
      { id: 'child',    key: 'npc_child',    x: cx - 2 * TILE, y: cy + TILE,          name: npcData.child.name }
    ];

    for (const d of defs) {
      const npc = new NPC(this, d.x, d.y, d.key, d.id, d.name);
      this.npcMap[d.id] = npc;
    }
  }

  _buildUI() {
    this.hud = this.add.text(6, 6, '雪与浪 | WASD移动 E交互', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#aaccee',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#00000066',
      padding: { x: 6, y: 3 }
    }).setScrollFactor(0).setDepth(10);

    this.statusText = this.add.text(6, this.scale.height - 20, '', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
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
    const newX = Phaser.Math.Clamp(this.player.x + vx * dt, 16, MAP_W * TILE - 16);
    const newY = Phaser.Math.Clamp(this.player.y + vy * dt, 32, MAP_H * TILE - 8);
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
      if (d < 60 && d < closestDist) {
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
  }

  onDialogClosed() {
    this.dialogOpen = false;
    TriggerSystem.check(this);
  }

  // World event floating text: show at world coords (wx, wy) then fade out
  showWorldEvent(msg, wx, wy) {
    const txt = this.add.text(wx, wy, msg, {
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffaa',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#00000099',
      padding: { x: 5, y: 3 }
    }).setOrigin(0.5).setDepth(20);

    this.tweens.add({
      targets: txt,
      y: wy - 40,
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
