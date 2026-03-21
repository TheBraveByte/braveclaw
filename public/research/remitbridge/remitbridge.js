document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Mermaid
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
      darkMode: isDark,
      background: isDark ? '#0d1117' : '#fafafa',
      mainBkg: isDark ? '#111827' : '#ffffff',
      nodeBorder: isDark ? '#263547' : '#e4e4e7',
      lineColor: isDark ? '#ffffff' : '#000000',
      primaryColor: isDark ? '#111827' : '#ffffff',
      primaryTextColor: isDark ? '#ffffff' : '#000000',
      primaryBorderColor: isDark ? '#333333' : '#cccccc',
      secondaryColor: isDark ? '#0d1117' : '#f4f4f5',
      tertiaryColor: isDark ? '#07090f' : '#ffffff',
      edgeLabelBackground: isDark ? '#111827' : '#ffffff',
      actorBkg: isDark ? '#111827' : '#ffffff',
      actorBorder: isDark ? '#ffffff' : '#000000',
      actorTextColor: isDark ? '#ffffff' : '#000000',
      actorLineColor: isDark ? '#ffffff' : '#000000',
      signalColor: isDark ? '#cccccc' : '#555555',
      signalTextColor: isDark ? '#ffffff' : '#000000',
      labelBoxBkgColor: isDark ? '#111827' : '#ffffff',
      labelBoxBorderColor: isDark ? '#333333' : '#cccccc',
      labelTextColor: isDark ? '#ffffff' : '#000000',
      loopTextColor: isDark ? '#ffffff' : '#000000',
      noteBorderColor: isDark ? '#666666' : '#aaaaaa',
      noteBkgColor: isDark ? '#222222' : '#f0f0f0',
      noteTextColor: isDark ? '#ffffff' : '#000000',
      activationBorderColor: isDark ? '#ffffff' : '#000000',
      activationBkgColor: isDark ? '#222222' : '#f0f0f0',
      sequenceNumberColor: isDark ? '#ffffff' : '#000000',
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '13px',
      stateBkg: isDark ? '#111827' : '#ffffff',
      stateBorder: isDark ? '#333333' : '#cccccc',
      taskBkgColor: isDark ? '#111827' : '#ffffff',
      taskTextColor: isDark ? '#ffffff' : '#000000',
      taskBorderColor: isDark ? '#333333' : '#cccccc',
      activeTaskBkgColor: isDark ? '#222222' : '#f0f0f0',
      activeTaskBorderColor: isDark ? '#ffffff' : '#000000',
      doneTaskBkgColor: isDark ? '#111111' : '#e4e4e7',
      doneTaskBorderColor: isDark ? '#888888' : '#888888',
      critBkgColor: isDark ? '#333333' : '#eeeeee',
      critBorderColor: isDark ? '#ffffff' : '#000000',
      sectionBkgColor: isDark ? '#0d1117' : '#fafafa',
      altSectionBkgColor: isDark ? '#111827' : '#ffffff',
      gridColor: isDark ? '#1e2d3d' : '#e4e4e7',
      todayLineColor: isDark ? '#ffffff' : '#000000',
    },
    flowchart: { curve: 'cardinal', padding: 20, htmlLabels: true },
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
