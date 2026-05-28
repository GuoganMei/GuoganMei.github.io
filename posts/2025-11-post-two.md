# 博客文章标题二 / Blog Post Title Two

*2025.11*

这是一篇用 **Markdown** 写的博客文章示例。网站会通过 `viewer.html` 自动渲染本文件。

This is an example blog post written in **Markdown**. The site renders this file automatically via `viewer.html`.

---

## 小节标题 / Section Title

Markdown 支持常见格式：

- **加粗**、*斜体*、`行内代码`
- [超链接](https://example.com)
- 数学公式（通过 MathJax 渲染）

行内公式：$E = mc^2$

独立公式：

$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

## 代码块

```python
def gradient_descent(f, grad_f, x0, lr=0.01, steps=100):
    x = x0
    for _ in range(steps):
        x = x - lr * grad_f(x)
    return x
```

## 引用

> 好的写作就是好的思考。
