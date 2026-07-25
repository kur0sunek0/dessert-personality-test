# 设计规范 v2 — 测测你的本命甜点塑

## 风格定位

**Y2K千禧甜酷少女风｜Web1.0古早虚拟社交主页**
（SpaceHey / Neocities 复古个人站风格）

融合2000年代欧美少女社交网页审美、复古换装娃娃像素美学，甜腻粉色系，充满初代互联网怀旧感，带有动态装饰。甜而不腻，粉黑平衡，甜酷兼有。

---

## 色彩体系

| 用途 | 色值 | 说明 |
|------|------|------|
| 主背景 | `#FFF0F3` | 奶油浅粉 |
| 面板底色 | `#FFFFFF` | 纯白窗口 |
| 辅助粉 | `#FFD9DE` | 浅裸粉模块 |
| 强调粉 | `#F5B7C5` | 甜粉色边框 |
| **黑色** | `#1A1A1A` | **纯黑文字/蕾丝/波点** |
| 浅灰 | `#F0EDED` | 背景过渡 |
| 蝴蝶结色 | `#F8C8D0` | 蝴蝶结链条主色 |

> ⚠️ **新风格关键特征**：大面积的淡粉色 + 纯黑色点缀（波点、蕾丝），对比鲜明，甜酷平衡。**允许使用纯黑色**（仅在装饰元素和文字中，与旧规范的"禁用纯黑"不同）。

---

## 字体体系

```css
/* 标题 — Google Fonts 纤细花体英文 */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
font-family: 'Playfair Display', 'Georgia', serif;

/* 正文 — 简洁无衬线 */
font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;

/* 古早像素感英文 */
font-family: "Courier New", "MS Sans Serif", monospace;
```

## 字号规范

| 层级 | 移动端(≤480px) | 平板/桌面(>768px) |
|------|----------------|-------------------|
| 主标题 | 22px | 28px |
| 副标题 | 16px | 18px |
| 正文 | 14px | 15px |
| 辅助文字 | 12px | 13px |
| 小字 | 10px | 11px |
| 英文花体标题 | 20px | 26px |

---

## 布局系统

### 自由错落式卡片网格（碎片化拼贴）
- 多个大小不一的圆角矩形悬浮模块随意排布
- 模块之间留有空隙
- 模拟早期社交主页自定义排版
- 移动端：单列堆叠，保持错落间距
- 桌面端：多列拼贴布局

### 页面最大宽度
- 移动端：全宽（padding: 12px）
- 桌面端：max-width: 680px 居中

---

## 核心装饰元素

### 1. 动态蝴蝶结链条边框（页面标志性元素）
- 使用纯 CSS 动画实现
- 多个 🎀 emoji 或 CSS 绘制的蝴蝶结沿页面四边循环流动
- 一个完整的闭环，蝴蝶结逐个移动
- `animation: ribbonFlow 8s linear infinite`
- 移动端缩小蝴蝶结尺寸和数量

### 2. 复古窗口面板
- 所有卡片模拟老式电脑弹窗
- 顶部带标题栏（黑色背景 + 白色文字）
- 面板带立体浮雕效果（模拟早期网页3D按钮质感）：
  ```css
  border: 2px solid;
  border-color: #FFFFFF #D4B0B8 #D4B0B8 #FFFFFF;
  box-shadow: inset 1px 1px 0 #FFFFFF, 1px 1px 0 rgba(0,0,0,0.1);
  ```

### 3. 黑色波点蕾丝花边
- 部分面板顶部有黑色圆点排列的蕾丝边效果
- 使用 CSS `radial-gradient` 或 `border-image` 实现
- 或简单的 border-top 黑色虚线 + 圆点装饰

### 4. 内部纹理
- 竖条纹：`repeating-linear-gradient`
- 菱格纹：双层 `repeating-linear-gradient` 交叉
- 绗缝爱心软垫：`radial-gradient` + 爱心形状

