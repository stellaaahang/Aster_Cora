# Mission Scenarios — Apple Cards Carousel

2026-11-21：仅将 Tech & Scenarios 的四个任务场景改为图片叠字的横向轮播，并移除该页末尾的 Multi-Robot Collaboration 图文区块。Product 页的 More Possibilities 保留。

来源为用户附件中的三文件实现及 [Aceternity Apple Cards Carousel](https://ui.aceternity.com/components/apple-cards-carousel)。项目没有 components.json，采用手动接入。

主要文件：

- `src/components/ui/apple-cards-carousel.tsx`：保留 CarouselContext、Carousel、Card、BlurImage 导出。
- `src/hooks/use-outside-click.tsx`：保留 useOutsideClick 导出。
- `src/components/technology/MissionScenarioCarousel.tsx`：Aster 的消费组件，替代附件的通用 demo。
- `src/components/technology/TechnicalSections.tsx`：移除旧的四组左右图文和该页的多机协作区块。
- `src/i18n/technology.en.ts`、`technology.zh.ts`：保留四个场景原文，补齐图片替代文字与轮播按钮翻译。

与附件的接入差异及原因：

1. 使用现有 Vite/React，Next Image 改为原生 img；移除 fill、blurDataURL 等 Next 属性。路径改为相对导入，沿用现有 cn；JSX.Element 与 RefObject 类型适配 React 19。新增 Tabler 图标依赖，Motion、clsx、tailwind-merge 复用项目安装版本。
2. 用 Aster 的四个场景、概念标注和项目已有图片替换通用 iSad 内容。任务影像卡使用现有舱内实验照片，替代旧像素场景。保留源组件的纵向图片尺寸、圆角、渐变叠层、白色标题、水平滚动和圆形箭头等 Tailwind 样式；消费组件的详情图片与正文也使用 Tailwind。
3. 点击卡片展示原场景说明，详情内保留进入 Try Cora 对应演示的按钮。打开任务模块时仍选择温度传感器。消费组件命名体现用途，避免保留无关 demo。
4. 图卡、标题与分类使用稳定实例 ID，避免双语标题变化或多个实例造成布局动画冲突。进入动画保留源组件 0.5 秒、0.2 秒间隔和 easeOut，改为首次进入视野时触发。
5. 详情通过 portal 渲染到 body，层级提高至 200，覆盖现有固定导航。补充 dialog 语义、焦点约束、Escape、关闭后焦点恢复、背景 inert 与滚动锁定清理，避免导航或背景仍可操作。点击外部的监听仅在展开时启用，鼠标和触摸统一使用 pointerdown。
6. 关闭后按真实卡片位置定位轮播，代替源代码的固定宽度估算；ResizeObserver 更新箭头边界。补充本地化按钮名称与键盘方向键、Home/End，保持浏览器原生纵向滚动。
7. 源码没有完整的减少动态效果处理，因此接入现有动态订阅的 prefers-reduced-motion hook；开启时取消位移、延迟、共享布局与平滑滚动，保留内容及全部操作。

验证入口为现有 `scripts/technology-browser-check.mjs`：任务卡先展开详情，再验证其按钮激活原 Try Cora 演示。

实际验证：构建成功，10 项单元测试与技术页全部 7 组浏览器回归检查通过。另行核对了 1440px/390px 双语叠字、箭头边界、键盘浏览、详情焦点约束、Escape、点击外部关闭、关闭后焦点恢复、语言切换保持横向位置，以及真实触摸滑动、深色模式和减少动态效果。
