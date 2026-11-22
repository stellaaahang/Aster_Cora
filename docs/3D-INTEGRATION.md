# Cora 官方三维模型

Product 页 `/product` 使用用户提供的 `天巡者_实拍版_哑光白.glb`。源文件完整复制为 `public/models/cora-matte-white.glb`，构建输出也保留相同字节。文件大小为 4,332,608 字节，SHA-256 如下。

```text
35dba3437c5f5681a7f2f01f93ad8326646153950d83783a3cb6496e2fe95a6e
```

## 模型与方向

文件包含 61 个节点、34 个网格和 15 个材质。查看器保留源节点变换、几何与材质，在展示容器中等比居中与缩放。光源与柔和地面阴影独立设置，包围盒供相机取景使用。

| 视角 | 应用源变换后的方向 | 核对依据 |
| --- | --- | --- |
| 正面 | +Z | 显示屏、前置感知区 |
| 左侧 | −X | 左侧圆形接口 |
| 右侧 | +X | 右侧圆形接口 |
| 背面 | −Z | 后部控制区 |
| 顶部 | +Y | 顶盖和通风结构 |
| 底部 | −Y | 底盖与轮组结构 |

`src/config/coraModel.ts` 集中定义上述朝向、源节点和预设，默认从正面偏右约 27°、稍上方观察。顶部和底部保留很小的偏移以避开相机极点。相机从实际包围盒取景，在球面上走较短的方向，约 600ms 到达预设；减少动态效果时直接切换。拖拽、滚轮、加减按钮和键盘共用限位。触屏默认保留页面滚动，可按“启用旋转”后单指拖拽、双指缩放，再切回滚动。

## 查看器与屏幕

- `src/pages/Product.tsx` 组织各区块及共享选择状态。`src/components/product/CoraModelViewer.tsx` 处理查看器交互、进度、重试、静态图和原生全屏。无原生全屏时使用带焦点限制与退出恢复的全屏对话框。
- `CoraScene.tsx` 延迟加载 React Three Fiber / Three.js，只在 Product 查看器中启动。`modelAsset.ts` 缓存解析后的 GLB，在保持源资源的前提下建立本页实例。`ModelRig.tsx` 共用一个相机与场景，按需渲染并限制像素比例。
- 热点根据哑光白模型的节点表面定位。感知区为 34，显示屏为 53，左右接口为 50/51，机械角部为 36，背面控制区为 47。标记随相机投影，通过法线与遮挡检测隐藏背面的部件。点击标记或部件入口时，只展开一个详情。两侧接口共用一个类别，随当前观察侧切换锚点。风扇、感知区和显示屏使用各自的局部取景，镜头中心来自对应网格的包围盒。
- 热点特写中，缩小按钮或键盘减号保留观察方向，将旋转中心移回机身，并拉远到全机视图。后续缩小按常规步长执行。
- `ScreenDisplay.tsx` 依据显示屏节点的几何计算带圆角的内嵌面，略高于原屏面以避免深度冲突。初次查看时显示原屏面，点击屏幕热点时正面取景并点亮白色屏幕。待机、工作、陪伴按钮分别绘制休息、专注和微笑表情。
- `public/images/cora-matte-white-overview.png` 由哑光白 GLB 实际渲染，用于 Product 加载与静态浏览。需要重新导出时，运行开发服务后执行 `node scripts/render-cora-posters.mjs`（需要 Playwright 和 Chrome）。

## 模块与内容

`ProductSections.tsx` 使用用户提供的图片展示模块化拓展和多机协作概念。`/applications?demo=modules#try-cora` 打开 Try Cora 的模块演示，提供机械臂、载物箱、温度传感器和泵阀四种选择。2026-11-21 按要求移除了 Tech & Scenarios 中独立的多机协作区块；该页的四个任务场景改用 Apple Cards Carousel，详见 `docs/MISSION-SCENARIOS-CAROUSEL.md`。

文案位于 `src/i18n/product.en.ts`、`src/i18n/product.zh.ts`，沿用全站语言状态。产品页末尾链接到 `/applications#technology`，可在“核心技术”区选择功能并进入 Try Cora 演示。产品页样式独立于 `src/styles/product-3d.css`。

更换模型时，先确认几何、材质和朝向，再重新标定热点、屏幕与接口、更新静态图。不要用旧节点序号直接套用到新模型。回归检查见 `scripts/product-browser-check.mjs` 与 `docs/VERIFICATION.md`。
