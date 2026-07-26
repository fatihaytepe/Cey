(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const year = document.querySelector("#year");
  const form = document.querySelector("#randevu-form");
  const note = document.querySelector("#form-note");

  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
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

  const revealTargets = document.querySelectorAll(
    ".star-list li, .service, .about-grid > *, .process-list li, .tip, .faq-list details, .cta-panel > *, .info-card, .fit-closing"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

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
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
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
