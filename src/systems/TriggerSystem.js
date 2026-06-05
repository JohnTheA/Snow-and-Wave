import EventFlags from './EventFlags.js';
import RelationSystem from './RelationSystem.js';

const TriggerSystem = {
  check(scene) {
    const npcs = scene.npcMap;
    if (!npcs) return;

    // If helped_reindeer: reindeer gets green tint
    const reindeer = npcs['reindeer'];
    if (reindeer) {
      if (EventFlags.get('helped_reindeer')) {
        reindeer.setTint(0x88ff88);
        reindeer.nameText.setColor('#88ff88');
      }
    }

    // If elder relation >= 30: elder gets warm yellow name
    const elder = npcs['elder'];
    if (elder) {
      if (RelationSystem.get('elder') >= 30) {
        elder.nameText.setColor('#ffdd44');
        elder.setTint(0xffffaa);
      }
    }

    // If repelled_attack: show guardian text
    if (EventFlags.get('repelled_attack') && !scene.guardianText) {
      scene.guardianText = scene.add.text(
        scene.villageEntranceX || 400,
        scene.villageEntranceY || 320,
        '村庄守护者',
        { fontSize: '10px', fontFamily: 'monospace', color: '#ffcc00',
          stroke: '#000000', strokeThickness: 3 }
      ).setOrigin(0.5);
    }

    // If hunter relation >= 20: hunter becomes friendlier (tint warm)
    const hunter = npcs['hunter'];
    if (hunter && RelationSystem.get('hunter') >= 20) {
      hunter.nameText.setColor('#ffaa55');
    }
  }
};

export default TriggerSystem;
