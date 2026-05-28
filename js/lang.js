(function () {
  var STORAGE_KEY = 'site-lang';

  function setLang(lang) {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    localStorage.setItem(STORAGE_KEY, lang);
    var btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = lang === 'en' ? '中文' : 'EN';
  }

  var saved = localStorage.getItem(STORAGE_KEY) || 'zh';
  // lang already set by inline <head> script; just sync button label and attach handler
  var btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.textContent = saved === 'en' ? '中文' : 'EN';
    btn.addEventListener('click', function () {
      var current = localStorage.getItem(STORAGE_KEY) || 'zh';
      setLang(current === 'en' ? 'zh' : 'en');
    });
  }
})();
