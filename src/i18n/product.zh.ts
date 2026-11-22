import type productEn from './product.en';
const product3d: typeof productEn = {
  overview: {
    title: '认识 Cora', subtitle: '探索每一处细节',
  },
  viewer: {
    label: 'Cora 交互式三维查看器', description: 'Cora 官方三维模型。拖拽旋转，或使用视角按钮。聚焦此区域后，可用方向键旋转，加减键缩放。', official: 'Cora 官方模型', fullscreen: '进入全屏', exitFullscreen: '退出全屏', hotspotPrefix: '探索',
    loading: '正在准备 Cora 三维模型…', error: '暂时无法显示 Cora 三维模型。请重试，或切换至静态视图继续浏览。', retry: '重新加载三维模型', zoomOut: '缩小模型', zoomIn: '放大模型', zoom: '模型缩放比例', reset: '复位视角', viewsLabel: '模型相机视角', views: ['正面', '左侧', '右侧', '背面', '顶部', '底部'],
    dragHint: '拖拽旋转 · 滚轮缩放 · 聚焦后可用方向键操作', touchHint: '可直接滚动页面，或启用触摸旋转来查看 Cora。', touchActive: '拖拽旋转 · 双指缩放', rotate: '启用旋转', scroll: '启用页面滚动', static: '静态视图', return3d: '返回三维视图',
  },
  structure: {
    title: '探索 Cora 的设计', intro: '近距离了解构成 Cora 能力的各个部件。', select: '选择一个部件', prompt: '点击 Cora 上的热点，了解相应结构。', selected: '已选部件',
    items: [
      { title: '视觉与感知', text: 'Cora 正面的感知区域面向视觉交互与设备识别概念而设计。', alt: '白色 Cora 机身正面的传感器组件特写。' },
      { title: '交互式显示屏', text: '前置显示屏为信息呈现、任务反馈与宇航员交互提供可视化界面。', alt: 'Cora 前置显示屏特写，屏幕展示信息界面示意。' },
      { title: '模块化接口', text: 'Cora 两侧的接口旨在支持专用任务模块与未来能力拓展。', alt: 'Cora 白色侧面板上的圆形模块接口特写。' },
      { title: '机械结构', text: 'Cora 将机械部件集成于紧凑的平台中，面向空间站作业需求开展设计。', alt: '用户提供的哑光白 Cora 斜俯视图，展示外壳、散热结构与角部单元。' },
      { title: '控制与内部设计', text: 'Cora 通过紧凑的机身结构整合机械与控制相关部件。', alt: '白色 Cora 的背面视图，展示外部控制开关与检修面板。' },
    ],
  },
  display: {
    title: '切换显示模式', label: '显示屏模式', working: '工作中', modes: ['待机模式', '工作模式', '陪伴模式'], original: '保留模型原始外观。', awake: '屏幕已点亮。选择一个模式查看对应表情。',
    descriptions: ['平静的待机表情。', '专注的表情与任务状态。', '带有轻柔眨眼的友好笑脸。'],
  },
  capabilities: {
    title: 'Cora 的核心设计',
    gallery: 'Cora 的五项核心设计',
    carousel: '轮播图',
    hint: '拖动或滑动浏览 · 聚焦后可使用方向键',
    navigation: '浏览核心设计', previous: '上一项设计', next: '下一项设计',
    qr: {
      text: '识别物资标签，辅助完成舱内库存管理。',
      alt: '概念示意图：Cora 在空间站舱内扫描物资标签。',
      identified: '已识别物资', location: '存放位置', record: '库存记录',
    },
    voice: { text: '通过自然语音指令与 Cora 交互。', alt: '哑光白 Cora 旁显示蓝色人声声波图标。' },
    motion: { text: '在空间站舱内移动并执行任务。', alt: 'Cora 沿标出的路径在空间站舱内移动。' },
    photo: { text: '通过拍照记录舱内实验与日常活动。', alt: '摄像头视角下，戴手套的双手在空间站实验台操作设备。' },
    companion: { text: '通过友好的日常交流，提供情绪陪伴与支持。', alt: '哑光白 Cora 模型在空间站舱内显示微笑表情。' },
  },
  possibilities: {
    title: '更多可能', status: '未来能力概念',
    modular: {
      title: '模块化拓展',
      text: '通过机身双侧的模块接口，Cora 可根据不同任务搭载专用工具，持续拓展空间站舱内作业能力。',
      imageAlt: '概念示意图：哑光白 Cora 的侧面接口旁展示白色载物箱、机械臂与温度传感器模块，空间站舱内背景柔和虚化。',
      artworkAlt: '概念图：哑光白 Cora 旁展示白色载物箱、机械臂和温度传感器模块，舱内背景柔和虚化。',
    },
    collaboration: {
      title: '多机协作',
      text: '未来，多台 Cora 可通过信息共享与任务协调，共同执行更复杂的空间站舱内任务。',
      imageAlt: '概念示意图：一台 Cora 扫描物资标签，另一台沿任务路线前往另一处储物区，虚线表示数据共享。',
      artworkAlt: '概念图：两台白色 Cora 通过任务模块协作搬运载物箱，技术工作区背景柔和虚化。',
    },
  },
  modules: {
    items: [
      { title: '机械臂', short: '物体搬运与设备协助', text: '面向物体搬运与特定设备操作的潜在专用任务模块。', use: '设备操作与维护协助。' },
      { title: '载物箱', short: '小型物品运输', text: '可拓展载物模块，旨在支持空间站内小型物品的运输与递送任务。', use: '货物搬运与物资运输。' },
      { title: '温度传感器', short: '环境监测', text: '面向环境或设备温度信息采集的监测模块概念。', use: '环境与设备监测。' },
      { title: '泵阀模块', short: '流体控制概念', text: '面向未来流体处理与阀门相关操作的专用模块概念。', use: '流体控制协助与实验操作。' },
    ],
  },
  value: {
    title: '为下一步探索而设计', items: [
      { title: '面向空间站作业', text: '旨在为空间站内的日常任务、信息获取与作业流程提供协助。' },
      { title: '模块化设计', text: '通过侧面接口探索专用任务工具与可拓展机器人能力。' },
      { title: '以人为本的交互', text: '围绕信息、沟通与日常协助，探索支持宇航员工作的交互方式。' },
    ],
  },
  closing: { title: '探索 Cora 的更多可能', text: '了解 Cora 面向空间站任务协助所采用的技术思路与交互能力。', cta: '探索 Cora 的技术' },
};
export default product3d;
