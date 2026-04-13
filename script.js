const dimensionMeta = {
  W: { label: "W · 观望", description: "先看、先等、先判断，慢半拍但掌控全局" },
  S: { label: "S · 社交", description: "会下场、会起哄，能和任何人聊两句" },
  V: { label: "V · 开麦", description: "声音存在感满格，表达力旺盛" },
  M: { label: "M · 记账", description: "记仇记事记人情，必要时暗暗记一笔" },
  C: { label: "C · 松弛", description: "慢悠悠，容易躺平，不强求" },
  N: { label: "N · 夜感", description: "暗中输出、夜里来精神" },
  P: { label: "P · 突袭", description: "快、狠、趁手就上，效率第一" }
};

const maxScores = { W: 35, S: 28, V: 24, M: 12, C: 51, N: 11, P: 35 };
const weights = { W: 1.2, S: 1.1, V: 1.1, M: 1.2, C: 1, N: 1.2, P: 1.2 };
const SOFTMAX_T = 13;

const birdPrototypes = {
  夜鹭: { W: 95, S: 10, V: 10, M: 30, C: 60, N: 85, P: 40 },
  乌鸫: { W: 35, S: 40, V: 98, M: 80, C: 10, N: 20, P: 35 },
  喜鹊: { W: 35, S: 98, V: 80, M: 25, C: 20, N: 10, P: 40 },
  乌鸦: { W: 95, S: 10, V: 20, M: 95, C: 10, N: 45, P: 50 },
  珠颈斑鸠: { W: 15, S: 25, V: 10, M: 5, C: 98, N: 10, P: 5 },
  海鸥: { W: 5, S: 90, V: 90, M: 10, C: 10, N: 10, P: 98 },
  雕鸮: { W: 55, S: 5, V: 10, M: 85, C: 10, N: 98, P: 60 },
  游隼: { W: 40, S: 10, V: 10, M: 20, C: 5, N: 20, P: 100 }
};

