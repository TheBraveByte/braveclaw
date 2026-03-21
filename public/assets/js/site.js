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
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // 1. Hero Reveal Animation
  const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
  
  // Fade down the header
  if (document.querySelector('.site-header')) {
    heroTl.fromTo('.site-header', 
      { y: -20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, delay: 0.2 }
    );
  }

  // Elegant text reveal for Hero Title
  if (document.querySelector('.hero-title')) {
    heroTl.fromTo('.hero-title', 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2 },
      "-=0.6"
    );
  }

  // Subtitle fade
  if (document.querySelector('.hero-subtitle')) {
    heroTl.fromTo('.hero-subtitle', 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1 },
      "-=0.8"
    );
  }

  // 2. ScrollTrigger for Case Studies
  const caseItems = gsap.utils.toArray('.case-item');
  caseItems.forEach((item, i) => {
    gsap.fromTo(item, 
      { y: 60, opacity: 0 },
      {
        y: 0, 
        opacity: 1, 
        duration: 1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // 3. ScrollTrigger for Document Layout Details (Dossier page)
  const docElements = gsap.utils.toArray('.doc-content > *');
  if (docElements.length > 0) {
    gsap.fromTo('.doc-header', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
    );

    docElements.forEach((el) => {
      gsap.fromTo(el, 
        { y: 30, opacity: 0 },
        {
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
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
