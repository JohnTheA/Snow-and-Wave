export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    const g = this.add.graphics();
    const W = 32, H = 48;

    // ── Player: ocean person — teal/cyan body, round head with blue hair ──
    g.fillStyle(0x00bcd4);        // teal body
    g.fillRoundedRect(8, 22, 16, 18, 5);
    g.fillStyle(0x006064);        // darker teal legs
    g.fillRect(9, 36, 6, 10);
    g.fillRect(17, 36, 6, 10);
    g.fillStyle(0x00acc1);        // fin-like arms
    g.fillEllipse(4, 28, 7, 12);
    g.fillEllipse(28, 28, 7, 12);
    g.fillStyle(0x80deea);        // head (light cyan skin)
    g.fillCircle(16, 16, 11);
    g.fillStyle(0x0277bd);        // blue hair
    g.fillEllipse(16, 7, 18, 10);
    g.fillEllipse(8, 12, 8, 8);
    g.fillEllipse(24, 12, 8, 8);
    g.fillStyle(0x004d66);        // eyes
    g.fillCircle(12, 15, 2.5);
    g.fillCircle(20, 15, 2.5);
    g.fillStyle(0xffffff);        // eye highlights
    g.fillCircle(12.8, 14.2, 1);
    g.fillCircle(20.8, 14.2, 1);
    g.fillStyle(0x4dd0e1, 0.7);   // gill marks on cheeks
    g.fillEllipse(7, 17, 5, 3);
    g.fillEllipse(25, 17, 5, 3);
    g.lineStyle(1, 0x4dd0e1, 0.5);
    g.beginPath(); g.moveTo(5, 16); g.lineTo(9, 17); g.strokePath();
    g.beginPath(); g.moveTo(5, 18); g.lineTo(9, 19); g.strokePath();
    g.beginPath(); g.moveTo(27, 16); g.lineTo(23, 17); g.strokePath();
    g.beginPath(); g.moveTo(27, 18); g.lineTo(23, 19); g.strokePath();
    g.generateTexture('player', W, H);
    g.clear();

    // ── NPC Elder: village elder — white robe, white hair, walking stick ──
    g.fillStyle(0xeceff1);        // white robe
    g.fillRoundedRect(7, 22, 18, 20, 5);
    g.fillStyle(0xbdbdbd);        // legs under robe
    g.fillRect(9, 38, 5, 8);
    g.fillRect(17, 38, 5, 8);
    g.fillStyle(0xffe0b2);        // face
    g.fillCircle(16, 16, 10);
    g.fillStyle(0xffffff);        // white hair
    g.fillEllipse(16, 8, 20, 12);
    g.fillEllipse(7, 14, 8, 10);
    g.fillEllipse(25, 14, 8, 10);
    g.fillStyle(0xffe0b2);        // face overlap to clean up hair
    g.fillCircle(16, 16, 10);
    g.fillStyle(0x5d4037);        // kind squinting eyes
    g.fillRoundedRect(10, 14, 4, 2, 1);
    g.fillRoundedRect(18, 14, 4, 2, 1);
    g.fillStyle(0xffffff);        // beard/mustache
    g.fillEllipse(16, 21, 12, 5);
    g.fillStyle(0x8d6e63);        // walking stick
    g.fillRect(27, 18, 3, 28);
    g.fillRect(24, 18, 9, 3);
    g.generateTexture('npc_elder', W, H);
    g.clear();

    // ── NPC Hunter: brown fur coat, strong build, cap, stern face ──
    g.fillStyle(0x6d4c41);        // fur coat body
    g.fillRoundedRect(5, 20, 22, 22, 4);
    g.fillStyle(0x4e342e, 0.5);   // fur texture stripes
    g.fillRect(5, 22, 22, 3);
    g.fillRect(5, 27, 22, 3);
    g.fillRect(5, 32, 22, 3);
    g.fillRect(5, 37, 22, 3);
    g.fillStyle(0x4e342e);        // legs
    g.fillRect(7, 38, 7, 10);
    g.fillRect(18, 38, 7, 10);
    g.fillStyle(0x6d4c41);        // arms — strong wide
    g.fillRoundedRect(1, 21, 6, 16, 3);
    g.fillRoundedRect(25, 21, 6, 16, 3);
    g.fillStyle(0xffe0b2);        // face
    g.fillCircle(16, 15, 10);
    g.fillStyle(0x4e342e);        // cap brim
    g.fillRect(5, 9, 22, 4);
    g.fillStyle(0x3e2723);        // cap top
    g.fillRoundedRect(7, 4, 18, 8, 3);
    g.fillStyle(0x333333);        // stern eyes (sharp/triangular look)
    g.fillTriangle(10, 16, 14, 16, 12, 13);
    g.fillTriangle(18, 16, 22, 16, 20, 13);
    g.fillStyle(0x6d4c41);        // eyebrow furrowed
    g.fillRect(10, 12, 4, 2);
    g.fillRect(18, 12, 4, 2);
    g.generateTexture('npc_hunter', W, H);
    g.clear();

    // ── NPC Reindeer: brown oval body, round head, antlers, red nose ──
    g.fillStyle(0x8d6e63);        // body
    g.fillEllipse(16, 30, 22, 16);
    g.fillStyle(0xa1887f);        // head
    g.fillCircle(16, 16, 9);
    g.fillStyle(0xd7ccc8);        // snout
    g.fillEllipse(16, 21, 10, 6);
    g.fillStyle(0xff5252);        // red nose
    g.fillCircle(16, 22, 3.5);
    g.fillStyle(0x3e2723);        // eyes
    g.fillCircle(11, 13, 2);
    g.fillCircle(21, 13, 2);
    g.fillStyle(0xffffff);        // eye shine
    g.fillCircle(11.7, 12.3, 0.8);
    g.fillCircle(21.7, 12.3, 0.8);
    g.lineStyle(3, 0x5d4037);     // antlers
    g.beginPath(); g.moveTo(11, 8); g.lineTo(6, 2); g.strokePath();
    g.beginPath(); g.moveTo(6, 2); g.lineTo(2, 4); g.strokePath();
    g.beginPath(); g.moveTo(6, 2); g.lineTo(4, -1); g.strokePath();
    g.beginPath(); g.moveTo(21, 8); g.lineTo(26, 2); g.strokePath();
    g.beginPath(); g.moveTo(26, 2); g.lineTo(30, 4); g.strokePath();
    g.beginPath(); g.moveTo(26, 2); g.lineTo(28, -1); g.strokePath();
    g.fillStyle(0x6d4c41);        // legs
    g.fillRect(8, 36, 4, 12);
    g.fillRect(13, 36, 4, 12);
    g.fillRect(19, 36, 4, 12);
    g.generateTexture('npc_reindeer', W, H);
    g.clear();

    // ── NPC Child: pink jacket, pigtails, big round eyes, smile ──
    g.fillStyle(0xf48fb1);        // pink jacket body
    g.fillRoundedRect(9, 24, 14, 16, 5);
    g.fillStyle(0xce93d8);        // legs (purple leggings)
    g.fillRect(10, 36, 5, 12);
    g.fillRect(17, 36, 5, 12);
    g.fillStyle(0xf48fb1);        // arms
    g.fillRoundedRect(4, 25, 6, 12, 3);
    g.fillRoundedRect(22, 25, 6, 12, 3);
    g.fillStyle(0xff4081);        // scarf
    g.fillRect(9, 24, 14, 4);
    g.fillStyle(0xffe0b2);        // face
    g.fillCircle(16, 16, 10);
    g.fillStyle(0xffcc02);        // pigtail hair left
    g.fillCircle(6, 13, 7);
    g.fillStyle(0xffcc02);        // pigtail hair right
    g.fillCircle(26, 13, 7);
    g.fillStyle(0xffe0b2);        // face again to overlap hair
    g.fillCircle(16, 16, 10);
    g.fillStyle(0xffcc02);        // hair top
    g.fillEllipse(16, 8, 16, 8);
    g.fillStyle(0x4a148c);        // big round eyes
    g.fillCircle(12, 15, 3.2);
    g.fillCircle(20, 15, 3.2);
    g.fillStyle(0xffffff);        // eye whites/shine
    g.fillCircle(12.8, 14.2, 1.2);
    g.fillCircle(20.8, 14.2, 1.2);
    g.lineStyle(1.5, 0xd84315);   // smile
    g.beginPath(); g.arc(16, 18, 3.5, 0.2, Math.PI - 0.2); g.strokePath();
    g.generateTexture('npc_child', W, H);
    g.clear();

    g.destroy();
    this.scene.start('WorldScene');
  }
}
