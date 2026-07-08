# 小画家网页版

一个基于 React + TypeScript 的 AI 绘画生成网页应用，支持角色、动作、场景和风格选择，提供作品浏览、点赞、评论等社交功能。

## ✨ 功能特性

- 🎨 **AI 绘画生成**：选择角色、动作、场景和风格，一键生成精美画作
- 🌟 **作品浏览**：浏览社区内的 AI 绘画作品，支持无限滚动加载
- ❤️ **点赞互动**：对喜欢的作品进行点赞
- 💬 **评论功能**：使用预设评论模板对作品发表评论
- 🌙 **暗色模式**：支持亮色/暗色主题切换，自动保存用户偏好
- 🎯 **画卡管理**：画卡用完时提供重置账号选项
- 📱 **响应式设计**：适配桌面端和移动端

## 🛠️ 技术栈

- **框架**：React 18 + TypeScript
- **构建工具**：Vite 6
- **样式**：TailwindCSS 3
- **状态管理**：Zustand
- **路由**：React Router DOM
- **图标**：Lucide React
- **API 代理**：Vite Proxy

## 📦 安装

```bash
# 克隆项目
git clone https://github.com/your-username/xiaohuajia-web.git
cd xiaohuajia-web

# 安装依赖
npm install
```

## 🚀 运行

```bash
# 开发模式（端口 5173）
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # 组件
│   ├── CardExhaustedModal.tsx    # 画卡用完弹窗
│   ├── CommentSection.tsx        # 评论区组件
│   ├── Header.tsx                # 头部导航
│   ├── LikeButton.tsx            # 点赞按钮
│   ├── LoadingSpinner.tsx        # 加载动画
│   ├── WorkCard.tsx              # 作品卡片
│   ├── WorkGrid.tsx              # 作品网格
│   └── ...
├── hooks/               # 自定义 Hooks
│   └── useTheme.ts               # 主题切换 Hook
├── pages/               # 页面组件
│   ├── HomePage.tsx              # 首页
│   ├── CreatePage.tsx            # 创建页面
│   ├── WorkDetailPage.tsx        # 作品详情页
│   └── UserPage.tsx              # 用户主页
├── store/               # 状态管理
│   └── userStore.ts              # 用户状态
├── types/               # 类型定义
│   └── index.ts
├── utils/               # 工具函数
│   └── api.ts                    # API 接口封装
├── App.tsx              # 应用入口
├── main.tsx             # React 入口
└── index.css            # 全局样式
```

## 🌐 API 说明

项目使用小画家 Plus 的公开 API，通过 Vite 代理转发请求。

### 代理配置

```javascript
// vite.config.ts
proxy: {
  '/xhapi': {
    target: 'http://hwxhj.imttmt.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/xhapi/, ''),
  },
}
```

### 主要接口

| 接口 | 路径 | 方法 | 说明 |
|------|------|------|------|
| 登录 | `/xhjlogin` | POST | 登录或注册 |
| 用户信息 | `/xhj/user/info/{userId}` | GET | 获取用户信息 |
| 用户作品 | `/xhj/user/work_list/{userId}/{page}` | GET | 获取用户作品列表 |
| 作品详情 | `/xhj/work/detail/{workId}` | GET | 获取作品详情 |
| 点赞 | `/xhj/work/like` | POST | 点赞/取消点赞 |
| 评论 | `/xhj/work/comment` | POST | 评论作品 |
| 提交绘画 | `/xhj/creation/submit` | POST | 提交绘画生成 |
| 获取描述 | `/xhj/creation/descriptions` | GET | 获取角色/动作/场景选项 |
| 获取风格 | `/xhj/creation/styles` | GET | 获取绘画风格列表 |
| 点赞图标 | `/xhj/like/icons` | GET | 获取点赞表情列表 |
| 评论选项 | `/xhj/comment/options` | GET | 获取预设评论快捷语 |

## 🎨 主题切换

应用支持亮色和暗色两种主题，用户可以通过点击头部的太阳/月亮图标进行切换。主题偏好会自动保存到 localStorage。

## 📝 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'Add some feature'`
4. 推送到分支：`git push origin feature/your-feature`
5. 提交 Pull Request

## 📄 许可证

MIT License

## 🤝 致谢

感谢小画家 Plus 提供的 API 接口，本项目仅用于学习和交流目的。

---

**版本**: 1.0.0
**作者**: Your Name
**邮箱**: your.email@example.com