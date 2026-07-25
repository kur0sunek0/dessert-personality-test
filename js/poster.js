/* ================================================================
   poster.js — 分享海报生成（html2canvas 封装）
   将结果数据渲染为竖版长图卡片，支持保存和分享
   ================================================================ */

/**
 * 生成结果海报
 * 1. 在隐藏画布中构建海报 DOM
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

  // 1. 构建海报 HTML
  posterCanvas.innerHTML = buildPosterHTML(result);

  // 2. 等待所有图片加载完成
  var images = posterCanvas.querySelectorAll('img');
  var imagePromises = [];
  for (var i = 0; i < images.length; i++) {
    imagePromises.push(waitForImage(images[i]));
  }

  try {
    await Promise.all(imagePromises);
  } catch (e) {
    console.warn('部分海报图片加载失败，继续生成:', e.message);
  }

  // 3. 检查 html2canvas 是否可用
  if (typeof html2canvas === 'undefined') {
    console.error('html2canvas 未加载');
    return fallbackPoster(result);
  }

  // 4. 渲染（微信iOS关键：先滚动一下）
  window.scrollTo(0, 0);

  try {
    var canvas = await html2canvas(posterCanvas, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFF0F3',
      logging: false,
    });

    // 5. 转为 JPEG Data URL（控制文件大小）
    var dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    return dataUrl;
  } catch (e) {
    console.error('html2canvas 渲染失败:', e);
    return fallbackPoster(result);
  }
}

/**
 * 构建海报 DOM 内容
 * @param {Object} result - 结果数据对象
 * @returns {string} HTML 字符串
 */
