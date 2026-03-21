const revealTargets = document.querySelectorAll(".reveal");

if (revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

// Theme Switching Logic
const themeBtn = document.querySelector("#theme-toggle");
const html = document.documentElement;

const getStoredTheme = () => localStorage.getItem("theme");
const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

const applyTheme = (theme) => {
  html.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  if (themeBtn) {
    themeBtn.innerHTML = isDark 
      ? '<svg class="icon" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L19.42 4.58zM5.99 18.01l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/></svg> Light'
      : '<svg class="icon" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg> Dark';
  }
};

const initialTheme = getStoredTheme() || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(initialTheme);

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    setStoredTheme(next);
    location.reload(); 
  });
}

const spyContainer = document.querySelector("[data-nav-spy]");
const sections = document.querySelectorAll("[data-section]");

if (spyContainer && sections.length) {
  const links = Array.from(spyContainer.querySelectorAll("a[href^='#']"));

  const syncActiveLink = (id) => {
    links.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isMatch);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        syncActiveLink(visible.target.id);
      }
    },
    {
      rootMargin: "-25% 0px -55% 0px",
      threshold: [0.2, 0.45, 0.7],
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

if (window.mermaid) {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  window.mermaid.initialize({
    startOnLoad: true,
    theme: isDark ? "dark" : "base",
    securityLevel: "loose",
    themeVariables: {
      fontFamily: '"Monaco", monospace',
      fontSize: "11px",
      primaryColor: isDark ? "#111111" : "#fcfcfc",
      primaryTextColor: isDark ? "#ffffff" : "#131313",
      primaryBorderColor: isDark ? "#333333" : "#e5e5e5",
      lineColor: isDark ? "#ffffff" : "#131313",
      secondaryColor: isDark ? "#050505" : "#f5f5f5",
      tertiaryColor: isDark ? "#121212" : "#fafafa",
      mainBkg: isDark ? "#000000" : "#ffffff",
      nodeBorder: isDark ? "#333333" : "#e5e5e5",
      clusterBkg: isDark ? "#050505" : "#f5f5f5",
      clusterBorder: isDark ? "#333333" : "#e5e5e5",
      titleColor: isDark ? "#ffffff" : "#131313",
      edgeLabelBackground: isDark ? "#0a0a0a" : "#ffffff",
      nodeTextColor: isDark ? "#ffffff" : "#131313"
    },
    flowchart: { curve: "basis", htmlLabels: true },
    gantt: { barHeight: 20, topPadding: 40, gridLineStartPadding: 30 }
  });
}