const birdMeta = {
  乌鸫: {
    en: "Blackbird",
    imageWebp: "figure%20v2/compressed/wudong.webp",
    imageJpg: "figure%20v2/wudong.jpg",
    tagline: "我会一直看着你的，永远",
    color: "#2f2f36",
    description: `乌鸫，你好。你总是习惯站在离热附近，在别人眼里你或许有些抽离，但实际上你的心思比大多数人都要细腻。很多时候，别人以为你只是在发呆，但其实你的大脑正在默默记录周围发生的一切。你未必是那个急于在人群中表达自我的人，却往往是把事情看得最透彻的那个。你心里一直记着那些别人早已遗忘的微小细节和微妙情绪。你偶尔也会觉得自己是不是太敏感了，想得太多，但正是这种不动声色的观察力，让你在复杂的人际关系里总能保留一份清醒。`
  },
  喜鹊: {
    en: "Magpie",
    imageWebp: "figure%20v2/compressed/xique.webp",
    imageJpg: "figure%20v2/xique.jpg",
    tagline: "喳。",
    color: "#1f7a8c",
    description: `喜鹊，见到你很高兴，你身上总有一种让人无法忽视的生命力。你似乎天生就懂得如何与这个世界打交道，无论把你放到什么陌生的环境里，你总能很快找到属于自己的位置。身边的人往往只看到你阳光的一面，觉得你每天都无忧无虑，却很少有人察觉，你在人群散去后偶尔也会感到深深的疲惫和空虚。你对新鲜事物有着天然的好奇心，反应极快，能在关键时刻自然而然地接住别人抛来的情绪。你从未刻意去讨好谁，你只是喜鹊罢了。`
  },
  乌鸦: {
    en: "Crow",
    imageWebp: "figure%20v2/compressed/wuya.webp",
    imageJpg: "figure%20v2/wuya.jpg",
    tagline: "I know......",
    color: "#222831",
    description: `乌鸦，其实很多事情你心里比谁都清楚。你常常给人一种带着点距离感的第一印象。很多时候，你看着别人为了鸡毛蒜皮的事情争论不休，心里早已看透了事物的本质和走向，只是觉得没有必要点破。你内心深处有着一套非常严密的逻辑系统，只对真正的朋友敞开。你偶尔也会感到一种无人理解的孤独，但你可是乌鸦，乌鸦朋友会与你相伴。`
  },
  珠颈斑鸠: {
    en: "Spotted Dove",
    imageWebp: "figure%20v2/compressed/zhujingbanjiu.webp",
    imageJpg: "figure%20v2/zhujingbanjiu.jpg",
    tagline: "古固咕？古固咕！",
    color: "#b07b64",
    description: `珠颈斑鸠，慢一点也没关系，这大概是你潜意识里最真实的生活哲学。在这个每个人都在拼命赶路、充满焦虑的时代，你似乎总是保持着一种略带迟缓的从容。很多人会认为你好脾气、随遇而安，甚至有点迷糊，但其实你内心对于自己想要什么、不想要什么有着非常坚定的底线。你只是不想把力气花在无谓的内耗和比较上。遇到突发状况时，你本能的反应往往是先愣一下，然后按着自己的步调慢慢去消化。你身上那种不战而屈人之兵的松弛感，其实掩盖了你内心深处那份不愿随波逐流的倔强。`
  },
  海鸥: {
    en: "Seagull",
    imageWebp: "figure%20v2/compressed/haiou.webp",
    imageJpg: "figure%20v2/haiou.jpg",
    tagline: "来都来了，整点薯条",
    color: "#1f9ac7",
    description: `海鸥，你又在寻找下一个落脚点了对吧。你是一个非常注重活在当下的人，对你来说，与其花大量时间去纠结未知的风险和复杂的心理活动，不如先下手为强。你身上有一种特别实在的行动力，只要看到机会，或者察觉到对自己有利的信号，就会毫不犹豫地采取行动。有时候，别人会觉得你做事全凭直觉、甚至有点鲁莽，但其实你有着自己独特的生存智慧。你不喜欢那些虚无缥缈的承诺和画大饼，你更看重抓在手里的切实回报。哪怕偶尔扑个空或者走弯路，你也能很快调整心态，潇洒地飞向下一片海域。`
  },
  雕鸮: {
    en: "Eagle-Owl",
    imageWebp: "figure%20v2/compressed/diaoxiao.webp",
    imageJpg: "figure%20v2/diaoxiao.jpg",
    tagline: "晚上见",
    color: "#7c5527",
    description: `雕鸮，独处的时候才是你思绪最活跃的时刻。你和大多数人的生物钟或是情绪节奏似乎总存在着某种微妙的时差。在常规的社交里，你可能会显得有些不温不火，甚至带着点敷衍。但只要到了你觉得安全的私人空间，或者面对你真正感兴趣的事物，你潜藏的敏锐和深刻就会瞬间苏醒。你并不喜欢时时刻刻都保持高昂的斗志，你习惯把最深邃的思考、最真实的情感，都留给那个懂你的人。你的光芒总是选择性地绽放，绝不轻易示人。`
  },
  游隼: {
    en: "Falcon",
    imageWebp: "figure%20v2/compressed/yousun.webp",
    imageJpg: "figure%20v2/yousun.jpg",
    tagline: "你的眼神锐利如同翱翔天空的游隼",
    color: "#c9510c",
    description: `游隼，其实连你自己都常常被自己偶尔爆发出来的潜能吓到吧。在日常放松的状态下，你可能看起来十分平和，甚至带点漫不经心，完全没有任何攻击性。你骨子里觉得大多数日常琐事根本不值得你全力以赴。然而，一旦遇到真正让你认为非赢不可的目标，你就会在一瞬间切换状态，展现出极其可怕的专注度与决断力。你平时有多随性，认真起来就有多致命。`
  },
  夜鹭: {
    en: "Night Heron",
    imageWebp: "figure%20v2/compressed/yelu.webp",
    imageJpg: "figure%20v2/yelu.jpg",
    tagline: "天气好极了，鱼几乎没有",
    color: "#4f6a92",
    description: `夜鹭，你又在默默观察这个世界了吧。很多人第一眼看你，会觉得你常常处于一种放空的状态，但其实他们根本不知道在你那看似毫无波澜的外表下，心思有多么缜密。当你遇到那些表面光鲜实则让人失望的人和事时，你内心往往会上演极其丰富的内心戏，但最终表现出来的，却只是一丝带着黑色幽默的礼貌与从容。你太懂得分辨什么是虚张声势，什么是真正有价值的目标。所以，当别人都在为了凑热闹而急着随波逐流时，你更愿意独自站在岸边静静地等一等，用你那独特的节奏，慢慢衡量今天这趟浑水到底值不值得你亲自下场。`
  }
};

