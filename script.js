/* ==========================================================
   CONFIGURATION — edit ONLY this block before launch.
   Every purchase button, the price and the footer links read
   from here. Leave a value as "" if you do not have it yet.
   ========================================================== */
const CONFIG = {
  checkoutUrl: "",        // REQUIRED to sell: your payment provider's official hosted checkout link (must start with https://)
  priceLabel: "$27 USD",  // Displayed price. Must match what the checkout charges.
  deliveryNote: "",       // Plain-English note on how buyers receive the PDF (only once your provider is set up and tested)
  refundNote: "",         // Your actual refund terms, in one sentence (leave "" if none)
  legalLinks: {           // Full URLs (https://… or mailto:…) to REAL pages only
    contact: "",
    privacy: "",
    terms: "",
    refunds: ""
  }
};

(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var isUrl = function (v) { return /^https:\/\/\S+$/i.test(v || ""); };

  // Price and year
  if ($("price")) $("price").textContent = CONFIG.priceLabel;
  if ($("year")) $("year").textContent = new Date().getFullYear();

  // Purchase buttons: one config, accessible fallback when checkout is not configured
  var hasCheckout = isUrl(CONFIG.checkoutUrl);
  var status = $("buyStatus");
  if (!hasCheckout && status) {
    status.textContent = "Purchasing is not open yet. Checkout has not been connected, so this ebook cannot be bought on this page right now. Please check back soon.";
    status.hidden = false;
  }
  document.querySelectorAll("[data-buy]").forEach(function (el) {
    if (hasCheckout) {
      el.setAttribute("href", CONFIG.checkoutUrl);
      el.setAttribute("rel", "noopener");
    } else {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var buy = $("buy");
        if (buy) buy.scrollIntoView();
        if (status) status.focus({ preventScroll: true });
      });
    }
  });

  // Delivery / refund notes: shown only if the owner supplied real text
  [["noteDelivery", "Delivery: ", CONFIG.deliveryNote], ["noteRefund", "Refunds: ", CONFIG.refundNote]].forEach(function (n) {
    var el = $(n[0]);
    if (el && n[2]) { el.textContent = n[1] + n[2]; el.hidden = false; }
  });
  if ($("faqDelivery") && (CONFIG.deliveryNote || CONFIG.refundNote)) {
    $("faqDelivery").textContent = [CONFIG.deliveryNote, CONFIG.refundNote].filter(Boolean).join(" ");
  }

  // Footer policy links: render only the ones that are configured
  var links = $("legalLinks");
  if (links) {
    var labels = { contact: "Contact", privacy: "Privacy", terms: "Terms", refunds: "Refunds" };
    var built = Object.keys(labels).filter(function (k) { return /^(https:\/\/|mailto:)\S+$/i.test(CONFIG.legalLinks[k] || ""); });
    if (built.length) {
      links.textContent = "";
      built.forEach(function (k, i) {
        var a = document.createElement("a");
        a.href = CONFIG.legalLinks[k];
        a.textContent = labels[k];
        if (i) links.appendChild(document.createTextNode(" · "));
        links.appendChild(a);
      });
    }
  }

  // Owner-only reminder in the browser console (visitors never see this)
  var missing = [];
  if (!hasCheckout) missing.push("checkoutUrl");
  ["contact", "privacy", "terms", "refunds"].forEach(function (k) { if (!CONFIG.legalLinks[k]) missing.push("legalLinks." + k); });
  if (!CONFIG.deliveryNote) missing.push("deliveryNote");
  if (missing.length) console.info("[Zyvtron] Not yet configured in script.js: " + missing.join(", "));

  // Mobile menu
  var btn = $("menuBtn"), nav = $("nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("click", function (e) {
    if (btn.getAttribute("aria-expanded") === "true" && !e.target.closest(".hdr")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { setMenu(false); btn.focus(); }
  });
  if (window.matchMedia) {
    window.matchMedia("(min-width:1024px)").addEventListener("change", function () { setMenu(false); });
  }
})();
