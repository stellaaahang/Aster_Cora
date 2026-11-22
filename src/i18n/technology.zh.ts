import type EnglishTechnology from './technology.en.ts';

const technology: typeof EnglishTechnology = {
  hero: { title: '与 Cora 一起行动' },
  lab: { title: '体验 Cora', intro: '选择一项能力，看看 Cora 如何回应。', demo: '交互概念演示', concept: '交互概念演示', select: 'Cora 能力' },
  features: { companion: '陪伴交互', qr: '二维码识别', voice: '语音交互', modules: '模块化设计', photo: '拍照记录', motion: '运动控制' },
  speech: { play: '播放语音', stop: '停止播报', unavailable: '当前浏览器不支持语音播报。' },
  pixel: { idle: '待机状态的 Cora', happy: '开心表情的像素 Cora', calm: '平静表情的像素 Cora', working: '工作状态的像素 Cora', down: '嘴角下垂、带一滴眼泪的 Cora', standby: '半闭眼、显示睡眠符号的 Cora', worried: '担忧表情的像素 Cora' },
  companion: {
    title: '你今天感觉怎么样？', intro: '选择此刻的心情，看看 Cora 会如何回应。',
    greeting: '嗨！我是 Cora。你今天感觉怎么样？', choose: '选择心情',
    moods: {
      happy: { label: '开心', reply: '听起来真好。今天有什么让你开心的事？' },
      down: { label: '低落', reply: '我会在这里陪着你。你想聊一聊，还是一起安静待一会儿？' },
      tired: { label: '疲倦', reply: '你已经忙碌很久了。要不要短暂休息一下？' },
      worried: { label: '担忧', reply: '你愿意说说正在担心什么吗？我们可以一步一步来。' },
    },
  },
  qr: {
    intro: '扫描空间站设备的示例标签，体验 Cora 如何查找设备信息。', sample: '示例设备标签',
    scan: '扫描示例二维码', upload: '选择二维码图片', reset: '重置', fileHint: 'PNG、JPG 或 WebP · 最大 5 MB · 在当前设备上解析',
    scanning: '正在读取二维码…', unreadable: '未能读取此二维码，请重试。', invalidFile: '请选择不超过 5 MB 的 PNG、JPG 或 WebP 图片。',
    noMatch: '二维码已解码，示例设备库中没有对应记录。', result: '识别结果', raw: '解码内容', id: '设备编号', equipment: '设备', location: '位置', status: '状态',
    record: { name: '示例载物箱', location: 'A-02 储物架', status: '已识别示例设备' },
  },
  voice: {
    intro: '用语音给 Cora 下达舱内任务，或选择一条示例指令。', choose: '示例语音指令',
    hold: '按住说话', listening: '正在聆听…', recognizing: '正在识别语音…', executing: 'Cora 正在执行任务…',
    unavailable: '当前环境无法使用麦克风识别。请试试示例指令。',
    denied: '麦克风权限未获允许。请试试示例指令。',
    missed: 'Cora 未能识别这条指令。请重试或选择示例。',
    reply: 'Cora 的回复', photoLink: '进入拍照记录', viewfinder: '已准备拍摄任务', inventory: '示例物资清单',
    name: '名称', location: '位置', status: '记录状态', tool: '工具箱', toolRack: 'B-04 储物架', current: '记录已更新',
    commands: {
      locate: { text: '找到工具箱。', reply: '工具箱在 B-04 储物架。' },
      photo: { text: '拍一张照片。', reply: '拍摄任务已准备好。进入拍照记录即可取景。' },
      inventory: { text: '显示物资清单。', reply: '这是示例物资清单和最新记录的位置。' },
    },
  },
  modules: {
    title: '为 Cora 搭配任务模块', intro: '将模块拖到 Cora 上，探索不同的任务组合。',
    choose: '选择任务模块', hotspot: 'Cora 侧面接口', release: '松手连接', attached: '模块已连接',
    attach: '连接模块', remove: '移除模块', failed: '组合图片未能加载，请重试连接。',
    uses: {
      cargo: '在不同工作区域之间运送小件物资。',
      temperature: '采集指定位置的温度读数。',
      arm: '搭载专用工具，探索物品操作任务。',
      pump: '探索特定任务中的流体转移与控制。',
    },
    contact: { title: '还有其他可能？', text: '告诉我们，你希望 Cora 完成什么任务。', link: '联系我们' },
  },
  photo: {
    intro: '选择场景，将两位宇航员拖入画面。',
    backgrounds: '选择场景', tray: '宇航员准备区', astronaut: '宇航员', frame: '拍摄画面',
    placement: '选中宇航员后可点击放置，或用方向键微调位置。',
    reset: '重置场景', ready: '两位宇航员已进入画面。', pending: '请将两位宇航员放入画面。', loading: '正在载入宇航员…',
    failed: '宇航员素材未能加载，请刷新页面重试。',
    capture: '拍照', retake: '重拍', time: '拍摄时间', result: '成片', shutter: '拍摄完成',
    scenes: ['实验记录', '设备维护', '乘组合照'],
  },
  motion: {
    intro: '选择目的地，体验简化的机器人导航流程。', concept: '运动控制概念演示', map: '舱内路线示意图',
    start: '起点', choose: '选择目的地', moving: '正在前往目的地', reached: '已到达目的地', destinations: ['储物区', '工作台', '巡检点'],
  },
  core: {
    title: '核心技术', intro: '探索 Cora 的地面原型与未来任务设想。',
    groups: ['识别与交互', '运动与记录', '乘员支持与任务扩展'],
    items: {
      qr: '通过物品标签关联数字库存记录。',
      voice: '将语音指令转化为任务反馈。',
      motion: '展示 Cora 如何移动并接近任务位置。',
      photo: '拍摄任务画面，保留可回看的影像记录。',
      companion: '回应日常情绪表达与交流需求。',
      modules: '通过可更换模块适应不同任务。',
    },
  },
  scenarios: {
    title: '任务场景', intro: '探索 Cora 可以如何协助完成舱内的日常任务。',
    previous: '上一组场景', next: '下一组场景',
    status: '概念场景',
    items: [
      { title: '物资盘点与交接', text: '宇航员需要查找工具并核对它的最新位置。Cora 可协助识别物品、更新记录，让下一班成员获得清晰的交接信息。', action: '体验二维码识别', alt: 'Cora 在空间站舱内识别带标签的物资，旁边展示库存记录示意。' },
      { title: '环境巡检', text: '宇航员需要持续了解舱内环境状态。未来搭载传感模块的 Cora 可在指定位置采集读数，并留下供团队查看的记录。', action: '探索任务模块', alt: '白色 Cora 的侧面接口连接温度传感器模块。' },
      { title: '任务影像记录', text: '实验操作、设备维护和乘组活动都可能需要事后回看。Cora 可协助拍摄这些过程，留下可查阅的影像。', action: '体验拍照记录', alt: '摄像头视角下，戴手套的双手在空间站实验台记录实验过程。' },
      { title: '日常陪伴', text: '长期任务中，宇航员也需要交流或独处的片刻。Cora 的陪伴功能设想提供了一个表达感受、简单交流或安静休息的入口。', action: '体验陪伴互动', alt: '哑光白 Cora 在空间站舱内显示友好的微笑表情。' },
    ],
  },
  next: {
    label: '走向空间站之外', title: '下一项任务，等你开启。',
    intro: '从今天的空间站作业，到未来的月球与火星探索，Aster 希望打造新一代可适应不同任务的机器人伙伴，支持人类走向地球之外。',
    link: '了解我们的愿景',
  },
};
export default technology;
