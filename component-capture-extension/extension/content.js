(() => {
  if (window.__ccLoaded) {
    window.__ccActivate?.();
    return;
  }
  window.__ccLoaded = true;

  const SERVER = 'http://localhost:54321';

  const VISUAL_PROPS = [
    'display', 'position', 'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
    'margin', 'padding', 'color', 'backgroundColor', 'backgroundImage',
    'border', 'borderRadius', 'boxShadow',
    'font', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'textAlign',
    'flex', 'flexDirection', 'flexWrap', 'alignItems', 'justifyContent', 'gap',
    'gridTemplateColumns', 'gridTemplateRows', 'gridGap',
    'overflow', 'opacity', 'cursor',
    'transition', 'transform', 'animation', 'animationName', 'animationDuration',
    'textDecoration', 'textTransform', 'whiteSpace', 'boxSizing',
  ];

  let highlight = null;
  let labelEl = null;
  let panel = null;
  let selecting = false;
  let hoveredEl = null;
  let capturedData = null;
  let screenshotDataUrl = null;
  let stateCaptures = [];

  // ── Helpers ──
  function getVisualStyles(el) {
    const computed = getComputedStyle(el);
    const styles = {};
    for (const prop of VISUAL_PROPS) {
      const val = computed[prop];
      if (val && val !== 'none' && val !== 'normal' && val !== 'auto' && val !== '0px' && val !== 'rgba(0, 0, 0, 0)') {
        styles[prop] = val;
      }
    }
    return styles;
  }

  function captureElement(el) {
    const rect = el.getBoundingClientRect();
    const children = [];
    for (const child of el.children) {
      if (children.length >= 30) break;
      children.push(captureElement(child));
    }
    return {
      tag: el.tagName.toLowerCase(),
      classes: el.className && typeof el.className === 'string' ? el.className.split(/\s+/).filter(Boolean) : [],
      id: el.id || undefined,
      text: el.children.length === 0 ? (el.textContent || '').trim().slice(0, 200) : undefined,
      styles: getVisualStyles(el),
      rect: { width: Math.round(rect.width), height: Math.round(rect.height) },
      children: children.length > 0 ? children : undefined,
    };
  }

  function getElementLabel(el) {
    const tag = el.tagName.toLowerCase();
    const cls = el.className && typeof el.className === 'string'
      ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
      : '';
    const r = el.getBoundingClientRect();
    return `<${tag}${cls}> ${Math.round(r.width)}×${Math.round(r.height)}`;
  }

  // ── Selector — elementFromPoint with hide/show trick (like DevTools) ──
  function onMouseMove(e) {
    if (!selecting) return;

    // Hide our elements so elementFromPoint sees the real page
    if (highlight) highlight.style.display = 'none';
    if (labelEl) labelEl.style.display = 'none';

    const el = document.elementFromPoint(e.clientX, e.clientY);

    if (!el || el.closest('#cc-panel')) {
      if (highlight) highlight.style.display = '';
      if (labelEl) labelEl.style.display = '';
      return;
    }

    if (hoveredEl !== el) {
      hoveredEl = el;
    }

    const rect = el.getBoundingClientRect();

    if (!highlight) {
      highlight = document.createElement('div');
      highlight.className = 'cc-highlight';
      document.body.appendChild(highlight);
    }
    if (!labelEl) {
      labelEl = document.createElement('div');
      labelEl.className = 'cc-highlight-label';
      document.body.appendChild(labelEl);
    }

    Object.assign(highlight.style, {
      top: rect.top + window.scrollY + 'px',
      left: rect.left + window.scrollX + 'px',
      width: rect.width + 'px',
      height: rect.height + 'px',
      display: 'block',
    });
    labelEl.textContent = getElementLabel(el);
    Object.assign(labelEl.style, {
      top: (rect.top + window.scrollY - 22) + 'px',
      left: rect.left + window.scrollX + 'px',
      display: 'block',
    });
  }

  function onClick(e) {
    if (!selecting) return;
    if (e.target.closest('#cc-panel')) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if (!hoveredEl) return;

    capturedData = {
      captured: captureElement(hoveredEl),
      outerHTML: hoveredEl.outerHTML.length > 50000
        ? hoveredEl.outerHTML.slice(0, 50000) + '<!-- truncated -->'
        : hoveredEl.outerHTML,
      rect: (() => {
        const r = hoveredEl.getBoundingClientRect();
        return { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) };
      })(),
      pageUrl: location.href,
      pageTitle: document.title,
    };

    stopSelecting();
    showPanel();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      destroyAll();
    }
  }

  function startSelecting() {
    selecting = true;
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKeyDown, true);
    showToast('点击选择要采集的元素，Esc 退出');

    chrome.runtime.sendMessage({ type: 'TAKE_SCREENSHOT' }, (res) => {
      if (res?.screenshot) screenshotDataUrl = res.screenshot;
    });
  }

  function stopSelecting() {
    selecting = false;
    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('click', onClick, true);
    highlight?.remove();
    labelEl?.remove();
    highlight = null;
    labelEl = null;
    hoveredEl = null;
  }

  // ── In-page Panel ──
  function showPanel() {
    const el = capturedData.captured;
    const previewInfo = `&lt;${el.tag}&gt; ${el.rect.width}×${el.rect.height}px`;

    stateCaptures = [];

    panel = document.createElement('div');
    panel.id = 'cc-panel';
    panel.innerHTML = `
      <div class="cc-p-header">
        <span class="cc-p-title">Component Capture</span>
        <button class="cc-p-close" id="cc-close">✕</button>
      </div>

      <div class="cc-p-preview">
        ${screenshotDataUrl ? `<img src="${screenshotDataUrl}" class="cc-p-img">` : ''}
        <div class="cc-p-info">${previewInfo} · ${capturedData.pageTitle}</div>
      </div>

      <div class="cc-p-form">
        <label class="cc-p-label">组件名称</label>
        <input type="text" id="cc-name" class="cc-p-input" placeholder="例：渐变悬浮按钮"
          value="${(el.classes?.[0] || el.tag).replace(/[-_]/g, ' ').replace(/"/g, '')}">

        <label class="cc-p-label">描述交互行为</label>
        <textarea id="cc-desc" class="cc-p-textarea" rows="3"
          placeholder="描述这个组件的交互效果，比如：鼠标悬浮时有渐变色过渡和微弹效果"></textarea>

        <label class="cc-p-label">产品线</label>
        <select id="cc-pl" class="cc-p-input">
          <option value="b-end" selected>B 端</option>
          <option value="website">官网</option>
          <option value="ai-product">AI 产品</option>
          <option value="universal">通用</option>
        </select>

        <label class="cc-p-label">标签 <span class="cc-p-opt">空格分隔</span></label>
        <input type="text" id="cc-tags" class="cc-p-input" placeholder="button hover animation">

        <label class="cc-p-label">分类</label>
        <select id="cc-cat" class="cc-p-input">
          <option value="interactive" selected>交互 Interactive</option>
          <option value="navigation">导航 Navigation</option>
          <option value="feedback">反馈 Feedback</option>
          <option value="data-display">数据展示 Data Display</option>
          <option value="form">表单 Form</option>
          <option value="layout">布局 Layout</option>
          <option value="animation">动效 Animation</option>
          <option value="other">其他 Other</option>
        </select>

        <!-- Multi-state captures -->
        <div class="cc-p-section">
          <div class="cc-p-section-header">
            <label class="cc-p-label" style="margin-top:0">组件状态 <span class="cc-p-opt">可选</span></label>
            <button id="cc-add-state" class="cc-p-btn-small">+ 添加状态</button>
          </div>
          <div id="cc-states" class="cc-p-states"></div>
        </div>

        <!-- Extra code -->
        <div class="cc-p-section">
          <div class="cc-p-section-header">
            <label class="cc-p-label" style="margin-top:0">补充代码 <span class="cc-p-opt">可选</span></label>
            <button id="cc-add-code" class="cc-p-btn-small">+ 添加代码</button>
          </div>
          <div id="cc-codes" class="cc-p-codes"></div>
        </div>
      </div>

      <div class="cc-p-actions">
        <button id="cc-reselect" class="cc-p-btn-ghost">重新选择</button>
        <button id="cc-save" class="cc-p-btn-primary">保存采集</button>
      </div>

      <div id="cc-status" class="cc-p-status" style="display:none"></div>
    `;
    document.body.appendChild(panel);

    panel.querySelector('#cc-close').onclick = () => destroyAll();
    panel.querySelector('#cc-reselect').onclick = () => {
      panel.remove();
      panel = null;
      capturedData = null;
      stateCaptures = [];
      startSelecting();
    };
    panel.querySelector('#cc-save').onclick = handleSave;
    panel.querySelector('#cc-add-state').onclick = addStateCapture;
    panel.querySelector('#cc-add-code').onclick = addCodeBlock;

    panel.addEventListener('mousedown', e => e.stopPropagation());
    panel.addEventListener('click', e => e.stopPropagation());
    document.addEventListener('keydown', onKeyDown, true);
  }

  // ── Multi-state: describe + optionally pick element for each state ──
  let stateCounter = 0;
  let statePickCallback = null;

  function addStateCapture() {
    const idx = stateCounter++;
    const container = panel.querySelector('#cc-states');
    const item = document.createElement('div');
    item.className = 'cc-p-state-item';
    item.dataset.idx = idx;
    item.innerHTML = `
      <div class="cc-p-state-row">
        <input type="text" class="cc-p-input cc-p-state-name" placeholder="状态名称，如 hover / active / disabled" data-idx="${idx}">
        <button class="cc-p-btn-small cc-p-state-pick" data-idx="${idx}" title="选择页面元素">⊕ 选择元素</button>
        <button class="cc-p-btn-small cc-p-state-del" data-idx="${idx}">✕</button>
      </div>
      <textarea class="cc-p-textarea cc-p-state-desc" rows="2" data-idx="${idx}"
        placeholder="描述这个状态下的变化，如：背景色变深，出现阴影，文字变白"></textarea>
      <div class="cc-p-state-captured" data-idx="${idx}" style="display:none"></div>
    `;
    container.appendChild(item);

    item.querySelector('.cc-p-state-del').onclick = () => item.remove();
    item.querySelector('.cc-p-state-pick').onclick = () => startStatePick(idx, item);
  }

  function startStatePick(idx, stateItem) {
    panel.style.display = 'none';
    showToast('选择这个状态对应的元素，Esc 取消');

    selecting = true;
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('keydown', onStatePickKeyDown, true);

    const stateClickHandler = (e) => {
      if (e.target.closest('#cc-panel')) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      if (!hoveredEl) return;

      const elData = captureElement(hoveredEl);
      const html = hoveredEl.outerHTML.length > 50000
        ? hoveredEl.outerHTML.slice(0, 50000) + '<!-- truncated -->'
        : hoveredEl.outerHTML;

      stateItem.dataset.capturedDom = html;
      stateItem.dataset.capturedStyles = JSON.stringify(elData.styles);

      const infoEl = stateItem.querySelector('.cc-p-state-captured');
      infoEl.style.display = 'block';
      infoEl.innerHTML = `<span class="cc-p-state-badge">&lt;${elData.tag}&gt; ${elData.rect.width}×${elData.rect.height}px 已采集</span>`;

      const pickBtn = stateItem.querySelector('.cc-p-state-pick');
      pickBtn.textContent = '⊕ 重新选择';

      finishStatePick(stateClickHandler);
    };

    document.addEventListener('click', stateClickHandler, true);

    statePickCallback = () => finishStatePick(stateClickHandler);
  }

  function onStatePickKeyDown(e) {
    if (e.key === 'Escape' && statePickCallback) {
      statePickCallback();
    }
  }

  function finishStatePick(clickHandler) {
    selecting = false;
    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('click', clickHandler, true);
    document.removeEventListener('keydown', onStatePickKeyDown, true);
    highlight?.remove();
    labelEl?.remove();
    highlight = null;
    labelEl = null;
    hoveredEl = null;
    statePickCallback = null;
    panel.style.display = '';
  }

  // ── Extra code blocks ──
  let codeCounter = 0;
  function addCodeBlock() {
    const idx = codeCounter++;
    const container = panel.querySelector('#cc-codes');
    const item = document.createElement('div');
    item.className = 'cc-p-code-item';
    item.innerHTML = `
      <div class="cc-p-state-row">
        <input type="text" class="cc-p-input cc-p-code-label" placeholder="代码说明，如 CSS 动画 / JS 逻辑" data-idx="${idx}">
        <button class="cc-p-btn-small cc-p-code-del" data-idx="${idx}">✕</button>
      </div>
      <textarea class="cc-p-textarea cc-p-code-content" rows="5" data-idx="${idx}"
        placeholder="粘贴相关代码"></textarea>
    `;
    container.appendChild(item);

    item.querySelector('.cc-p-code-del').onclick = () => item.remove();
  }

  // ── Save ──
  async function handleSave() {
    const name = panel.querySelector('#cc-name').value.trim();
    const description = panel.querySelector('#cc-desc').value.trim();
    const productLine = panel.querySelector('#cc-pl').value;
    const tags = panel.querySelector('#cc-tags').value.trim().split(/\s+/).filter(Boolean);
    const category = panel.querySelector('#cc-cat').value;

    // Collect states (with optional captured element data)
    const states = [];
    panel.querySelectorAll('.cc-p-state-item').forEach(item => {
      const sName = item.querySelector('.cc-p-state-name').value.trim();
      const sDesc = item.querySelector('.cc-p-state-desc').value.trim();
      const sDom = item.dataset.capturedDom || '';
      const sStyles = item.dataset.capturedStyles || '';
      if (sName || sDesc || sDom) {
        const state = { name: sName, description: sDesc };
        if (sDom) state.capturedHTML = sDom;
        if (sStyles) {
          try { state.capturedStyles = JSON.parse(sStyles); } catch {}
        }
        states.push(state);
      }
    });

    // Collect extra code
    const extraCodes = [];
    panel.querySelectorAll('.cc-p-code-item').forEach(item => {
      const cLabel = item.querySelector('.cc-p-code-label').value.trim();
      const cContent = item.querySelector('.cc-p-code-content').value.trim();
      if (cContent) extraCodes.push({ label: cLabel, code: cContent });
    });

    const statusEl = panel.querySelector('#cc-status');
    const saveBtn = panel.querySelector('#cc-save');
    statusEl.style.display = 'block';
    statusEl.textContent = '正在保存…';
    statusEl.className = 'cc-p-status';
    saveBtn.disabled = true;

    try {
      const payload = {
        name, description, productLine, tags, category,
        states,
        extraCodes,
        captured: capturedData.captured,
        outerHTML: capturedData.outerHTML,
        elementRect: capturedData.rect,
        pageUrl: capturedData.pageUrl,
        pageTitle: capturedData.pageTitle,
        screenshot: screenshotDataUrl,
      };

      const res = await fetch(`${SERVER}/api/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server ${res.status}`);
      const result = await res.json();

      statusEl.innerHTML = `<b>采集完成</b><br><span class="cc-p-path">${result.path}</span><br>在 Cursor 中打开 capture-prompt.md 让 AI 生成组件`;
      statusEl.className = 'cc-p-status cc-p-success';

      saveBtn.textContent = '继续采集';
      saveBtn.disabled = false;
      saveBtn.onclick = () => {
        destroyAll();
        capturedData = null;
        stateCaptures = [];
        setTimeout(() => startSelecting(), 100);
      };
    } catch (err) {
      statusEl.innerHTML = `<b>保存失败</b>: ${err.message}<br>请确认本地服务已启动: <code>node server.js</code>`;
      statusEl.className = 'cc-p-status cc-p-error';
      saveBtn.disabled = false;
    }
  }

  // ── Utilities ──
  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'cc-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('cc-visible'));
    setTimeout(() => { t.classList.remove('cc-visible'); setTimeout(() => t.remove(), 300); }, 2500);
  }

  function destroyAll() {
    stopSelecting();
    panel?.remove();
    panel = null;
    document.removeEventListener('keydown', onKeyDown, true);
  }

  window.__ccActivate = () => {
    if (selecting || panel) { destroyAll(); return; }
    startSelecting();
  };
})();
