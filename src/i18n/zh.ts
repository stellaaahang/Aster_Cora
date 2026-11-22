import contact from './contact.zh.ts';
import about from './about.zh.ts';
import technology from './technology.zh.ts';
import type { Dictionary } from './en';
import product3d from './product.zh.ts';
const zh: Dictionary = {
  product3d,
  contact,
  technology,
  nav: { home: '首页', product: '产品', applications: '技术与场景', about: '关于我们', menu: '打开导航菜单', closeMenu: '关闭导航菜单', skip: '跳至正文', language: '网站语言', backTop: '返回顶部' },
  common: { explore: '探索 Cora', viewModel: '查看产品', learnMore: '了解更多', close: '关闭详情', concept: '未来概念', planned: '规划能力', prototype: '地面原型', pending: '待确认', imageError: '图片暂时无法加载', imageRetry: '重新加载', imageAlt: 'Cora，Aster 的模块化智能机器人平台', next: '下一项', previous: '上一项', select: '选择', status: '研发状态', teamAlt: 'Aster 团队五位成员合照', orbitAlt: '地球上空的国际空间站', sourceNote: '内容依据所提供的项目资料整理。飞行性能与具体任务适用性仍需验证。' },
  footer: { line: '为下一段探索，注入智能。', description: '模块化设计，在太空与你相伴。', copyright: '© 2026 Aster. 保留所有权利。', top: '返回顶部' },
  intro: {
    title: '探索，从这里开始。', description: '认识 Cora，一起探索更以人为本的太空未来。',
    skip: '跳过开屏', enter: '直接进入', passType: '探索通行证',
    stubTitle: '欢迎来到Aster太空。', pullOutward: '向外拉，开启探索',
    issuedBy: '来自 Aster 的邀请', tagline: '模块化智能，\n服务未来太空任务。',
    dragHorizontal: '抓住票根向外拉，开启探索。',
    keepPulling: '再拉一点，新的可能就在眼前。', release: '松开票根，开始探索。',
    opening: '正在开启下一段探索…', ready: '准备就绪，欢迎来到 Aster。',
    stubAria: '撕开探索通行证，进入首页。可按回车键、空格键，或向外拖动票根。',
    imageAlt: 'Cora 与地球上空的空间站线稿',
  },
  home: {
    sectionNavigation: '首页章节',
    hero: {
      title: '欢迎登舱', subtitle: '与 Cora 一起，探索太空机器人的未来。',
      description: '认识 Cora，由 Aster 开发的智能舱内机器人助手。',
      start: '开启探索之旅', meet: '认识 Cora', greetCora: '向 Cora 打个招呼', continueGuide: '与 Cora 继续探索',
      clickHint: '点击 Cora，打个招呼', guideLabel: 'Cora 互动导览',
      guideMessages: ['你好，我是 Cora，今天由我带你探索！', '欢迎登舱，让我们一起探索太空机器人的未来。'],
      smilingAlt: '前置屏幕显示友好笑脸的 Cora',
      listen: '试听 Cora 的声音', stop: '停止语音试听', voiceUnavailable: '当前浏览器暂不支持语音试听',
      voicePlaying: 'Cora 正在说话。', voiceStopped: '语音试听已停止。', voiceError: '语音暂时无法播放，请重试。',
      voiceLoading: '正在准备 Cora 的声音…', voiceNotReady: 'Cora 的声音尚未准备好，请稍后再试。',
    },
    whyCora: {
      title: '为什么需要 Cora？',
      description: '在执行主要任务之余，宇航员还需要查找物资、更新库存记录，并向下一班成员交接工作。Cora 从这些日常舱内事务切入，为宇航员提供协助。',
      action: '探索我们的旅程',
      imageAlt: '国际空间站舱内的设备柜和物资',
    },
    journey: {
      title: '我们的旅程', subtitle: '从地面原型出发，探索 Cora 在空间站、月球与火星任务中的应用。',
      previous: '上一站', next: '下一站',
      pause: '暂停环绕', resume: '继续环绕', detailNav: '旅程详情',
      stages: [
        {
          label: '地球', phase: '地面原型', title: 'Cora 的起点',
          description: 'Cora 源于一个实际问题：如何让宇航员少花时间处理重复事务？我们的地面原型已展示二维码识别、语音交互和地面移动等基础功能。',
          imageAlt: 'Cora 白色机身、前置屏幕与四角涵道的模型渲染', caption: 'Cora 模型渲染',
        },
        {
          label: '发射', phase: '验证计划', title: '为任务验证做准备',
          description: '下一步是在模拟舱中测试 Cora 的硬件接口、宇航员操作流程与系统集成，为后续飞行试验做准备。',
          imageAlt: '火箭在尾焰和烟雾中升空', caption: '发射场景示意照片',
        },
        {
          label: '轨道', phase: '验证计划', title: '验证轨道环境下的运动能力',
          description: '未来将验证 Cora 在微重力环境下如何移动、确定自身位置，并在指定位置稳定停留。',
          imageAlt: 'Cora 在空间站舱内通道中漂浮的概念图', caption: '舱内移动概念图',
        },
        {
          label: '空间站', phase: '应用设想', title: '协助空间站日常工作',
          description: '在空间站内，Cora 可协助宇航员查找工具、扫描标签、更新库存记录，并把信息留给下一班成员。',
          imageAlt: 'Cora 面向空间站舱内设备柜的概念图', caption: '空间站作业概念图',
        },
        {
          label: '月球', phase: '未来迭代', title: '支援月面基地',
          description: '在月面基地，升级版 Cora 可协助宇航员在出舱前后核对装备、在舱内运送小件物资，并搭载任务模块巡检指定区域。',
          imageAlt: '月球表面的宇航员与设备', caption: '月面场景参考',
        },
        {
          label: '火星', phase: '长期愿景', title: '支援火星长期驻留',
          description: '在火星长期驻留期间，进一步迭代的 Cora 可按计划执行巡检、记录异常读数，并在舱内汇总信息，帮助团队安排维护工作。',
          imageAlt: '火星地表上栖息舱模块的概念图', caption: '火星栖息舱概念图',
        },
      ],
    },
    meetCora: {
      title: '认识 Cora', subtitle: '以智能与模块化设计，探索未来空间站机器人的可能。',
      action: '探索 Cora',
    },
    slogan: '面向太空任务的\n智能舱内助手。', intro: '以模块化机器人平台连接日常辅助与可拓展工具，探索更以人为本的太空未来。', view: '浏览产品视图', visualCaption: '为地球之外的工作与生活而设计。', scroll: '探索更多可能', valuesTitle: '一个平台，\n更多可能。', valuesIntro: '连接感知、交互与任务工具，让日常辅助更容易调用，也更灵活适配。',
    values: [
      { title: '智能任务辅助', text: '将日常请求、信息与任务支持，连接到同一个易用平台。' },
      { title: '多模态感知', text: '结合视觉观察与语音输入，让每一次交互更有帮助。' },
      { title: '模块化拓展', text: '保留通用核心，按不同任务的需要配置协作工具。' },
      { title: '人机协作', text: '以人为中心，通过清晰反馈与受控操作提供支持。' }
    ],
    discoverTitle: '进一步认识 Cora。', discover: [
      { title: '为灵活适配而设计。', text: '了解平台设计，以及机身内的技术思考。', action: '探索产品' },
      { title: '从舱内日常作业，\n走向未来探索。', text: '探索未来太空栖息地的日常辅助场景。', action: '了解应用场景' },
      { title: '带着初衷出发。', text: '认识将目光投向更远处的学生团队。', action: '认识 Aster' }
    ]
  },
  product: {
    heroDescription: '为未来舱内作业提供支持的模块化智能机器人平台。', title: 'Cora', intro: '通用核心，\n开放的任务可能。', sub: '从真实产品设计出发，探索围绕未来太空栖息地中人与任务而构建的模块化机器人平台。', anchors: ['产品概览', '核心功能', '技术架构', '模块化设计', '产品规格'],
    viewer: { title: '从每一面，认识 Cora。', description: '浏览真实产品图片，点击部件热点，了解设计细节。', imageMode: '产品图片浏览', note: '图片预览 · 三维模型待接入', unavailable: '白色外壳效果展示，当前为图片预览。提供适用于网页的模型文件后，将接入真实三维交互。', zoomIn: '放大图片', zoomOut: '缩小图片', reset: '重置视图与缩放', imageZoom: '图片缩放比例', viewLabel: '产品视角', views: ['透视', '正面', '左侧', '背面', '右侧', '顶部', '底部'], hotspotHint: '点击部件热点，探索产品', hotspotLabel: '查看部件：', previewAlt: 'Cora 产品图片，', noHotspots: '部件热点可在透视视图中查看。', loading: '正在加载三维模型…', modelError: '三维模型加载失败，仍可浏览产品图片。', imageFallback: '使用产品图片',
      hotspots: [
        { title: '前置显示屏', text: '前置屏幕用于呈现识别结果、设备状态与交互反馈。', detail: '向使用者提供直观的信息反馈。' },
        { title: '感知系统', text: '在地面原型中，摄像头为二维码识别与人脸检测提供共用的图像输入。', detail: '清晰观察，是感知的起点。' },
        { title: '角部推进单元', text: '八顶角涵道风扇构型用于研究增压舱内微重力环境下的多方向运动。推力、力矩与姿态控制仍需进一步验证。', detail: '推进方案研究，尚未经飞行鉴定。' },
        { title: '侧面模块接口', text: '机身双侧接口面向未来任务工具拓展，共用计算与交互核心。', detail: '让未来工具共用一个基础平台。' },
        { title: '散热结构', text: '提供的产品设计中可见通风面板。散热性能与运行边界尚待测试验证。', detail: '围绕整体系统进行集成设计。' }
      ]
    },
    functions: { title: '用心构建核心，\n按需拓展能力。', intro: '了解现有地面原型功能，以及我们正在探索的未来能力。', tabs: [
      { title: '自主移动', heading: '向更自主的运行迈进。', text: '地面原型已用于演示受控移动。舱内自主导航与微重力推进属于研发目标，定位、推力和姿态控制仍待测试。', tag: '规划能力', items: ['地面受控移动', '本地权限与停止检查', '未来定位与路径规划'] },
      { title: '环境感知', heading: '更好地了解舱内环境。', text: '摄像头观察构成现有视觉输入。未来传感器模块可进一步拓展平台，为舱内任务采集环境信息。', tag: '规划能力', items: ['共用摄像头输入', '按任务拓展感知工具', '环境测量能力待验证'] },
      { title: '计算机视觉与 AI', heading: '从观察，到有用的信息。', text: '地面原型结合二维码解析、人脸检测与表情分类，并将视觉事件与屏幕、语音流程协同连接。', tag: '地面原型', items: ['基于二维码的物资识别', 'OpenCV 视觉处理', '结合上下文的交互事件'] },
      { title: '设备监测', heading: '支持日常设备检查。', text: '未来监测流程可将视觉记录与兼容工具连接，为宇航员回顾设备状况提供帮助。自主故障检测尚未验证。', tag: '规划能力', items: ['设备视觉记录', '兼容传感工具', '由使用者复核观察结果'] },
      { title: '宇航员交互', heading: '辅助，从一个请求开始。', text: '语音输入、前置显示屏与本地控制检查，将使用者连接到设备功能。地面原型当前通过联网流程使用语言服务。', tag: '地面原型', items: ['本地语音唤醒', '语音与屏幕反馈', '明确的控制权限'] },
      { title: '任务记录', heading: '记录值得保留的细节。', text: '语音请求可触发拍照、保存图像并反馈完成状态。与任务编号、时间关联的记录功能属于后续拓展方向。', tag: '地面原型', items: ['语音请求拍照', '图像保存与完成反馈', '未来关联任务的记录'] }
    ] },
    technology: { title: '各司其职，协同运行。', intro: '分布式嵌入式架构为感知、交互与控制划定清晰职责。点击任一层，了解系统如何连接。', caption: '系统架构 · 功能关系示意', nodes: [
      { title: '感知采集', label: '摄像头与输入', heading: '共用的环境观察入口。', text: '摄像头图像进入二维码解析与人脸分析，麦克风输入进入音频处理链路。传感器拓展仍属于按任务配置的概念。' },
      { title: '信息处理', label: '树莓派', heading: '将输入，转化为有用事件。', text: '树莓派承担视觉处理、图形界面与设备协调。Python、OpenCV、NumPy 和 Pygame 支持这些原型流程。' },
      { title: '运行控制', label: 'Board A → Board B', heading: '请求与执行，清晰分工。', text: 'Board A 管理运动请求、权限与控制来源，Board B 驱动风扇。状态检查、心跳处理与停止逻辑共同协调执行。' },
      { title: '人机交互', label: 'ESP32-S3 与显示屏', heading: '让使用者始终参与其中。', text: 'ESP32-S3 管理音频采集、本地唤醒与播放。联网语言服务将请求连接到支持的工具，并通过屏幕和扬声器反馈。' },
      { title: '模块拓展', label: '双侧接口', heading: '随着任务演进，增加工具。', text: '通用计算与交互平台面向可更换的任务工具。接口可靠性与搭载配置仍需进一步开发与测试。' }
    ] },
    modules: { title: '同一核心，\n不同任务。', intro: '选择一个工具，探索模块化构想。各模块均为未来拓展，使用提供的概念渲染图展示。', interface: 'Cora 双侧模块接口', connection: '接口概念示意', imageNote: '概念渲染图 · 连接方式为示意', items: [
      { title: '载物箱', text: '带锁扣的紧凑型载物容器概念，用于在工作区域之间转运小型物资与研究用品。', use: '小型物资转运' },
      { title: '温度传感器模块', text: '面向特定环境检查任务的感知工具概念，用于采集局部温度观察数据。', use: '局部环境采样' },
      { title: '机械臂', text: '面向未来受控操作的紧凑型机械臂概念。工作范围、载荷与操作安全性仍待验证。', use: '受控物体操作' },
      { title: '泵阀操作模块', text: '面向流体处理与阀门相关辅助任务研究的可配置工具概念。', use: '特定任务流体辅助' }
    ] },
    specs: { title: '平台信息，一目了然。', intro: '以下为现有架构信息。经过测量与验证的硬件规格，将在后续补充。', columns: ['参数', '当前信息'], rows: [
      ['研发阶段', '地面原型，尚未经飞行鉴定'], ['主计算平台', '树莓派'], ['语音交互', 'ESP32-S3'], ['运动控制', 'Board A / Board B 分布式控制'], ['模块连接', '双侧接口设计'], ['尺寸与质量', '待测量确认'], ['功耗与续航', '待测试确认'], ['推进与导航性能', '待验证确认']
    ] }
  },
  applications: {
    title: '从舱内日常作业，\n走向未来探索。', intro: '从空间站的日常作业，到探索的下一篇章。了解通用机器人平台未来可以发挥作用的场景。', sceneLabel: '任务场景', conceptNote: '应用概念 · 使用提供的场景示意图', selectLabel: '选择任务场景', flowTitle: '从请求，到回应。', flowIntro: '清晰、以人为中心的任务闭环。选择一个阶段，了解请求如何在系统中传递。', stepsLabel: '任务流程示意',
    scenarios: [
      { title: '舱内巡检', short: '舱内巡检', description: '辅助工作区域与设备的日常视觉检查，提供图像记录，供宇航员复核。', steps: ['请求视觉检查', '观察任务区域', '复核并保存记录'] },
      { title: '环境监测', short: '环境监测', description: '通过兼容感知模块探索舱内局部环境观察，并将信息呈现给使用者复核。', steps: ['选择感知任务', '采集局部信息', '报告数据供复核'] },
      { title: '物资与库存支持', short: '物资支持', description: '通过二维码识别显示并朗读物品信息。将物品关联存放区域属于后续拓展方向。', steps: ['呈现物品标签', '解析二维码信息', '显示并朗读结果'] },
      { title: '任务协助与人机交互', short: '任务协助', description: '通过统一、易用的界面，连接语音请求、拍照记录与清晰的完成反馈。', steps: ['接收语音请求', '调用支持的工具', '确认任务完成'] }
    ],
    workflow: [
      { title: '任务请求', text: '宇航员提出明确的请求。支持的工具与控制权限共同决定平台可执行的操作。' },
      { title: '环境感知', text: '摄像头或兼容传感器采集所选任务需要的信息。' },
      { title: 'AI 分析', text: '相应的视觉或语言处理将输入转化为信息。运动请求仍需通过本地检查。' },
      { title: '反馈与记录', text: '屏幕和语音界面报告结果，并保存支持的记录，便于后续复核。' }
    ],
    futureTitle: '为更远的未来而探索。', futureIntro: '以下均为未来研究方向。每一种用途都需要针对任务进行适配、鉴定与集成。', future: [
      { title: '商业空间站', text: '为新兴的轨道工作环境探索可配置辅助。' },
      { title: '长期太空任务', text: '为长期远离地球的宇航员提供任务支持。' },
      { title: '月球栖息地', text: '面向未来增压地表栖息地的灵活工具。' },
      { title: '深空探索', text: '关于更独立任务支持的长期愿景。' }
    ], productLink: '探索任务背后的平台'
  },
  about,
};
export default zh;
