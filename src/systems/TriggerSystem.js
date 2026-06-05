import EventFlags from './EventFlags.js';
import RelationSystem from './RelationSystem.js';

const TriggerSystem = {
  check(scene) {
    const npcs = scene.npcMap;
    if (!npcs) return;

    const elderRel   = RelationSystem.get('elder');
    const hunterRel  = RelationSystem.get('hunter');
    const helpedReindeer = EventFlags.get('helped_reindeer');
    const hunterAllied   = EventFlags.get('hunter_allied');
    const repelled       = EventFlags.get('repelled_attack');

    // ── 驯鹿 ──────────────────────────────────────────────────────────
    const reindeer = npcs['reindeer'];
    if (reindeer) {
      if (helpedReindeer) {
        reindeer.setTint(0x88ff88);
        reindeer.nameText.setColor('#88ff88');
      }
    }

    // ── 猎人 ──────────────────────────────────────────────────────────
    const hunter = npcs['hunter'];
    if (hunter) {
      // 玩家帮助了驯鹿 → 猎人主动提起，好感+
      if (helpedReindeer && !EventFlags.get('hunter_noticed_reindeer')) {
        EventFlags.set('hunter_noticed_reindeer');
        RelationSystem.add('hunter', 15);
        scene.showWorldEvent('猎人阿龙注意到你照顾了驯鹿…', hunter.x, hunter.y - 40);
      }
      if (hunterRel >= 20) {
        hunter.nameText.setColor('#ffaa55');
        hunter.setTint(0xffddaa);
      }
      if (hunterAllied) {
        hunter.nameText.setColor('#ffdd00');
      }
    }

    // ── 村长 ──────────────────────────────────────────────────────────
    const elder = npcs['elder'];
    if (elder) {
      // 猎人结盟后 → 村长感知到，好感再增
      if (hunterAllied && !EventFlags.get('elder_heard_alliance')) {
        EventFlags.set('elder_heard_alliance');
        RelationSystem.add('elder', 15);
        scene.showWorldEvent('村长听说你与猎人阿龙结盟了…', elder.x, elder.y - 40);
      }
      // 帮助驯鹿 → 村长也感激
      if (helpedReindeer && !EventFlags.get('elder_heard_reindeer')) {
        EventFlags.set('elder_heard_reindeer');
        RelationSystem.add('elder', 10);
        scene.showWorldEvent('村长听说你保护了小驯鹿…', elder.x, elder.y - 40);
      }
      if (elderRel >= 30) {
        elder.nameText.setColor('#ffdd44');
        elder.setTint(0xffffaa);
      }
      if (elderRel >= 60) {
        elder.nameText.setColor('#ffffff');
        elder.setTint(0xffffff);
      }
    }

    // ── 雪娃 ──────────────────────────────────────────────────────────
    const child = npcs['child'];
    if (child) {
      // 击退进攻后，雪娃变得非常开心
      if (repelled && !EventFlags.get('child_celebration')) {
        EventFlags.set('child_celebration');
        child.setTint(0xffaaff);
        child.nameText.setColor('#ffaaff');
        scene.showWorldEvent('雪娃欢呼起来：村子安全了！', child.x, child.y - 40);
      }
      // 村长信任高 → 雪娃对你也更友好
      if (elderRel >= 40 && !EventFlags.get('child_warmed')) {
        EventFlags.set('child_warmed');
        child.nameText.setColor('#ffccee');
        scene.showWorldEvent('雪娃跑过来：村长爷爷说你是好人！', child.x, child.y - 40);
      }
    }

    // ── 击退进攻：全村视觉变化 ────────────────────────────────────────
    if (repelled && !scene.guardianText) {
      scene.guardianText = scene.add.text(
        scene.villageEntranceX,
        scene.villageEntranceY,
        '⚔ 村庄守护者',
        { fontSize: '10px', fontFamily: 'monospace', color: '#ffcc00',
          stroke: '#000000', strokeThickness: 3 }
      ).setOrigin(0.5).setDepth(5);
      // 全体NPC暖色
      for (const npc of Object.values(npcs)) {
        if (!npc.tintTopLeft || npc.tintTopLeft === 0xffffff) {
          npc.setTint(0xffeecc);
        }
      }
    }
  }
};

export default TriggerSystem;
