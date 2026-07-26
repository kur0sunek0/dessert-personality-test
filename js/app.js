/* ================================================================
   app.js — 应用主控
   页面路由、状态管理、事件绑定
   ================================================================ */

// ---------- 全局应用状态 ----------
const AppState = {
  currentPage: 'home',                // 'home' | 'quiz' | 'result'
  currentQuestion: 0,                 // 0-9
  answers: new Array(10).fill(null),  // 'A'|'B'|'C'|'D' | null
  resultId: null,                     // 1-8 | null
};

// ---------- DOM 元素引用 ----------
const DOM = {
  // 页面容器
  pageHome:   document.getElementById('page-home'),
  pageQuiz:   document.getElementById('page-quiz'),
  pagePaywall: document.getElementById('page-paywall'),
  pageResult:   document.getElementById('page-result'),

  // 首页
  btnStart:   document.getElementById('btn-start'),

  // 答题页
  btnBackHome:    document.getElementById('btn-back-home'),
  btnPrev:        document.getElementById('btn-prev'),
  btnNext:        document.getElementById('btn-next'),
  quizQuestion:   document.getElementById('quiz-question'),
  quizOptions:    document.getElementById('quiz-options'),
  progressText:   document.getElementById('progress-text'),
  progressFill:   document.querySelector('.progress-bar__fill'),

  // 结果页
  resultImage:       document.getElementById('result-image'),
  resultName:        document.getElementById('result-name'),
  resultDescription: document.getElementById('result-description'),
  resultTags:        document.getElementById('result-tags'),
  btnPoster:         document.getElementById('btn-poster'),
  btnRetry:          document.getElementById('btn-retry'),

  // 海报弹窗
  posterModal:           document.getElementById('poster-modal'),
  posterImageContainer:  document.getElementById('poster-image-container'),
  posterHint:            document.getElementById('poster-hint'),
  btnCloseModal:         document.getElementById('btn-close-modal'),
  btnDownloadPoster:     document.getElementById('btn-download-poster'),
};

// ---------- 页面切换 ----------
function navigateTo(pageName) {
  // 移除所有 active 状态
  [DOM.pageHome, DOM.pageQuiz, DOM.pagePaywall, DOM.pageResult].forEach(function (el) {
    el.classList.remove('page--active');
  });

  // 激活目标页
  var targetMap = {
    home:    DOM.pageHome,
    quiz:    DOM.pageQuiz,
    paywall: DOM.pagePaywall,
    result:  DOM.pageResult,
  };
  var target = targetMap[pageName];
  if (target) {
    target.classList.add('page--active');
  }

  AppState.currentPage = pageName;

  // 页面初始化钩子
  if (pageName === 'quiz') {
    initQuiz();
  } else if (pageName === 'result') {
    renderResult();
  }

  // 滚动到顶部
  window.scrollTo(0, 0);
}

// ---------- 首页 → 开始测试 ----------
DOM.btnStart.addEventListener('click', function () {
  resetQuiz();
  navigateTo('quiz');
});

// ---------- 答题页逻辑 ----------
function resetQuiz() {
  AppState.currentQuestion = 0;
  AppState.answers = new Array(10).fill(null);
  AppState.resultId = null;
}

function initQuiz() {
  renderQuestion();
  updateProgress();
  updateNavButtons();
}

function renderQuestion() {
  var idx = AppState.currentQuestion;
  var q = QUESTIONS[idx];

  // 题目标题
  DOM.quizQuestion.textContent = q.title;

  // 选项
  var savedAnswer = AppState.answers[idx];
  var html = '';
  for (var i = 0; i < q.options.length; i++) {
    var opt = q.options[i];
    var selectedClass = (savedAnswer === opt.key) ? ' option-card--selected' : '';
    html +=
      '<div class="option-card' + selectedClass + '" data-key="' + opt.key + '">' +
        '<span class="option-card__key">' + opt.key + '</span>' +
        '<span class="option-card__text">' + opt.text + '</span>' +
      '</div>';
  }
  DOM.quizOptions.innerHTML = html;

  // 绑定选项点击
  var cards = DOM.quizOptions.querySelectorAll('.option-card');
  for (var j = 0; j < cards.length; j++) {
    cards[j].addEventListener('click', function () {
      var key = this.getAttribute('data-key');
      selectOption(key);
    });
  }
}

function selectOption(key) {
  // 保存答案
  AppState.answers[AppState.currentQuestion] = key;

  // 更新选中态
  var cards = DOM.quizOptions.querySelectorAll('.option-card');
  for (var i = 0; i < cards.length; i++) {
    var cardKey = cards[i].getAttribute('data-key');
    if (cardKey === key) {
      cards[i].classList.add('option-card--selected');
    } else {
      cards[i].classList.remove('option-card--selected');
    }
  }

  // 更新导航按钮
  updateNavButtons();
}

