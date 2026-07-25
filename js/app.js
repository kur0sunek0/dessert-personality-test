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
  pageResult: document.getElementById('page-result'),

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
  [DOM.pageHome, DOM.pageQuiz, DOM.pageResult].forEach(function (el) {
    el.classList.remove('page--active');
  });

  // 激活目标页
  var targetMap = {
    home:   DOM.pageHome,
    quiz:   DOM.pageQuiz,
    result: DOM.pageResult,
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
    // 全部答完 → 计算并跳转结果
    AppState.resultId = calculateResult(AppState.answers);
    navigateTo('result');
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
DOM.btnPoster.addEventListener('click', async function () {
  if (!AppState.resultId) return;

  // 显示加载状态
  DOM.btnPoster.textContent = '⏳ 生成海报中...';
  DOM.btnPoster.disabled = true;

  var dataUrl = await generatePoster(AppState.resultId);

  // 恢复按钮
  DOM.btnPoster.textContent = '📸 保存结果海报';
  DOM.btnPoster.disabled = false;

  // 展示/保存海报
  saveOrSharePoster(dataUrl);
});

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

// ---------- 初始化：确保首页可见 ----------
navigateTo('home');

// ---------- 暴露调试接口到全局 ----------
window.DessertApp = {
  AppState: AppState,
  navigateTo: navigateTo,
  calculateResult: calculateResult,
  scoringSelfTest: scoringSelfTest,
};
