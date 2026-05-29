/**
 * scramble.js — 字符闪动解码效果
 * 页面加载时，标题文字从随机符号逐字解码为真实内容；鼠标悬停时重新触发。
 */
(function () {
  const CHARS = '!<>-_\\/[]{}=+*^?#@$%&~|;:.,';

  /**
   * 对单个元素执行闪动解码动画。
   * 若元素内含 .zh / .en 子 span，则只对当前可见语言的那个执行动画。
   */
  function scrambleElement(el) {
    if (el._scrambling) return; // 防止重复触发

    const lang = document.documentElement.lang;
    const zhSpan = el.querySelector('.zh');
    const enSpan = el.querySelector('.en');

    // 找到当前可见的文本容器
    let target = el;
    if (zhSpan || enSpan) {
      target = lang === 'en' ? (enSpan || zhSpan) : (zhSpan || enSpan);
    }
    if (!target) return;

    const finalText = target.textContent;
    if (!finalText.trim()) return;

    const len = finalText.length;
    // totalFrames 控制整体动画时长（帧数越多越慢）
    const totalFrames = Math.max(len * 3, 30);
    let frame = 0;
    el._scrambling = true;

    function tick() {
      let html = '';
      let settled = 0;

      for (let i = 0; i < len; i++) {
        if (finalText[i] === ' ') {
          // 空格直接保留，不参与乱码
          html += ' ';
          settled++;
          continue;
        }

        // 每个字符有自己的"开始解码帧"（从左到右依次解码）
        const revealStart = Math.floor((i / (len || 1)) * totalFrames * 0.65);
        const revealEnd = revealStart + 7;

        if (frame >= revealEnd) {
          // 已完全解码
          html += finalText[i];
          settled++;
        } else if (frame >= revealStart) {
          // 正在解码：显示随机字符（高亮色）
          const c = CHARS[Math.floor(Math.random() * CHARS.length)];
          html += `<span class="sc-active">${c}</span>`;
        } else {
          // 尚未开始解码：以低透明度随机闪烁，或保持空白
          if (Math.random() < 0.25) {
            const c = CHARS[Math.floor(Math.random() * CHARS.length)];
            html += `<span class="sc-dim">${c}</span>`;
          } else {
            html += `<span class="sc-dim">${finalText[i]}</span>`;
          }
        }
      }

      target.innerHTML = html;
      frame++;

      if (settled < len) {
        requestAnimationFrame(tick);
      } else {
        // 动画结束，还原纯文本，释放锁
        target.textContent = finalText;
        el._scrambling = false;
      }
    }

    requestAnimationFrame(tick);
  }

  function init() {
    // 页面加载时依次对各标题执行动画（错开时间，避免同时触发）
    const targets = [
      document.querySelector('.profile-name'),
      ...Array.from(document.querySelectorAll('.about-body h2'))
    ].filter(Boolean);

    targets.forEach((el, i) => {
      setTimeout(() => scrambleElement(el), i * 220);
    });

    // 鼠标悬停时重新触发（仅 h2）
    document.querySelectorAll('.about-body h2').forEach(h2 => {
      h2.addEventListener('mouseenter', () => scrambleElement(h2));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
