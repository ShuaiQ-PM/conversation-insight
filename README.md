# 会话洞察功能页

一个基于客户聊天记录的会话洞察页面，包含：
- 客户情绪分析（正负向总结 + 热词下钻）
- 自定义洞察场景（售前/售后等场景扩展）
- 电商产品需求洞察（按热度输出产品列表并下钻）

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

## 发布到 GitHub 并可在线访问

项目已内置 GitHub Pages 自动部署工作流：`.github/workflows/deploy-pages.yml`。

1. 创建 GitHub 仓库（例如 `conversation-insight`）
2. 推送代码到 `main` 分支
3. 在 GitHub 仓库设置中开启 Pages：
   - `Settings` -> `Pages`
   - `Build and deployment` 选择 `GitHub Actions`
4. 等待 `Actions` 中 `Deploy Next.js to GitHub Pages` 任务成功
5. 访问页面：
   - 项目仓库通常是：`https://<你的用户名>.github.io/<仓库名>/`
   - 如果仓库名是 `<用户名>.github.io`，则地址是：`https://<你的用户名>.github.io/`

## 技术栈

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- shadcn/ui