const questionBank = [
  { id: 1, title: "刚到一个不太熟的局，你通常先干嘛？", options: [
    { text: "找个能观察全场的角落。", effects: { W: 1, C: 1 } },
    { text: "三分钟内接上话题，顺手混熟两个人。", effects: { S: 1, V: 1 } },
    { text: "坐下，谁来找我我再动。", effects: { C: 2 } },
    { text: "做我来这里要做的事。", effects: { P: 1, W: 1 } }
  ] },
  { id: 2, title: "群里突然 99+，你的反应？", options: [
    { text: "点开，潜水，看戏，不说话。", effects: { W: 1 } },
    { text: "已经接了三个梗，还在往下翻。", effects: { S: 1, V: 1 } },
    { text: "看两眼，算了，等结论版。", effects: { C: 1 } },
    { text: "直接翻到重点，留一句最有用的。", effects: { P: 1, M: 1 } }
  ] },
  { id: 3, title: "大家在聊一个你不太懂的话题，你会？", options: [
    { text: "先听明白再说。", effects: { W: 1, C: 1 } },
    { text: "先接两句，聊着聊着就懂了。", effects: { S: 1, V: 1 } },
    { text: "安静待机，顺便走神。", effects: { C: 2 } },
    { text: "问关键问题。", effects: { P: 1, W: 1 } }
  ] },
  { id: 4, title: "有人阴阳你一句，你更可能？", options: [
    { text: "回去复盘才发现被阴阳了。", effects: { M: 1, W: 1 } },
    { text: "直接喷回去。", effects: { V: 1, P: 1 } },
    { text: "懒得接，和这种人讲话费电。", effects: { C: 1 } },
    { text: "打算之后挑个好时机还回去。", effects: { M: 1, N: 1 } }
  ] },
  { id: 5, title: "朋友最常吐槽你的点是？", options: [
    { text: "呆。", effects: { W: 1, C: 1 } },
    { text: "社交恐怖分子。", effects: { S: 1, V: 1 } },
    { text: "困。", effects: { C: 2 } },
    { text: "静若处子，动如脱兔。", effects: { P: 1, N: 1 } }
  ] },
  { id: 6, title: "意外放假一天，你更想？", options: [
    { text: "慢慢晃，看到哪算哪。", effects: { C: 1, W: 1 } },
    { text: "出门社交。", effects: { S: 2 } },
    { text: "躺着。", effects: { C: 2 } },
    { text: "出门做一件之前就想做的事。", effects: { P: 2 } }
  ] },
  { id: 7, title: "电话突然打进来，你第一反应？", options: [
    { text: "看看是谁，想想要不要接。", effects: { W: 1, M: 1 } },
    { text: "直接接再看是谁。", effects: { V: 1, S: 1 } },
    { text: "装没看见，等会儿再说。", effects: { C: 1 } },
    { text: "秒接，尽快结束。", effects: { P: 1 } }
  ] },
  { id: 8, title: "别人第一次见你，最容易误会你什么？", options: [
    { text: "以为我不太聪明。", effects: { C: 1, W: 1 } },
    { text: "以为我很会来事。", effects: { S: 1, V: 1 } },
    { text: "以为我很好欺负。", effects: { C: 1 } },
    { text: "以为我很高冷。", effects: { M: 1, N: 1 } }
  ] },
  { id: 9, title: "排队的时候，你更常见的状态是？", options: [
    { text: "安静站着，观察前面每一个人。", effects: { W: 2 } },
    { text: "已经和旁边人聊起来了。", effects: { S: 1, V: 1 } },
    { text: "神游。", effects: { C: 2 } },
    { text: "眼睛已经在找哪条队更快。", effects: { P: 1, W: 1 } }
  ] },
  { id: 10, title: "出门迷路了，你？", options: [
    { text: "先停下来看路牌和导航。", effects: { W: 2 } },
    { text: "先问人。", effects: { S: 1, V: 1 } },
    { text: "迷就迷吧，慢慢走总会到。", effects: { C: 2 } },
    { text: "我不会迷路。", effects: { P: 2 } }
  ] },
  { id: 11, title: "社交电量见底时，你会？", options: [
    { text: "只是看着……", effects: { W: 1 } },
    { text: "社交还有电量？", effects: { S: 1, V: 1 } },
    { text: "直接进入省电模式。", effects: { C: 2 } },
    { text: "早已跑路。", effects: { P: 1, N: 1 } }
  ] },
  { id: 12, title: "你更认可哪种智慧？", options: [
    { text: "先观察思考再下结论。", effects: { W: 2 } },
    { text: "人是社会性动物，有必要构建自己的社交网络。", effects: { S: 1, V: 1 } },
    { text: "不争不抢，与世无争。", effects: { C: 2 } },
    { text: "关键时候抓住机会。", effects: { P: 2 } }
  ] },
  { id: 13, title: "熬夜之后，你会？", options: [
    { text: "低功耗模式……", effects: { W: 1, N: 1 } },
    { text: "靠咖啡续命。", effects: { V: 1, S: 1 } },
    { text: "不中了。", effects: { C: 2 } },
    { text: "超长待机 48 小时！", effects: { N: 2 } }
  ] },
  { id: 14, title: "看到别人那边有热闹，你会？", options: [
    { text: "先听听是啥热闹好玩再看看。", effects: { W: 1 } },
    { text: "火速到达现场，最好还能听到完整版。", effects: { S: 2 } },
    { text: "避之不及。", effects: { C: 2 } },
    { text: "和自己相关的才去看。", effects: { P: 1, N: 1 } }
  ] },
  { id: 15, title: "开会时突然被点名，你更可能？", options: [
    { text: "先确认问题，再答。", effects: { W: 2 } },
    { text: "张口就来，边说边补全思路。", effects: { V: 1, S: 1 } },
    { text: "啊？我吗？", effects: { C: 2 } },
    { text: "早已做好万全准备能直接给结论。", effects: { P: 2 } }
  ] },
  { id: 16, title: "朋友借你钱忘了还，你会？", options: [
    { text: "我记得，但我先不说。", effects: { M: 1, W: 1 } },
    { text: "我会直接提醒。", effects: { V: 1, P: 1 } },
    { text: "算了，下次再说吧（然后忘记）。", effects: { C: 2 } },
    { text: "我一直盯着你的。", effects: { M: 2 } }
  ] },
  { id: 17, title: "工作 / 学习安排临时变了，你通常？", options: [
    { text: "先问为什么变了。", effects: { W: 1, M: 1 } },
    { text: "一边改一边和大家同步。", effects: { S: 1, V: 1 } },
    { text: "有点烦，但也行吧。", effects: { C: 2 } },
    { text: "秒切新计划。", effects: { P: 2 } }
  ] },
  { id: 18, title: "电梯里碰到半熟不熟的人，你通常？", options: [
    { text: "打个招呼，安静站完这几层。", effects: { W: 1, C: 1 } },
    { text: "热聊。", effects: { S: 1, V: 1 } },
    { text: "低头看手机，假装很忙。", effects: { C: 1 } },
    { text: "看对方要不要聊。", effects: { M: 1, W: 1 } }
  ] },
  { id: 19, title: "下雨天，你整个人更像？", options: [
    { text: "更安静了，适合发呆睡觉。", effects: { W: 1, C: 1 } },
    { text: "想找点吃的，或者找人一起逛商场。", effects: { S: 1, V: 1 } },
    { text: "更不想动了。", effects: { C: 2 } },
    { text: "莫名精神。", effects: { N: 1, P: 1 } }
  ] },
  { id: 20, title: "想发动态的时候，你更可能发什么？", options: [
    { text: "只发图不发字。", effects: { W: 1, M: 1 } },
    { text: "很有现场感的话。", effects: { S: 1, V: 1 } },
    { text: "可能想了半天，最后还是没发。", effects: { C: 2 } },
    { text: "发很短的总结。", effects: { P: 1, N: 1 } }
  ] },
  { id: 21, title: "别人连续打断你两次，你会？", options: [
    { text: "表面平静心里记账。", effects: { M: 1, W: 1 } },
    { text: "直接说，先让我讲完。", effects: { V: 1, P: 1 } },
    { text: "算了，不讲也行。", effects: { C: 2 } },
    { text: "打断 TA 三次。", effects: { M: 1, P: 1 } }
  ] },
  { id: 22, title: "大家一起合照时，你更像？", options: [
    { text: "站边边，表情神秘。", effects: { W: 1, N: 1 } },
    { text: "已经开始指挥站位和表情了。", effects: { S: 1, V: 1 } },
    { text: "随便拍吧，我都行。", effects: { C: 2 } },
    { text: "自然地被拍居然有股神秘气场。", effects: { P: 2 } }
  ] },
  { id: 23, title: "做完一件很大的事之后，你通常会？", options: [
    { text: "自己回想一遍，看看哪里还能更好。", effects: { W: 1, M: 1 } },
    { text: "立刻找人分享全过程。", effects: { S: 1, V: 1 } },
    { text: "先瘫着再说。", effects: { C: 2 } },
    { text: "没时间庆祝了，马上下一件。", effects: { P: 1, N: 1 } }
  ] },
  { id: 24, title: "去自助餐，你会？", options: [
    { text: "先完整巡视一圈。", effects: { W: 2 } },
    { text: "看见什么吃什么。", effects: { S: 1, V: 1 } },
    { text: "爱吃啥吃啥，哪怕是蛋炒饭。", effects: { C: 2 } },
    { text: "哪里排队去哪里。", effects: { P: 2 } }
  ] },
  { id: 25, title: "遇到竞争场面，你更常见的反应是？", options: [
    { text: "先看别人怎么动。", effects: { W: 2 } },
    { text: "我就是出头鸟。", effects: { S: 1, P: 1 } },
    { text: "竞争就竞争吧，我不一定非得争这个。", effects: { C: 2 } },
    { text: "暗中出手。", effects: { P: 2 } }
  ] },
  { id: 26, title: "做决定的时候，你更常靠什么？", options: [
    { text: "多看多思。", effects: { W: 2 } },
    { text: "多与别人讨论。", effects: { S: 1, V: 1 } },
    { text: "感觉到了就行。", effects: { C: 2 } },
    { text: "先定一个方向再修改。", effects: { P: 2 } }
  ] },
  { id: 27, title: "出去旅行时，你会？", options: [
    { text: "喜欢慢慢看，走走停停，拍点奇怪的小东西。", effects: { W: 1, C: 1 } },
    { text: "想多逛多吃多看。", effects: { S: 2 } },
    { text: "能坐着就不站，行程别太满。", effects: { C: 2 } },
    { text: "严格按照计划。", effects: { P: 2 } }
  ] },
  { id: 28, title: "好朋友突然都很生气，你一般会？", options: [
    { text: "先听听到底发生了啥。", effects: { W: 1 } },
    { text: "和朋友一起生气。", effects: { S: 1, V: 1 } },
    { text: "人机安慰。", effects: { C: 2 } },
    { text: "帮朋友解决问题。", effects: { M: 1, P: 1 } }
  ] },
  { id: 29, title: "哪句话最像你？", isBonus: true, options: [
    { text: "古固咕。", effects: { W: 2 } },
    { text: "oioioioi。", effects: { S: 1, V: 1 } },
    { text: "于一。", effects: { C: 2 } },
    { text: "呱——。", effects: { P: 2 } }
  ] }
];

