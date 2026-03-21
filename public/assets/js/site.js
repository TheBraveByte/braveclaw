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
  window.mermaid.initialize({
    startOnLoad: true,
    theme: "base",
    securityLevel: "loose",
    themeVariables: {
      background: "#f3efe8",
      primaryColor: "#f8f5ef",
      primaryTextColor: "#141412",
      primaryBorderColor: "#141412",
      lineColor: "#141412",
      secondaryColor: "#e5dfd6",
      tertiaryColor: "#d4cec3",
      edgeLabelBackground: "#f3efe8",
      actorBkg: "#f8f5ef",
      actorBorder: "#141412",
      actorTextColor: "#141412",
      signalColor: "#141412",
      signalTextColor: "#141412",
      labelBoxBkgColor: "#f3efe8",
      labelBoxBorderColor: "#141412",
      labelTextColor: "#141412",
      noteBkgColor: "#e5dfd6",
      noteBorderColor: "#141412",
      noteTextColor: "#141412",
      activationBorderColor: "#141412",
      activationBkgColor: "#d4cec3",
      sequenceNumberColor: "#141412",
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: "14px",
      nodeBorder: "#141412",
      clusterBkg: "#ebe5dc",
      clusterBorder: "#141412",
      taskBkgColor: "#d4cec3",
      taskTextColor: "#141412",
      taskBorderColor: "#141412",
      activeTaskBkgColor: "#bcb4a8",
      activeTaskBorderColor: "#141412",
      doneTaskBkgColor: "#ece7df",
      doneTaskBorderColor: "#141412",
      critBkgColor: "#777168",
      critBorderColor: "#141412",
      sectionBkgColor: "#f8f5ef",
      altSectionBkgColor: "#ebe5dc",
      gridColor: "#b1ab9f",
      todayLineColor: "#141412",
      cScale0: "#141412",
      cScale1: "#3a3834",
      cScale2: "#6a655c",
      cScale3: "#9d9588",
    },
    flowchart: {
      curve: "basis",
      htmlLabels: true,
    },
    gantt: {
      barHeight: 20,
      topPadding: 40,
      gridLineStartPadding: 30,
    },
  });
}
