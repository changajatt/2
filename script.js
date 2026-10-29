/* ==========================================================
   CONFIGURATION — edit ONLY this block before launch.
   Every purchase button on the page reads from here.
   ========================================================== */
const CONFIG = {
  checkoutUrl: "",          // e.g. your hosted checkout link. Leave "" until a real one exists.
  priceLabel: "$27 USD",    // Proposed launch price; change when confirmed.
  legalLinks: {             // Add real URLs only when the policies exist.
    contact: "",
    privacy: "",
    terms: "",
    refunds: ""
  }
};

(function () {
  "use strict";

  // Price and year
  var price = document.getElementById("price");
  if (price) price.textContent = CONFIG.priceLabel;
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Purchase buttons: one config, safe fallback when no URL is set
  var hasCheckout = /^https:\/\//i.test(CONFIG.checkoutUrl);
  var status = document.getElementById("buyStatus");
  document.querySelectorAll("[data-buy]").forEach(function (el) {
    if (hasCheckout) {
      el.setAttribute("href", CONFIG.checkoutUrl);
      el.setAttribute("rel", "noopener");
    } else {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        if (status) {
          status.textContent = "Checkout is not connected yet, so purchases can't be completed on this page. The site owner needs to add a checkout link in script.js.";
          status.hidden = false;
        }
        var buy = document.getElementById("buy");
        if (buy) buy.scrollIntoView();
      });
    }
  });

  // Footer policy links: render only the ones that are configured
  var links = document.getElementById("legalLinks");
  if (links) {
    var labels = { contact: "Contact", privacy: "Privacy", terms: "Terms", refunds: "Refunds" };
    var built = Object.keys(labels).filter(function (k) { return /^(https?:|mailto:)/i.test(CONFIG.legalLinks[k]); });
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

  // Mobile menu
  var btn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  }
  btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { setMenu(false); btn.focus(); }
  });
})();
