export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    const g = this.add.graphics();
    const W = 24, H = 32;

    const make = (key, drawFn) => {
      g.clear();
      drawFn(g);
      g.generateTexture(key, W, H);
    };

    // ── 主角：海洋人（蓝绿色，有海洋纹路）─────────────────────────
    make('player', g => {
      // 身体
      g.fillStyle(0x00bcd4); g.fillRoundedRect(6, 14, 12, 12, 3);
      // 头
      g.fillStyle(0x80deea); g.fillCircle(12, 10, 7);
      // 眼睛
      g.fillStyle(0x004d66); g.fillCircle(9, 9, 2); g.fillCircle(15, 9, 2);
      g.fillStyle(0xffffff); g.fillCircle(9.5, 8.5, 0.8); g.fillCircle(15.5, 8.5, 0.8);
      // 腮帮（海洋纹路）
      g.fillStyle(0x4dd0e1, 0.6); g.fillRect(4, 11, 3, 2); g.fillRect(17, 11, 3, 2);
      // 腿
      g.fillStyle(0x0097a7); g.fillRect(7, 25, 4, 6); g.fillRect(13, 25, 4, 6);
      // 手臂
      g.fillRect(2, 15, 4, 8); g.fillRect(18, 15, 4, 8);
    });

    // ── 村长（白发白袍，慈祥）──────────────────────────────────────
    make('npc_elder', g => {
      // 袍子
      g.fillStyle(0xeceff1); g.fillRoundedRect(5, 14, 14, 14, 3);
      // 头
      g.fillStyle(0xffe0b2); g.fillCircle(12, 10, 7);
      // 白发
      g.fillStyle(0xffffff); g.fillCircle(12, 5, 5);
      g.fillRect(5, 7, 5, 5); g.fillRect(14, 7, 5, 5);
      // 眼睛（眯眼）
      g.fillStyle(0x5d4037);
      g.fillRect(8, 9, 3, 1.5); g.fillRect(13, 9, 3, 1.5);
      // 胡须
      g.fillStyle(0xffffff); g.fillRect(8, 13, 8, 2);
      // 拐杖
      g.fillStyle(0x8d6e63); g.fillRect(20, 12, 2, 16);
      g.fillRect(18, 12, 6, 2);
      // 腿
      g.fillStyle(0xbdbdbd); g.fillRect(7, 27, 4, 5); g.fillRect(13, 27, 4, 5);
    });

    // ── 猎人（皮草，强壮）─────────────────────────────────────────
    make('npc_hunter', g => {
      // 皮草外套
      g.fillStyle(0x6d4c41); g.fillRoundedRect(4, 14, 16, 13, 3);
      // 皮草纹理
      g.fillStyle(0x4e342e, 0.4);
      g.fillRect(4, 15, 16, 2); g.fillRect(4, 19, 16, 2); g.fillRect(4, 23, 16, 2);
      // 头
      g.fillStyle(0xffe0b2); g.fillCircle(12, 10, 7);
      // 帽子
      g.fillStyle(0x4e342e); g.fillRect(5, 4, 14, 5); g.fillRect(3, 8, 18, 3);
      // 眼睛（锐利）
      g.fillStyle(0x333333);
      g.fillTriangle(7, 10, 11, 10, 9, 8); g.fillTriangle(13, 10, 17, 10, 15, 8);
      // 弓（装饰）
      g.fillStyle(0x8d6e63); g.fillRect(21, 8, 2, 18);
      g.lineStyle(1.5, 0x5d4037); g.beginPath();
      g.moveTo(21, 8); g.lineTo(23, 16); g.lineTo(21, 26); g.strokePath();
      // 腿
      g.fillStyle(0x4e342e); g.fillRect(6, 26, 5, 6); g.fillRect(13, 26, 5, 6);
    });

    // ── 驯鹿（棕色，鹿角）────────────────────────────────────────
    make('npc_reindeer', g => {
      // 身体
      g.fillStyle(0x8d6e63); g.fillEllipse(12, 20, 16, 12);
      // 头
      g.fillStyle(0xa1887f); g.fillCircle(12, 11, 6);
      // 鹿角
      g.lineStyle(2, 0x5d4037);
      g.beginPath(); g.moveTo(9, 6); g.lineTo(5, 1); g.strokePath();
      g.beginPath(); g.moveTo(5, 1); g.lineTo(2, 3); g.strokePath();
      g.beginPath(); g.moveTo(5, 1); g.lineTo(4, -1); g.strokePath();
      g.beginPath(); g.moveTo(15, 6); g.lineTo(19, 1); g.strokePath();
      g.beginPath(); g.moveTo(19, 1); g.lineTo(22, 3); g.strokePath();
      g.beginPath(); g.moveTo(19, 1); g.lineTo(20, -1); g.strokePath();
      // 鼻子（红色）
      g.fillStyle(0xff5252); g.fillCircle(12, 14, 2.5);
      // 眼睛
      g.fillStyle(0x3e2723); g.fillCircle(9, 10, 1.5); g.fillCircle(15, 10, 1.5);
      // 腿
      g.fillStyle(0x6d4c41);
      g.fillRect(6, 25, 3, 7); g.fillRect(10, 25, 3, 7);
      g.fillRect(14, 25, 3, 7); // 只画3条腿，透视感
    });

    // ── 雪娃（粉色小女孩）────────────────────────────────────────
    make('npc_child', g => {
      // 雪地外套（粉色）
      g.fillStyle(0xf48fb1); g.fillRoundedRect(7, 16, 10, 11, 3);
      // 头
      g.fillStyle(0xffe0b2); g.fillCircle(12, 10, 6);
      // 双马尾
      g.fillStyle(0xffcc02);
      g.fillCircle(6, 8, 4); g.fillCircle(18, 8, 4);
      g.fillStyle(0xffe0b2); g.fillCircle(12, 10, 6); // 覆盖中间
      // 围巾
      g.fillStyle(0xff4081); g.fillRect(7, 16, 10, 3);
      // 眼睛（大眼睛）
      g.fillStyle(0x4a148c); g.fillCircle(9.5, 9.5, 2.2); g.fillCircle(14.5, 9.5, 2.2);
      g.fillStyle(0xffffff); g.fillCircle(10, 9, 0.8); g.fillCircle(15, 9, 0.8);
      // 笑脸
      g.lineStyle(1.2, 0xd84315);
      g.beginPath(); g.arc(12, 12, 2.5, 0.2, Math.PI - 0.2); g.strokePath();
      // 腿
      g.fillStyle(0xce93d8); g.fillRect(8, 26, 4, 6); g.fillRect(12, 26, 4, 6);
    });

    g.destroy();
    this.scene.start('WorldScene');
  }
}