### 5. 复古社交菜单（纯装饰）
- 模拟 MySpace 时代的社交按钮栏
- 按钮文字：「Send Message」「Add to Favorites」「Comment」「Share」
- 放在首页顶部或侧边，营造古早社交网页氛围
- 使用老式按钮样式：灰色渐变 + 浮雕边框

### 6. 复古滚动条
```css
::-webkit-scrollbar { width: 12px; }
::-webkit-scrollbar-track { background: #FFF0F3; }
::-webkit-scrollbar-thumb { background: #F5B7C5; border-radius: 6px; }
```

---

## 圆角与阴影

| 元素 | 圆角 | 阴影 |
|------|------|------|
| 大窗口面板 | 8px（复古小圆角，非现代大圆角） | 浮雕立体阴影 |
| 按钮 | 4px（老式直角按钮感） | 3D 凹凸效果 |
| 标签 | 12px | 无/微投影 |
| 图片框 | 6px | 白色内边框 + 外阴影 |

---

## 按钮系统

### 主按钮（甜粉色）
```css
background: #F5B7C5;
border: 2px solid #E8A0B0;
color: #1A1A1A;
/* 浮雕3D效果 */
box-shadow: inset 0 1px 0 rgba(255,255,255,0.4),
            0 2px 4px rgba(0,0,0,0.15);
```

### 复古社交按钮
```css
background: linear-gradient(180deg, #F8F8F8, #E0D8D8);
border: 2px solid #C0B0B0;
color: #1A1A1A;
font-family: "MS Sans Serif", sans-serif;
font-size: 11px;
```

### 文字链接（古早蓝色下划线风）
```css
color: #0000EE;
text-decoration: underline;
```

---

## 装饰图标

迷你装饰符号：🌹 👠 ✨ 👗 💕 🎀 ♡ ★ ☆
像素爱心、对话框气泡、小裙子图标

---

## 插图规范

- **甜点形象**：保留8张SVG像素画，用于结果页
- **装饰娃娃**：AI生成古早换装游戏Q版卡通娃娃（Himegal / Doll Dress-up风格），大眼金发少女、复古手绘风，用于首页和页面装饰
- **娃娃风格参考**：2000年代Flash小游戏美术质感，Kiss Doll / MyScene 风格

---

## 动效规范

| 元素 | 动效 |
|------|------|
| 蝴蝶结链条 | 沿边框持续循环流动，8s一圈 |
| 页面切换 | 复古推拉门效果 或 淡入 |
| 按钮 hover | 3D按压效果（阴影反转） |
| 选项选中 | 波点边框 + 淡粉填充 |
| 进度条 | 黑粉条纹填充动画 |

---

## 响应式断点

| 断点 | 宽度 | 布局变化 |
|------|------|----------|
| 手机 | 320-480px | 单列，蝴蝶结缩小，卡片全宽 |
| 平板 | 768px+ | 蝴蝶结恢复正常大小 |
| 桌面 | 1024px+ | 多列拼贴，页面居中，显示完整边框 |

---

## 与 v1 设计的主要变化

| 维度 | v1（日系手账风） | v2（Y2K甜酷风） |
|------|------------------|------------------|
| 主色 | 纯白 + 极淡奶油粉 | 奶油浅粉 + 纯黑 |
| 配色逻辑 | 禁用纯黑 | 黑色是核心点缀 |
| 布局 | 整齐卡片瀑布流 | 自由错落拼贴 |
| 边框 | 圆角矩形 + 银灰线 | 复古弹窗 + 3D浮雕 |
| 氛围 | 安静、细腻、手作感 | 活泼、复古电子感、甜酷 |
| 动态元素 | 无 | 蝴蝶结链条循环流动 |
| 装饰 | ASCII符号 + 花边 | 波点蕾丝 + 仿社交菜单 |
| 字体 | 圆润宋体/黑体 | 花体英文 + 无衬线 |
