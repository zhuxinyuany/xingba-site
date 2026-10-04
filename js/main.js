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
  const items = Array.from(document.querySelectorAll("[data-full]"));
  let lbIndex = 0;
  const show = (idx) => {
    if (!lb || !lbImg || !items.length) return;
    lbIndex = (idx + items.length) % items.length;
    const el = items[lbIndex];
    lbImg.src = el.getAttribute("data-full") || el.querySelector("img")?.src || "";
    lb.classList.add("open");
  };
  items.forEach((el, idx) => {
    el.addEventListener("click", () => show(idx));
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
  const urlQ = new URLSearchParams(location.search).get("q") || "";
  if (searchInput && urlQ) searchInput.value = urlQ;

  let currentCat = "all";
  const applyCatalog = () => {
    if (!catalog) return;
    const q = (searchInput?.value || "").trim().toLowerCase();
    let shown = 0;
    catalog.querySelectorAll(".card").forEach((card) => {
      const catOk = currentCat === "all" || card.dataset.cat === currentCat;
      const hay = `${card.textContent || ""} ${card.dataset.cat || ""}`.toLowerCase();
      const qOk = !q || hay.includes(q);
      const vis = catOk && qOk;
      card.style.display = vis ? "" : "none";
      if (vis) shown += 1;
    });
    if (emptyHint) emptyHint.hidden = shown > 0;
  };

  const filter = document.querySelector(".filter");
  if (filter) {
    const apply = (cat) => {
      currentCat = cat;
      filter.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.cat === cat));
      applyCatalog();
    };
    filter.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      apply(btn.dataset.cat);
    });
    const hash = location.hash.replace("#", "");
    if (hash && filter.querySelector(`[data-cat="${hash}"]`)) apply(hash);
    else applyCatalog();
  } else if (urlQ && catalog) {
    applyCatalog();
  }

  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = (searchInput?.value || "").trim();
    if (catalog) {
      const url = new URL(location.href);
      if (q) url.searchParams.set("q", q);
      else url.searchParams.delete("q");
      history.replaceState(null, "", url);
      applyCatalog();
      return;
    }
    location.assign(q ? `products.html?q=${encodeURIComponent(q)}` : "products.html");
  });
  searchInput?.addEventListener("input", () => {
    if (catalog) applyCatalog();
  });

  document.querySelector("form.inquiry")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("感谢垂询。本地演示站点不会发送邮件，请直接联系 info@xingba-wood.com");
  });
})();
