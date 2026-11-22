import type EnglishAbout from './about.en.ts';

const about: typeof EnglishAbout = {
  hero: {
    label: '关于 Aster', title: '认识 Aster 背后的团队', subtitle: '始于好奇，灵感来自太空。',
    intro: '我们是 Aster。五名学生将机器人、软件与产品设计连接到同一个目标，支持在地球之外工作与生活的人们。我们通过 Cora 探索智能机器人能够提供的帮助。',
    observation: '俯瞰地球的空间站观景舱',
  },
  crew: {
    title: '认识我们的团队', subtitle: '每项任务背后，都有一群心怀好奇的人。', intro: '认识将 Aster 的想法付诸实践的伙伴。',
    member: '团队成员', pixel: '像素头像', reveal: '点击翻面', showPixel: '返回像素头像',
    showProfile: '查看成员资料', portrait: '真人肖像', profilePending: '照片及资料待确认',
    photoPending: '照片待确认', pixelPending: '像素头像待补充', roster: '成员职责与贡献',
  },
  members: [
    { id: 'austin', name: 'Austin Huang', chineseName: '黄子傲', role: '项目协调与系统集成', text: '负责项目协调，参与软件开发与树莓派系统集成。' },
    { id: 'alexis', name: 'Alexis Liu', chineseName: '柳灏宸', role: '人工智能与计算机视觉', text: '专注人工智能、计算机视觉与相关软件系统。' },
    { id: 'daniel', name: 'Daniel Wang', chineseName: '王大猷', role: '软件与算法', text: '参与软件实现、算法开发与功能流程连接。' },
    { id: 'angelina', name: 'Angelina Chen', chineseName: '陈奕帆', role: '硬件与软硬件集成', text: '负责硬件、嵌入式电路与软硬件集成。' },
    { id: 'lucas', name: 'Lucas Liu', chineseName: '刘昊朗', role: '产品与交互设计', text: '负责产品结构、模型与以使用者为中心的交互设计。' },
  ],
  hatch: {
    title: '认识全体成员', prompt: '准备好见到整个团队了吗？', open: '开启团队舱门', close: '关闭舱门',
    team: 'Aster 团队', intro: '我们一起把好奇变成想法，再把想法变成新的可能。', members: '查看团队成员',
  },
  journey: {
    title: '我们的历程', subtitle: '从一个想法，走向下一段探索。',
    milestones: [
      { title: '项目构想', subtitle: '项目构想与需求探索', detail: '了解宇航员面临的工作挑战，寻找智能机器人可以提供协助的环节。', image: 'Cora 设计多视图' },
      { title: '原型开发', subtitle: '原型开发与功能探索', detail: '开发 Cora 的实体结构，探索核心能力并测试早期交互概念。', image: 'Cora 官方原型模型' },
      { title: '下一步', subtitle: '测试、迭代与未来应用', detail: '持续改进平台，探索更多模块以及空间机器人的潜在应用。', image: '机械臂模块概念图' },
    ],
  },
  purpose: {
    title: '我们的使命与愿景',
    principles: [
      { title: '我们的使命', text: '让宇航员少花时间处理重复事务。Aster 正在开发 Cora，协助宇航员查找物资、更新记录和记录任务，让他们有更多时间专注于关键工作。', image: 'NASA 伽利略号拍摄的太空中的地球与太平洋云层' },
      { title: '我们的愿景', text: '让机器人协助成为太空生活的一部分。我们希望机器人能够支持宇航员的工作与日常生活，从空间站逐步走向未来的月球与火星栖息地。', image: '地球上空的国际空间站' },
    ],
  },
  valuePage: {
    back: '返回关于我们', title: '我们的价值',
    intro: '我们相信，对太空日常工作的支持，也能成为人类探索旅程中的一份贡献。',
    items: [
      { title: '为科学发现创造时间', text: '我们希望协助处理日常事务，让宇航员能将更多时间投入科研与探索。', image: '空间站舱内的设备与物资存放区域' },
      { title: '关注每一位探索者', text: '围绕探索者的需求开展设计，关注他们的工作、交流与舱内日常生活。', image: '地球上空，一名宇航员在空间站舱外工作' },
      { title: '为未来任务持续迭代', text: '我们计划逐步发展 Cora 的能力，探索未来空间站、月球与火星任务中的应用。', image: '未来火星栖息地概念图，画面中有宇航员与橙色火星地貌' },
      { title: '鼓励更多未来探索者', text: '通过分享实践与收获，鼓励更多年轻人理解航天机器人，并动手探索自己的想法。', image: '火箭从发射场升空，下方是升腾的尾焰与烟云' },
    ],
  },
  closing: {
    label: '下一步', title: '新的篇章，从这里开始。', intro: '让我们共同探索智能机器人能够为未来航天带来的更多可能。',
    contact: '联系我们',
  },
};
export default about;
