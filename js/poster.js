/* ================================================================
   poster.js — 截图海报方案（不用html2canvas，100%可靠）
   直接在弹窗中展示精美海报卡片，用户截图即可分享
   ================================================================ */

/**
 * 生成并展示海报
 * 不再使用html2canvas，直接在弹窗中渲染精美HTML卡片
 * 用户截图/长按即可保存分享
 */
function generatePoster(resultId) {
  var result = RESULTS[resultId];
  if (!result) return null;

  // 构建海报HTML，直接展示
  var html = buildPosterCardHTML(result);

  // 同时用Canvas生成下载用的小图（纯文字+emoji，简单可靠）
  var downloadDataUrl = buildCanvasDownload(result);

  return { html: html, downloadUrl: downloadDataUrl };
}

/**
 * 构建海报卡片HTML（直接在弹窗中展示）
 */
function buildPosterCardHTML(result) {
  var h = '';
  h += '<div style="background:#FFF0F3;padding:4px;border:2px solid #1A1A1A;border-radius:12px;max-width:340px;margin:0 auto;">';

  // 顶部黑条标题栏
  h += '<div style="background:#1A1A1A;color:#FFF;text-align:center;padding:8px;border-radius:8px 8px 0 0;font-size:11px;font-family:Arial,sans-serif;letter-spacing:2px;">';
  h += '★ 测测你的本命甜点塑 ★';
  h += '</div>';

  // 主体白色区域
  h += '<div style="background:#FFFFFF;padding:20px;text-align:center;border-radius:0 0 8px 8px;">';

  // 甜品emoji大图
  h += '<div style="display:inline-block;width:120px;height:120px;border-radius:50%/40%;border:2px solid #F5B7C5;background:#FFF5F8;text-align:center;line-height:120px;margin:0 auto 12px;position:relative;">';
  h += '<span style="font-size:56px;line-height:120px;">' + (result.emoji || '🍰') + '</span>';
  h += '<span style="position:absolute;top:-14px;left:50%;margin-left:-10px;font-size:20px;">🎀</span>';
  h += '</div>';

  // 名称
  h += '<h2 style="font-size:22px;font-weight:900;color:#1A1A1A;margin:8px 0 2px;letter-spacing:2px;">';
  h += result.name + '</h2>';
  h += '<p style="font-size:14px;color:#F5B7C5;margin:0 0 10px;font-weight:700;">· ' + result.subtitle + ' ·</p>';

  // 标签
  h += '<div style="margin:8px 0;">';
  for (var i = 0; i < result.tags.length; i++) {
    h += '<span style="display:inline-block;padding:4px 12px;margin:3px;background:#FFF;color:#1A1A1A;border:1.5px solid #1A1A1A;border-radius:10px;font-size:11px;font-family:Arial,sans-serif;">' + result.tags[i] + '</span>';
  }
  h += '</div>';

  // 性格解读
  h += '<div style="margin:12px 0 0;padding:14px;background:#FFFBFD;border:1px solid #F5E1E1;border-radius:8px;text-align:left;">';
  h += '<p style="font-size:13px;color:#3A3030;line-height:1.8;margin:0;">' + result.description + '</p>';
  h += '</div>';

  // 底部
  h += '<p style="font-size:10px;color:#C0B0B0;margin:12px 0 0;">♡ 测测你的本命甜点塑 ♡</p>';

  h += '</div></div>';

  return h;
}

/**
 * 用Canvas生成简易下载图（纯文字+emoji，不依赖外部图片）
 */
function buildCanvasDownload(result) {
  try {
    var canvas = document.createElement('canvas');
    canvas.width = 680;
    canvas.height = 900;
    var ctx = canvas.getContext('2d');

    // 背景
    ctx.fillStyle = '#FFF0F3';
    ctx.fillRect(0, 0, 680, 900);

    // 白色卡片
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(30, 60, 620, 780, 16);
    ctx.fill();
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 顶部黑条
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.roundRect(30, 60, 620, 44, [16, 16, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ 测测你的本命甜点塑 ★', 340, 88);

    // 甜品emoji
    ctx.font = '80px Arial';
    ctx.fillText(result.emoji || '🍰', 340, 190);

    // 蝴蝶结
    ctx.font = '24px Arial';
    ctx.fillText('🎀', 340, 136);

    // 名称
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.fillText(result.name, 340, 250);

    // 副标题
    ctx.fillStyle = '#F5B7C5';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText('· ' + result.subtitle + ' ·', 340, 282);

    // 标签
    var tagY = 320;
    ctx.font = 'bold 15px Arial, sans-serif';
    for (var i = 0; i < result.tags.length; i++) {
      var tag = result.tags[i];
      var tw = ctx.measureText(tag).width + 28;
      var tx = 340 - (result.tags.length * 70) / 2 + i * 72;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(tx - tw / 2, tagY - 13, tw, 28, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1A1A1A';
      ctx.fillText(tag, tx, tagY + 5);
    }

    // 解读文字
    ctx.fillStyle = '#3A3030';
    ctx.font = '16px Arial, sans-serif';
    var lines = wrapText(ctx, result.description, 560);
    var descY = 380;
    for (var j = 0; j < lines.length; j++) {
      ctx.fillText(lines[j], 340, descY + j * 28);
    }

    // 底部
    ctx.fillStyle = '#C0B0B0';
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText('♡ 测测你的本命甜点塑 ♡', 340, 810);

    return canvas.toDataURL('image/jpeg', 0.85);
  } catch (e) {
    console.warn('Canvas下载图生成失败:', e);
    return null;
  }
}

function wrapText(ctx, text, maxWidth) {
  var words = text.split('');
  var lines = [];
  var current = '';
  for (var i = 0; i < words.length; i++) {
    var test = current + words[i];
    if (ctx.measureText(test).width > maxWidth && current.length > 0) {
      lines.push(current);
      current = words[i];
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * 降级方案
 */
function fallbackPoster(result) {
  return { html: buildPosterCardHTML(result), downloadUrl: null };
}

/**
 * 展示海报弹窗
 */
function saveOrSharePoster(result) {
  var modal = document.getElementById('poster-modal');
  var container = document.getElementById('poster-image-container');
  var hint = document.getElementById('poster-hint');
  var downloadBtn = document.getElementById('btn-download-poster');

  if (!modal || !container) return;

  container.innerHTML = '';

  if (!result || !result.html) {
    container.innerHTML =
      '<div style="text-align:center;padding:30px;color:#3A3030;">' +
      '<p style="font-size:48px;margin:0 0 10px;">📸</p>' +
      '<p style="font-size:14px;">请直接截图本页面分享吧~</p></div>';
    hint.textContent = '📸 截图保存到相册';
    if (downloadBtn) downloadBtn.style.display = 'none';
  } else {
    // 直接展示HTML海报卡片
    container.innerHTML = result.html;

    // 提示文字
    if (WechatEnv.needsLongPressHint) {
      hint.textContent = '📱 截图保存到相册，分享给朋友吧 ♡';
    } else if (WechatEnv.isIOS) {
      hint.textContent = '📸 截图保存到相册，分享给朋友吧 ♡';
    } else {
      hint.textContent = '📸 截图保存到相册，分享给朋友吧 ♡';
    }

    // 桌面端显示下载按钮
    if (downloadBtn) {
      if (!WechatEnv.isWechat && !WechatEnv.isIOS && result.downloadUrl) {
        downloadBtn.style.display = 'inline-flex';
        downloadBtn.onclick = function () {
          var link = document.createElement('a');
          link.download = '我的本命甜点塑海报.jpg';
          link.href = result.downloadUrl;
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
