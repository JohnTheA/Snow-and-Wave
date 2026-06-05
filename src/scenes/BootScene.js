export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    const g = this.add.graphics();

    // Helper to render a 16x16 pixel array into a texture
    const makeTex = (key, pixels) => {
      g.clear();
      pixels.forEach((row, y) => {
        row.forEach((col, x) => {
          if (col) {
            g.fillStyle(col, 1);
            g.fillRect(x, y, 1, 1);
          }
        });
      });
      g.generateTexture(key, 16, 16);
    };

    // ── player (ocean person) ─────────────────────────────────────
    const T = 0x00d4ff; // teal body
    const S = 0x0080aa; // dark teal shadow
    const F = 0xffe0b2; // face/skin
    const H = 0x004488; // hair dark blue
    const _ = null;
    makeTex('player', [
      [_,_,_,_,_,_,H,H,H,H,_,_,_,_,_,_],
      [_,_,_,_,_,H,F,F,F,F,H,_,_,_,_,_],
      [_,_,_,_,_,H,F,F,F,F,H,_,_,_,_,_],
      [_,_,_,_,_,H,F,0x222255,F,0x222255,F,H,_,_,_,_],
      [_,_,_,_,_,H,F,F,F,F,H,_,_,_,_,_],
      [_,_,_,_,_,_,H,H,H,H,_,_,_,_,_,_],
      [_,_,_,_,T,T,T,T,T,T,T,T,_,_,_,_],
      [_,_,_,S,T,T,T,T,T,T,T,T,S,_,_,_],
      [_,_,_,S,T,T,T,T,T,T,T,T,S,_,_,_],
      [_,_,_,S,T,T,T,T,T,T,T,T,S,_,_,_],
      [_,_,S,S,T,T,T,T,T,T,T,T,S,S,_,_],
      [_,_,S,_,_,_,T,T,T,T,_,_,_,S,_,_],
      [_,_,S,_,_,_,T,T,T,T,_,_,_,S,_,_],
      [_,_,_,_,_,_,S,S,S,S,_,_,_,_,_,_],
      [_,_,_,_,_,_,S,_,_,S,_,_,_,_,_,_],
      [_,_,_,_,_,_,S,_,_,S,_,_,_,_,_,_],
    ]);

    // ── elder ─────────────────────────────────────────────────────
    const W = 0xeeeeee; // white robe
    const GR= 0xaaaaaa; // gray
    const EF= 0xffe0b2;
    makeTex('npc_elder', [
      [_,_,_,_,_,_,GR,GR,GR,GR,_,_,_,_,_,_],
      [_,_,_,_,_,GR,EF,EF,EF,EF,GR,_,_,_,_,_],
      [_,_,_,_,_,GR,EF,EF,EF,EF,GR,_,_,_,_,_],
      [_,_,_,_,_,GR,GR,GR,GR,GR,GR,_,_,_,_,_],
      [_,_,_,_,_,GR,EF,EF,EF,EF,GR,_,_,_,_,_],
      [_,_,_,_,_,_,GR,GR,GR,GR,_,_,_,_,_,_],
      [_,_,_,_,W,W,W,W,W,W,W,W,_,_,_,_],
      [_,_,_,GR,W,W,W,W,W,W,W,W,GR,_,_,_],
      [_,_,_,GR,W,W,W,W,W,W,W,W,GR,_,_,_],
      [_,_,_,GR,W,W,W,W,W,W,W,W,GR,_,_,_],
      [_,_,GR,W,W,W,W,W,W,W,W,W,W,GR,_,_],
      [_,_,GR,_,_,W,W,W,W,W,W,_,_,GR,_,_],
      [_,_,GR,_,_,W,W,W,W,W,W,_,_,GR,_,_],
      [_,_,_,_,_,GR,GR,GR,GR,GR,GR,_,_,_,_,_],
      [_,_,_,_,_,GR,_,_,_,_,GR,_,_,_,_,_],
      [_,_,_,_,_,GR,_,_,_,_,GR,_,_,_,_,_],
    ]);

    // ── hunter ───────────────────────────────────────────────────
    const BR= 0x8B4513;
    const LB= 0xcd853f;
    const HF= 0xffe0b2;
    makeTex('npc_hunter', [
      [_,_,_,_,_,_,BR,BR,BR,BR,_,_,_,_,_,_],
      [_,_,_,_,_,BR,HF,HF,HF,HF,BR,_,_,_,_,_],
      [_,_,_,_,_,BR,HF,HF,HF,HF,BR,_,_,_,_,_],
      [_,_,_,_,_,BR,HF,0x333,HF,0x333,HF,BR,_,_,_,_],
      [_,_,_,_,_,BR,HF,HF,HF,HF,BR,_,_,_,_,_],
      [_,_,_,_,_,_,BR,BR,BR,BR,_,_,_,_,_,_],
      [_,_,_,_,LB,LB,LB,LB,LB,LB,LB,LB,_,_,_,_],
      [_,_,_,BR,LB,LB,LB,LB,LB,LB,LB,LB,BR,_,_,_],
      [_,_,_,BR,LB,LB,LB,LB,LB,LB,LB,LB,BR,_,_,_],
      [_,_,_,BR,LB,LB,LB,LB,LB,LB,LB,LB,BR,_,_,_],
      [_,_,BR,BR,LB,LB,LB,LB,LB,LB,LB,LB,BR,BR,_,_],
      [_,_,BR,_,_,_,LB,LB,LB,LB,_,_,_,BR,_,_],
      [_,_,BR,_,_,_,LB,LB,LB,LB,_,_,_,BR,_,_],
      [_,_,_,_,_,_,BR,BR,BR,BR,_,_,_,_,_,_],
      [_,_,_,_,_,_,BR,_,_,BR,_,_,_,_,_,_],
      [_,_,_,_,_,_,BR,_,_,BR,_,_,_,_,_,_],
    ]);

    // ── reindeer ──────────────────────────────────────────────────
    const RB= 0x8B5E3C;
    const RD= 0x5C3A1E;
    const RN= 0xd2a679;
    makeTex('npc_reindeer', [
      [_,_,RD,_,_,_,_,_,_,_,_,_,RD,_,_,_],
      [_,RD,RD,RD,_,_,_,_,_,_,RD,RD,RD,_,_,_],
      [_,_,RD,RD,_,_,_,_,_,_,RD,RD,_,_,_,_],
      [_,_,_,RN,RN,RN,RN,RN,RN,RN,RN,_,_,_,_,_],
      [_,_,_,RN,RB,RB,RB,RB,RB,RB,RN,_,_,_,_,_],
      [_,_,_,RB,RB,RB,RB,RB,RB,RB,RB,_,_,_,_,_],
      [_,_,_,RB,RB,RB,RB,RB,RB,RB,RB,_,_,_,_,_],
      [_,_,RB,RB,RB,RB,RB,RB,RB,RB,RB,RB,_,_,_,_],
      [_,_,RB,RB,RB,RB,RB,RB,RB,RB,RB,RB,_,_,_,_],
      [_,_,RB,RB,RB,RB,RB,RB,RB,RB,RB,RB,_,_,_,_],
      [_,_,RD,RB,RB,RB,RB,RB,RB,RB,RB,RD,_,_,_,_],
      [_,_,RD,RD,_,_,RB,RB,RB,RB,RD,RD,_,_,_,_],
      [_,_,_,RD,_,_,RD,RD,RD,RD,_,RD,_,_,_,_],
      [_,_,_,RD,_,_,RD,_,_,RD,_,RD,_,_,_,_],
      [_,_,_,RD,_,_,RD,_,_,RD,_,RD,_,_,_,_],
      [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    ]);

    // ── child ─────────────────────────────────────────────────────
    const CF= 0xffe0b2;
    const CJ= 0xff6699; // pink jacket
    const CS= 0xcc3366;
    makeTex('npc_child', [
      [_,_,_,_,_,_,CS,CS,CS,CS,_,_,_,_,_,_],
      [_,_,_,_,_,CS,CF,CF,CF,CF,CS,_,_,_,_,_],
      [_,_,_,_,_,CS,CF,CF,CF,CF,CS,_,_,_,_,_],
      [_,_,_,_,_,CS,CF,0x333,CF,0x333,CF,CS,_,_,_,_],
      [_,_,_,_,_,CS,CF,CF,CF,CF,CS,_,_,_,_,_],
      [_,_,_,_,_,_,CS,CS,CS,CS,_,_,_,_,_,_],
      [_,_,_,_,_,CJ,CJ,CJ,CJ,CJ,CJ,_,_,_,_,_],
      [_,_,_,CS,CJ,CJ,CJ,CJ,CJ,CJ,CJ,CS,_,_,_,_],
      [_,_,_,CS,CJ,CJ,CJ,CJ,CJ,CJ,CJ,CS,_,_,_,_],
      [_,_,_,CS,CJ,CJ,CJ,CJ,CJ,CJ,CJ,CS,_,_,_,_],
      [_,_,CS,CJ,CJ,CJ,CJ,CJ,CJ,CJ,CJ,CJ,CS,_,_,_],
      [_,_,_,_,_,_,CJ,CJ,CJ,CJ,_,_,_,_,_,_],
      [_,_,_,_,_,_,CJ,CJ,CJ,CJ,_,_,_,_,_,_],
      [_,_,_,_,_,_,CS,CS,CS,CS,_,_,_,_,_,_],
      [_,_,_,_,_,_,CS,_,_,CS,_,_,_,_,_,_],
      [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    ]);

    // ── tiles tileset (64x16: 4 tiles side by side) ───────────────
    // tile 0 = snow, tile 1 = path, tile 2 = water, tile 3 = house base
    g.clear();
    // snow tile (0)
    g.fillStyle(0xddeeff, 1); g.fillRect(0, 0, 16, 16);
    g.fillStyle(0xffffff, 1); g.fillRect(2, 2, 2, 2); g.fillRect(9, 5, 2, 2); g.fillRect(5, 10, 2, 2);
    // path tile (16)
    g.fillStyle(0x99aabb, 1); g.fillRect(16, 0, 16, 16);
    g.fillStyle(0x7788aa, 1); g.fillRect(18, 3, 2, 2); g.fillRect(24, 9, 2, 2);
    // water tile (32)
    g.fillStyle(0x1155cc, 1); g.fillRect(32, 0, 16, 16);
    g.fillStyle(0x3377ee, 1); g.fillRect(33, 3, 3, 2); g.fillRect(37, 8, 4, 2); g.fillRect(42, 4, 3, 2);
    g.fillStyle(0x88bbff, 1); g.fillRect(34, 4, 1, 1); g.fillRect(40, 9, 1, 1);
    // house tile (48)
    g.fillStyle(0x8B5E3C, 1); g.fillRect(48, 0, 16, 16);
    g.fillStyle(0x5C3A1E, 1); g.fillRect(50, 2, 5, 6); g.fillRect(57, 2, 5, 6);
    g.fillStyle(0xffe0b2, 1); g.fillRect(52, 8, 8, 6);
    g.generateTexture('tiles', 64, 16);

    g.destroy();
    this.scene.start('WorldScene');
  }
}