const dimensionKeys = Object.keys(dimensionMeta);
const requiredQuestionCount = questionBank.filter((q) => !q.isBonus).length;

const form = document.getElementById('quiz-form');
const questionStageEl = document.getElementById('question-stage');
const progressTextEl = document.getElementById('progress-text');
const progressBarFillEl = document.getElementById('progress-bar-fill');
const prevBtn = document.getElementById('prev-question');
const nextBtn = document.getElementById('next-question');
const submitBtn = document.getElementById('submit-quiz');
const resultPanel = document.getElementById('result-panel');
const birdNameEl = document.getElementById('bird-name');
const birdEnglishEl = document.getElementById('bird-english');
const birdVisualEl = document.getElementById('bird-visual');
const birdTaglineEl = document.getElementById('bird-tagline');
const birdDescriptionEl = document.getElementById('bird-description');
const bonusNoteEl = document.getElementById('bonus-note');
const restartBtn = document.getElementById('restart-quiz');
const jumpBtn = document.getElementById('jump-to-quiz');
const heroEl = document.getElementById('hero');
const quizPanel = document.getElementById('quiz-panel');

const state = {
  questions: [],
  currentIndex: 0,
  answers: {}
};

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomizeQuestions() {
  const randomized = shuffle(questionBank).map((question) => ({
    ...question,
    options: shuffle(question.options)
  }));
  const bonusIndex = randomized.findIndex((item) => item.isBonus);
  if (bonusIndex > -1 && bonusIndex !== randomized.length - 1) {
    const [bonus] = randomized.splice(bonusIndex, 1);
    randomized.push(bonus);
  }
  return randomized;
}

