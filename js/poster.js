/* ================================================================
   poster.js — 分享海报生成（html2canvas 封装）
   将结果数据渲染为竖版长图卡片，支持保存和分享
   ================================================================ */

/**
 * 生成结果海报
 * 1. 在画布中构建海报 DOM（用emoji代替SVG，html2canvas兼容）
 * 2. 使用 html2canvas 渲染为 canvas
 * 3. 返回 Data URL
 *
 * @param {number} resultId - 人格ID (1-8)
 * @returns {Promise<string>} 海报图片 Data URL (JPEG)
 */
async function generatePoster(resultId) {
  var result = RESULTS[resultId];
  if (!result) {
    console.error('无效的人格ID:', resultId);
    return null;
  }

  var posterCanvas = document.getElementById('poster-canvas');
  if (!posterCanvas) {
    console.error('找不到海报画布元素');
    return null;
  }

  // 1. 将海报画布移到可见区域（html2canvas需要元素在视口内）
  posterCanvas.style.left = '0';
  posterCanvas.style.top = '0';
  posterCanvas.style.opacity = '0';
  posterCanvas.style.position = 'fixed';
  posterCanvas.style.zIndex = '-1';
  posterCanvas.style.pointerEvents = 'none';

  // 2. 构建海报 HTML
  posterCanvas.innerHTML = buildPosterHTML(result);

  // 3. 检查 html2canvas 是否可用
  if (typeof html2canvas === 'undefined') {
    console.error('html2canvas 未加载');
    hidePosterCanvas();
    return fallbackPoster(result);
  }

  // 4. 短暂延迟确保DOM渲染完成
  await new Promise(function (r) { setTimeout(r, 200); });

  // 5. 渲染
  window.scrollTo(0, 0);

  try {
    var canvas = await html2canvas(posterCanvas, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFF0F3',
      logging: false,
    });

    // 6. 转为 JPEG Data URL
    var dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    // 7. 隐藏海报画布
    hidePosterCanvas();

    return dataUrl;
  } catch (e) {
    console.error('html2canvas 渲染失败:', e);
    hidePosterCanvas();
    return fallbackPoster(result);
  }
}

function hidePosterCanvas() {
  var el = document.getElementById('poster-canvas');
  if (el) {
    el.style.left = '-9999px';
    el.style.opacity = '';
    el.style.position = 'absolute';
    el.style.zIndex = '';
  }
}

/**
 * 构建海报 DOM 内容
 * 注意：html2canvas 不支持SVG图片，使用大号emoji代替
 */
