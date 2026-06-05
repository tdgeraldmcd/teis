const progressBar = document.querySelector(".scroll-progress__bar");
const processList = document.querySelector(".process-list");
const processFill = document.querySelector(".process-line__fill");
const processSteps = [...document.querySelectorAll(".process-step")];
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll("[data-reveal]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const updateScrollEffects = () => {
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pageProgress = documentHeight > 0 ? window.scrollY / documentHeight : 0;
  progressBar.style.transform = `scaleX(${pageProgress})`;

  if (!processList || !processFill) {
    return;
  }

  const rect = processList.getBoundingClientRect();
  const viewportTarget = window.innerHeight * 0.5;
  const processProgress = clamp((viewportTarget - rect.top) / rect.height, 0, 1);
  processFill.style.height = `${processProgress * 100}%`;

  processSteps.forEach((step) => {
    const stepRect = step.getBoundingClientRect();
    step.classList.toggle("is-active", stepRect.top < viewportTarget && stepRect.bottom > viewportTarget);
  });
};

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.08,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

let ticking = false;
const requestScrollUpdate = () => {
  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(() => {
    updateScrollEffects();
    ticking = false;
  });
};

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
updateScrollEffects();

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle?.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  });
});

const calTarget = document.querySelector("#cal-inline-interview");

if (calTarget) {
  (function (C, A, L) {
    const push = function (api, args) {
      api.q.push(args);
    };
    const pageDocument = C.document;

    C.Cal =
      C.Cal ||
      function () {
        const cal = C.Cal;
        const args = arguments;

        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          pageDocument.head.appendChild(pageDocument.createElement("script")).src = A;
          cal.loaded = true;
        }

        if (args[0] === L) {
          const api = function () {
            push(api, arguments);
          };
          const namespace = args[1];
          api.q = api.q || [];

          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            push(cal.ns[namespace], args);
            push(cal, ["initNamespace", namespace]);
          } else {
            push(cal, args);
          }

          return;
        }

        push(cal, args);
      };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  const initializeCalendar = (namespace, selector) => {
    window.Cal("init", namespace, { origin: "https://cal.com" });
    window.Cal.ns[namespace]("inline", {
      elementOrSelector: selector,
      calLink: "gerald-mcdonald-rsal7l/interview",
      config: {
        layout: "month_view",
      },
    });
    window.Cal.ns[namespace]("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
    });
  };

  initializeCalendar("interview", "#cal-inline-interview");
}
