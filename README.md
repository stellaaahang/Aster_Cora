# Aster / Cora 官方网站

部署交付包：请先阅读 [部署说明.md](部署说明.md)。已附本次构建的 `dist/`、完整源码、素材和托管配置。

基于 React 19、TypeScript 和 Vite 的可维护双语网站。当前交付为本地项目，未发布到互联网。

## 本地运行

建议 Node.js 24+（本机使用 Node.js 26；项目也支持随附 Node.js 24）。

```sh
cd "/Users/stella/Desktop/Aster_Cora"
npm install
npm run dev
```

分享预览时统一使用带 `?intro=preview` 的首页链接。每次打开都会显示原版探索通行证，撕票、跳过或直接进入后可通过导航查看本次更新的页面。[打开完整预览](http://127.0.0.1:5173/?intro=preview)

预览期间请保持开发服务运行。`strictPort` 已启用，端口占用时可关闭原服务或使用 `npm run dev -- --port 5174`，并在预览链接中使用对应端口。

```sh
npm run check   # TypeScript
npm test        # 双语资源结构、素材、内容与模型降级约束
npm run build  # 类型检查并生成 dist/
npm run preview # 查看生产构建，默认 http://127.0.0.1:4173/?intro=preview
```

使用 Vite 的 `runner` 配置加载器，并通过 overrides 固定 esbuild 0.25.12，兼容本机配置加载与依赖预构建。Vite 保留在修复了依赖审计问题的 7.3.7 版本。字体与页面素材随项目提供，联系表单通过 FormSubmit 转发邮件。

## 探索通行证开屏

首次访问首页会显示蓝白探索通行证。拖动票根撕开，或选择“跳过／直接进入”，即可进入 Home。完成后在当前浏览器中记住，不会在正常刷新或站内跳转时重复出现。直接访问其他页面不受影响。

随时复看开屏：**http://127.0.0.1:5173/?intro=preview**。每次打开开屏时先显示英文，可手动切换中文并保持到后续页面。此参数仅供主动复看；正常访问仍遵循首次显示规则。首次状态键为 `aster.exploration-pass.v1`，与语言状态分离。

桌面和手机均使用横向票券，向右撕开票根。开屏以空间站线稿替代产品图，英文欢迎语为“Welcome to Aster Space”，中文为“欢迎来到Aster太空。”。支持键盘 Enter／空格键、Escape、触摸及减少动态效果。详见 [docs/OPENING-PASS.md](docs/OPENING-PASS.md)。

## 页面与交互

- `/`：Welcome Aboard 首屏、Cora 笑脸与导览语音、Why Cora、Earth 到 Mars 六站轨道及独立详情、Meet Cora。
- `/product`：官方哑光白 GLB、六面视图、旋转缩放与全屏、部件热点、屏幕状态、Cora's Core Design 图标入口和 More Possibilities。
- `/applications`：Try Cora 六项演示、核心技术、四张图片叠字的 Mission Scenarios 轮播卡片与详情。
- `/about`：像素与真人照片翻面、舱门合照揭幕、使命与愿景、Our Value 和联系入口。
- `/about/value`：价值详情；`/contact`：中英文联系表单。
- `/technology`：原有核心技术区的兼容跳转。

首次访问固定英文，不读取浏览器语言。语言保存在 `aster.language.v1` 中，切换时保留当前路由、滚动位置与当前交互选项。存储不可用时仍能切换语言。测试首次默认英文时可在开发者工具中清除此项。

所有选项卡支持方向键、Home / End；热点支持触摸与键盘，Escape 关闭详情。移动端有折叠菜单。动画尊重 `prefers-reduced-motion`。陪伴演示使用用户提供的 Cora 像素图。

全站检查使用 `scripts/browser-check.mjs`，技术页交互检查使用 `scripts/technology-browser-check.mjs`。两者均需要环境中安装 Playwright 和 Google Chrome。可通过 `PREVIEW_URL` 指定开发或生产预览地址；检查覆盖双语、四个响应式宽度、热点、选项卡、菜单、语言状态和运行时错误。

## 目录

```text
src/
  components/   # 导航、页脚、图标、图片降级、通用选项卡、产品浏览器
  pages/        # Home / Product / Applications / About
  i18n/         # en.ts / zh.ts / I18nProvider.tsx
  config/       # product.ts：图片、视图、热点与模型配置
  hooks/        # 轻量滚动进入动画
  styles.css    # 全站设计变量、下方内容区块
  styles/reference.css # 参考图对应的四页首屏构图
  styles/home-orbit.css # 最新空间站 Home 与全站玻璃胶囊导航
public/
  images/       # 经裁剪和压缩的用户素材
  models/       # 官方 Cora GLB，保留源文件
scripts/        # 原始素材预处理脚本（仅重处理素材时需要 Pillow）
tests/          # 资源和内容完整性检查
```

## 修改内容

- 文案：同步编辑 `src/i18n/en.ts` 与 `src/i18n/zh.ts`。TypeScript 和 `npm test` 检查两种语言的结构是否一致。
- 图片与模块：将新图片放入 `public/images/`，再修改 `src/config/product.ts`。
- 颜色、字体、间距与断点：编辑 `src/styles.css` 及 `src/styles/`。正文与导航使用自托管 Inter，标题使用自托管 Manrope，中文优先使用系统中的思源黑体 / Noto Sans SC，其次使用苹方等本地中文字体。
- 产品页文案：同步编辑 `src/i18n/product.en.ts`、`src/i18n/product.zh.ts`。经确认的规格由团队提供后再展示。
- 模块扩展：同步更新 `src/config/coraModel.ts` 的 `missionModules` 和两个产品词典的 `modules.items`。

## 3D 状态和接入

产品页加载 `public/models/cora-matte-white.glb`，与 `天巡者_实拍版_哑光白.glb` 字节一致。三维引擎按需加载，静态回退图由同一 GLB 渲染。手机端点击“启用旋转”后可拖动或双指缩放，点击“启用页面滚动”返回。

四种模块目前使用概念图进行对齐示意。真实装配需要模块 GLB 与确认的接口变换。模型标定、屏幕叠层、导图与更新方法见 [docs/3D-INTEGRATION.md](docs/3D-INTEGRATION.md)。交互回归脚本为 `scripts/product-browser-check.mjs`。

## 部署

GitHub Pages 使用 `npm run build:pages` 生成 `dist-pages/`，Pages 的 Source 选择 GitHub Actions。自动部署工作流已提供，参见 [GitHub Pages 说明](docs/GITHUB-PAGES.md)。

`dist/` 是静态网站，可部署到支持 SPA 回退的静态服务器。将 `/product`、`/applications`、`/about`、`/about/value`、`/contact` 等未知文件请求回退至 `index.html`。项目提供 `public/_redirects` 作为兼容平台的示例；其他服务器需自行设置相同规则。本站未配置域名或统计。

## 联系表单

About Us 与模块演示的入口共用 `/contact`。表单在网页内通过 FormSubmit AJAX 提交，收件人为 `aster.cora@outlook.com`，访客邮箱用于回复地址。表单校验失败、网络错误或接收邮箱尚未验证时保留填写内容。页面仅在服务返回明确的成功回执后显示“信息已提交”。

首次提交会触发 FormSubmit 的收件邮箱验证。邮箱持有人需要在 `aster.cora@outlook.com` 收到的邮件中完成激活，才能正常接收表单信息。正式域名上线后也应确认该来源已激活并完成一次收件检查。说明见 [FormSubmit 官方文档](https://formsubmit.co/)。

可通过构建时变量 `VITE_CONTACT_EMAIL` 更换收件邮箱，通过 `VITE_CONTACT_ENDPOINT` 接入自己的 JSON 接口。FormSubmit 回执兼容 `success: true` 与 `success: "true"`。自有接口成功时返回 HTTP 204，或 2xx JSON `{ "ok": true }` / `{ "success": true }`。更新变量后需要重启开发服务或重新构建。

## 素材与研发状态

所有照片、产品和模块图均来自用户提供的素材。原始产品素材保留；根据用户后续指定的白色外壳要求，首页等既有展示图采用内置图像编辑工具处理的哑光白材质版本；产品页官方 GLB 保留原始材质。处理范围、提示词和文件位置见 `docs/WHITE-FINISH.md`。场景图和模块图明确标注为概念示意。团队职责取自双语创新简报，像素头像与获准展示的真人照按用户确认的顺序对应。

11 月 10 日的 Home 更新使用最新截图编辑生成的空间站背景与白色直立产品展示素材。全站采用统一的 Aster 原版 Logo 与玻璃胶囊导航。Galaxy 按需加载，语音仅在点击试听按钮后播放。素材、提示词、组件来源与修改方法见 [docs/HOME-ORBITAL.md](docs/HOME-ORBITAL.md)。

最新配色遵循 Light Orbital Aerospace：首页由舱内深蓝自然淡入浅蓝白色，四页复用同一组颜色变量。导航固定悬浮，并在进入浅色内容区后切换为浅底深蓝文字。首页点击 Cora 只切换本地欢迎气泡，保留当前页面；“认识 Cora”按钮和导航仍可进入产品页。Logo 沿用用户提供的 Aster 字形，深色导航中显示白色。颜色变量与页面组件说明见 [docs/ORBITAL-THEME.md](docs/ORBITAL-THEME.md)。

研发内容按地面原型与规划能力区分。技术说明中的设计尺寸不是经验证的成品参数，产品页只呈现可从源模型与项目资料确认的描述。上线前请确认提供素材的使用权与正式文案。


## 11 月 11 日首页互动更新

导航文字和中英文切换按钮已放大，Aster Logo 与首屏产品适当缩小。Cora 第一次点击显示笑脸与第一句导览，第二次显示欢迎语，之后保持第二句；屏幕眨眼、产品和气泡的轻微浮动支持减少动态效果，并在离屏时暂停。语音仅在点击声波按钮后播放。

11 月 22 日：Cora 全站播报已改用 ElevenLabs Jessica（`cgSgspJ2msm6clMCkdW9`），中英文各 10 段本地 MP3 已生成并通过 `npm run voice:check`。当前回复静默预加载，点击播放；停止、语言切换、情绪和演示切换均取消上一段。原定语音库音色受账户计划限制，按用户后续授权替换为可用的年轻活泼音色。生成工具通过本地 `.env.local` 使用 SDK；静态网站不暴露密钥，也不实时请求合成。详见 [docs/CORA-VOICE.md](docs/CORA-VOICE.md)。

Galaxy 使用指定的 Drift 参数和浅蓝白色星光。新增 `/technology` 作为现有 `/applications#technology` 核心技术区的入口；四个一级导航保持不变。组件、文案、图像和交互配置分离，详见 [docs/HOME-INTERACTIONS.md](docs/HOME-INTERACTIONS.md)。原版探索通行证仍可通过 `/?intro=preview` 重看。
