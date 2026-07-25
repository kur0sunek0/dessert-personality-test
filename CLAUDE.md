# CLAUDE.md — 测测你的本命甜点塑 项目工作指引

## 项目概述

这是一个面向年轻群体的竖屏轻量化趣味人格测试 Web App（移动端优先）。通过10道生活化选择题测算用户的"甜点人格"，纯前端静态站点，部署于 GitHub Pages。

## 工作原则

1. **每次只做一件事**：严格按阶段执行，一个阶段完成并验证后再进入下一阶段。
2. **移动端优先**：所有样式先以 375px-414px 手机宽度为基准编写，再向上适配。
3. **当天工作当天记录**：每次改动完成后，在 `devlog/` 下写入/更新当日日志。
4. **先读标准再动手**：涉及样式时先查 `docs/design-spec.md`，涉及逻辑时先查 `docs/tech-spec.md`。

## 关键文件索引

### 规范文档（动手前必读）
| 文件 | 内容 | 何时查阅 |
|------|------|----------|
| [docs/requirements.md](docs/requirements.md) | 完整需求（页面、功能、文案、评分规则） | 任何新功能开发前 |
| [docs/tech-spec.md](docs/tech-spec.md) | 技术架构、评分算法、文件职责、技术选型 | 写 JS 逻辑前 |
| [docs/design-spec.md](docs/design-spec.md) | 配色、字体、组件样式、装饰元素规范 | 写 CSS 前 |
| [docs/dev-roadmap.md](docs/dev-roadmap.md) | 分阶段执行清单 + 验收标准 | 每阶段启动和收尾时 |

### 源代码
| 文件 | 职责 |
|------|------|
| [index.html](index.html) | 主入口，三页 SPA 结构 |
| [css/style.css](css/style.css) | 全局样式，CSS 变量，响应式 |
| [js/app.js](js/app.js) | 应用主逻辑，页面路由，状态管理 |
| [js/questions.js](js/questions.js) | 10道题目数据 |
| [js/results.js](js/results.js) | 8套甜点人格结果数据 |
| [js/scoring.js](js/scoring.js) | 评分算法（纯函数） |
| [js/poster.js](js/poster.js) | 海报生成（html2canvas） |

### 其他
| 文件 | 用途 |
|------|------|
| [devlog/](devlog/) | 每日开发日志 |
| [assets/images/](assets/images/) | 甜点像素画 + favicon 等图片资源 |

## 开发流程

```
阶段 N 启动 → 读 docs/dev-roadmap.md 明确任务
            → 读对应的 docs/ 规范文件
            → 写代码
            → 验证（浏览器打开 + 移动端模拟 + 控制台无报错）
            → 写入 devlog/YYYY-MM-DD.md
            → 阶段 N 完成 ✓
```

## 注意事项

- 不要引入任何框架或构建工具，纯 HTML/CSS/JS。
- 不要引入需要 npm install 的依赖；html2canvas 通过 CDN `<script>` 引入。
- 中文内容全部直接写在 HTML/JS 中，不需要 i18n。
- 用户是不懂代码的小白，项目结构保持简洁，方便后续自行管理。
- 提交信息用中文写。