function updateProgress() {
  var current = AppState.currentQuestion + 1;
  var total = QUESTIONS.length;
  DOM.progressText.textContent = current + '/' + total;
  DOM.progressFill.style.width = ((current / total) * 100) + '%';
}

function updateNavButtons() {
  var idx = AppState.currentQuestion;
  var hasAnswer = AppState.answers[idx] !== null;
  var isLast = idx === QUESTIONS.length - 1;
  var allAnswered = AppState.answers.every(function (a) { return a !== null; });

  // 上一题按钮
  DOM.btnPrev.disabled = (idx === 0);

  // 下一题按钮
  DOM.btnNext.disabled = !hasAnswer;

  if (isLast) {
    // 最后一题：变为"查看结果"
    DOM.btnNext.textContent = '查看结果 ✦';
    DOM.btnNext.disabled = !allAnswered; // 全部答完才能看结果
  } else {
    DOM.btnNext.textContent = '下一题 →';
  }
}

// 上一题
DOM.btnPrev.addEventListener('click', function () {
  if (AppState.currentQuestion > 0) {
    AppState.currentQuestion--;
    renderQuestion();
    updateProgress();
    updateNavButtons();
  }
});

// 下一题 / 查看结果
DOM.btnNext.addEventListener('click', function () {
  var idx = AppState.currentQuestion;
  var isLast = idx === QUESTIONS.length - 1;

  if (isLast) {
    // 全部答完 → 计算 → 跳转付费页
    AppState.resultId = calculateResult(AppState.answers);
    navigateTo('paywall');
  } else {
    // 下一题
    AppState.currentQuestion++;
    renderQuestion();
    updateProgress();
    updateNavButtons();
  }
});

// 返回首页（答题页左上角）
DOM.btnBackHome.addEventListener('click', function () {
  navigateTo('home');
});

// ---------- 结果页逻辑 ----------
function renderResult() {
  var result = RESULTS[AppState.resultId];
  if (!result) return;

  // 甜点图片
  var imgLoaded = false;
  DOM.resultImage.src = result.image;
  DOM.resultImage.alt = result.name;
  DOM.resultImage.style.display = 'block';
  DOM.resultImage.onload = function () { imgLoaded = true; };
  DOM.resultImage.onerror = function () {
    // 图片加载失败：显示 emoji 占位
    this.style.display = 'none';
    showResultEmojiFallback(result.emoji);
  };

  // 如果图片已缓存立即触发
  if (DOM.resultImage.complete && DOM.resultImage.naturalWidth > 0) {
    imgLoaded = true;
  }

  // 名称 + 副标题
  DOM.resultName.textContent = result.name + ' · ' + result.subtitle;

  // 标签
  var tagsHtml = '';
  for (var i = 0; i < result.tags.length; i++) {
    tagsHtml += '<span class="result-tag">' + result.tags[i] + '</span>';
  }
  DOM.resultTags.innerHTML = tagsHtml;

  // 解读
  DOM.resultDescription.textContent = result.description;
}

/**
 * 图片不可用时，在相框内显示 emoji 占位
 */
function showResultEmojiFallback(emoji) {
  var frame = document.querySelector('.result-frame');
  if (!frame) return;

  // 移除已有占位
  var existing = frame.querySelector('.result-emoji-fallback');
  if (existing) existing.remove();

  var span = document.createElement('span');
  span.className = 'result-emoji-fallback';
  span.textContent = emoji || '🍰';
  span.style.cssText = 'font-size:64px;line-height:1;position:absolute;';
  frame.appendChild(span);
}

// 保存海报
DOM.btnPoster.addEventListener('click', function () {
  if (!AppState.resultId) return;

  // 生成海报卡片（HTML + Canvas下载图）
  var posterData = generatePoster(AppState.resultId);

  // 展示海报弹窗
  saveOrSharePoster(posterData);
});

// ---------- 付费页：金额验证 + 倒计时解锁 ----------
var btnVerifyAmount = document.getElementById('btn-verify-amount');
var paywallAmount = document.getElementById('paywall-amount');
var paywallVerifyError = document.getElementById('paywall-verify-error');
var paywallVerifyArea = document.getElementById('paywall-verify');
var paywallUnlockArea = document.getElementById('paywall-unlock-area');
var btnPayDone = document.getElementById('btn-pay-done');
var countdownTimer = null;
var countdownSeconds = 5;

