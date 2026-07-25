/* ================================================================
   sparkle.js — 古早网页闪光像素粒子系统
   在首页和结果页生成随机闪烁的粉色光点
   经典2000年代个人网站标志性效果 ✧
   ================================================================ */

(function () {
  'use strict';

  var SPARKLE_SYMBOLS = ['✧', '✦', '⋅', '♡', '★', '✿'];
  var SPARKLE_COLORS = [
    '#F5B7C5', '#FFD9DE', '#FFFFFF',
    '#FFE0E8', '#FCC8D5', '#E8A0B0',
  ];

  var container = null;
  var sparkles = [];
  var isRunning = false;

  /**
   * 根据屏幕宽度决定粒子数量
   */
  function getSparkleCount() {
    var width = window.innerWidth;
    if (width < 480) return 12;   // 手机
    if (width < 768) return 18;   // 平板
    return 28;                     // 桌面
  }

  /**
   * 创建单个闪光粒子 DOM
   */
  function createSparkleEl() {
    var el = document.createElement('span');
    el.textContent = SPARKLE_SYMBOLS[Math.floor(Math.random() * SPARKLE_SYMBOLS.length)];
    el.style.cssText =
      'position:absolute;' +
      'pointer-events:none;' +
      'user-select:none;' +
      '-webkit-user-select:none;' +
      'z-index:0;' +
      'font-size:' + (6 + Math.random() * 10).toFixed(0) + 'px;' +
      'color:' + SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)] + ';' +
      'left:' + (Math.random() * 100).toFixed(1) + '%;' +
      'top:' + (Math.random() * 100).toFixed(1) + '%;' +
      'opacity:0;' +
      'animation: sparkleFloat ' +
      (1.5 + Math.random() * 2.5).toFixed(1) + 's ease-in-out ' +
      (Math.random() * 3).toFixed(1) + 's infinite;';
    return el;
  }

  /**
   * 在当前活跃页面生成粒子
   */
  function spawnSparkles(pageEl) {
    if (!pageEl) return;

    var count = getSparkleCount();
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var el = createSparkleEl();
      sparkles.push(el);
      fragment.appendChild(el);
    }

    pageEl.appendChild(fragment);
  }

  /**
   * 清除所有粒子
   */
  function clearSparkles() {
    for (var i = 0; i < sparkles.length; i++) {
      if (sparkles[i].parentNode) {
        sparkles[i].parentNode.removeChild(sparkles[i]);
      }
    }
    sparkles = [];
  }

  /**
   * 页面切换时更新粒子
   */
  function updateSparkles(pageName) {
    clearSparkles();

    // 只在首页和结果页显示粒子（答题页保持专注）
    var pageMap = {
      home: 'page-home',
      result: 'page-result',
    };

    var targetId = pageMap[pageName];
    if (targetId) {
      var targetEl = document.getElementById(targetId);
      if (targetEl && targetEl.classList.contains('page--active')) {
        spawnSparkles(targetEl);
      }
    }
  }

  /**
   * 监听页面切换
   * 通过劫持 DessertApp.navigateTo 实现
   */
  function hookNavigateTo() {
    // 等待 app.js 初始化完成后劫持
    var checkInterval = setInterval(function () {
      if (window.DessertApp && window.DessertApp.navigateTo) {
        clearInterval(checkInterval);

        var originalNavigate = window.DessertApp.navigateTo;
        window.DessertApp.navigateTo = function (pageName) {
          originalNavigate(pageName);
          updateSparkles(pageName);
        };
      }
    }, 100);

    // 超时停止等待
    setTimeout(function () {
      clearInterval(checkInterval);
    }, 5000);
  }

  /**
   * 初始化：在首页生成粒子
   */
  function init() {
    // 注入关键帧动画（如果 CSS 中没有）
    if (!document.getElementById('sparkle-style')) {
      var styleEl = document.createElement('style');
      styleEl.id = 'sparkle-style';
      styleEl.textContent =
        '@keyframes sparkleFloat {' +
        '0%, 100% { opacity: 0; transform: translateY(0) scale(0.6); }' +
        '25%      { opacity: 0.7; transform: translateY(-4px) scale(1); }' +
        '50%      { opacity: 0.3; transform: translateY(2px) scale(0.8); }' +
        '75%      { opacity: 0.8; transform: translateY(-2px) scale(1.1); }' +
        '}';
      document.head.appendChild(styleEl);
    }

    // 初始生成
    var homePage = document.getElementById('page-home');
    if (homePage && homePage.classList.contains('page--active')) {
      spawnSparkles(homePage);
    }

    // 劫持路由
    hookNavigateTo();

    isRunning = true;
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
