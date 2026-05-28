# CLAUDE.md — 个人网站项目说明

本文件为 Claude Code 提供项目上下文。

## 项目类型

纯静态个人网站：无框架、无构建工具、无依赖。原始 HTML + CSS。

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 首页，Hero 区域入口 |
| `about.html` | 个人简介与技能列表 |
| `projects.html` | 项目卡片网格 |
| `contact.html` | 联系方式 |
| `css/style.css` | 全局样式，暗色主题，CSS 变量控制颜色 |

## 设计规范

- 风格：学术个人主页（类 arXiv / 高校教授主页）
- 背景：白色 `#ffffff`，衬线字体（Georgia）为主
- 强调色：`--color-accent: #8b0000`（学术深红），定义在 `:root` CSS 变量中
- 字体：正文用 Georgia/serif，导航/标签用系统 sans-serif，无外部字体依赖
- 布局：最大宽度 820px，居中，响应式
- 数学公式：MathJax 3（CDN），所有页面均已引入
  - 行内公式：`$...$` 或 `\(...\)`
  - 独立公式：`$$...$$`，建议包裹在 `<div class="math-block">` 中

## 开发规则

- **不引入 JavaScript 框架或构建工具**，保持零依赖
- 新增页面需在所有现有页面的 `<nav>` 中同步添加链接，同时加入 MathJax 脚本块
- 样式修改优先使用 CSS 变量，避免硬编码颜色值
- 所有页面共享同一个 `css/style.css`

## 预览

```bash
python3 -m http.server 8080
```

访问 `http://localhost:8080`
