# AI 甜点像素画生成提示词

## 统一参数规格

- **尺寸**: 512×512 px（后期缩至256px使用）
- **格式**: PNG，透明背景
- **风格**: 低饱和马卡龙像素画（Pixel Art），日系复古甜品，GBA/NDS游戏道具风格
- **色彩**: 每张不超过6种主色，低饱和马卡龙色系
- **视角**: 正面微俯视（3/4 view），完整展示甜点
- **造型**: Q版圆润，轮廓清晰无抗锯齿，像素边缘干净利落

---

## 通用提示词模板

### 正面提示词（所有甜点共享部分）
```
pixel art, 512x512, exact pixel edges, no anti-aliasing, flat colors,
low saturation pastel macaron color palette, kawaii Japanese dessert illustration,
clean white background, 16-bit retro game item sprite, Studio Ghibli food aesthetic,
Japanese parfait, cute and soft, handheld game art style, pixel-perfect edges,
limited color palette, crisp pixel clusters, dithering shading only
```

### 通用负面提示词
```
oversaturated, glossy, highlights, soft shadows, gradients, blur, 3d render,
realistic photo, text, watermark, signature, face, eyes, mouth, complex background,
too many colors, anti-aliased, smooth edges, noise, grain, HD, high resolution,
photorealistic, oil painting, watercolor, sketch, vector art, anime style
```

---

## 8款甜点独立提示词

### 1. 泡芙 (Cream Puff) — 反差甜妹人格
**主色调**: 奶油米 + 浅金棕 + 淡粉
```
A single cream puff (choux pastry), plump round shape, golden-brown baked top,
whipped cream filling peeking out, powdered sugar dusted on top,
sitting on a small doily, pastel pink decorative tiny heart nearby
```

### 2. 草莓奶油蛋糕 (Strawberry Shortcake) — 治愈温柔人格
**主色调**: 草莓粉 + 奶油白 + 蛋糕黄
```
A slice of strawberry shortcake, three layers visible, white cream frosting between layers,
a fresh whole strawberry with green leaves on top, soft pink sponge cake inside,
slice view showing the layers, on a delicate pastel plate
```

### 3. 焦糖烤布蕾 (Crème Brûlée) — 清冷贵气人格
**主色调**: 焦糖琥珀 + 奶黄 + 瓷白
```
A crème brûlée in a white ramekin, caramelized golden-brown sugar crust on top,
tiny cracks visible on the sugar shell, vanilla custard underneath,
a small silver spoon next to it, elegant and minimal presentation
```

### 4. 巧克力熔岩蛋糕 (Chocolate Lava Cake) — 热烈深情人格
**主色调**: 深棕 + 熔岩暖橙 + 可可棕
```
A chocolate lava cake in a small round ramekin, dark chocolate exterior,
warm molten chocolate center oozing out from the top, dusted with cocoa powder,
a tiny mint leaf garnish, rich warm brown tones
```

### 5. 甜甜圈 (Donut) — 元气万人迷人格
**主色调**: 粉色糖霜 + 彩糖粒 + 面团黄
```
A pink frosted ring donut with a hole in the center, glossy pastel pink icing on top,
colorful tiny sprinkles scattered on the icing, fluffy golden dough visible at the sides,
playful and cute, on a small colorful napkin
```

### 6. 芝士乳酪蛋糕 (Cheesecake) — 清醒独立人格
**主色调**: 乳酪奶黄 + 饼干棕 + 奶油白
```
A triangular slice of baked cheesecake, creamy pale yellow top surface,
biscuit crust base visible at the bottom, smooth and clean surface,
a tiny fork placed next to the slice, minimal and elegant
```

### 7. 柠檬挞 (Lemon Tart) — 清爽小众人格
**主色调**: 柠檬黄 + 挞皮棕 + 薄荷绿
```
A small round lemon tartlet, bright pale yellow lemon curd filling on top,
shortcrust pastry edges with crimped pattern, a tiny green mint leaf garnish,
fresh and clean look, on a pastel green small plate
```

### 8. 原味吐司 (Shokupan Toast) — 安稳治愈人格
**主色调**: 面包棕 + 内芯奶白 + 黄油黄
```
A thick square slice of Japanese shokupan milk bread toast, golden brown crust edges,
soft white fluffy inside, a small pat of butter melting on top,
tiny wisps of steam rising, warm and comforting, simple and wholesome
```

---

## 推荐生成工具 & 参数

### 方案A: Midjourney (推荐)
- 使用 Niji Model 6
- 参数: `--style cute --ar 1:1 --no text,watermark,signature,realistic,3d`
- 优点: Niji 对二次元/像素风理解最好

### 方案B: DALL-E 3
- 通过 ChatGPT 或 API
- 参数: `size: 1024x1024`，生成后用 CSS `image-rendering: pixelated` 缩小保持像素感
- 优点: 对文字描述理解准确

### 方案C: Stable Diffusion
- 模型: Anything V5 或 Counterfeit-V3
- 使用上述提示词 + LoRA（如有 Pixel Art LoRA）

---

## 后处理步骤

1. 用在线工具裁剪/缩放到 256×256 px
2. 如需增强像素感，使用 [Pixelator](https://giventofly.github.io/pixelit/) 等工具二次处理
3. 用 TinyPNG 压缩每张到 < 15KB
4. 按以下文件名放入 `assets/images/`:
   - pao-fu.png → 泡芙
   - strawberry-cake.png → 草莓奶油蛋糕
   - creme-brulee.png → 焦糖烤布蕾
   - chocolate-lava.png → 巧克力熔岩蛋糕
   - donut.png → 甜甜圈
   - cheesecake.png → 芝士乳酪蛋糕
   - lemon-tart.png → 柠檬挞
   - toast.png → 原味吐司
5. 生成 favicon.png (32×32) 和 og-image.png (1200×630)

---

## Y2K 娃娃装饰插图（追加）

### 用途
用于页面装饰（首页两侧、答题页背景），营造古早换装游戏氛围。2-3张即可。

### 统一参数
- **尺寸**: 512×512 px
- **格式**: PNG，透明背景
- **风格**: Y2K千禧少女换装游戏（Himegal / Doll Dress-up），2000年代Flash小游戏美术质感
- **色彩**: 柔和粉色系 + 少量黑色点缀，低饱和

### 通用正面提示词
```
Y2K dress-up game doll character, kawaii himegal style, big sparkly eyes,
blonde hair with pink ribbons, cute pink outfit, pixel art portrait,
transparent background, 2000s Flash game aesthetic, Kiss Doll style,
MyScene inspired, retro online avatar, clean lines, flat colors,
soft pink color palette, doll-like proportions, cute pose, decorative frame
```

### 通用负面提示词
```
realistic, 3D, photorealistic, anime style, Studio Ghibli, dark colors,
creepy, horror, adult themes, too many details, complex shading, gradients
```

### 推荐生成工具
- **Midjourney Niji 6**: `--style cute --ar 1:1 --niji 6`
- **DALL-E 3**: 在提示词前加 "A simple digital illustration of a"

### 后处理
- 缩放到 256×256 或 200×200
- 压缩到 < 20KB
- 放入 `assets/images/` 命名为 `doll-left.png`, `doll-right.png`
- 如需替换页面占位emoji，修改 `index.html` 中 `.doll-placeholder` 为 `<img>`
