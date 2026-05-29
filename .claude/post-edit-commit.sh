#!/bin/bash
# post-edit-commit.sh — 每次 Claude 完成回复后，更新 README 并暂存变更
#
# 说明：
#   - Claude 应在对话中主动用自然语言写 commit message 并提交（见 CLAUDE.md）
#   - 本脚本作为兜底：若 Claude 未提交，自动暂存 + 用简短 message 提交
#   - README 的项目结构树始终自动更新

set -euo pipefail

REPO="/home/noname/project/learn_claude"
cd "$REPO"

# 如果工作区没有任何变更，直接退出
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  exit 0
fi

# ── 更新 README.md 项目结构 ───────────────────────────────────
python3 - <<'PYEOF'
import re, pathlib

readme = pathlib.Path("README.md").read_text()

html_files = sorted(pathlib.Path(".").glob("*.html"))
js_files   = sorted(pathlib.Path("js").glob("*.js")) if pathlib.Path("js").exists() else []
css_files  = sorted(pathlib.Path("css").glob("*.css")) if pathlib.Path("css").exists() else []
has_favicon = pathlib.Path("images/favicon.svg").exists()

descriptions = {
  "index.html":        "首页",
  "about.html":        "关于我",
  "publications.html": "出版物",
  "projects.html":     "项目展示",
  "blog.html":         "博客",
  "archive.html":      "档案 + 访客统计",
  "contact.html":      "联系方式",
  "stats.html":        "访客统计（独立页）",
  "viewer.html":       "Markdown/PDF 阅读器",
  "lang.js":           "中英双语切换",
  "scramble.js":       "字符闪动效果",
  "visitors.js":       "访客计数与地图",
  "style.css":         "全局样式，学术风格",
}

lines = ["```", "learn_claude/"]
for f in html_files:
  desc = descriptions.get(f.name, "页面")
  lines.append(f"├── {f.name:<22} # {desc}")
if has_favicon:
  lines.append("├── images/")
  lines.append("│   └── favicon.svg        # 网站图标")
if css_files:
  lines.append("├── css/")
  for f in css_files:
    desc = descriptions.get(f.name, "样式")
    lines.append(f"│   └── {f.name:<18} # {desc}")
if js_files:
  lines.append("├── js/")
  for f in js_files:
    desc = descriptions.get(f.name, "脚本")
    lines.append(f"│   └── {f.name:<18} # {desc}")
lines.append("├── CLAUDE.md              # Claude Code 项目说明")
lines.append("└── README.md              # 本文件")
lines.append("```")

new_block = "\n".join(lines)
new_readme = re.sub(r"```[\s\S]*?```", new_block, readme, count=1)
pathlib.Path("README.md").write_text(new_readme)
PYEOF

# ── 暂存所有变更 ──────────────────────────────────────────────
git add -A

# 若暂存区为空（Claude 已在对话中提交），退出
if git diff --cached --quiet; then
  exit 0
fi

# 兜底提交（仅在 Claude 本轮未提交时触发）
LANG=zh_CN.UTF-8 LC_ALL=zh_CN.UTF-8 git commit -m "$(cat <<'COMMITMSG'
自动暂存：本轮代码变更（Claude 未在对话中提交）

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
COMMITMSG
)"

echo '{"systemMessage": "⚠️ README 已更新并兜底提交。建议下次由 Claude 在对话中用自然语言写 commit message。"}'
