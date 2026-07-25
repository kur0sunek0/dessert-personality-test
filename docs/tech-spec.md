# 技术规格 — 测测你的本命甜点塑

## 技术选型

| 项 | 选型 | 理由 |
|----|------|------|
| 框架 | 无，纯 HTML/CSS/JS | 零依赖，GitHub Pages 拖拽即用 |
| 包管理 | 无，不需要 npm | 不做构建，直接写原生代码 |
| CSS | 原生 CSS（CSS 自定义属性） | 移动端优先，响应式 |
| JS | ES6+ 原生 JavaScript | 现代浏览器全面支持 |
| 海报 | html2canvas (CDN) | 成熟稳定，兼容微信浏览器 |
| 字体 | 系统字体栈 + Google Fonts 英文花体 | 中文字体文件太大，用系统字体保证加载速度 |
| 图标 | Unicode 符号 + Emoji + CSS 绘制 | 免额外图标库 |
| 部署 | GitHub Pages | 免费、稳定、支持自定义域名 |

## 架构设计

```
SPA（单页应用）— 3个视图切换

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  首页欢迎页   │───▶│   答题页     │───▶│   结果页     │
│  (view-home) │    │ (view-quiz) │    │(view-result)│
└─────────────┘    └─────────────┘    └─────────────┘
       ▲                                      │
       └──────────── 重新测试 ◀────────────────┘
```

所有视图在一个 `index.html` 中，通过 `display: none/block` + CSS 类切换，无前端路由库。

## 文件职责

### index.html
- `<head>`: meta viewport, charset UTF-8, favicon, OG 标签, 微信分享 meta
- `<body>`: 3个 `<section>` 对应三个页面，初始仅首页可见
- `<script src="js/questions.js">`
- `<script src="js/results.js">`
- `<script src="js/scoring.js">`
- `<script src="js/poster.js">`
- `<script src="js/app.js">`
- html2canvas CDN: `<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js">`

### css/style.css
- CSS 自定义属性（:root 变量）
- 移动优先基础样式
- 页面切换动画
- 组件样式（按钮、卡片、进度条、选项）
- 装饰系统（边框、花边、符号）
- 响应式断点（768px 平板, 1024px 桌面）
- 海报专属样式

### js/questions.js
```js
const QUESTIONS = [
  {
    id: 1,
    title: '纠结点外卖时，你通常？',
    options: [
      { key: 'A', text: '反复对比，最后选常吃的' },
      { key: 'B', text: '固定几家店，很少尝试新品' },
      { key: 'C', text: '愿意尝试新奇菜品，不怕踩雷' },
      { key: 'D', text: '快速敲定，不反复内耗' },
    ]
  },
  // ... 共10题
];
```

### js/results.js
```js
const RESULTS = {
  1: {
    id: 1,
    name: '泡芙型',
    subtitle: '反差甜妹人格',
    tags: ['外软内稳', '温柔清醒', '高情商'],
    description: '外表软糯可爱...',
    image: 'assets/images/paofu.png',
    emoji: '🍰',
  },
  // ... 共8套
};
```

### js/scoring.js
```js
function calculateResult(answers) {
  // answers: ['A', 'B', 'C', ...] 长度10
  // 统计 + 决策树 → 返回人格ID (1-8)
}
```
纯函数，输入答案数组，输出人格ID。

### js/app.js
应用主控：
- 页面切换（showHome / showQuiz / showResult）
- 答题状态管理（currentQuestion, answers[]）
- 事件绑定
- 结果展示触发

### js/poster.js
```js
async function generatePoster(resultData) {
  // 1. 构建隐藏海报DOM
  // 2. html2canvas渲染
  // 3. 输出图片 → 触发保存/展示
}
```

## 评分算法（决策树）

```
输入: answers: string[] (长度10, 每项 'A'|'B'|'C'|'D')
输出: resultId: number (1-8)

步骤:
1. 统计 A/B/C/D 各出现次数 → counts = {A: n, B: n, C: n, D: n}
2. 找最大值 maxCount = Math.max(...Object.values(counts))
3. 收集 maxCount 对应的选项 → topKeys: string[]
4. 根据 topKeys 匹配:

   单一主导 (topKeys.length === 1):
     A → 2 (草莓奶油蛋糕)
     B → 3 (焦糖烤布蕾)
     C → 5 (甜甜圈)
     D → 6 (芝士乳酪蛋糕)

   双选项并列 (topKeys.length === 2):
     A+D → 1 (泡芙)
     B+D → 4 (巧克力熔岩蛋糕)
     B+C → 7 (柠檬挞)
     A+B → 8 (原味吐司)
     A+C → 2 (草莓奶油蛋糕) [A主导优先]
     C+D → 5 (甜甜圈)        [C主导优先]

   三选项及以上:
     → 1 (泡芙) [默认兜底]
```

## 状态管理

用简单的全局对象，不引入状态库：

```js
const AppState = {
  currentView: 'home',        // 'home' | 'quiz' | 'result'
  currentQuestion: 0,         // 0-9
  answers: new Array(10).fill(null),  // 每项 'A'|'B'|'C'|'D'|null
  resultId: null,             // 1-8 | null
};
```

## html2canvas 使用方案

```html
<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
```

```js
// 1. 构建海报DOM（display:none，放在body底部）
// 2. 渲染
const canvas = await html2canvas(posterEl, {
  scale: 2,           // 2倍清晰度
  useCORS: true,      // 跨域图片
  backgroundColor: '#FFFBF8',
});
// 3. 输出
const dataUrl = canvas.toDataURL('image/png');
// 4a. 桌面端：创建 <a download> 触发下载
// 4b. 移动端/微信：展示 <img> + "长按保存"提示
```

## 微信兼容要点

1. **Meta 标签**：添加微信分享所需的 meta（`wx:title`、`wx:description`、`wx:image` 等）
2. **图片保存**：微信内置浏览器不支持 `download` 属性，改用展示图片 + 长按保存
3. **字体**：微信浏览器对 Google Fonts 加载可能受限，需有系统字体 fallback
4. **调试**：微信开发者工具 / vConsole CDN 注入调试

## 性能目标

- 首屏加载 < 1s（纯静态文件，无框架）
- 海报生成 < 2s（html2canvas 渲染）
- 所有图片总计 < 500KB（像素画 PNG 压缩后很小）