function startNewQuiz() {
  state.questions = randomizeQuestions();
  state.currentIndex = 0;
  state.answers = {};
  renderQuestion();
  updateNavState();
  hideResults();
}

function renderQuestion() {
  const question = state.questions[state.currentIndex];
  if (!question) {
    questionStageEl.innerHTML = '<p>点击开始答题。</p>';
    return;
  }
  const saved = state.answers[question.id];

  const options = question.options
    .map((option, idx) => {
      const optionId = `q${question.id}-opt${idx}`;
      const letter = String.fromCharCode(65 + idx);
      const checked = saved === idx ? 'checked' : '';
      return `
        <div class="option">
          <input type="radio" id="${optionId}" name="current-question" value="${idx}" ${checked} />
          <label for="${optionId}">
            <span class="option-letter">${letter}</span>
            <span class="option-text">${option.text}</span>
          </label>
        </div>
      `;
    })
    .join('');

  questionStageEl.innerHTML = `
    <h2>${question.title}</h2>
    <div class="options">${options}</div>
  `;

  questionStageEl.querySelectorAll('input[name="current-question"]').forEach((input) => {
    input.addEventListener('change', () => {
      state.answers[question.id] = Number(input.value);
      updateNavState();
    });
  });
}

function updateNavState() {
  const question = state.questions[state.currentIndex];
  const answeredCurrent = question && typeof state.answers[question.id] === 'number';
  prevBtn.disabled = state.currentIndex === 0;
  nextBtn.hidden = state.currentIndex === state.questions.length - 1;
  submitBtn.hidden = state.currentIndex !== state.questions.length - 1;
  nextBtn.disabled = !answeredCurrent;
  submitBtn.disabled = !isQuizComplete();
  updateProgress();
}