function buildPosterHTML(result) {
  var html = '';

  // 顶部黑色波点蕾丝
  html += '<div style="height:6px;margin:16px 20px 8px;border-top:2px dotted #1A1A1A;opacity:0.3;"></div>';

  // 甜点emoji展示区（html2canvas不支持SVG，用emoji）
  html += '<div style="text-align:center;padding:12px 0;">';
  html += '<div style="display:inline-block;width:160px;height:160px;border-radius:50%/40%;';
  html += 'border:2px solid #F5B7C5;background:#FFFFFF;';
  html += 'box-shadow:inset 0 0 0 4px #FFFFFF,inset 0 0 0 6px #FFD9DE;';
  html += 'overflow:hidden;position:relative;text-align:center;line-height:160px;">';
  html += '<span style="position:absolute;top:-14px;left:50%;margin-left:-12px;font-size:24px;">🎀</span>';
  html += '<span style="font-size:72px;line-height:160px;">' + (result.emoji || '🍰') + '</span>';
  html += '</div>';
  html += '</div>';

  // 标题
  html += '<div style="text-align:center;padding:12px 20px;">';
  html += '<p style="font-size:12px;color:#A09898;margin:0 0 4px;';
  html += 'font-family:Arial,sans-serif;letter-spacing:1px;">';
  html += '★ 你的本命甜点是 ★</p>';
  html += '<h2 style="font-size:26px;font-weight:900;color:#1A1A1A;margin:0;letter-spacing:2px;">';
  html += result.name + '</h2>';
  html += '<p style="font-size:16px;color:#F5B7C5;margin:6px 0 0;font-weight:700;">';
  html += '· ' + result.subtitle + ' ·</p>';
  html += '</div>';

  // 标签
  html += '<div style="text-align:center;padding:8px 20px;">';
  for (var i = 0; i < result.tags.length; i++) {
    html += '<span style="display:inline-block;padding:5px 14px;margin:4px;';
    html += 'background:#FFFFFF;color:#1A1A1A;border:1.5px solid #1A1A1A;';
    html += 'border-radius:12px;font-size:12px;';
    html += 'font-family:Arial,sans-serif;">';
    html += result.tags[i] + '</span>';
  }
  html += '</div>';

  // 性格解读
  html += '<div style="margin:16px 24px;padding:20px;background:#FFFFFF;';
  html += 'border:2px solid #D4B0B8;border-radius:8px;text-align:left;">';
  html += '<p style="font-size:14px;color:#3A3030;line-height:1.9;margin:0;">';
  html += result.description;
  html += '</p>';
  html += '</div>';

  // 底部
  html += '<div style="text-align:center;padding:16px 20px 20px;">';
  html += '<p style="font-size:11px;color:#A09898;margin:0 0 4px;">';
  html += '♡  ·  ★  ·  ♡  ·  ★  ·  ♡';
  html += '</p>';
  html += '<p style="font-size:12px;color:#A09898;margin:0;letter-spacing:1px;">';
  html += '测测你的本命甜点塑 🍰';
  html += '</p>';
  html += '<p style="font-size:10px;color:#E8A0B0;margin:4px 0 0;">';
  html += '长按保存 · 分享给朋友一起测 ♡';
  html += '</p>';
  html += '</div>';

  return html;
}

/**
 * 降级方案：当 html2canvas 不可用或失败时
 */
function fallbackPoster(result) {
  console.warn('使用降级海报方案');
  return null;
}

/**
 * 触发海报保存或展示
 */
function saveOrSharePoster(dataUrl) {
  var modal = document.getElementById('poster-modal');
  var container = document.getElementById('poster-image-container');
  var hint = document.getElementById('poster-hint');
  var downloadBtn = document.getElementById('btn-download-poster');

  if (!modal || !container) return;

  container.innerHTML = '';

  if (!dataUrl) {
    container.innerHTML =
      '<div style="text-align:center;padding:40px 20px;color:#8C7A75;">' +
      '<p style="font-size:48px;margin:0 0 12px;">📸</p>' +
      '<p style="font-size:14px;margin:0;">海报生成失败</p>' +
      '<p style="font-size:12px;color:#A09898;">请直接截图本页面分享吧~</p>' +
      '</div>';
    hint.textContent = '请截图本页面分享';
    if (downloadBtn) downloadBtn.style.display = 'none';
  } else {
    var img = document.createElement('img');
    img.src = dataUrl;
    img.alt = '我的甜点人格海报';
    img.style.width = '100%';
    img.style.display = 'block';
    img.style.borderRadius = '8px';
    container.appendChild(img);

    if (WechatEnv.needsLongPressHint) {
      hint.textContent = '📱 长按上方图片保存到相册';
    } else if (WechatEnv.isIOS) {
      hint.textContent = '长按图片即可保存到相册';
    } else {
      hint.textContent = '长按图片保存到相册，或点击下方按钮下载';
    }

    if (downloadBtn) {
      if (!WechatEnv.isWechat && !WechatEnv.isIOS) {
        downloadBtn.style.display = 'inline-flex';
        downloadBtn.onclick = function () {
          var link = document.createElement('a');
          link.download = '我的本命甜点塑海报.jpg';
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
      } else {
        downloadBtn.style.display = 'none';
      }
    }
  }

  modal.style.display = 'flex';
  document.body.classList.add('no-scroll');
}
