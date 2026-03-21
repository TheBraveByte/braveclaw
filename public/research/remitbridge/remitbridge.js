document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Mermaid
  mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    themeVariables: {
      darkMode: true,
      background: '#0d1117',
      mainBkg: '#111827',
      nodeBorder: '#263547',
      lineColor: '#ffffff',
      primaryColor: '#111827',
      primaryTextColor: '#ffffff',
      primaryBorderColor: '#333333',
      secondaryColor: '#0d1117',
      tertiaryColor: '#07090f',
      edgeLabelBackground: '#111827',
      actorBkg: '#111827',
      actorBorder: '#ffffff',
      actorTextColor: '#ffffff',
      actorLineColor: '#ffffff',
      signalColor: '#cccccc',
      signalTextColor: '#ffffff',
      labelBoxBkgColor: '#111827',
      labelBoxBorderColor: '#333333',
      labelTextColor: '#ffffff',
      loopTextColor: '#ffffff',
      noteBorderColor: '#666666',
      noteBkgColor: '#222222',
      noteTextColor: '#ffffff',
      activationBorderColor: '#ffffff',
      activationBkgColor: '#222222',
      sequenceNumberColor: '#ffffff',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '13px',
      stateBkg: '#111827',
      stateBorder: '#333333',
      // Shapes fill mapping (monochromatic)
      fillType0: '#111111',
      fillType1: '#222222',
      fillType2: '#333333',
      fillType3: '#444444',
      fillType4: '#555555',
      fillType5: '#666666',
      fillType6: '#777777',
      fillType7: '#888888',
      cScale0: '#ffffff',
      cScale1: '#cccccc',
      cScale2: '#aaaaaa',
      cScale3: '#888888',
      taskBkgColor: '#111827',
      taskTextColor: '#ffffff',
      taskBorderColor: '#333333',
      activeTaskBkgColor: '#222222',
      activeTaskBorderColor: '#ffffff',
      doneTaskBkgColor: '#111111',
      doneTaskBorderColor: '#888888',
      critBkgColor: '#333333',
      critBorderColor: '#ffffff',
      sectionBkgColor: '#0d1117',
      altSectionBkgColor: '#111827',
      gridColor: '#1e2d3d',
      todayLineColor: '#ffffff',
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