function updateProgress() {
  const answered = state.questions.reduce((count, q) => {
    if (q.isBonus) return count;
    return typeof state.answers[q.id] === 'number' ? count + 1 : count;
  }, 0);
  const displayIndex = getDisplayIndex();
  progressTextEl.textContent = `第 ${displayIndex} / ${requiredQuestionCount} 题`;
  const progressPercent = Math.min(100, (answered / requiredQuestionCount) * 100);
  progressBarFillEl.style.width = `${progressPercent}%`;
}

function getDisplayIndex() {
  const visited = state.questions.slice(0, state.currentIndex).filter((q) => !q.isBonus).length;
  const current = state.questions[state.currentIndex];
  if (current && !current.isBonus) {
    return Math.min(requiredQuestionCount, visited + 1);
  }
  return Math.max(1, Math.min(requiredQuestionCount, visited));
}

function isQuizComplete() {
  const answered = state.questions.filter((q) => !q.isBonus && typeof state.answers[q.id] === 'number');
  return answered.length === requiredQuestionCount;
}

function handleSubmit(event) {
  event.preventDefault();
  if (!isQuizComplete()) {
    alert('还有题没答完');
    return;
  }
  const summary = calculateScores();
  renderResults(summary);
}

function calculateScores() {
  const rawScores = dimensionKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
  let bonusAnswer = '';

  state.questions.forEach((question) => {
    const choiceIndex = state.answers[question.id];
    if (typeof choiceIndex !== 'number') return;
    const option = question.options[choiceIndex];
    if (!option) return;

    if (question.isBonus) {
      bonusAnswer = option.text;
      return;
    }

    Object.entries(option.effects).forEach(([dimension, points]) => {
      rawScores[dimension] += points;
    });
  });

  const normalized = dimensionKeys.reduce((acc, key) => {
    const percent = Math.min(100, (rawScores[key] / maxScores[key]) * 100);
    return { ...acc, [key]: { raw: rawScores[key], percent } };
  }, {});

  return { raw: rawScores, normalized, bonus: bonusAnswer.trim() };
}

