document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Mermaid
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const rootStyles = getComputedStyle(document.documentElement);
  const bg = rootStyles.getPropertyValue('--bg').trim() || (isDark ? '#07090f' : '#ffffff');
  const surface1 = rootStyles.getPropertyValue('--s1').trim() || (isDark ? '#0d1117' : '#fafafa');
  const surface2 = rootStyles.getPropertyValue('--s2').trim() || (isDark ? '#111827' : '#f4f4f5');
  const border = rootStyles.getPropertyValue('--border').trim() || (isDark ? '#1e2d3d' : 'rgba(0, 0, 0, 0.14)');
  const borderStrong = rootStyles.getPropertyValue('--border2').trim() || (isDark ? '#263547' : 'rgba(0, 0, 0, 0.24)');
  const textPrimary = rootStyles.getPropertyValue('--white').trim() || (isDark ? '#ffffff' : '#111111');
  const textBody = rootStyles.getPropertyValue('--text').trim() || (isDark ? '#d1d9e8' : '#1f2937');
  const muted = rootStyles.getPropertyValue('--muted').trim() || (isDark ? '#888888' : '#6b7280');
  
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
      darkMode: isDark,
      background: bg,
      mainBkg: surface2,
      nodeBorder: border,
      lineColor: textPrimary,
      primaryColor: surface2,
      primaryTextColor: textPrimary,
      textColor: textPrimary,
      primaryBorderColor: borderStrong,
      secondaryColor: surface1,
      tertiaryColor: bg,
      edgeLabelBackground: bg,
      actorBkg: surface2,
      actorBorder: textPrimary,
      actorTextColor: textPrimary,
      actorLineColor: textPrimary,
      signalColor: textBody,
      signalTextColor: textPrimary,
      labelBoxBkgColor: bg,
      labelBoxBorderColor: borderStrong,
      labelTextColor: textPrimary,
      loopTextColor: textPrimary,
      noteBorderColor: muted,
      noteBkgColor: surface1,
      noteTextColor: textPrimary,
      activationBorderColor: textPrimary,
      activationBkgColor: surface1,
      sequenceNumberColor: textPrimary,
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '13px',
      stateBkg: surface2,
      stateBorder: borderStrong,
      taskBkgColor: surface2,
      taskTextColor: textPrimary,
      taskBorderColor: borderStrong,
      activeTaskBkgColor: surface1,
      activeTaskBorderColor: textPrimary,
      doneTaskBkgColor: surface1,
      doneTaskBorderColor: borderStrong,
      critBkgColor: surface1,
      critBorderColor: textPrimary,
      sectionBkgColor: bg,
      altSectionBkgColor: surface1,
      gridColor: border,
      todayLineColor: textPrimary,
    },
    flowchart: { curve: 'cardinal', padding: 20, htmlLabels: false },
    sequence: { actorMargin: 50, width: 140, height: 50 },
    gantt: { barHeight: 20, fontSize: 12, barGap: 4, topPadding: 50 },
  });

  // 2. Scroll spy for sidebar
  const links = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('.section');

  if (links.length > 0 && sections.length > 0) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`nav a[href="#${e.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  // 3. Diagram Zoom Controls
  document.querySelectorAll('.diagram-wrap').forEach(wrap => {
    // Inject the zoom controls HTML into the wrapper
    const controlsHtml = `
      <div class="zoom-controls">
        <button class="zoom-btn" title="Zoom In" data-action="in">+</button>
        <button class="zoom-btn" title="Zoom Out" data-action="out">-</button>
        <button class="zoom-btn" title="Reset Zoom" data-action="reset">↺</button>
      </div>
    `;
    wrap.insertAdjacentHTML('afterbegin', controlsHtml);

    const innerScope = wrap.querySelector('.mermaid');
    if (!innerScope) return;

    // Wrap mermaid in a drag container
    const innerContainer = document.createElement('div');
    innerContainer.classList.add('diagram-inner');
    innerScope.parentNode.insertBefore(innerContainer, innerScope);
    innerContainer.appendChild(innerScope);

    let scale = 1;
    let isDragging = false;
    let startX, startY, transX = 0, transY = 0;

    const btns = wrap.querySelectorAll('.zoom-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        if (action === 'in') scale = Math.min(scale + 0.2, 3);
        if (action === 'out') scale = Math.max(scale - 0.2, 0.4);
        if (action === 'reset') {
          scale = 1; transX = 0; transY = 0;
        }
        applyTransform();
      });
    });

    // Panning logic
    innerContainer.addEventListener('mousedown', (e) => {
      if (scale <= 1) return; // Only drag when zoomed
      isDragging = true;
      startX = e.clientX - transX;
      startY = e.clientY - transY;
      innerContainer.classList.add('zoomed');
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      innerContainer.classList.remove('zoomed');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || scale <= 1) return;
      e.preventDefault();
      transX = e.clientX - startX;
      transY = e.clientY - startY;
      applyTransform();
    });

    // Add scroll wheel zoom
    innerContainer.addEventListener('wheel', (e) => {
      if(e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.min(Math.max(0.4, scale + delta), 3);
        applyTransform();
      }
    });

    function applyTransform() {
      if (scale === 1) {
        transX = 0; transY = 0;
        innerContainer.style.cursor = 'auto';
      } else {
        innerContainer.style.cursor = 'grab';
      }
      innerScope.style.transform = `translate(${transX}px, ${transY}px) scale(${scale})`;
    }
  });
});
