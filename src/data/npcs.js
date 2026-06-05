import EventFlags from '../systems/EventFlags.js';
import RelationSystem from '../systems/RelationSystem.js';

// getStart(npcId) 根据当前世界状态决定从哪个节点开始对话
function getStart(npcId) {
  switch (npcId) {
    case 'elder':
      if (EventFlags.get('repelled_attack')) return 'after_repel';
      if (RelationSystem.get('elder') >= 40)  return 'trusted';
      if (RelationSystem.get('elder') >= 20)  return 'warming';
      return 'intro';
    case 'hunter':
      if (EventFlags.get('hunter_allied'))           return 'allied';
      if (EventFlags.get('hunter_noticed_reindeer')) return 'noticed_reindeer';
      if (RelationSystem.get('hunter') >= 20)        return 'warming';
      return 'intro';
    case 'reindeer':
      if (EventFlags.get('helped_reindeer')) return 'friend';
      return 'intro';
    case 'child':
      if (EventFlags.get('child_celebration')) return 'celebrate';
      if (EventFlags.get('child_warmed'))      return 'warmed';
      return 'intro';
    default:
      return 'intro';
  }
}

const npcData = {
  elder: {
    name: '村长老爷爷',
    getStart: () => getStart('elder'),
    nodes: {
      // ── 初次见面 ────────────────────────────────────────────────────
      intro: {
        text: '老人眯起眼睛打量着你。\n"来者何人？你的气息……不像是雪原之人。"',
        choices: [
          { label: '我来自大海之下', next: 'ocean_origin', action: null },
          { label: '我只是路过的旅人', next: 'traveler', action: null }
        ]
      },
      ocean_origin: {
        text: '村长抚须，眼神变得温和。\n"海洋之子，久闻其名。\n欢迎来到雪鹿村，这里的冬天很长，但人情很暖。"',
        choices: [
          { label: '我想了解这个村子', next: 'village_info', action: 'addRelation:elder:20' },
          { label: '村子最近有什么异常？', next: 'village_trouble', action: 'addRelation:elder:10' }
        ]
      },
      traveler: {
        text: '村长微微点头。\n"路过也好，陌生人。雪原凶险，注意安全。"',
        choices: [
          { label: '能告诉我这里的情况吗？', next: 'village_info', action: null },
          { label: '再见', next: null, action: null }
        ]
      },
      village_info: {
        text: '"我们村与驯鹿相依为命已有百年。\n最近北边有狼群出没，猎人阿龙一直在追踪。\n去和他说说话吧，年轻人。"',
        choices: [
          { label: '我会去找他的，谢谢您', next: null, action: 'addRelation:elder:10' },
          { label: '还有什么我能帮忙的吗？', next: 'ask_help', action: null }
        ]
      },
      village_trouble: {
        text: '"北方的狼群越来越大胆了……\n小驯鹿独自在牧场，我很担心。\n如果你能去看看它，我会很感激的。"',
        choices: [
          { label: '我去看看驯鹿', next: null, action: 'addRelation:elder:20' },
          { label: '了解了，再见', next: null, action: null }
        ]
      },
      ask_help: {
        text: '"帮忙驱赶那些狼……\n村里的孩子们就能安心了。\n去和猎人阿龙合作，他一个人太辛苦了。"',
        choices: [
          { label: '我会想办法的', next: null, action: 'setFlag:repelled_attack' },
          { label: '我会尽力', next: null, action: 'addRelation:elder:10' }
        ]
      },
      // ── 好感增长后 ──────────────────────────────────────────────────
      warming: {
        text: '村长看到你便微笑着点头。\n"听说你去看过小驯鹿了，谢谢你。\n阿龙那孩子也提到你，说你是个值得信任的人。"',
        choices: [
          { label: '猎人认可我了，我很高兴', next: 'warming_b', action: 'addRelation:elder:5' },
          { label: '请问还有什么需要帮忙的？', next: 'ask_help', action: null }
        ]
      },
      warming_b: {
        text: '"是啊，阿龙很少夸人。\n你若愿意留下来，这里永远有你的位置。"',
        choices: [
          { label: '我想留下来', next: null, action: 'addRelation:elder:10' }
        ]
      },
      // ── 高度信任 ────────────────────────────────────────────────────
      trusted: {
        text: '村长握住你的手，眼眶微红。\n"孩子，你让这个村子又有了生气。\n雪娃昨天还问我，你是不是会一直住在这里。"',
        choices: [
          { label: '我会的，这里是我的家了', next: null, action: 'addRelation:elder:10' },
          { label: '谢谢您，我会保护大家的', next: null, action: 'setFlag:repelled_attack' }
        ]
      },
      // ── 击退进攻后 ──────────────────────────────────────────────────
      after_repel: {
        text: '村长站在村口，望着你，深深鞠了一躬。\n"你保护了我们所有人。\n从今以后，你就是雪鹿村的守护者。"',
        choices: [
          { label: '这里的人值得守护', next: null, action: null }
        ]
      }
    }
  },

  hunter: {
    name: '猎人阿龙',
    getStart: () => getStart('hunter'),
    nodes: {
      // ── 初次见面 ────────────────────────────────────────────────────
      intro: {
        text: '猎人警惕地看着你，手握弓箭。\n"外乡人，你来这里做什么？\n雪原不欢迎不知根底的陌生人。"',
        choices: [
          { label: '我想帮忙对付狼群', next: 'offer_help', action: null },
          { label: '只是路过，无意冒犯', next: 'passing', action: null }
        ]
      },
      offer_help: {
        text: '猎人皱眉，但眼神有所松动。\n"你？能打狼？\n我见过太多自不量力的人……\n不过，如果你真有本事——"',
        choices: [
          { label: '我有海洋的力量', next: 'trust', action: 'addRelation:hunter:20' },
          { label: '我先当你的向导', next: 'guide', action: 'addRelation:hunter:10' }
        ]
      },
      passing: {
        text: '"哼，路过就少管闲事。\n这片雪原比你想的危险多了。"',
        choices: [
          { label: '能说说危险在哪里吗？', next: 'danger_info', action: null },
          { label: '好的，再见', next: null, action: null }
        ]
      },
      trust: {
        text: '"……海洋之力。有趣。\n好吧，我给你一次机会。\n先去看看牧场的驯鹿，确认狼没有靠近。"',
        choices: [
          { label: '好，我马上去', next: null, action: 'setFlag:hunter_allied' }
        ]
      },
      guide: {
        text: '"向导？算了，多个人手也无妨。\n跟我来，我带你看看狼的踪迹。"',
        choices: [
          { label: '我跟着你', next: null, action: 'addRelation:hunter:15' }
        ]
      },
      danger_info: {
        text: '"北边山口来了狼群，比往年多三倍。\n驯鹿牧场首当其冲。\n去找村长老爷爷，他才是做决定的人。"',
        choices: [
          { label: '明白了，谢谢你', next: null, action: 'addRelation:hunter:5' }
        ]
      },
      // ── 注意到你帮了驯鹿 ────────────────────────────────────────────
      noticed_reindeer: {
        text: '猎人放下弓，表情不再那么冷淡。\n"……你去看过驯鹿了？\n小家伙今天比平时安静，应该是放松了。\n我没看错你。"',
        choices: [
          { label: '驯鹿很可爱，我很高兴能帮上忙', next: 'reindeer_bond', action: 'addRelation:hunter:10' },
          { label: '我们一起保护它们吧', next: 'alliance_offer', action: null }
        ]
      },
      reindeer_bond: {
        text: '"你懂驯鹿……在雪原上，\n人和动物相互信任才能活下去。\n也许你真的能帮上忙。"',
        choices: [
          { label: '告诉我该怎么做', next: null, action: 'setFlag:hunter_allied' }
        ]
      },
      alliance_offer: {
        text: '"……好。\n我一个人追踪狼群已经够累了。\n有个帮手，也许我们真能把它们赶走。"',
        choices: [
          { label: '我们一起', next: null, action: 'setFlag:hunter_allied' }
        ]
      },
      // ── 结盟后 ──────────────────────────────────────────────────────
      warming: {
        text: '猎人点点头，表情轻松了许多。\n"昨晚狼群没有靠近村子。\n也许是你的海洋气息让它们迷惑了。"',
        choices: [
          { label: '我们一起把它们彻底驱走', next: null, action: 'setFlag:repelled_attack' },
          { label: '大家都平安就好', next: null, action: 'addRelation:hunter:5' }
        ]
      },
      allied: {
        text: '猎人拍了拍你的肩膀——\n对他来说，这已经是很大的示好了。\n"今晚我会在北边守夜。村子靠你了。"',
        choices: [
          { label: '放心，我会守护大家的', next: null, action: 'setFlag:repelled_attack' },
          { label: '我陪你一起去守夜', next: null, action: 'addRelation:hunter:10' }
        ]
      }
    }
  },

  reindeer: {
    name: '小驯鹿',
    getStart: () => getStart('reindeer'),
    nodes: {
      intro: {
        text: '小驯鹿抬起头，用大眼睛看着你。\n"哞……"它嗅了嗅你的手，\n似乎感受到了海洋的气息，有些好奇。',
        choices: [
          { label: '轻轻摸摸它的头', next: 'pet', action: 'setFlag:helped_reindeer' },
          { label: '给它唱一首海洋的歌', next: 'song', action: 'setFlag:helped_reindeer' }
        ]
      },
      pet: {
        text: '驯鹿满足地闭上眼睛，发出低沉的呼噜声。\n它感受到了你的善意，将你视作了朋友。\n\n【猎人阿龙会注意到这一幕…】',
        choices: [
          { label: '好好照顾自己哦', next: null, action: 'addRelation:elder:5' }
        ]
      },
      song: {
        text: '你轻声哼起海底的旋律——\n驯鹿竟随之摇摆起来，\n牧场里其他的驯鹿也慢慢聚拢过来。\n\n【猎人阿龙会注意到这一幕…】',
        choices: [
          { label: '真是奇妙的感应', next: null, action: 'addRelation:hunter:5' }
        ]
      },
      // ── 已经是朋友 ──────────────────────────────────────────────────
      friend: {
        text: '驯鹿一看到你便跑了过来，\n用鼻子蹭了蹭你的手。\n它的眼神比昨天更加明亮。',
        choices: [
          { label: '（陪它待一会儿）', next: 'friend_b', action: 'addRelation:elder:3' },
          { label: '再见，小家伙', next: null, action: null }
        ]
      },
      friend_b: {
        text: '你和驯鹿静静地待在雪地里。\n远处，猎人阿龙的身影出现在山坡上——\n他看见你们，微微点了点头。',
        choices: [
          { label: '（感受到了什么在改变）', next: null, action: 'addRelation:hunter:5' }
        ]
      }
    }
  },

  child: {
    name: '雪娃',
    getStart: () => getStart('child'),
    nodes: {
      intro: {
        text: '小女孩踮起脚尖，好奇地打量着你。\n"你是从海里来的吗？你会游泳吗！\n我从来没见过大海！"',
        choices: [
          { label: '对，我来自海底', next: 'ocean_talk', action: null },
          { label: '你好，你住在这里吗？', next: 'village_talk', action: null }
        ]
      },
      ocean_talk: {
        text: '"哇！海底是什么样的？\n村长爷爷说海洋比天空还要深！\n猎人叔叔说海洋人很危险，但你看起来很好！"',
        choices: [
          { label: '给她描述美丽的珊瑚礁', next: 'coral', action: 'addRelation:elder:5' },
          { label: '猎人为什么这样说？', next: 'hunter_rumor', action: null }
        ]
      },
      village_talk: {
        text: '"对呀！村长爷爷很厉害，猎人叔叔也很厉害！\n就是最近大家都很担心，因为有狼……\n猎人叔叔每天都去巡逻，好辛苦。"',
        choices: [
          { label: '别怕，我来帮忙了', next: 'reassure', action: 'addRelation:elder:5' },
          { label: '告诉我更多吧', next: 'more_info', action: null }
        ]
      },
      coral: {
        text: '"哇哦！五颜六色的！等我长大也要去看！\n对了，你要小心北边！\n猎人叔叔说那里最近有狼的脚印。"',
        choices: [
          { label: '谢谢你提醒，再见！', next: null, action: null }
        ]
      },
      hunter_rumor: {
        text: '"猎人叔叔说……以前海洋人来过，\n把我们的鱼都带走了。\n但我觉得你不一样！你帮了我们嘛！"',
        choices: [
          { label: '我会用行动证明的', next: null, action: 'addRelation:hunter:5' }
        ]
      },
      reassure: {
        text: '"真的吗！太好了！\n村长爷爷说只要大家在一起就不怕！\n你也是我们的伙伴了！"',
        choices: [
          { label: '当然！再见雪娃！', next: null, action: null }
        ]
      },
      more_info: {
        text: '"猎人叔叔说北边山口来了好多狼，\n把驯鹿都吓跑了。\n村长爷爷每天都睡不好……"',
        choices: [
          { label: '我会帮忙解决的', next: null, action: 'addRelation:elder:10' }
        ]
      },
      // ── 击退进攻后 ──────────────────────────────────────────────────
      celebrate: {
        text: '雪娃朝你飞奔过来，差点绊倒。\n"你赶走狼了！村长爷爷哭了！猎人叔叔也笑了！\n我从来没见过猎人叔叔笑！"',
        choices: [
          { label: '大家平安就是最好的', next: null, action: null }
        ]
      },
      // ── 村长认可后 ──────────────────────────────────────────────────
      warmed: {
        text: '"村长爷爷说你是好人！\n猎人叔叔也不再皱眉了！\n驯鹿今天特别开心，一直跑来跑去！"',
        choices: [
          { label: '大家都好，我就放心了', next: null, action: null },
          { label: '你有没有想去大海看看？', next: 'dream', action: null }
        ]
      },
      dream: {
        text: '"想！我想看珊瑚！想看大鱼！\n你能带我去吗？"\n她的眼睛里闪烁着星光。',
        choices: [
          { label: '等你长大了，我带你去', next: null, action: 'addRelation:elder:5' }
        ]
      }
    }
  }
};

export default npcData;
