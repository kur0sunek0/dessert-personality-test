/* ================================================================
   wechat.js — 微信环境检测 & iOS 视口修复补丁
   ================================================================ */

const WechatEnv = {
  isWechat: /MicroMessenger/i.test(navigator.userAgent),
  isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
  isAndroid: /Android/i.test(navigator.userAgent),

  get isWechatIOS() {
    return this.isWechat && this.isIOS;
  },

  get isWechatAndroid() {
    return this.isWechat && this.isAndroid;
  },

  get needsLongPressHint() {
    // 微信内置浏览器不支持 download 属性，需要长按保存
    return this.isWechat;
  },
};

/**
 * 修复 iOS Safari / 微信内置浏览器 100vh 不准确的问题
 * 使用 JS 动态计算视口高度，写入 CSS 变量 --app-height
 */
function fixViewportHeight() {
  const vh = window.innerHeight;
  document.documentElement.style.setProperty('--app-height', `${vh}px`);
}

// 初始化
fixViewportHeight();

// 监听窗口变化
window.addEventListener('resize', fixViewportHeight);
window.addEventListener('orientationchange', function () {
  // 延迟等旋转动画完成后再取高度
  setTimeout(fixViewportHeight, 150);
});