function startCountdown() {
  btnPayDone.disabled = true;
  var remaining = countdownSeconds;

  btnPayDone.textContent = '♡ 解锁结果 (' + remaining + '秒)';

  countdownTimer = setInterval(function () {
    remaining--;
    if (remaining <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      btnPayDone.textContent = '♡ 解锁结果 ♡';
      btnPayDone.disabled = false;
    } else {
      btnPayDone.textContent = '♡ 解锁结果 (' + remaining + '秒)';
    }
  }, 1000);
}

if (btnVerifyAmount && paywallAmount) {
  btnVerifyAmount.addEventListener('click', function () {
    var val = parseFloat(paywallAmount.value);

    if (isNaN(val) || val < 1.99) {
      paywallVerifyError.textContent = '(｡•́︿•̀｡) 金额不足 ¥1.99，请输入正确赞赏金额~';
      return;
    }

    if (val > 9.99) {
      paywallVerifyError.textContent = '(๑•́ ω •̀๑) 金额太大了！请输入 ¥1.99 哦~';
      return;
    }

    // 金额正确 → 显示解锁区 + 倒计时
    paywallVerifyError.textContent = '';
    paywallVerifyArea.style.display = 'none';
    paywallUnlockArea.style.display = 'block';
    startCountdown();
  });

  // 回车键也能提交
  paywallAmount.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      btnVerifyAmount.click();
    }
  });
}

if (btnPayDone) {
  btnPayDone.addEventListener('click', function () {
    if (countdownTimer) return; // 倒计时未结束，不能点
    navigateTo('result');
  });
}

// 离开付费页时清理倒计时
var origNavigateTo = navigateTo;
navigateTo = function (pageName) {
  if (countdownTimer && AppState.currentPage === 'paywall' && pageName !== 'paywall') {
    clearInterval(countdownTimer);
    countdownTimer = null;
    // 重置付费页状态
    if (paywallVerifyArea) paywallVerifyArea.style.display = 'flex';
    if (paywallUnlockArea) paywallUnlockArea.style.display = 'none';
    if (paywallAmount) paywallAmount.value = '';
    if (paywallVerifyError) paywallVerifyError.textContent = '';
    btnPayDone.disabled = true;
    btnPayDone.textContent = '♡ 解锁结果 (5秒)';
  }
  origNavigateTo(pageName);
};

// 重新测试
DOM.btnRetry.addEventListener('click', function () {
  resetQuiz();
  navigateTo('quiz');
});

// ---------- 海报弹窗 ----------
DOM.btnCloseModal.addEventListener('click', closePosterModal);
document.querySelector('.poster-modal__overlay').addEventListener('click', closePosterModal);

function closePosterModal() {
  DOM.posterModal.style.display = 'none';
  document.body.classList.remove('no-scroll');
}

DOM.btnDownloadPoster.addEventListener('click', function () {
  // 阶段5实现
  alert('请长按海报图片保存到相册~');
});

// ---------- 分享按钮（菜单栏） ----------
var btnShareMenu = document.getElementById('btn-share-menu');
if (btnShareMenu) {
  btnShareMenu.addEventListener('click', function () {
    var shareUrl = window.location.href;
    var shareTitle = '测测你的本命甜点塑 🍰';
    var shareText = '10道小题，找到属于你的甜点人格！快来测测~';

    // 优先使用 Web Share API（手机原生分享）
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      }).catch(function () {});
    } else {
      // 桌面端/微信：复制链接
      copyToClipboard(shareUrl);
    }
  });
}

/**
 * 复制文字到剪贴板 + 短暂反馈
 */
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      showCopyToast('链接已复制！去粘贴分享吧 ♡');
    }).catch(function () {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showCopyToast('链接已复制！去粘贴分享吧 ♡');
  } catch (e) {
    alert('链接：' + text);
  }
  document.body.removeChild(textarea);
}

function showCopyToast(msg) {
  var toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText =
    'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);' +
    'background:#1A1A1A;color:#FFF;padding:12px 24px;border-radius:20px;' +
    'font-size:14px;z-index:99999;white-space:nowrap;' +
    'animation:toastIn 0.3s ease,toastOut 0.3s ease 1.8s forwards;';
  document.body.appendChild(toast);
  setTimeout(function () {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 2200);
}

// ---------- 初始化：确保首页可见 ----------
navigateTo('home');

// ---------- 暴露调试接口到全局 ----------
window.DessertApp = {
  AppState: AppState,
  navigateTo: navigateTo,
  calculateResult: calculateResult,
  scoringSelfTest: scoringSelfTest,
};