function buildPosterHTML(result) {
  // 海报尺寸：370px 宽（适配手机屏幕），Y2K风格
  var html = '';

  // === 顶部黑色波点蕾丝 ===
  html += '<div style="height:6px;margin:16px 20px 8px;background-image:';
  html += 'radial-gradient(circle,#1A1A1A 1.5px,transparent 1.5px);';
  html += 'background-size:8px 6px;background-repeat:repeat-x;opacity:0.5;"></div>';

  // === 甜点图片 ===
  html += '<div style="text-align:center;padding:12px 0;">';
  html += '<div style="display:inline-block;width:160px;height:160px;border-radius:50%/40%;';
  html += 'border:2px solid #F5B7C5;background:#FFFFFF;';
  html += 'box-shadow:inset 0 0 0 4px #FFFFFF,inset 0 0 0 6px #FFD9DE;';
  html += 'overflow:hidden;position:relative;">';
  // 蝴蝶结
  html += '<span style="position:absolute;top:-12px;font-size:24px;">🎀</span>';
  // 图片
  html += '<img src="' + result.image + '" alt="' + result.name + '" ';
  html += 'width="140" height="140" style="object-fit:contain;image-rendering:pixelated;" ';
  html += 'onerror="this.style.display=\'none\'">';
  html += '</div>';
  html += '</div>';

  // === 标题 ===
  html += '<div style="text-align:center;padding:12px 20px;">';
  html += '<p style="font-size:12px;color:#A09898;margin:0 0 4px;';
  html += 'font-family:\'MS Sans Serif\',\'Trebuchet MS\',sans-serif;letter-spacing:1px;">';
  html += '★ 你的本命甜点是 ★</p>';
  html += '<h2 style="font-size:26px;font-weight:900;color:#1A1A1A;margin:0;letter-spacing:2px;">';
  html += result.name + '</h2>';
  html += '<p style="font-size:16px;color:#F5B7C5;margin:6px 0 0;font-weight:700;">';
  html += '· ' + result.subtitle + ' ·</p>';
  html += '</div>';

  // === 标签 ===
  html += '<div style="text-align:center;padding:8px 20px;">';
  for (var i = 0; i < result.tags.length; i++) {
    html += '<span style="display:inline-block;padding:5px 14px;margin:4px;';
    html += 'background:#FFFFFF;color:#1A1A1A;border:1.5px solid #1A1A1A;';
    html += 'border-radius:12px;font-size:12px;';
    html += 'font-family:\'MS Sans Serif\',\'Trebuchet MS\',sans-serif;">';
    html += result.tags[i] + '</span>';
  }
  html += '</div>';

  // === 性格解读（复古弹窗） ===
  html += '<div style="margin:16px 24px;padding:20px;background:#FFFFFF;';
  html += 'border:2px solid #D4B0B8;border-color:#FFFFFF #D4B0B8 #D4B0B8 #FFFFFF;';
  html += 'border-radius:8px;box-shadow:inset 1px 1px 0 rgba(255,255,255,0.8),';
  html += 'inset -1px -1px 0 rgba(0,0,0,0.08);text-align:left;">';
  html += '<p style="font-size:14px;color:#3A3030;line-height:1.9;margin:0;">';
  html += result.description;
  html += '</p>';
  html += '</div>';

  // === 底部 ===
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
 * 等待单张图片加载完成
 * @param {HTMLImageElement} img
 * @returns {Promise}
 */
function waitForImage(img) {
  return new Promise(function (resolve, reject) {
    if (img.complete && img.naturalWidth > 0) {
      resolve();
      return;
    }
    img.onload = resolve;
    img.onerror = function () {
      // 图片加载失败不阻塞流程
      resolve();
    };
    // 超时兜底
    setTimeout(resolve, 3000);
  });
}

/**
 * 降级方案：当 html2canvas 不可用或失败时
 * 返回简单的纯文本兜底海报数据
 */
function fallbackPoster(result) {
  console.warn('使用降级海报方案');
  // 返回 null 让调用方显示提示
  return null;
}

/**
 * 触发海报保存或展示
 * 根据运行环境选择最佳方式：
 * - 桌面端：创建下载链接
 * - 移动端/微信：弹窗展示图片，引导长按保存
 *
 * @param {string} dataUrl - 图片 Data URL
 */
function saveOrSharePoster(dataUrl) {
  var modal = document.getElementById('poster-modal');
  var container = document.getElementById('poster-image-container');
  var hint = document.getElementById('poster-hint');
  var downloadBtn = document.getElementById('btn-download-poster');

  if (!modal || !container) return;

  // 清空旧内容
  container.innerHTML = '';

  if (!dataUrl) {
    // 降级：提示用户截图
    container.innerHTML =
      '<div style="text-align:center;padding:40px 20px;color:#8C7A75;">' +
      '<p style="font-size:48px;margin:0 0 12px;">📸</p>' +
      '<p style="font-size:14px;margin:0;">海报生成失败</p>' +
      '<p style="font-size:12px;color:#B5A5A0;">请直接截图本页面分享给朋友吧~</p>' +
      '</div>';
    hint.textContent = '请截图本页面分享';
    if (downloadBtn) downloadBtn.style.display = 'none';
  } else {
    // 展示生成的海报图片
    var img = document.createElement('img');
    img.src = dataUrl;
    img.alt = '我的甜点人格海报';
    img.style.width = '100%';
    img.style.display = 'block';
    img.style.borderRadius = '8px';
    container.appendChild(img);

    // 根据环境设置提示文字
    if (WechatEnv.needsLongPressHint) {
      hint.textContent = '📱 长按上方图片保存到相册';
    } else if (WechatEnv.isIOS) {
      hint.textContent = '长按图片即可保存到相册';
    } else {
      hint.textContent = '长按图片保存到相册，或点击下方按钮下载';
    }

    // 桌面端显示下载按钮
    if (downloadBtn) {
      if (!WechatEnv.isWechat && !WechatEnv.isIOS) {
        downloadBtn.style.display = 'inline-flex';
        // 更新下载按钮事件
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

  // 显示弹窗
  modal.style.display = 'flex';
  document.body.classList.add('no-scroll');
}
