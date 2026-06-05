// Dialogue tree format:
// Each NPC has a tree of nodes keyed by id.
// node: { text, choices: [{ label, next, action }] }
// action: string like "setFlag:key" or "addRelation:npcId:value"
// next: null means end dialogue

const npcData = {
  elder: {
    name: '村长老爷爷',
    start: 'intro',
    nodes: {
      intro: {
        text: '老人眯起眼睛打量着你。\n"来者何人？你的气息……不像是雪原之人。"',
        choices: [
          { label: '我来自大海之下', next: 'ocean_origin', action: null },
          { label: '我只是路过的旅人', next: 'traveler', action: null }
        ]
      },
      ocean_origin: {
        text: '村长抚须，眼神变得温和。\n"海洋之子，久闻其名。欢迎来到雪鹿村，这里的冬天很长，但人情很暖。"',
        choices: [
          { label: '谢谢您，我想了解这个村子', next: 'village_info', action: 'addRelation:elder:20' },
          { label: '请问村子最近有什么异常？', next: 'village_trouble', action: 'addRelation:elder:10' }
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
        text: '"我们村与驯鹿相依为命已有百年。\n最近北边有狼群出没，猎人阿龙一直在追踪它们。\n去和他说说话吧，年轻人。"',
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
        text: '"如果你能帮忙驱赶那些狼……\n村里的孩子们就能安心玩耍了。\n去和猎人阿龙合作，他一个人太辛苦了。"',
        choices: [
          { label: '我会想办法的', next: null, action: 'setFlag:repelled_attack' },
          { label: '我会尽力', next: null, action: 'addRelation:elder:10' }
        ]
      }
    }
  },

  hunter: {
    name: '猎人阿龙',
    start: 'intro',
    nodes: {
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
          { label: '我有海洋的力量，不会输的', next: 'trust', action: 'addRelation:hunter:20' },
          { label: '我可以先当你的向导', next: 'guide', action: 'addRelation:hunter:10' }
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
          { label: '好，我马上去', next: null, action: 'setFlag:hunter_allied' },
          { label: '没问题', next: null, action: 'addRelation:hunter:10' }
        ]
      },
      guide: {
        text: '"向导？\n你连地形都不熟……算了，多个人手也无妨。\n跟我来，我带你看看狼的踪迹。"',
        choices: [
          { label: '我跟着你', next: null, action: 'addRelation:hunter:15' }
        ]
      },
      danger_info: {
        text: '"北边山口来了狼群，比往年多三倍。\n驯鹿牧场首当其冲。如果你真想帮……\n去找村长老爷爷吧，他才是做决定的人。"',
        choices: [
          { label: '明白了，谢谢你', next: null, action: 'addRelation:hunter:5' }
        ]
      }
    }
  },

  reindeer: {
    name: '小驯鹿',
    start: 'intro',
    nodes: {
      intro: {
        text: '小驯鹿抬起头，用大眼睛看着你。\n"哞……"它嗅了嗅你的手，\n似乎感受到了海洋的气息，有些好奇。',
        choices: [
          { label: '轻轻摸摸它的头', next: 'pet', action: 'setFlag:helped_reindeer' },
          { label: '给它唱一首海洋的歌', next: 'song', action: 'setFlag:helped_reindeer' }
        ]
      },
      pet: {
        text: '驯鹿满足地闭上眼睛，发出低沉的呼噜声。\n它感受到了你的善意，\n将你视作了朋友。',
        choices: [
          { label: '好好照顾自己哦', next: null, action: 'addRelation:elder:5' }
        ]
      },
      song: {
        text: '你轻声哼起海底的旋律——\n驯鹿竟随之摇摆起来，\n牧场里其他的驯鹿也慢慢聚拢过来。',
        choices: [
          { label: '真是奇妙的感应', next: null, action: 'addRelation:hunter:5' }
        ]
      }
    }
  },

  child: {
    name: '雪娃',
    start: 'intro',
    nodes: {
      intro: {
        text: '小女孩踮起脚尖，好奇地打量着你。\n"你是从海里来的吗？你会游泳吗！\n我从来没见过大海！"',
        choices: [
          { label: '对，我来自海底', next: 'ocean_talk', action: null },
          { label: '你好，雪娃，你住在这里吗？', next: 'village_talk', action: null }
        ]
      },
      ocean_talk: {
        text: '"哇！海底是什么样的？\n有大鱼吗？有宝藏吗？\n村长爷爷说海洋比天空还要深！"',
        choices: [
          { label: '给她描述美丽的珊瑚礁', next: 'coral', action: 'addRelation:elder:5' },
          { label: '告诉她海底也有危险', next: 'danger', action: null }
        ]
      },
      village_talk: {
        text: '"对呀！我一直住在这里。\n村长爷爷很厉害的，猎人叔叔也很厉害！\n就是最近大家都很担心，因为有狼……"',
        choices: [
          { label: '别怕，我来了', next: 'reassure', action: 'addRelation:elder:5' },
          { label: '告诉我更多吧', next: 'more_info', action: null }
        ]
      },
      coral: {
        text: '"哇哦！五颜六色的！\n等我长大了我也要去看！\n对了，你要小心北边啊，那里有狼！"',
        choices: [
          { label: '谢谢你提醒我，再见！', next: null, action: null }
        ]
      },
      danger: {
        text: '"真的吗……\n那海底就和雪原一样了，\n都有危险的东西。\n所以我们都要互相帮助！"',
        choices: [
          { label: '说得很对，再见！', next: null, action: null }
        ]
      },
      reassure: {
        text: '"真的吗！\n那太好了！\n村长爷爷说只要大家在一起就不怕！\n你也是我们的伙伴了！"',
        choices: [
          { label: '当然！再见雪娃！', next: null, action: null }
        ]
      },
      more_info: {
        text: '"猎人叔叔说北边山口来了好多狼，\n它们把驯鹿都吓跑了。\n村长爷爷每天都睡不好觉……"',
        choices: [
          { label: '我会帮忙解决的', next: null, action: 'addRelation:elder:10' }
        ]
      }
    }
  }
};

export default npcData;
