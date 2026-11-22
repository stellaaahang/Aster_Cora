# GitHub Pages 发布

仓库：stellaaahang/Aster_Cora。正式地址：https://stellaaahang.github.io/Aster_Cora/ 。带开屏的预览：https://stellaaahang.github.io/Aster_Cora/?intro=preview 。

## 问题与修复

原先 Pages 从 main 分支根目录发布源码，线上 index.html 仍指向 /src/main.tsx，浏览器未获得 Vite 编译产物。Pages 项目站点还需要 /Aster_Cora/ 资源前缀。

现在 .github/workflows/deploy-pages.yml 在 main 更新时自动安装锁定依赖、运行测试和语音校验、执行 npm run build:pages，并将 dist-pages 发布到 Pages。仓库 Settings → Pages → Build and deployment → Source 需选择 GitHub Actions。完成后在 Actions 查看 Deploy Aster to GitHub Pages。

## 两种构建保持独立

- npm run build：原有根路径部署，生成 dist，使用 BrowserRouter，适合 Vercel、Netlify 和有 SPA 回退的服务器。
- npm run build:pages：生成 dist-pages，使用 HashRouter，默认资源前缀 /Aster_Cora/。Pages 无需服务器改写规则，各页面通过 #/product、#/applications、#/about 等访问和刷新。
- Actions 通过 configure-pages 输出的 base_path 设置 PAGES_BASE_PATH，可适配仓库名称变化或自定义域名。
- src/config/publicAssets.ts 统一处理 public 素材前缀。音频索引保持可供生成脚本校验的标准 /audio 路径，实际请求时加部署前缀。
- /?intro=preview 与 /#/?intro=preview 都会展示原有开屏，完成后保留正常站内导航。

## 本地验证

11 项自动测试通过；两种构建通过。对 /Aster_Cora/ 实际构建检查了：开屏全部图片、英文和中文 MP3、同页旅程锚点、产品 GLB、五个页面及刷新、模块化演示深链接、二维码样例解码、手机开屏与布局。无运行时错误，无请求遗漏仓库前缀。

参考：[Vite 官方 Pages 部署说明](https://vite.dev/guide/static-deploy.html#github-pages)、[GitHub 自定义 Pages 工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
