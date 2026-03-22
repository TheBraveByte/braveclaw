document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Mermaid
  const isDark = true; // Defaulting to dark for this design
  
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
      darkMode: true,
      background: '#0a0d14',
      mainBkg: '#0f141e',
      nodeBorder: '#1a2433',
      lineColor: '#ffffff',
      primaryColor: '#0f141e',
      primaryTextColor: '#ffffff',
      primaryBorderColor: '#242f44',
      secondaryColor: '#0a0d14',
      tertiaryColor: '#05070a',
      edgeLabelBackground: '#0f141e',
      actorBkg: '#0f141e',
      actorBorder: '#ffffff',
      actorTextColor: '#ffffff',
      actorLineColor: '#ffffff',
      signalColor: '#cbd5e1',
      signalTextColor: '#ffffff',
      labelBoxBkgColor: '#0f141e',
      labelBoxBorderColor: '#242f44',
      labelTextColor: '#ffffff',
      loopTextColor: '#ffffff',
      noteBorderColor: '#64748b',
      noteBkgColor: '#1a2433',
      noteTextColor: '#ffffff',
      activationBorderColor: '#ffffff',
      activationBkgColor: '#1a2433',
      sequenceNumberColor: '#ffffff',
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '13px',
      stateBkg: '#0f141e',
      stateBorder: '#242f44'
    },
    flowchart: { curve: 'cardinal', padding: 20, htmlLabels: true },
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
