/* ============================================================
   SUKAKA ART · script.js (v2 redesign)
   - Loader with progress
   - Custom cursor with text labels
   - Sticky/auto-hide nav
   - Mobile menu
   - Scroll reveal (IntersectionObserver)
   - Counter animation
   - Image tilt on hero art
   - Section parallax
   - Lightbox gallery (prev/next, keyboard, swipe)
   - Testimonial slider (auto + manual)
   - Booking form -> WhatsApp deep link
   ============================================================ */

(() => {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  /* ============================================================
     1. LOADER
     ============================================================ */
  const loader = $("#loader");
  const loaderCount = $(".loader__count");
  const loaderBar = $(".loader__bar i");

  function runLoader() {
    if (!loader) return Promise.resolve();
    return new Promise((resolve) => {
      let n = 0;
      const tick = () => {
        n += Math.max(1, Math.round((100 - n) * 0.08));
        if (n > 100) n = 100;
        if (loaderCount) loaderCount.textContent = String(n).padStart(2, "0");
        if (loaderBar) loaderBar.style.width = n + "%";
        if (n < 100) {
          requestAnimationFrame(() => setTimeout(tick, 18));
        } else {
          setTimeout(() => {
            loader.classList.add("is-done");
            document.body.classList.add("is-loaded");
            setTimeout(() => loader.remove(), 700);
            resolve();
          }, 250);
        }
      };
      tick();
    });
  }

  /* ============================================================
     2. CUSTOM CURSOR
     ============================================================ */
  const cursor = $(".cursor");
  const cursorDot = $(".cursor__dot");
  const cursorRing = $(".cursor__ring");
  const cursorText = $(".cursor__text");

  if (cursor && isFinePointer && !prefersReducedMotion) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let dx = mx, dy = my;
    let rx = mx, ry = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
    });

    function animate() {
      dx += (mx - dx) * 1;
      dy += (my - dy) * 1;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorDot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    const hoverTargets = "a, button, [data-cursor], .work__cell, .svc, .field, input, textarea, select, label";
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest(hoverTargets);
      if (!t) return;
      cursor.classList.add("is-hover");
      const label = t.getAttribute("data-cursor");
      cursorText.textContent = label ? label : "";
    });
    document.addEventListener("mouseout", (e) => {
      const t = e.target.closest(hoverTargets);
      if (!t) return;
      cursor.classList.remove("is-hover");
      cursorText.textContent = "";
    });
  } else if (cursor) {
    cursor.style.display = "none";
  }

  /* ============================================================
     3. NAV — sticky, auto-hide on scroll-down
     ============================================================ */
  const nav = $("#nav");
  const burger = $("#navBurger");
  let lastY = 0;
  let navTicking = false;

  function onScroll() {
    const y = window.scrollY;
    if (!nav) return;
    if (y > 30) nav.classList.add("is-scrolled"); else nav.classList.remove("is-scrolled");
    if (y > lastY && y > 220 && !nav.classList.contains("is-open")) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    lastY = y;
    navTicking = false;
  }
  window.addEventListener("scroll", () => {
    if (!navTicking) { requestAnimationFrame(onScroll); navTicking = true; }
  }, { passive: true });

  // Mobile menu
  if (burger && nav) {
    burger.addEventListener("click", () => nav.classList.toggle("is-open"));
    $$(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("is-open"))
    );
  }

  /* ============================================================
     4. SMOOTH SCROLL with offset
     ============================================================ */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.length <= 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ============================================================
     5. SCROLL REVEAL
     ============================================================ */
  const revealSelectors = [
    ".section__head", ".display", ".lede",
    ".about__photo", ".about__bullets", ".about__text > p",
    ".work__heading", ".work__cell",
    ".services__heading", ".svc",
    ".contact__heading", ".form",
    ".footer__cta", ".footer__big",
    ".stats__item", ".contact__list", ".contact__map"
  ];
  const revealEls = $$(revealSelectors.join(", "));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ============================================================
     6. STAT COUNTERS
     ============================================================ */
  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    $$(".stats__num").forEach((el) => counterIO.observe(el));
  } else {
    $$(".stats__num").forEach(animateCount);
  }

  /* ============================================================
     7. IMAGE TILT (hero artwork)
     ============================================================ */
  if (isFinePointer && !prefersReducedMotion) {
    $$("[data-tilt]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) scale(1.01)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ============================================================
     8. PARALLAX
     ============================================================ */
  const parallaxEls = $$("[data-parallax]");
  if (parallaxEls.length && !prefersReducedMotion) {
    let pTicking = false;
    const updateParallax = () => {
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const offset = (center - window.innerHeight / 2) / window.innerHeight;
        const ty = offset * speed;
        el.style.transform = `translateY(${ty}px)`;
      });
      pTicking = false;
    };
    window.addEventListener("scroll", () => {
      if (!pTicking) { requestAnimationFrame(updateParallax); pTicking = true; }
    }, { passive: true });
    updateParallax();
  }

  /* ============================================================
     9. LIGHTBOX
     ============================================================ */
  const cells = $$(".work__cell");
  const lb = $("#lb");
  const lbImg = $("#lbImg");
  const lbCount = $(".lb__count b");
  const lbTotal = $(".lb__count i");
  const lbClose = $(".lb__close");
  const lbPrev = $(".lb__nav--prev");
  const lbNext = $(".lb__nav--next");
  let lbIndex = 0;

  if (lbTotal) lbTotal.textContent = String(cells.length).padStart(2, "0");

  function openLB(i) {
    if (!cells.length || !lb) return;
    lbIndex = (i + cells.length) % cells.length;
    const img = cells[lbIndex].querySelector("img");
    if (img) {
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || "Tattoo work";
    }
    if (lbCount) lbCount.textContent = String(lbIndex + 1).padStart(2, "0");
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLB() {
    if (!lb) return;
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  cells.forEach((c, i) => c.addEventListener("click", () => openLB(i)));
  lbClose && lbClose.addEventListener("click", closeLB);
  lbPrev && lbPrev.addEventListener("click", (e) => { e.stopPropagation(); openLB(lbIndex - 1); });
  lbNext && lbNext.addEventListener("click", (e) => { e.stopPropagation(); openLB(lbIndex + 1); });
  lb && lb.addEventListener("click", (e) => { if (e.target === lb) closeLB(); });
  document.addEventListener("keydown", (e) => {
    if (!lb || !lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLB();
    else if (e.key === "ArrowLeft") openLB(lbIndex - 1);
    else if (e.key === "ArrowRight") openLB(lbIndex + 1);
  });

  // Touch swipe on lightbox
  if (lb) {
    let sx = 0, sy = 0;
    lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) openLB(lbIndex + 1); else openLB(lbIndex - 1);
      }
    }, { passive: true });
  }

  /* ============================================================
     10. TESTIMONIAL SLIDER
     ============================================================ */
  const slides = $$(".words__slide");
  const dots = $$(".words__dots i");
  const wPrev = $(".words__btn--prev");
  const wNext = $(".words__btn--next");
  let wIdx = 0;
  let wTimer = null;

  function showSlide(i) {
    if (!slides.length) return;
    wIdx = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle("is-active", idx === wIdx));
    dots.forEach((d, idx) => d.classList.toggle("is-active", idx === wIdx));
  }
  function startAuto() {
    stopAuto();
    wTimer = setInterval(() => showSlide(wIdx + 1), 6000);
  }
  function stopAuto() {
    if (wTimer) { clearInterval(wTimer); wTimer = null; }
  }
  wPrev && wPrev.addEventListener("click", () => { showSlide(wIdx - 1); startAuto(); });
  wNext && wNext.addEventListener("click", () => { showSlide(wIdx + 1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener("click", () => { showSlide(i); startAuto(); }));

  if (slides.length > 1) startAuto();

  // Pause auto-rotation while hovering
  const wordsStage = $("#wordsStage");
  if (wordsStage) {
    wordsStage.addEventListener("mouseenter", stopAuto);
    wordsStage.addEventListener("mouseleave", startAuto);
  }

  /* ============================================================
     11. BOOKING FORM -> WHATSAPP
     ============================================================ */
  const form = $("#bookingForm");
  const formMsg = $("#formMsg");
  const WHATSAPP_NUMBER = "917567424001";

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const get = (k) => (fd.get(k) || "").toString().trim();

      const name = get("name");
      const phone = get("phone");
      const email = get("email");
      const idea = get("idea");
      const date = get("date");
      const service = get("service") || "Custom Tattoo";

      if (!name || !phone || !idea) {
        formMsg.textContent = "Please fill in your name, phone, and tattoo idea.";
        formMsg.className = "form__msg is-error";
        return;
      }

      const text = encodeURIComponent(
        `Hi Sukaka Art!\n\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        (email ? `Email: ${email}\n` : "") +
        `Service: ${service}\n` +
        `Preferred Date: ${date || "Flexible"}\n\n` +
        `Tattoo idea:\n${idea}`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener");

      formMsg.textContent = "Opening WhatsApp… we'll reply within 24 hours.";
      formMsg.className = "form__msg is-success";
      form.reset();
    });
  }

  /* ============================================================
     12. KICK OFF
     ============================================================ */
  // If page is loaded from cache, force the loader to finish quickly
  if (document.readyState === "complete") {
    runLoader();
  } else {
    window.addEventListener("load", runLoader);
  }

  // Footer year
  const copy = $(".footer__copy");
  if (copy) copy.innerHTML = copy.innerHTML.replace(/\d{4}/, new Date().getFullYear());

})();
