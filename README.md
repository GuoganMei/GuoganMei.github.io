# 个人网站

一个简洁的静态个人网站，包含首页、关于我、项目展示和联系方式四个页面。

## 项目结构

```
learn_claude/
├── about.html             # 关于我
├── archive.html           # 档案
├── blog.html              # 博客
├── contact.html           # 联系方式
├── index.html             # 首页
├── projects.html          # 项目展示
├── publications.html      # 出版物
├── stats.html             # 访客统计
├── viewer.html            # PDF 阅读器
├── favicon.svg            # 网站图标
├── css/
│   └── style.css          # 全局样式，学术风格
├── js/
│   └── lang.js            # 中英双语切换
│   └── scramble.js        # 字符闪动效果
│   └── visitors.js        # 访客计数与地图
├── CLAUDE.md              # Claude Code 项目说明
└── README.md              # 本文件
```

## 快速开始

这是纯静态网站，无需构建工具，直接用浏览器打开 `index.html` 即可预览。

如需本地开发服务器（解决部分浏览器的跨域限制）：

```bash
# Python 3
python3 -m http.server 8080

# 或 Node.js（需安装 serve）
npx serve .
```

然后访问 `http://localhost:8080`。

## 自定义

1. 将所有 `Your Name` 替换为你的真实姓名
2. 在 `about.html` 填写个人简介和技能
3. 在 `projects.html` 添加你的项目卡片
4. 在 `contact.html` 更新联系方式和社交链接
5. 在 `css/style.css` 的 `:root` 中修改颜色变量以更换主题

## 部署

任何静态托管服务均可使用：

- [GitHub Pages](https://pages.github.com)
- [Netlify](https://netlify.com)
- [Vercel](https://vercel.com)

## 许可

MIT