function determineBirdPool(normalized) {
  const percent = (key) => normalized[key].percent;
  const sortedKeys = [...dimensionKeys].sort((a, b) => percent(b) - percent(a));
  const highestKey = sortedKeys[0];

  if (percent('P') >= 85 && percent('S') <= 55 && percent('V') <= 55) {
    return ['游隼'];
  }

  if (percent('S') >= 70 && percent('V') >= 65) {
    if (percent('P') >= 75) return ['海鸥'];
    if (percent('M') >= 60) return ['乌鸫'];
    return ['喜鹊'];
  }

  if (percent('W') >= 70 && percent('M') >= 65) {
    if (percent('N') >= 75) return ['雕鸮'];
    if (percent('M') >= 85 && percent('C') <= 40) return ['乌鸦'];
    if (percent('C') >= 55) return ['夜鹭'];
    return ['乌鸦', '夜鹭'];
  }

  if (highestKey === 'C' && percent('M') <= 40 && percent('P') <= 45) {
    if (percent('W') >= 60) return ['夜鹭'];
    return ['珠颈斑鸠'];
  }

  return Object.keys(birdPrototypes);
}

function rankBirds(normalized) {
  const pool = determineBirdPool(normalized);
  const chosenPool = pool.length ? pool : Object.keys(birdPrototypes);
  const distances = chosenPool.map((name) => ({
    name,
    distance: Math.sqrt(
      dimensionKeys.reduce((sum, key) => {
        const diff = normalized[key].percent - birdPrototypes[name][key];
        const weighted = diff * (weights[key] || 1);
        return sum + weighted * weighted;
      }, 0)
    )
  }));

  const minDistance = Math.min(...distances.map((item) => item.distance));
  const scores = distances.map((item) => Math.exp(-(item.distance - minDistance) / SOFTMAX_T));
  const totalScore = scores.reduce((sum, val) => sum + val, 0) || 1;

  return distances
    .map((item, index) => ({
      name: item.name,
      distance: item.distance,
      match: Math.round((scores[index] / totalScore) * 1000) / 10
    }))
    .sort((a, b) => b.match - a.match);
}

function renderResults(summary) {
  const ranking = rankBirds(summary.normalized);
  const top = ranking[0];
  const meta = birdMeta[top.name] || {};
  const color = meta.color || '#101828';

  birdNameEl.textContent = top.name;
  birdNameEl.style.color = color;
  birdEnglishEl.textContent = meta.en || '';
  birdEnglishEl.style.color = `${color}cc`;
  birdTaglineEl.textContent = meta.tagline || '';
  birdTaglineEl.style.color = color;
  birdVisualEl.style.borderColor = `${color}55`;
  birdVisualEl.style.color = color;
  if (meta.imageWebp || meta.imageJpg) {
    const fallbackSrc = meta.imageJpg || meta.imageWebp;
    const pictureMarkup = `
      <picture>
        ${meta.imageWebp ? `<source srcset="${meta.imageWebp}" type="image/webp">` : ''}
        <img src="${fallbackSrc}" alt="${top.name}" loading="lazy" decoding="async" />
      </picture>
    `;
    birdVisualEl.innerHTML = pictureMarkup;
  } else {
    birdVisualEl.textContent = '【鸟图占位】';
  }
  birdDescriptionEl.textContent = meta.description || '';

  if (summary.bonus) {
    bonusNoteEl.hidden = false;
    bonusNoteEl.textContent = `「${summary.bonus}」`;
  } else {
    bonusNoteEl.hidden = true;
  }

  resultPanel.hidden = false;
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideResults() {
  resultPanel.hidden = true;
  bonusNoteEl.hidden = true;
}

function beginQuiz() {
  if (heroEl) {
    heroEl.setAttribute('hidden', 'true');
  }
  if (quizPanel) {
    quizPanel.removeAttribute('hidden');
  }
  startNewQuiz();
  if (quizPanel) {
    quizPanel.scrollIntoView({ behavior: 'smooth' });
  }
}

prevBtn.addEventListener('click', () => {
  if (state.currentIndex === 0) return;
  state.currentIndex -= 1;
  renderQuestion();
  updateNavState();
});

nextBtn.addEventListener('click', () => {
  const question = state.questions[state.currentIndex];
  if (!question || typeof state.answers[question.id] !== 'number') return;
  if (state.currentIndex >= state.questions.length - 1) return;
  state.currentIndex += 1;
  renderQuestion();
  updateNavState();
});

form.addEventListener('submit', handleSubmit);
restartBtn.addEventListener('click', () => {
  quizPanel.hidden = false;
  startNewQuiz();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (jumpBtn) {
  jumpBtn.addEventListener('click', beginQuiz);
} else {
  beginQuiz();
}

// 初始保持标题页，等待用户点击开始

























