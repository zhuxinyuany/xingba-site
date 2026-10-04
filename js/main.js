(function () {
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
  }

  const track = document.querySelector(".hero-track");
  if (track) {
    const slides = Array.from(track.children);
    let i = 0;
    const dots = document.querySelector(".dots");
    if (dots) {
      dots.innerHTML = slides.map((_, n) => `<span${n === 0 ? ' class="on"' : ""}></span>`).join("");
    }
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      if (dots) {
        dots.querySelectorAll("span").forEach((d, idx) => d.classList.toggle("on", idx === i));
      }
    };
    document.querySelector("[data-prev]")?.addEventListener("click", () => go(i - 1));
    document.querySelector("[data-next]")?.addEventListener("click", () => go(i + 1));
    setInterval(() => go(i + 1), 5000);
  }

  const lb = document.querySelector(".lightbox");
  const lbImg = lb?.querySelector("img");
  const getItems = () => Array.from(document.querySelectorAll(".series:not([hidden]) [data-full], [data-full]")).filter((el) => {
    const series = el.closest(".series");
    return !series || !series.hidden;
  });
  let lbIndex = 0;
  const show = (idx) => {
    const items = getItems();
    if (!lb || !lbImg || !items.length) return;
    lbIndex = (idx + items.length) % items.length;
    const el = items[lbIndex];
    lbImg.src = el.getAttribute("data-full") || el.querySelector("img")?.src || "";
    lb.classList.add("open");
  };
  document.querySelectorAll("[data-full]").forEach((el) => {
    el.addEventListener("click", () => {
      const items = getItems();
      const idx = items.indexOf(el);
      show(idx >= 0 ? idx : 0);
    });
  });
  lb?.querySelector(".close")?.addEventListener("click", () => lb.classList.remove("open"));
  lb?.querySelector(".prev")?.addEventListener("click", (e) => {
    e.stopPropagation();
    show(lbIndex - 1);
  });
  lb?.querySelector(".next")?.addEventListener("click", (e) => {
    e.stopPropagation();
    show(lbIndex + 1);
  });
  lb?.addEventListener("click", (e) => {
    if (e.target === lb) lb.classList.remove("open");
  });
  document.addEventListener("keydown", (e) => {
    if (!lb?.classList.contains("open")) return;
    if (e.key === "Escape") lb.classList.remove("open");
    if (e.key === "ArrowLeft") show(lbIndex - 1);
    if (e.key === "ArrowRight") show(lbIndex + 1);
  });

  const searchForm = document.querySelector(".site-search");
  const searchInput = searchForm?.querySelector("input[name='q']");
  const catalog = document.querySelector(".catalog");
  const emptyHint = document.querySelector(".catalog-empty");
  const sideNav = document.querySelector(".side-nav");
  const sideToggle = document.querySelector(".side-toggle");
  const seriesList = Array.from(document.querySelectorAll(".series"));
  const urlQ = new URLSearchParams(location.search).get("q") || "";
  if (searchInput && urlQ) searchInput.value = urlQ;

  const showSeries = (id) => {
    if (!seriesList.length) return;
    let found = false;
    seriesList.forEach((sec) => {
      const on = sec.dataset.series === id;
      sec.hidden = !on;
      if (on) found = true;
    });
    if (!found && seriesList[0]) {
      seriesList[0].hidden = false;
      id = seriesList[0].dataset.series;
    }
    sideNav?.querySelectorAll("a").forEach((a) => {
      a.classList.toggle("on", a.dataset.series === id);
    });
    if (id) history.replaceState(null, "", `#${id}`);
  };

  const applySearch = () => {
    if (!catalog || !seriesList.length) return;
    const q = (searchInput?.value || "").trim().toLowerCase();
    if (!q) {
      emptyHint && (emptyHint.hidden = true);
      const hash = location.hash.replace("#", "");
      const first = seriesList[0]?.dataset.series;
      showSeries(hash || first || "aframe-1");
      return;
    }
    let firstMatch = null;
    let shown = 0;
    seriesList.forEach((sec) => {
      const hay = `${sec.textContent || ""} ${sec.dataset.series || ""}`.toLowerCase();
      const match = hay.includes(q);
      sec.hidden = !match;
      if (match) {
        shown += 1;
        if (!firstMatch) firstMatch = sec.dataset.series;
      }
    });
    sideNav?.querySelectorAll("a").forEach((a) => {
      const sec = catalog.querySelector(`.series[data-series="${a.dataset.series}"]`);
      a.style.display = sec && !sec.hidden ? "" : "none";
      a.classList.toggle("on", a.dataset.series === firstMatch);
    });
    if (emptyHint) emptyHint.hidden = shown > 0;
  };

  sideToggle?.addEventListener("click", () => sideNav?.classList.toggle("open"));

  sideNav?.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-series]");
    if (!a) return;
    e.preventDefault();
    if (searchInput) searchInput.value = "";
    sideNav.querySelectorAll("a").forEach((x) => { x.style.display = ""; });
    showSeries(a.dataset.series);
    sideNav.classList.remove("open");
    if (emptyHint) emptyHint.hidden = true;
  });

  if (seriesList.length) {
    const hash = location.hash.replace("#", "");
    const alias = {
      aframe: "aframe-1",
      stand: "stand-1",
      table: "table-1",
      wall: "wall",
    };
    const start = hash && (document.querySelector(`.series[data-series="${hash}"]`) || document.querySelector(`#${hash}`))
      ? (document.querySelector(`.series[data-series="${hash}"]`)?.dataset.series || hash)
      : (alias[hash] || "aframe-1");
    if (urlQ) applySearch();
    else showSeries(start);
  }

  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = (searchInput?.value || "").trim();
    if (catalog) {
      const url = new URL(location.href);
      if (q) url.searchParams.set("q", q);
      else url.searchParams.delete("q");
      history.replaceState(null, "", url);
      applySearch();
      return;
    }
    location.assign(q ? `products.html?q=${encodeURIComponent(q)}` : "products.html");
  });
  searchInput?.addEventListener("input", () => {
    if (catalog) applySearch();
  });

  document.querySelector("form.inquiry")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("感谢垂询。本地演示站点不会发送邮件，请直接联系 info@xingba-wood.com");
  });
})();
