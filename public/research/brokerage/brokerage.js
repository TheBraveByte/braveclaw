document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Mermaid
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const rootStyles = getComputedStyle(document.documentElement);
  const bg = rootStyles.getPropertyValue('--bg').trim() || (isDark ? '#07090f' : '#ffffff');
  const surface1 = rootStyles.getPropertyValue('--s1').trim() || (isDark ? '#0d1117' : '#fafafa');
  const surface2 = rootStyles.getPropertyValue('--s2').trim() || (isDark ? '#111827' : '#f4f4f5');
  const border = rootStyles.getPropertyValue('--border').trim() || (isDark ? '#1a2433' : 'rgba(0, 0, 0, 0.14)');
  const borderStrong = rootStyles.getPropertyValue('--border2').trim() || (isDark ? '#242f44' : 'rgba(0, 0, 0, 0.24)');
  const textPrimary = rootStyles.getPropertyValue('--white').trim() || (isDark ? '#ffffff' : '#111827');
  const textBody = rootStyles.getPropertyValue('--text').trim() || (isDark ? '#cbd5e1' : '#1f2937');
  const muted = rootStyles.getPropertyValue('--muted').trim() || (isDark ? '#64748b' : '#6b7280');
  
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
      labelBoxBkgColor: surface2,
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
      sectionBkgColor: bg,
      altSectionBkgColor: surface1,
      gridColor: border,
      todayLineColor: textPrimary
    },
    flowchart: { curve: 'cardinal', padding: 20, htmlLabels: false },
    sequence: { actorMargin: 50, width: 140, height: 50 }
  });

  // 2. Scroll spy for sidebar navigation
  const links = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('.section');

  if (links.length > 0 && sections.length > 0) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const id = e.target.getAttribute('id');
          const activeLink = document.querySelector(`nav a[href="#${id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  // 3. Diagram Zoom Controls (Inspired by RemitBridge)
  document.querySelectorAll('.diagram-wrap').forEach(wrap => {
    // Inject controls
    const controlsHtml = `
      <div class="zoom-controls">
        <button class="zoom-btn" title="Zoom In" data-action="in">+</button>
        <button class="zoom-btn" title="Zoom Out" data-action="out">-</button>
        <button class="zoom-btn" title="Reset" data-action="reset">↺</button>
      </div>
    `;
    wrap.insertAdjacentHTML('afterbegin', controlsHtml);

    const innerScope = wrap.querySelector('.mermaid');
    if (!innerScope) return;

    // Build container
    const innerContainer = document.createElement('div');
    innerContainer.classList.add('diagram-inner');
    innerScope.parentNode.insertBefore(innerContainer, innerScope);
    innerContainer.appendChild(innerScope);

    let scale = 1;
    let isDragging = false;
    let startX, startY, transX = 0, transY = 0;

    wrap.querySelectorAll('.zoom-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        if (action === 'in') scale = Math.min(scale + 0.2, 3);
        if (action === 'out') scale = Math.max(scale - 0.2, 0.4);
        if (action === 'reset') { scale = 1; transX = 0; transY = 0; }
        applyTransform();
      });
    });

    innerContainer.addEventListener('mousedown', (e) => {
      if (scale <= 1) return;
      isDragging = true;
      startX = e.clientX - transX;
      startY = e.clientY - transY;
      innerContainer.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      innerContainer.style.cursor = scale > 1 ? 'grab' : 'auto';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || scale <= 1) return;
      e.preventDefault();
      transX = e.clientX - startX;
      transY = e.clientY - startY;
      applyTransform();
    });

    function applyTransform() {
      innerContainer.style.cursor = scale > 1 ? 'grab' : 'auto';
      innerScope.style.transform = `translate(${transX}px, ${transY}px) scale(${scale})`;
    }
  });

  // 4. GSAP Animations
  gsap.from('.reveal', {
    duration: 0.8,
    y: 20,
    opacity: 0,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.reveal',
      start: 'top 85%'
    }
  });
});
