/* ================================================================
   app.js — 应用主控
   页面路由、状态管理、事件绑定
   ================================================================ */

// ---------- 全局应用状态 ----------
const AppState = {
  currentPage: 'home',                // 'home' | 'quiz' | 'paywall' | 'result'
  currentQuestion: 0,                 // 0-9
  answers: new Array(10).fill(null),  // 'A'|'B'|'C'|'D' | null
  resultId: null,                     // 1-8 | null
};

// ---------- DOM 元素引用 ----------
const DOM = {
  // 页面容器
  pageHome:    document.getElementById('page-home'),
  pageQuiz:    document.getElementById('page-quiz'),
  pagePaywall: document.getElementById('page-paywall'),
  pageResult:  document.getElementById('page-result'),

  // 首页
  btnStart:    document.getElementById('btn-start'),

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

// ---------- 广告页倒计时 ----------
var adCountdownNum = document.getElementById('ad-countdown-num');
var adProgressFill = document.getElementById('ad-progress-fill');
var btnAdSkip = document.getElementById('btn-ad-skip');
var adTimer = null;
var adSeconds = 5;
var adElapsed = 0;

function startAdCountdown() {
  adElapsed = 0;
  var remaining = adSeconds;
  if (adCountdownNum) adCountdownNum.textContent = remaining;
  if (adProgressFill) adProgressFill.style.width = '0%';
  if (btnAdSkip) { btnAdSkip.disabled = true; btnAdSkip.textContent = '跳过广告 (' + remaining + '秒)'; }

  adTimer = setInterval(function () {
    adElapsed++;
    remaining = adSeconds - adElapsed;
    if (adCountdownNum) adCountdownNum.textContent = Math.max(0, remaining);
    if (adProgressFill) adProgressFill.style.width = ((adElapsed / adSeconds) * 100) + '%';
    if (btnAdSkip) {
      btnAdSkip.textContent = '跳过广告 (' + Math.max(0, remaining) + '秒)';
      if (remaining <= 0) btnAdSkip.disabled = false;
    }
    if (adElapsed >= adSeconds) { clearInterval(adTimer); adTimer = null; navigateTo('result'); }
  }, 1000);
}

function stopAdCountdown() { if (adTimer) { clearInterval(adTimer); adTimer = null; } }

if (btnAdSkip) {
  btnAdSkip.addEventListener('click', function () {
    if (adElapsed >= adSeconds) { stopAdCountdown(); navigateTo('result'); }
  });
}

// ---------- 页面切换 ----------
function navigateTo(pageName) {
  // 离开广告页时清理
  if (adTimer && AppState.currentPage === 'paywall' && pageName !== 'paywall') stopAdCountdown();

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
  if (target) target.classList.add('page--active');

  AppState.currentPage = pageName;

  // 页面初始化钩子
  if (pageName === 'quiz') initQuiz();
  else if (pageName === 'result') renderResult();
  else if (pageName === 'paywall') startAdCountdown();

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

function initQuiz() { renderQuestion(); updateProgress(); updateNavButtons(); }

function renderQuestion() {
  var idx = AppState.currentQuestion;
  var q = QUESTIONS[idx];
  DOM.quizQuestion.textContent = q.title;

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

  var cards = DOM.quizOptions.querySelectorAll('.option-card');
  for (var j = 0; j < cards.length; j++) {
    cards[j].addEventListener('click', function () {
      selectOption(this.getAttribute('data-key'));
    });
  }
}

function selectOption(key) {
  AppState.answers[AppState.currentQuestion] = key;
  var cards = DOM.quizOptions.querySelectorAll('.option-card');
  for (var i = 0; i < cards.length; i++) {
    var cardKey = cards[i].getAttribute('data-key');
    if (cardKey === key) cards[i].classList.add('option-card--selected');
    else cards[i].classList.remove('option-card--selected');
  }
  updateNavButtons();
}

function updateProgress() {
  var current = AppState.currentQuestion + 1;
  DOM.progressText.textContent = current + '/' + QUESTIONS.length;
  DOM.progressFill.style.width = ((current / QUESTIONS.length) * 100) + '%';
}

function updateNavButtons() {
  var idx = AppState.currentQuestion;
  var hasAnswer = AppState.answers[idx] !== null;
  var isLast = idx === QUESTIONS.length - 1;
  var allAnswered = AppState.answers.every(function (a) { return a !== null; });

  DOM.btnPrev.disabled = (idx === 0);
  DOM.btnNext.disabled = !hasAnswer;

  if (isLast) {
    DOM.btnNext.textContent = '查看结果 ✦';
    DOM.btnNext.disabled = !allAnswered;
  } else {
    DOM.btnNext.textContent = '下一题 →';
  }
}

DOM.btnPrev.addEventListener('click', function () {
  if (AppState.currentQuestion > 0) { AppState.currentQuestion--; renderQuestion(); updateProgress(); updateNavButtons(); }
});

DOM.btnNext.addEventListener('click', function () {
  var isLast = AppState.currentQuestion === QUESTIONS.length - 1;
  if (isLast) {
    AppState.resultId = calculateResult(AppState.answers);
    navigateTo('paywall');  // 先看广告
  } else {
    AppState.currentQuestion++; renderQuestion(); updateProgress(); updateNavButtons();
  }
});

DOM.btnBackHome.addEventListener('click', function () { navigateTo('home'); });

// ---------- 结果页逻辑 ----------
function renderResult() {
  var result = RESULTS[AppState.resultId];
  if (!result) return;

  DOM.resultImage.src = result.image;
  DOM.resultImage.alt = result.name;
  DOM.resultImage.style.display = 'block';
  DOM.resultImage.onerror = function () { this.style.display = 'none'; showResultEmojiFallback(result.emoji); };

  DOM.resultName.textContent = result.name + ' · ' + result.subtitle;

  var tagsHtml = '';
  for (var i = 0; i < result.tags.length; i++) {
    tagsHtml += '<span class="result-tag">' + result.tags[i] + '</span>';
  }
  DOM.resultTags.innerHTML = tagsHtml;
  DOM.resultDescription.textContent = result.description;
}

function showResultEmojiFallback(emoji) {
  var frame = document.querySelector('.result-frame');
  if (!frame) return;
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
  var posterData = generatePoster(AppState.resultId);
  saveOrSharePoster(posterData);
});

// 重新测试
DOM.btnRetry.addEventListener('click', function () { resetQuiz(); navigateTo('quiz'); });

// ---------- 赞赏弹窗 ----------
var donateModal = document.getElementById('donate-modal');
var btnDonate = document.getElementById('btn-donate');
var btnCloseDonate = document.getElementById('btn-close-donate');

if (btnDonate && donateModal) {
  btnDonate.addEventListener('click', function () { donateModal.style.display = 'flex'; document.body.classList.add('no-scroll'); });
}
if (btnCloseDonate && donateModal) {
  btnCloseDonate.addEventListener('click', function () { donateModal.style.display = 'none'; document.body.classList.remove('no-scroll'); });
  var donateOverlay = donateModal.querySelector('.poster-modal__overlay');
  if (donateOverlay) donateOverlay.addEventListener('click', function () { donateModal.style.display = 'none'; document.body.classList.remove('no-scroll'); });
}

// ---------- 海报弹窗 ----------
DOM.btnCloseModal.addEventListener('click', closePosterModal);
document.querySelector('.poster-modal__overlay').addEventListener('click', closePosterModal);

function closePosterModal() { DOM.posterModal.style.display = 'none'; document.body.classList.remove('no-scroll'); }

DOM.btnDownloadPoster.addEventListener('click', function () { alert('请长按海报图片保存到相册~'); });

// ---------- 分享按钮（菜单栏） ----------
var btnShareMenu = document.getElementById('btn-share-menu');
if (btnShareMenu) {
  btnShareMenu.addEventListener('click', function () {
    var shareUrl = window.location.href;
    if (navigator.share) { navigator.share({ title: '测测你的本命甜点塑 🍰', text: '10道小题，找到属于你的甜点人格！快来测测~', url: shareUrl }).catch(function () {}); }
    else { copyToClipboard(shareUrl); }
  });
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () { showCopyToast('链接已复制！去粘贴分享吧 ♡'); }).catch(function () { fallbackCopy(text); });
  } else { fallbackCopy(text); }
}
function fallbackCopy(text) {
  var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); showCopyToast('链接已复制！去粘贴分享吧 ♡'); } catch (e) { alert('链接：' + text); }
  document.body.removeChild(ta);
}
function showCopyToast(msg) {
  var toast = document.createElement('div'); toast.textContent = msg;
  toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1A1A1A;color:#FFF;padding:12px 24px;border-radius:20px;font-size:14px;z-index:99999;white-space:nowrap;animation:toastIn 0.3s ease,toastOut 0.3s ease 1.8s forwards;';
  document.body.appendChild(toast);
  setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 2200);
}

// ---------- 初始化 ----------
navigateTo('home');

window.DessertApp = { AppState: AppState, navigateTo: navigateTo, calculateResult: calculateResult, scoringSelfTest: scoringSelfTest };
