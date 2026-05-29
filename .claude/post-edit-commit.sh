#!/bin/bash
# post-edit-commit.sh — 每次 Claude 修改代码后更新 README 并提交
#
# 触发条件：PostToolUse (Write|Edit|NotebookEdit)
# 策略：仅在有实际变更时才更新 README + commit，避免空 commit。

set -euo pipefail

REPO="/home/noname/project/learn_claude"

cd "$REPO"

# 如果工作区没有任何变更，直接退出
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  exit 0
fi

# ── 更新 README.md ────────────────────────────────────────────
# 统计当前页面数量和 JS 文件数量，写入 README 的"项目结构"区块
HTML_COUNT=$(find . -maxdepth 1 -name "*.html" | wc -l | tr -d ' ')
JS_FILES=$(find js/ -name "*.js" 2>/dev/null | sort | sed 's|^./||' | while read f; do printf "│   └── %-18s # %s\n" "$(basename $f)" "$(basename $f .js) 脚本"; done)
CSS_FILES=$(find css/ -name "*.css" 2>/dev/null | sort | xargs -I{} basename {})

python3 - <<'PYEOF'
import re, os, pathlib

readme = pathlib.Path("README.md").read_text()

# 收集文件列表
html_files = sorted(pathlib.Path(".").glob("*.html"))
js_files   = sorted(pathlib.Path("js").glob("*.js")) if pathlib.Path("js").exists() else []
css_files  = sorted(pathlib.Path("css").glob("*.css")) if pathlib.Path("css").exists() else []
has_favicon = pathlib.Path("favicon.svg").exists()

descriptions = {
  "index.html":        "首页",
  "about.html":        "关于我",
  "publications.html": "出版物",
  "projects.html":     "项目展示",
  "blog.html":         "博客",
  "archive.html":      "档案",
  "contact.html":      "联系方式",
  "stats.html":        "访客统计",
  "viewer.html":       "PDF 阅读器",
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
  lines.append("├── favicon.svg            # 网站图标")
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
print("README updated")
PYEOF

# ── Git commit ────────────────────────────────────────────────
git add -A

# 生成提交信息：列出变更的文件
CHANGED=$(git diff --cached --name-only | head -8 | tr '\n' '、' | sed 's/、$//')
DATE=$(date '+%Y-%m-%d %H:%M')

LANG=zh_CN.UTF-8 LC_ALL=zh_CN.UTF-8 git commit -m "$(cat <<EOF
更新代码：${CHANGED}

由 Claude Code 自动提交（${DATE}）

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"

echo '{"systemMessage": "✅ README 已更新，变更已提交到 git"}'
