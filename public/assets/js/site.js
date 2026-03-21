/**
 * Braveclaw / The Brave Byte Site Logic
 * Premium GSAP Motion UI & Theme Management
 */

// --- Theme Management ---
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;
  
  if (!themeToggle) return;

  // Retrieve saved theme or default to light
  let currentTheme = localStorage.getItem("theme");
  
  // Apply initial theme
  if (currentTheme) {
    html.setAttribute("data-theme", currentTheme);
  } else {
    currentTheme = "light";
  }

  updateToggleText(currentTheme === "dark");

  // Toggle Listener
  themeToggle.addEventListener("click", () => {
    const isDark = html.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateToggleText(!isDark);
    
    // Smooth reload for Mermaid specifically, if it exists, to re-render in correct colors
    setTimeout(() => {
      if (document.querySelector(".mermaid")) {
        location.reload();
      }
    }, 150);
  });

  function updateToggleText(isDark) {
    const iconSpan = themeToggle.querySelector('.theme-icon');
    if(iconSpan) {
      iconSpan.textContent = isDark ? "Light" : "Dark";
    }
  }
}

// --- GSAP Motion UI ---
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // GSAP failed to load — ensure everything is visible
    document.querySelectorAll('.reveal, .hero-title, .hero-subtitle, .case-item, .doc-header').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Set initial states in JS (not CSS) so content is never invisibly stuck
  gsap.set('.site-header', { y: -20, opacity: 0 });
  gsap.set('.hero-title', { y: 40, opacity: 0 });
  gsap.set('.hero-subtitle', { y: 20, opacity: 0 });
  gsap.set('.hero-action', { y: 16, opacity: 0 });
  gsap.set('.case-item', { y: 60, opacity: 0 });
  gsap.set('.doc-header', { y: 30, opacity: 0 });
  gsap.set('.doc-content > *', { y: 30, opacity: 0 });

  // 1. Hero Reveal Animation
  const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  if (document.querySelector('.site-header')) {
    heroTl.to('.site-header', { y: 0, opacity: 1, duration: 1, delay: 0.1 });
  }
  if (document.querySelector('.hero-title')) {
    heroTl.to('.hero-title', { y: 0, opacity: 1, duration: 1.2 }, '-=0.6');
  }
  if (document.querySelector('.hero-subtitle')) {
    heroTl.to('.hero-subtitle', { y: 0, opacity: 1, duration: 1 }, '-=0.8');
  }
  if (document.querySelector('.hero-action')) {
    heroTl.to('.hero-action', { y: 0, opacity: 1, duration: 0.8 }, '-=0.7');
  }

  // 2. ScrollTrigger for Case Studies
  gsap.utils.toArray('.case-item').forEach((item) => {
    gsap.to(item, {
      y: 0, opacity: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // 3. Document page reveals
  if (document.querySelector('.doc-header')) {
    gsap.to('.doc-header', { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 });
    gsap.utils.toArray('.doc-content > *').forEach((el) => {
      gsap.to(el, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
      });
    });
  }
}

// --- Mermaid ---
function initMermaid() {
  if (typeof mermaid === 'undefined') return;
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const primary = getComputedStyle(document.documentElement).getPropertyValue('--logo-primary').trim();
  const secondary = getComputedStyle(document.documentElement).getPropertyValue('--logo-secondary').trim();
  
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
      primaryColor: isDark ? '#1a1a1a' : '#fafafa',
      primaryTextColor: primary,
      primaryBorderColor: secondary,
      lineColor: primary,
      secondaryColor: isDark ? '#222' : '#f0f0f0',
      tertiaryColor: isDark ? '#333' : '#e5e5e5'
    },
    fontFamily: '"IBM Plex Mono", "Monaco", monospace'
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initGSAP();
  initMermaid();
});
