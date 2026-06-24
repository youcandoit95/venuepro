/* KORTA — vanilla app: i18n · booking · coaches · membership · daftar · gallery · PWA */
(() => {
  "use strict";
  const LANG_KEY = "korta-lang", BK = "korta-bookings", MB = "korta-members";
  let lang = localStorage.getItem(LANG_KEY) || "id";
  const t = (n) => (n && typeof n === "object" ? (n[lang] ?? n.id) : n);
  const $ = (s, r = document) => r.querySelector(s);
  const fmtIDR = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  const pad2 = (n) => String(n).padStart(2, "0");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function seeded(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }

  const WD = { id: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"], en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] };
  const MO = { id: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  const isoOf = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  const todayISO = () => isoOf(new Date());
  function upcomingDays(n) { const out = [], t0 = new Date(); t0.setHours(0, 0, 0, 0); for (let i = 0; i < n; i++) { const d = new Date(t0); d.setDate(t0.getDate() + i); out.push({ date: isoOf(d), dow: d.getDay(), day: d.getDate() }); } return out; }
  function prettyDate(iso) { const [y, m, d] = iso.split("-").map(Number); const dt = new Date(y, m - 1, d); return `${WD[lang][dt.getDay()]}, ${d} ${MO[lang][m - 1]}`; }
  function relDay(iso) { if (iso === todayISO()) return lang === "id" ? "Hari ini" : "Today"; const d = upcomingDays(2)[1]; if (d && iso === d.date) return lang === "id" ? "Besok" : "Tomorrow"; return ""; }

  const OPEN = 6, CLOSE = 23, COACH_FEE = 150000;
  const getBookings = () => { try { return JSON.parse(localStorage.getItem(BK) || "[]"); } catch { return []; } };
  function genSlots(courtId, date) {
    const booked = getBookings().filter((b) => b.courtId === courtId && b.date === date).map((b) => b.hour);
    const isToday = date === todayISO(), now = new Date().getHours(), out = [];
    for (let h = OPEN; h < CLOSE; h++) {
      let st = "avail"; const r = seeded(`${courtId}|${date}|${h}`); const occ = h >= 17 ? 0.62 : h >= 12 ? 0.74 : 0.82;
      if (r > occ) st = "booked"; if (isToday && h < now) st = "booked"; if (isToday && h === now) st = "live"; if (booked.includes(h)) st = "booked";
      out.push({ h, st });
    }
    return out;
  }
  const code = () => "KORTA-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  const memberId = () => "KORTA-M" + Math.floor(1000 + Math.random() * 9000);

  /* ---- icons ---- */
  const ic = {
    ur: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    r: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    l: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    cl: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 18l-6-6 6-6"/></svg>',
    cr: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 6l6 6-6 6"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l5 5L20 6"/></svg>',
    x: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    star: '<svg width="11" height="11" viewBox="0 0 24 24" fill="#c6f24e" stroke="#c6f24e"><path d="M12 2l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7L2 9.5 9 9z"/></svg>',
    award: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1c7c54" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M9 13l-1 8 4-2 4 2-1-8"/></svg>',
    loader: '<svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a9 9 0 1 0 9 9" stroke-linecap="round"/></svg>',
    down: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
    lock: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  };

  /* ---- state ---- */
  const S = {
    menu: false,
    booking: { courtId: "centre", date: todayISO(), hour: null, coach: "", name: "", phone: "", submitting: false, done: null, err: "" },
    coachFilter: "all",
    annual: false,
    wiz: { step: 0, name: "", email: "", phone: "", level: "", goal: "", times: [], tier: "klub", submitting: false, done: null, err: "" },
    overlay: null, // {type:'coach',slug} | {type:'lightbox',i}
    lastFocus: null,
  };

  /* ============================ RENDER: skeleton ============================ */
  const kicker = (label, meta, center) =>
    `<div class="kicker${center ? " center" : ""}"><span class="line"></span><span class="label">${esc(label)}${meta ? `<span class="meta">· ${esc(meta)}</span>` : ""}</span></div>`;

  function navHTML() {
    const L = T.nav;
    const links = [["#booking", L.booking], ["#coaches", L.coaches], ["#membership", L.membership], ["#courts", L.courts]];
    return `<header class="nav" id="nav"><div class="nav-in">
      <a href="#top" class="logo">KORTA<span class="dot"></span></a>
      <nav class="nav-links">${links.map(([h, l]) => `<a href="${h}">${esc(t(l))}</a>`).join("")}</nav>
      <div class="nav-right">${langToggleHTML()}<a href="#booking" class="btn btn-lime btn-sm">Book</a></div>
      <button class="nav-burger" data-action="menu:open" aria-label="${lang === "id" ? "Buka menu" : "Open menu"}" aria-expanded="${S.menu}" aria-controls="menu">${ic.menu}</button>
    </div></header>
    <div class="menu${S.menu ? " open" : ""}" id="menu" ${S.menu ? "" : 'aria-hidden="true"'}>
      <div class="menu-top"><a href="#top" class="logo" data-action="menu:close">KORTA<span class="dot"></span></a>
        <button class="nav-burger" data-action="menu:close" aria-label="${lang === "id" ? "Tutup" : "Close"}">${ic.x}</button></div>
      <div class="menu-links">${links.map(([h, l]) => `<a href="${h}" data-action="menu:close">${esc(t(l))}</a>`).join("")}</div>
      <div class="menu-foot">${langToggleHTML()}<a href="#booking" class="btn btn-lime" data-action="menu:close">Book Now</a></div>
    </div>`;
  }
  const langToggleHTML = () =>
    `<div class="langtoggle" role="group" aria-label="Language">${["id", "en"].map((l) => `<button data-action="lang:set" data-lang="${l}" class="${lang === l ? "on" : ""}" aria-pressed="${lang === l}">${l}</button>`).join("")}</div>`;

  function heroHTML() {
    const head = lang === "id" ? ["Tanah", "lapang,", "jiwa", '<span class="accent">juara.</span>'] : ["Grounded.", '<span class="accent">Relentless.</span>'];
    const slots = genSlots("centre", todayISO()).filter((s) => s.st === "avail").length;
    return `<section class="hero" id="top"><div class="container hero-grid">
      <div>
        ${kicker("Padel Club", "Jakarta · Est. 2026")}
        <h1 class="display">${head.join(" ")}</h1>
        <p class="lead hero-sub">${t({ id: "Clubhouse padel premium dengan delapan lapangan kaca. Booking dalam hitungan detik, latih bersama coach pro, jadi bagian dari komunitas.", en: "A premium padel clubhouse with eight glass courts. Book in seconds, train with pro coaches, become part of the community." })}</p>
        <div class="hero-cta">
          <a href="#booking" class="btn btn-lime">${t({ id: "Booking lapangan", en: "Book a court" })}</a>
          <a href="#courts" class="btn btn-outline">${t({ id: "Lihat lapangan", en: "Explore courts" })} ${ic.r}</a>
        </div>
      </div>
      <div><div class="hero-visual">
        <img class="editorial-img" src="images/hero-main.jpg" alt="${t({ id: "Pemain padel beraksi", en: "Padel player in action" })}" fetchpriority="high" width="800" height="1000">
        <a href="#booking" class="avail"><span><span class="label" style="font-size:.6rem">${t({ id: "Hari ini", en: "Today" })}</span><br><span class="big">${slots} ${t({ id: "slot tersedia", en: "slots open" })}</span></span>
        <span class="live"><span class="dotlive"></span>Live ${ic.ur}</span></a>
      </div></div>
    </div></section>`;
  }

  const marqueeHTML = () => `<div class="marquee" aria-hidden="true"><div class="marquee-track">${[...MARQUEE, ...MARQUEE].map((w) => `<span>${w}<i></i></span>`).join("")}</div></div>`;

  function manifestoHTML() {
    return `<section class="sec"><div class="container">
      ${kicker("Manifesto")}
      <div class="mani-grid">
        <div><p class="mani-statement"><span>${t(MANIFESTO.lead)} </span>${MANIFESTO.lines.map((l) => `<span class="soft">${t(l)} </span>`).join("")}</p></div>
        <div class="mani-photo"><img class="editorial-img" src="images/detail-rackets-2.jpg" alt="${t({ id: "Detail raket padel", en: "Padel racket detail" })}" loading="lazy" width="600" height="800"></div>
      </div>
      <div class="pillars">${MANIFESTO.pillars.map((p) => `<div class="pillar"><span class="line"></span><h3>${t(p.t)}</h3><p>${t(p.b)}</p></div>`).join("")}</div>
    </div></section>`;
  }

  const statsHTML = () => `<section class="stats grain"><div class="container"><div class="stats-grid">${STATS.map((s) => `<div class="stat"><div class="n">${(s.v >= 1000 ? s.v.toLocaleString("id-ID") : s.v) + s.s}</div><div class="l">${esc(t(s.l))}</div></div>`).join("")}</div></div></section>`;

  function courtsHTML() {
    return `<section class="sec mist" id="courts"><div class="container">
      <div class="rail-head">
        <div class="sec-head">${kicker(t({ id: "Lapangan", en: "The Courts" }), t({ id: "8 lapangan · indoor & outdoor", en: "8 courts · indoor & outdoor" }))}<h2 class="heading">${t({ id: "Delapan panggung untuk permainanmu.", en: "Eight stages for your game." })}</h2></div>
        <div class="rail-arrows"><button data-action="rail:prev" aria-label="Prev">${ic.cl}</button><button data-action="rail:next" aria-label="Next">${ic.cr}</button></div>
      </div></div>
      <div class="rail" id="rail">${COURTS.map((c, i) => `<article class="court">
        <div class="court-img"><img class="editorial-img" src="${c.img}" alt="${esc(c.name)}" loading="${i < 2 ? "eager" : "lazy"}" width="420" height="280"><span class="court-tag">${c.type === "indoor" ? t({ id: "Indoor", en: "Indoor" }) : t({ id: "Outdoor", en: "Outdoor" })}</span></div>
        <div class="court-body"><div class="top"><h3>${esc(c.name)}</h3><span class="court-price">${fmtIDR(c.price)}<small>/${t({ id: "jam", en: "hr" })}</small></span></div>
          <p class="tl">${t(c.tagline)}</p>
          <div class="chips">${c.features.map((f) => `<span class="chip">${t(f)}</span>`).join("")}</div>
          <a href="#booking" class="court-link">${t({ id: "Booking lapangan ini", en: "Book this court" })} ${ic.ur}</a>
        </div></article>`).join("")}<div style="flex:none;width:1px"></div></div>
    </section>`;
  }

  const fieldbreakHTML = () => `<section class="fieldbreak grain"><img class="editorial-img" src="images/court-2.jpg" alt="${t({ id: "Lapangan padel saat golden hour", en: "Padel court at golden hour" })}" loading="lazy"><div class="ov"></div><div class="in"><div class="container"><span class="line"></span><p class="q">${t({ id: "Golden hour, dinding kaca, dan bola yang tak mau berhenti.", en: "Golden hour, glass walls, and a ball that won't quit." })}</p></div></div></section>`;

  /* ---- booking ---- */
  function bookingHTML() {
    return `<section class="sec mist" id="booking"><div class="container">
      <div class="sec-head center">${kicker("Booking", t({ id: "Buka 06–24 · tiap hari", en: "Open 06–24 · daily" }), true)}<h2 class="heading">${t({ id: "Amankan lapanganmu.", en: "Lock in your court." })}</h2><p class="lead">${t({ id: "Pilih lapangan, tanggal, dan jam. Tambah coach jika mau. Selesai dalam hitungan detik.", en: "Pick a court, date, and time. Add a coach if you like. Done in seconds." })}</p></div>
      <div id="booking-app"></div>
    </div></section>`;
  }
  function renderBooking() {
    const el = $("#booking-app"); if (!el) return; const b = S.booking;
    if (b.done) {
      const court = COURTS.find((c) => c.id === b.done.courtId);
      el.innerHTML = `<div class="confirm-card" role="status" aria-live="polite">
        <div class="confirm-ic">${ic.check}</div>
        <h3 class="heading" style="font-size:1.9rem">${t({ id: "Booking terkonfirmasi!", en: "Booking confirmed!" })}</h3>
        <p class="lead" style="margin-top:10px">${t({ id: "Sampai jumpa di lapangan. Tunjukkan kode ini di resepsionis.", en: "See you on court. Show this code at reception." })}</p>
        <div class="code"><span class="lab">${t({ id: "Kode booking", en: "Booking code" })}</span><span class="c">${b.done.id}</span></div>
        <div style="margin-top:18px;color:var(--forest)"><b>${esc(court.name)}</b><br><span class="mono" style="color:var(--muted)">${prettyDate(b.done.date)} · ${pad2(b.done.hour)}:00</span></div>
        <p style="margin-top:24px"><button class="backlink" data-action="book:reset">${t({ id: "Booking lagi", en: "Book again" })}</button></p>
      </div>`;
      updateMbar();
      return;
    }
    const court = COURTS.find((c) => c.id === b.courtId);
    const days = upcomingDays(14);
    const slots = genSlots(b.courtId, b.date);
    const coach = COACHES.find((c) => c.slug === b.coach);
    const total = court.price + (coach ? COACH_FEE : 0);
    const _sl = (() => { const d = el.querySelector(".dates"); return d ? d.scrollLeft : 0; })();
    el.innerHTML = `<div class="book-grid">
      <div style="display:flex;flex-direction:column;gap:36px">
        <div class="field"><div class="field-head"><span class="step">1</span><span class="t">${t({ id: "Pilih lapangan", en: "Choose a court" })}</span></div>
          <div class="opt-row">${COURTS.map((c) => `<button class="copt${c.id === b.courtId ? " on" : ""}" data-action="book:court" data-id="${c.id}"><span class="nm">${esc(c.name)}</span><span class="mt">${c.type === "indoor" ? t({ id: "Indoor", en: "Indoor" }) : t({ id: "Outdoor", en: "Outdoor" })} · ${fmtIDR(c.price)}</span></button>`).join("")}</div>
        </div>
        <div class="field"><div class="field-head"><span class="step">2</span><span class="t">${t({ id: "Pilih tanggal", en: "Choose a date" })}</span></div>
          <div class="dates">${days.map((d) => { const r = relDay(d.date); return `<button class="date${d.date === b.date ? " on" : ""}" data-action="book:date" data-date="${d.date}"><span class="d">${WD[lang][d.dow]}</span><span class="n">${d.day}</span>${r ? `<span class="r">${r}</span>` : ""}</button>`; }).join("")}</div>
        </div>
        <div class="field"><div class="field-head"><span class="step">3</span><span class="t">${t({ id: "Pilih jam", en: "Choose a time" })}</span></div>
          <div class="slots">${slots.map((s) => {
            const on = b.hour === s.h, cls = on ? "on" : s.st;
            const lab = s.st === "booked" ? t({ id: "terisi", en: "booked" }) : s.st === "live" ? t({ id: "sedang main", en: "in play" }) : on ? t({ id: "dipilih", en: "selected" }) : t({ id: "tersedia", en: "available" });
            return `<button class="slot ${cls}" ${s.st !== "avail" ? "disabled aria-disabled=true" : ""} aria-pressed="${on}" aria-label="${pad2(s.h)}:00 — ${lab}" ${s.st === "avail" ? `data-action="book:slot" data-hour="${s.h}"` : ""}>${pad2(s.h)}:00${s.st === "booked" ? `<span style="display:inline-flex;opacity:.7">${ic.lock}</span>` : ""}${s.st === "live" ? '<span class="ld"></span>' : ""}</button>`;
          }).join("")}</div>
          <div class="legend">
            <span class="lg"><span class="sw" style="border:1px solid var(--line);background:#fff"></span>${t({ id: "Tersedia", en: "Available" })}</span>
            <span class="lg"><span class="sw" style="background:var(--mist);border:1px solid var(--line)"><span style="position:absolute;width:11px;height:1px;background:var(--muted);transform:rotate(-20deg)"></span></span>${t({ id: "Terisi", en: "Booked" })}</span>
            <span class="lg"><span class="sw" style="background:rgba(198,242,78,.4);border:1px solid var(--green)"><span style="width:6px;height:6px;border-radius:50%;background:var(--green)"></span></span>${t({ id: "Sedang main", en: "Live" })}</span>
          </div>
        </div>
      </div>
      <div><div class="summary">
        <span class="label">${t({ id: "Ringkasan", en: "Summary" })}</span>
        <div style="margin-top:14px">
          <div class="row"><span class="k">${t({ id: "Lapangan", en: "Court" })}</span><span class="v">${esc(court.name)}</span></div>
          <div class="row"><span class="k">${t({ id: "Tanggal", en: "Date" })}</span><span class="v">${prettyDate(b.date)}</span></div>
          <div class="row"><span class="k">${t({ id: "Jam", en: "Time" })}</span><span class="v" data-summary="jam">${b.hour !== null ? `${pad2(b.hour)}:00 — ${pad2(b.hour + 1)}:00` : t({ id: "Pilih jam", en: "Pick a time" })}</span></div>
        </div>
        <div class="div"></div>
        <label class="fl"><span class="lab">${t({ id: "Coach (opsional)", en: "Coach (optional)" })}</span>
          <select data-action="book:coach">${`<option value="">${t({ id: "Tanpa coach", en: "No coach" })}</option>` + COACHES.map((c) => `<option value="${c.slug}" ${c.slug === b.coach ? "selected" : ""}>${esc(c.name)} — ${t(c.role)} (+${fmtIDR(COACH_FEE)})</option>`).join("")}</select></label>
        <label class="fl"><span class="lab">${t({ id: "Nama lengkap", en: "Full name" })} <b>*</b></span><input data-model="booking.name" autocomplete="name" value="${esc(b.name)}" placeholder="${t({ id: "mis. Andi Wijaya", en: "e.g. Andi Wijaya" })}"></label>
        <label class="fl"><span class="lab">${t({ id: "No. WhatsApp", en: "Phone / WhatsApp" })} <b>*</b></span><input data-model="booking.phone" type="tel" inputmode="numeric" autocomplete="tel" value="${esc(b.phone)}" placeholder="08xx xxxx xxxx"></label>
        <div class="total"><span class="label">${t({ id: "Total", en: "Total" })}</span><span class="amt">${fmtIDR(total)}</span></div>
        ${b.err ? `<p class="err" role="alert" aria-live="assertive">${esc(b.err)}</p>` : ""}
        <button class="btn btn-forest" style="width:100%;margin-top:16px" data-action="book:confirm" ${b.submitting || b.hour === null ? "disabled" : ""}>${b.submitting ? ic.loader + " " + t({ id: "Memproses…", en: "Processing…" }) : t({ id: "Konfirmasi booking", en: "Confirm booking" })}</button>
        <p class="note">${t({ id: "Tanpa pembayaran · demo", en: "No payment · demo" })}</p>
      </div></div>
    </div>
    <div class="mbar"><div class="mt"><span class="mk">${t({ id: "Total", en: "Total" })}</span><span class="amt">${fmtIDR(total)}</span></div><button class="btn btn-forest" data-action="book:confirm" ${b.submitting || b.hour === null ? "disabled" : ""}>${b.hour === null ? t({ id: "Pilih jam", en: "Pick a time" }) : t({ id: "Konfirmasi", en: "Confirm" })}</button></div>`;
    if (_sl) { const d2 = el.querySelector(".dates"); if (d2) d2.scrollLeft = _sl; }
    updateMbar();
  }

  /* lightweight slot selection — no full re-render (preserves date-strip scroll, no flicker) */
  function selectSlot(el) {
    const b = S.booking;
    document.querySelectorAll(".slots .slot.on").forEach((s) => {
      s.classList.remove("on"); s.classList.add("avail"); s.setAttribute("aria-pressed", "false");
      const hh = pad2(+s.dataset.hour); s.setAttribute("aria-label", `${hh}:00 — ${t({ id: "tersedia", en: "available" })}`);
    });
    el.classList.remove("avail"); el.classList.add("on"); el.setAttribute("aria-pressed", "true");
    b.hour = +el.dataset.hour; b.err = "";
    el.setAttribute("aria-label", `${pad2(b.hour)}:00 — ${t({ id: "dipilih", en: "selected" })}`);
    const jam = document.querySelector('[data-summary="jam"]');
    if (jam) jam.textContent = `${pad2(b.hour)}:00 — ${pad2(b.hour + 1)}:00`;
    const errEl = document.querySelector(".summary .err"); if (errEl) errEl.remove();
    document.querySelectorAll('[data-action="book:confirm"]').forEach((btn) => { btn.disabled = false; });
    const mb = document.querySelector('.mbar [data-action="book:confirm"]'); if (mb) mb.textContent = t({ id: "Konfirmasi", en: "Confirm" });
    updateMbar();
  }

  /* ---- coaches ---- */
  function coachesHTML() {
    return `<section class="sec" id="coaches"><div class="container">
      <div class="sec-head">${kicker(t({ id: "Coach", en: "Coaches" }), t({ id: "6 coach bersertifikat", en: "6 certified coaches" }))}<h2 class="heading">${t({ id: "Dilatih oleh yang terbaik.", en: "Trained by the best." })}</h2><p class="lead">${t({ id: "Tim coach bersertifikat untuk setiap level dan tujuan — dari pemula hingga atlet kompetisi.", en: "A certified coaching team for every level and goal — from first-timers to competitors." })}</p></div>
      <div class="filters" id="filters"></div>
      <div class="coaches" id="coaches-grid"></div>
    </div></section>`;
  }
  function renderCoaches() {
    const f = $("#filters"), g = $("#coaches-grid"); if (!f || !g) return;
    const chips = [{ key: "all", label: { id: "Semua", en: "All" } }, ...FOCUS];
    f.innerHTML = chips.map((c) => `<button class="filter${S.coachFilter === c.key ? " on" : ""}" data-action="coach:filter" data-key="${c.key}" aria-pressed="${S.coachFilter === c.key}">${esc(t(c.label))}</button>`).join("");
    const list = S.coachFilter === "all" ? COACHES : COACHES.filter((c) => c.focus.includes(S.coachFilter));
    g.innerHTML = list.map((c, i) => `<button class="coach" data-action="coach:open" data-slug="${c.slug}" aria-label="${t({ id: "Lihat coach", en: "View coach" })}: ${esc(c.name)}">
      <div class="coach-img"><img class="editorial-img" src="${c.img}" alt="${esc(c.name)}" loading="${i < 3 ? "eager" : "lazy"}" width="320" height="400">
        <div class="coach-badges"><span class="lv">${c.level}</span><span class="rt">${ic.star}${c.rating.toFixed(1)}</span></div></div>
      <span class="cname">${esc(c.name)}</span><span class="role">${t(c.role)}</span>
      <div class="sp">${c.sp.map((s) => `<span class="chip">${t(s)}</span>`).join("")}</div>
    </button>`).join("");
  }

  /* ---- membership ---- */
  function membershipHTML() {
    return `<section class="sec mist" id="membership"><div class="container"><div id="memb-app"></div></div></section>`;
  }
  function renderMembership() {
    const el = $("#memb-app"); if (!el) return;
    const per = S.annual ? (lang === "id" ? "thn" : "yr") : (lang === "id" ? "bln" : "mo");
    const priceOf = (ti) => (S.annual ? ti.y : ti.m);
    const rec = TIERS.find((t0) => t0.rec) || TIERS[1];
    const others = TIERS.filter((t0) => !t0.rec);
    const seg = `<div class="toggle-row"><div class="seg" role="group" aria-label="${t({ id: "Siklus tagihan", en: "Billing cycle" })}">
      <button class="${!S.annual ? "on" : ""}" data-action="memb:toggle" data-annual="0" aria-pressed="${!S.annual}">${t({ id: "Bulanan", en: "Monthly" })}</button>
      <button class="${S.annual ? "on" : ""}" data-action="memb:toggle" data-annual="1" aria-pressed="${S.annual}">${t({ id: "Tahunan", en: "Annual" })}</button>
    </div><span class="save">${lang === "id" ? "Hemat 2 bln" : "Save 2 mo"}</span></div>`;
    el.innerHTML = `<div class="memb-grid">
      <div class="memb-intro">
        ${kicker("Membership", t({ id: "3 paket · batal kapan saja", en: "3 plans · cancel anytime" }))}
        <h2 class="heading">${t({ id: "Jadi bagian dari KORTA.", en: "Become part of KORTA." })}</h2>
        <p class="lead">${t({ id: "Main lebih sering, lebih hemat, dan dapat akses prioritas — dari paket sosial hingga pro.", en: "Play more, save more, and unlock priority access — from social to pro." })}</p>
        ${seg}
      </div>
      <div class="memb-tiers">
        <div class="tier rec tier-feature">
          <div class="tf-main">
            <div class="th"><h3>${rec.name}</h3><span class="pop">${lang === "id" ? "Paling populer" : "Most popular"}</span></div>
            <p class="tl">${t(rec.tagline)}</p>
            <ul class="perks">${rec.perks.map((p) => `<li><span class="ck">${ic.check}</span><span>${t(p)}</span></li>`).join("")}</ul>
          </div>
          <div class="tf-side">
            <div class="price"><span class="p">${fmtIDR(priceOf(rec))}</span><span class="per">/${per}</span></div>
            <button class="btn btn-lime" data-action="memb:choose" data-tier="${rec.id}">${t({ id: "Pilih paket", en: "Choose plan" })}</button>
          </div>
        </div>
        <div class="memb-sub">${others.map((ti) => { return `<div class="tier tier-mini">
          <div class="th"><h3>${ti.name}</h3></div>
          <div class="price"><span class="p">${fmtIDR(priceOf(ti))}</span><span class="per">/${per}</span></div>
          <p class="tl">${t(ti.tagline)}</p>
          <ul class="perks">${ti.perks.map((p) => `<li><span class="ck">${ic.check}</span><span>${t(p)}</span></li>`).join("")}</ul>
          <button class="btn btn-forest" data-action="memb:choose" data-tier="${ti.id}">${t({ id: "Pilih paket", en: "Choose plan" })}</button>
        </div>`; }).join("")}</div>
      </div>
    </div>`;
  }

  /* ---- daftar wizard ---- */
  function daftarHTML() {
    return `<section class="sec" id="daftar"><div class="container">
      <div class="sec-head center">${kicker("Daftar", t({ id: "gratis · 2 menit", en: "free · 2 min" }), true)}<h2 class="heading">${t({ id: "Daftar jadi member.", en: "Become a member." })}</h2></div>
      <div class="wizard" id="wizard" style="margin-top:48px"></div>
    </div></section>`;
  }
  function renderWizard() {
    const el = $("#wizard"); if (!el) return; const w = S.wiz;
    if (w.done) {
      el.innerHTML = `<div class="confirm-card" role="status" aria-live="polite">
        <div class="confirm-ic">${ic.check}</div>
        <h3 class="heading" style="font-size:1.9rem">${t({ id: "Selamat datang, ", en: "Welcome, " })}${esc(w.done.name.split(" ")[0])}!</h3>
        <p class="lead" style="margin-top:10px">${t({ id: "Keanggotaanmu aktif. Simpan ID member ini.", en: "Your membership is active. Save your member ID." })}</p>
        <div class="code"><span class="lab">${t({ id: "ID Member", en: "Member ID" })}</span><span class="c">${w.done.id}</span></div>
        <p style="margin-top:24px"><a href="#booking" class="btn btn-forest btn-sm">${t({ id: "Booking pertama", en: "First booking" })}</a></p>
      </div>`;
      return;
    }
    const steps = [{ id: "akun", l: { id: "Akun", en: "Account" } }, { id: "profil", l: { id: "Profil", en: "Profile" } }, { id: "paket", l: { id: "Paket", en: "Plan" } }, { id: "review", l: { id: "Review", en: "Review" } }];
    const levels = [["Beginner", { id: "Pemula", en: "Beginner" }], ["Intermediate", { id: "Menengah", en: "Intermediate" }], ["Advanced", { id: "Mahir", en: "Advanced" }]];
    const goals = [["fun", { id: "Main seru", en: "Just for fun" }], ["improve", { id: "Tingkatkan skill", en: "Improve" }], ["compete", { id: "Kompetisi", en: "Compete" }]];
    const times = [["morning", { id: "Pagi", en: "Morning" }], ["afternoon", { id: "Siang", en: "Afternoon" }], ["evening", { id: "Malam", en: "Evening" }]];
    let body = "";
    if (w.step === 0) body = `<h3>${t({ id: "Buat akunmu", en: "Create your account" })}</h3><div class="stack">
      <label class="fl"><span class="lab">${t({ id: "Nama lengkap", en: "Full name" })}</span><input data-model="wiz.name" autocomplete="name" value="${esc(w.name)}" placeholder="${t({ id: "mis. Andi Wijaya", en: "e.g. Andi Wijaya" })}"></label>
      <label class="fl"><span class="lab">Email</span><input data-model="wiz.email" type="email" autocomplete="email" value="${esc(w.email)}" placeholder="nama@email.com"></label>
      <label class="fl"><span class="lab">${t({ id: "No. WhatsApp", en: "Phone / WhatsApp" })}</span><input data-model="wiz.phone" type="tel" inputmode="numeric" autocomplete="tel" value="${esc(w.phone)}" placeholder="08xx xxxx xxxx"></label></div>`;
    else if (w.step === 1) body = `<h3>${t({ id: "Profil padelmu", en: "Your padel profile" })}</h3>
      <div class="group"><span class="label">${t({ id: "Level saat ini", en: "Current level" })}</span><div class="opt-chips">${levels.map(([v, l]) => `<button class="wchip${w.level === v ? " on" : ""}" data-action="wiz:level" data-v="${v}">${t(l)}</button>`).join("")}</div></div>
      <div class="group"><span class="label">${t({ id: "Tujuan utama", en: "Main goal" })} <span class="meta">· ${t({ id: "opsional", en: "optional" })}</span></span><div class="opt-chips">${goals.map(([v, l]) => `<button class="wchip${w.goal === v ? " on" : ""}" data-action="wiz:goal" data-v="${v}">${t(l)}</button>`).join("")}</div></div>
      <div class="group"><span class="label">${t({ id: "Waktu favorit", en: "Preferred times" })} <span class="meta">· ${t({ id: "opsional", en: "optional" })}</span></span><div class="opt-chips">${times.map(([v, l]) => `<button class="wchip${w.times.includes(v) ? " on" : ""}" data-action="wiz:time" data-v="${v}">${t(l)}</button>`).join("")}</div></div>`;
    else if (w.step === 2) body = `<h3>${t({ id: "Pilih membership", en: "Choose membership" })}</h3><div class="stack">${TIERS.map((ti) => `<button class="wtier${w.tier === ti.id ? " on" : ""}" data-action="wiz:tier" data-v="${ti.id}"><span><span class="nm">${ti.name}</span><span class="tl">${t(ti.tagline)}</span></span><span class="pr">${fmtIDR(ti.m)}/${lang === "id" ? "bln" : "mo"}</span></button>`).join("")}</div>`;
    else { const ti = TIERS.find((x) => x.id === w.tier); body = `<h3>${t({ id: "Konfirmasi", en: "Review" })}</h3><div class="review-box">
      ${revRow(t({ id: "Nama", en: "Name" }), w.name)}${revRow("Email", w.email)}${revRow(t({ id: "Telepon", en: "Phone" }), w.phone)}${revRow(t({ id: "Level", en: "Level" }), w.level || "—")}${revRow(t({ id: "Paket", en: "Plan" }), ti ? `${ti.name} · ${fmtIDR(ti.m)}/${lang === "id" ? "bln" : "mo"}` : "—")}</div><p class="note">${t({ id: "Tanpa pembayaran · demo", en: "No payment · demo" })}</p>`; }
    const last = w.step === steps.length - 1;
    el.innerHTML = `<div class="prog">${steps.map((s, i) => `<div class="st ${i < w.step ? "done" : ""} ${i === w.step ? "cur" : ""}"><span class="bar"></span><span class="lab">${i + 1}. ${t(s.l)}</span></div>`).join("")}</div>
      <div class="wstep">${body}</div>
      ${w.err ? `<p class="err" role="alert" aria-live="assertive">${esc(w.err)}</p>` : ""}
      <div class="wnav">
        <button class="wback" data-action="wiz:back" ${w.step === 0 ? "disabled" : ""}>${ic.l} ${t({ id: "Kembali", en: "Back" })}</button>
        ${last ? `<button class="btn btn-lime" data-action="wiz:submit" ${w.submitting ? "disabled" : ""}>${w.submitting ? ic.loader + " " + t({ id: "Memproses…", en: "Processing…" }) : t({ id: "Daftar sekarang", en: "Join now" })}</button>`
        : `<button class="btn btn-forest" data-action="wiz:next">${t({ id: "Lanjut", en: "Continue" })} ${ic.r}</button>`}
      </div>`;
  }
  const revRow = (k, v) => `<div class="row" style="display:flex;justify-content:space-between;gap:12px;font-size:.9rem"><span style="color:var(--muted)">${esc(k)}</span><span style="font-weight:600;color:var(--forest)">${esc(v)}</span></div>`;

  /* ---- gallery & testimonials ---- */
  const galleryHTML = () => `<section class="sec" id="gallery"><div class="container">
    <div class="sec-head">${kicker(t({ id: "Galeri", en: "Gallery" }), t({ id: "momen di KORTA", en: "moments at KORTA" }))}<h2 class="heading">${t({ id: "Sore yang tak terlupakan.", en: "Unforgettable evenings." })}</h2></div>
    <div class="masonry">${GALLERY.map((g, i) => `<button data-action="gallery:open" data-i="${i}" aria-label="${t({ id: "Perbesar", en: "Enlarge" })}: ${esc(t(g.alt))}"><img class="editorial-img" src="${g.src}" alt="${esc(t(g.alt))}" loading="${i < 4 ? "eager" : "lazy"}"></button>`).join("")}</div>
  </div></section>`;

  function testimonialsHTML() {
    const [f, ...rest] = TESTIMONIALS;
    return `<section class="sec mist"><div class="container">
      <div class="sec-head">${kicker(t({ id: "Kata member", en: "Member stories" }), t({ id: "2.400+ member", en: "2,400+ members" }))}<h2 class="heading">${t({ id: "Dari yang sudah jatuh cinta.", en: "From those already hooked." })}</h2></div>
      <div class="tms">
        <figure class="tm-feature"><span class="line"></span><blockquote>“${t(f.q)}”</blockquote><figcaption><span class="nm">${esc(f.nm)}</span><span style="width:4px;height:4px;border-radius:50%;background:var(--muted)"></span><span class="ro">${t(f.ro)}</span></figcaption></figure>
        <div class="tm-small">${rest.map((x) => `<figure class="tm-card"><blockquote>“${t(x.q)}”</blockquote><figcaption><div class="nm">${esc(x.nm)}</div><div class="ro">${t(x.ro)}</div></figcaption></figure>`).join("")}</div>
      </div>
    </div></section>`;
  }

  function footerHTML() {
    const links = [["#booking", T.nav.booking], ["#coaches", T.nav.coaches], ["#membership", T.nav.membership], ["#daftar", { id: "Daftar Member", en: "Join" }], ["#courts", T.nav.courts]];
    return `<footer class="footer grain" id="contact"><div class="container footer-in">
      <div class="foot-cta"><h2 class="display">${lang === "id" ? "Ayo main." : "Let's play."}</h2><a href="#booking" class="btn btn-lime">${lang === "id" ? "Booking lapangan" : "Book a court"} ${ic.ur}</a></div>
      <div class="foot-cols">
        <div class="foot-col foot-brand"><a href="#top" class="logo">KORTA<span class="dot"></span></a><p>${lang === "id" ? "Clubhouse padel premium. Tanah lapang, jiwa juara." : "A premium padel clubhouse. Grounded, relentless."}</p></div>
        <div class="foot-col"><div class="lab">${lang === "id" ? "Jelajah" : "Explore"}</div>${links.map(([h, l]) => `<a href="${h}">${esc(t(l))}</a>`).join("")}</div>
        <div class="foot-col"><div class="lab">${lang === "id" ? "Kunjungi" : "Visit"}</div><p>${t(CLUB.address)}</p><a href="tel:${CLUB.phone}">${CLUB.phone}</a><a href="mailto:${CLUB.email}">${CLUB.email}</a>${CLUB.hours.map((h) => `<p style="display:flex;justify-content:space-between;gap:12px;color:rgba(255,255,255,.6)"><span>${t(h.d)}</span><span class="mono">${h.t}</span></p>`).join("")}</div>
        <div class="foot-col"><div class="lab">Newsletter</div><p style="color:rgba(255,255,255,.6)">${lang === "id" ? "Info turnamen & promo member." : "Tournaments & member perks."}</p>
          <form class="news" data-action="news:submit"><label class="sr-only" for="news-email">Email</label><input id="news-email" type="email" autocomplete="email" required placeholder="${lang === "id" ? "Email kamu" : "Your email"}"><button type="submit" aria-label="${lang === "id" ? "Langganan" : "Subscribe"}">${ic.ur}</button></form>
          <div class="socials">${[["Instagram", "https://instagram.com/kortapadel"], ["TikTok", "https://tiktok.com/@kortapadel"], ["YouTube", "https://youtube.com/@kortapadel"], ["WhatsApp", "https://wa.me/628118000555"]].map(([s, u]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="KORTA di ${s}">${s}</a>`).join("")}</div></div>
      </div>
      <div class="foot-bot"><p>© 2026 KORTA Padel Club</p><p>${lang === "id" ? "Dibuat di Jakarta" : "Made in Jakarta"}</p></div>
    </div></footer>`;
  }

  /* ============================ overlays ============================ */
  function renderOverlay() {
    const root = $("#overlay-root");
    if (!S.overlay) { root.innerHTML = ""; root.className = ""; root.removeAttribute("role"); root.removeAttribute("aria-modal"); root.removeAttribute("aria-label"); root.style.alignItems = ""; document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    root.removeAttribute("role"); root.removeAttribute("aria-modal"); root.removeAttribute("aria-label");
    if (S.overlay.type === "coach") {
      const c = COACHES.find((x) => x.slug === S.overlay.slug);
      const ALL = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"], EN = { Sen: "Mon", Sel: "Tue", Rab: "Wed", Kam: "Thu", Jum: "Fri", Sab: "Sat", Min: "Sun" };
      root.className = "overlay open"; root.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(c.name)}">
        <button class="modal-close" data-action="modal:close" aria-label="${lang === "id" ? "Tutup" : "Close"}">${ic.x}</button>
        <div class="cd-grid"><div class="cd-photo"><img class="editorial-img" src="${c.img}" alt="${esc(c.name)}"></div>
        <div class="cd-body"><span class="role">${t(c.role)} · ${c.level}</span><h2>${esc(c.name)}</h2>
          <div class="cd-stats"><div><div class="n">${ic.star}${c.rating.toFixed(1)}</div><div class="l">Rating</div></div><div><div class="n">${c.years}</div><div class="l">${t({ id: "Tahun", en: "Years" })}</div></div><div><div class="n">${c.sessions.toLocaleString("id-ID")}+</div><div class="l">${t({ id: "Sesi", en: "Sessions" })}</div></div></div>
          <p class="cd-bio">${t(c.bio)}</p>
          <div class="cd-section"><span class="label">${t({ id: "Spesialisasi", en: "Specialties" })}</span><div class="sp" style="margin-top:10px;display:flex;flex-wrap:wrap;gap:8px">${c.sp.map((s) => `<span class="chip">${t(s)}</span>`).join("")}</div></div>
          <div class="cd-section"><span class="label">${t({ id: "Sertifikasi", en: "Certifications" })}</span><div style="margin-top:10px;display:flex;flex-direction:column;gap:8px">${c.cert.map((x) => `<span style="display:flex;align-items:center;gap:8px;font-size:.9rem;color:var(--ink)">${ic.award}${esc(x)}</span>`).join("")}</div></div>
          <div class="cd-section"><span class="label">${t({ id: "Ketersediaan", en: "Availability" })}</span><div class="days">${ALL.map((d) => `<span class="day${c.days.includes(d) ? " on" : ""}">${lang === "id" ? d : EN[d]}</span>`).join("")}</div></div>
          <a href="#booking" class="btn btn-forest" style="margin-top:24px" data-action="coach:book" data-slug="${c.slug}">${t({ id: "Booking coach ini", en: "Book this coach" })} ${ic.ur}</a>
        </div></div></div>`;
      const cl = root.querySelector(".modal-close"); cl && cl.focus();
    } else if (S.overlay.type === "lightbox") {
      const i = S.overlay.i, g = GALLERY[i];
      root.className = "overlay open"; root.style.alignItems = "center";
      root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", lang === "id" ? "Pratinjau galeri" : "Gallery preview");
      root.innerHTML = `
        <button class="modal-close" data-action="modal:close" aria-label="${lang === "id" ? "Tutup" : "Close"}" style="background:rgba(255,255,255,.12);color:#fff">${ic.x}</button>
        <button class="lb-nav lb-prev" data-action="lb:prev" aria-label="Prev">${ic.cl}</button>
        <button class="lb-nav lb-next" data-action="lb:next" aria-label="Next">${ic.cr}</button>
        <figure class="lb-img"><img src="${g.src}" alt="${esc(t(g.alt))}"></figure>
        <span class="lb-count">${i + 1} / ${GALLERY.length}</span>`;
      const cl = root.querySelector(".modal-close"); cl && cl.focus();
    }
  }

  /* ============================ master render ============================ */
  function render() {
    document.documentElement.lang = lang;
    const SEAM = '<div class="container"><div class="seam"></div></div>';
    $("#app").innerHTML =
      `<a href="#main" class="skip">${lang === "id" ? "Lewati ke konten" : "Skip to content"}</a>` +
      navHTML() + '<main id="main" tabindex="-1">' + heroHTML() + marqueeHTML() +
      bookingHTML() + SEAM + coachesHTML() + SEAM + membershipHTML() + SEAM + daftarHTML() + SEAM +
      courtsHTML() + manifestoHTML() + statsHTML() + fieldbreakHTML() + galleryHTML() + SEAM + testimonialsHTML() + "</main>" + footerHTML();
    renderBooking(); renderCoaches(); renderMembership(); renderWizard();
    updateNavScroll(); updateMbar();
  }
  function setLang(l) { lang = l; localStorage.setItem(LANG_KEY, l); render(); }

  /* mobile sticky booking bar — only while the Booking section is on screen + a time is picked */
  function bookingVisible() { const el = $("#booking"); if (!el) return false; const r = el.getBoundingClientRect(); return r.top < window.innerHeight * 0.65 && r.bottom > window.innerHeight * 0.35; }
  function updateMbar() { document.body.classList.toggle("mbar-on", bookingVisible() && S.booking.hour !== null && !S.booking.done); }

  /* ============================ events ============================ */
  function updateNavScroll() { const n = $("#nav"); if (n) n.classList.toggle("scrolled", window.scrollY > 32); }
  window.addEventListener("scroll", () => { updateNavScroll(); updateMbar(); }, { passive: true });

  document.addEventListener("input", (e) => {
    const m = e.target.getAttribute && e.target.getAttribute("data-model");
    if (!m) return; const [obj, key] = m.split("."); S[obj][key] = e.target.value;
  });
  document.addEventListener("change", (e) => {
    const a = e.target.getAttribute && e.target.getAttribute("data-action");
    if (a === "book:coach") { S.booking.coach = e.target.value; renderBooking(); }
  });

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]"); if (!el) return;
    const a = el.getAttribute("data-action");
    const b = S.booking, w = S.wiz;
    switch (a) {
      case "lang:set": setLang(el.dataset.lang); break;
      case "menu:open": S.menu = true; render(); break;
      case "menu:close": S.menu = false; render(); break;
      case "rail:prev": { const r = $("#rail"); r && r.scrollBy({ left: -440, behavior: "smooth" }); break; }
      case "rail:next": { const r = $("#rail"); r && r.scrollBy({ left: 440, behavior: "smooth" }); break; }
      case "book:court": b.courtId = el.dataset.id; b.hour = null; b.err = ""; renderBooking(); break;
      case "book:date": b.date = el.dataset.date; b.hour = null; b.err = ""; renderBooking(); break;
      case "book:slot": selectSlot(el); break;
      case "book:reset": S.booking = { courtId: "centre", date: todayISO(), hour: null, coach: "", name: "", phone: "", submitting: false, done: null, err: "" }; renderBooking(); break;
      case "book:confirm": confirmBooking(); break;
      case "coach:filter": S.coachFilter = el.dataset.key; renderCoaches(); break;
      case "coach:open": e.preventDefault(); S.lastFocus = el; S.overlay = { type: "coach", slug: el.dataset.slug }; renderOverlay(); break;
      case "coach:book": S.booking.coach = el.dataset.slug; S.overlay = null; renderOverlay(); renderBooking(); break;
      case "modal:close": closeOverlay(); break;
      case "memb:toggle": S.annual = el.dataset.annual === "1"; renderMembership(); break;
      case "memb:choose": S.wiz.tier = el.dataset.tier; renderWizard(); break;
      case "wiz:level": w.level = el.dataset.v; renderWizard(); break;
      case "wiz:goal": w.goal = el.dataset.v; renderWizard(); break;
      case "wiz:time": w.times = w.times.includes(el.dataset.v) ? w.times.filter((x) => x !== el.dataset.v) : [...w.times, el.dataset.v]; renderWizard(); break;
      case "wiz:tier": w.tier = el.dataset.v; renderWizard(); break;
      case "wiz:next": wizNext(); break;
      case "wiz:back": w.err = ""; w.step = Math.max(0, w.step - 1); renderWizard(); break;
      case "wiz:submit": wizSubmit(); break;
      case "gallery:open": e.preventDefault(); S.lastFocus = el; S.overlay = { type: "lightbox", i: +el.dataset.i }; renderOverlay(); break;
      case "lb:prev": S.overlay.i = (S.overlay.i - 1 + GALLERY.length) % GALLERY.length; renderOverlay(); break;
      case "lb:next": S.overlay.i = (S.overlay.i + 1) % GALLERY.length; renderOverlay(); break;
      case "news:submit": break;
    }
  });
  // overlay backdrop click + newsletter submit
  document.addEventListener("click", (e) => { if (e.target.id === "overlay-root") closeOverlay(); });
  document.addEventListener("submit", (e) => { if (e.target.closest('[data-action="news:submit"]')) { e.preventDefault(); e.target.innerHTML = `<span role="status" class="mono" style="color:var(--lime);font-size:.7rem;font-weight:700;text-transform:uppercase">${lang === "id" ? "Terkirim — sampai jumpa!" : "Subscribed — see you!"}</span>`; } });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { if (S.overlay) closeOverlay(); else if (S.menu) { S.menu = false; render(); } }
    if (S.overlay && S.overlay.type === "lightbox") { if (e.key === "ArrowRight") { S.overlay.i = (S.overlay.i + 1) % GALLERY.length; renderOverlay(); } if (e.key === "ArrowLeft") { S.overlay.i = (S.overlay.i - 1 + GALLERY.length) % GALLERY.length; renderOverlay(); } }
    if (S.overlay && e.key === "Tab") {
      const root = $("#overlay-root");
      const f = root.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
      if (f.length) { const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  });
  function closeOverlay() { S.overlay = null; renderOverlay(); const f = S.lastFocus; if (f) try { f.focus(); } catch {} }

  function confirmBooking() {
    const b = S.booking; b.err = "";
    if (b.hour === null) { b.err = t({ id: "Pilih jam dulu.", en: "Pick a time first." }); return renderBooking(); }
    if ((b.name || "").trim().length < 2) { b.err = t({ id: "Nama belum diisi.", en: "Enter your name." }); renderBooking(); const i = $('[data-model="booking.name"]'); i && i.focus(); return; }
    if ((b.phone || "").replace(/\D/g, "").length < 8) { b.err = t({ id: "Nomor telepon belum valid.", en: "Enter a valid phone." }); renderBooking(); const i = $('[data-model="booking.phone"]'); i && i.focus(); return; }
    b.submitting = true; renderBooking();
    setTimeout(() => {
      const rec = { id: code(), courtId: b.courtId, date: b.date, hour: b.hour, coach: b.coach || undefined, name: b.name.trim(), phone: b.phone.trim(), createdAt: Date.now() };
      const all = getBookings(); all.push(rec); try { localStorage.setItem(BK, JSON.stringify(all)); } catch {}
      b.submitting = false; b.done = rec; renderBooking();
    }, 900);
  }
  function wizNext() {
    const w = S.wiz; w.err = "";
    if (w.step === 0) {
      if ((w.name || "").trim().length < 2) return fail(w, { id: "Nama belum diisi.", en: "Enter your name." });
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(w.email || "")) return fail(w, { id: "Email belum valid.", en: "Enter a valid email." });
      if ((w.phone || "").replace(/\D/g, "").length < 8) return fail(w, { id: "Nomor telepon belum valid.", en: "Enter a valid phone." });
    }
    if (w.step === 1 && !w.level) return fail(w, { id: "Pilih level kamu.", en: "Pick your level." });
    w.step = Math.min(3, w.step + 1); renderWizard();
  }
  const fail = (w, m) => { w.err = t(m); renderWizard(); };
  function wizSubmit() {
    const w = S.wiz; w.submitting = true; renderWizard();
    setTimeout(() => {
      const rec = { id: memberId(), name: w.name.trim(), email: w.email.trim(), level: w.level, tier: w.tier, createdAt: Date.now() };
      try { const all = JSON.parse(localStorage.getItem(MB) || "[]"); all.push(rec); localStorage.setItem(MB, JSON.stringify(all)); } catch {}
      w.submitting = false; w.done = rec; renderWizard();
    }, 1100);
  }

  /* ============================ boot ============================ */
  render();
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
})();
