(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const year = document.querySelector("#year");
  const form = document.querySelector("#randevu-form");
  const note = document.querySelector("#form-note");
  const progress = document.querySelector(".scroll-progress span");
  const serviceSelect = document.querySelector("#service-select");
  const navLinks = [...document.querySelectorAll("[data-nav]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 12);

    if (progress) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = `${pct}%`;
    }

    const cue = document.querySelector(".scroll-cue");
    if (cue) cue.style.opacity = y > 80 ? "0" : "1";
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Menüyü aç" : "Menüyü kapat");
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Menüyü aç");
        nav.classList.remove("is-open");
      });
    });
  }

  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      if (!id || !id.startsWith("#")) return null;
      const el = document.querySelector(id);
      return el ? { link, el } : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = sections.find((s) => s.el === entry.target);
          if (!match) return;
          navLinks.forEach((l) => l.classList.remove("is-active"));
          match.link.classList.add("is-active");
        });
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach(({ el }) => spy.observe(el));
  }

  const filterBtns = [...document.querySelectorAll(".filter-btn")];
  const services = [...document.querySelectorAll(".service[data-tags]")];

  const applyFilter = (key) => {
    filterBtns.forEach((btn) => {
      const active = btn.dataset.filter === key;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });

    services.forEach((card) => {
      const tags = (card.dataset.tags || "").split(/\s+/);
      const show = key === "all" || tags.includes(key);
      card.classList.toggle("is-hidden", !show);
    });
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter || "all"));
  });

  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      const value = link.getAttribute("data-service");
      if (!serviceSelect || !value) return;
      const option = [...serviceSelect.options].find((opt) => opt.value === value || opt.textContent === value);
      if (option) {
        serviceSelect.value = option.value;
        note && (note.textContent = `${value} seçildi — formu doldurman yeterli.`);
      }
    });
  });

  const revealTargets = document.querySelectorAll(
    ".trust-item, .section-head, .star-list li, .service, .approach-card, .about-grid > *, .timeline-item, .process-list li, .tip, .faq-list details, .cta-panel > *, .info-card"
  );

  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    const siblings = el.parentElement
      ? [...el.parentElement.children].filter((c) => c.classList.contains("reveal") || c === el)
      : [];
    const indexInGroup = Math.max(0, siblings.indexOf(el));
    el.style.setProperty("--delay", `${Math.min(indexInGroup, 6) * 70}ms`);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  if (!reduceMotion) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      const strength = 14;
      btn.addEventListener("pointermove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });

    document.querySelectorAll("[data-tilt]").forEach((el) => {
      const frame = el.querySelector(".hero-frame, .about-frame") || el;
      el.addEventListener("pointermove", (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        frame.style.transform = `rotateY(${px * 7}deg) rotateX(${py * -7}deg) translateY(-2px)`;
      });
      el.addEventListener("pointerleave", () => {
        frame.style.transform = "";
      });
    });
  }

  if (form && note) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const service = String(data.get("service") || "").trim();
      const goal = String(data.get("goal") || "").trim();

      if (!name || !email || !service || !goal) {
        note.textContent = "Lütfen tüm alanları doldur.";
        return;
      }

      const subject = encodeURIComponent(`Ceylan Tarhan — randevu talebi — ${name}`);
      const body = encodeURIComponent(
        `Ad Soyad: ${name}\nE-posta: ${email}\nHizmet: ${service}\n\nHedef:\n${goal}`
      );

      note.textContent = "Mail uygulaman açılıyor…";
      window.location.href = `mailto:merhaba@ceylantarhan.com?subject=${subject}&body=${body}`;
      form.reset();
    });
  }
})();
