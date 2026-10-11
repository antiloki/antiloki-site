/* THE NEWSLETTER FORM (operator 2026-10-11: "Get notified when checkout & macOS open"). One script draws it everywhere, so the markup and the copy live in one place:
 *   <div data-newsletter="NAME"></div>      the form, tagged NAME (Buttondown's tag shows which spot brought a signup). There is none under the headline: operator 2026-10-11, "at the end, not at the headline".
 *   <div data-newsletter="download"></div>  hidden until a download starts (a click on an installer link), then it appears
 *   the footer of every page that loads this script gets one tagged "footer", automatically
 * It posts to Buttondown (free plan). Without JavaScript the form still works: the browser posts it and Buttondown answers on its own page. With JavaScript the page stays put and says "Check your inbox to confirm."
 * (Buttondown sends the confirmation email itself.) If the request cannot be sent, the person gets the plain Buttondown link instead of a silent failure. */
(function () {
  var ACTION = "https://buttondown.com/api/emails/embed-subscribe/danjindev";
  var BACKUP = "https://buttondown.com/danjindev";
  var LABEL = "Get notified when checkout & macOS open";
  var FINE = "One email every ~2 weeks. No spam, unsubscribe anytime. We never share your email.";
  var n = 0;

  var css = ".nl{max-width:460px;margin:18px auto 0;text-align:left;font-family:inherit;color:#efe9e2}" +
    ".nl label{display:block;font-size:14px;font-weight:600;margin:0 0 8px;color:#efe9e2}" +
    ".nl .row{display:flex;gap:8px}" +
    ".nl input[type=email]{flex:1;min-width:0;padding:10px 12px;border-radius:9px;border:1px solid #3b3530;background:#2a2521;color:#efe9e2;font:inherit;font-size:14px}" +
    ".nl input[type=email]::placeholder{color:#6f665e}" +
    ".nl input[type=email]:focus-visible,.nl input[type=submit]:focus-visible{outline:2px solid #c97c5c;outline-offset:2px}" +
    ".nl input[type=submit]{padding:10px 16px;border-radius:9px;border:0;background:#c97c5c;color:#211e1b;font:inherit;font-size:14px;font-weight:700;cursor:pointer}" +
    ".nl input[type=submit]:hover{filter:brightness(1.08)}.nl input[type=submit]:disabled{opacity:.6;cursor:default}" +
    ".nl .fine{display:block;margin-top:8px;font-size:12px;line-height:1.5;color:#a3998f}" +
    ".nl .say{display:none;margin-top:8px;font-size:14px;color:#7fc48f}.nl .say a{color:#c97c5c}.nl.sent .say,.nl.bad .say{display:block}.nl.bad .say{color:#d9b45a}.nl.sent form>*{display:none}.nl.sent form .say{display:block}" +
    ".nl-thanks{max-width:460px;margin:0 auto 6px;text-align:center;font-size:14px;color:#a3998f}" +
    ".nl-wrap[hidden]{display:none}.nl-wrap.in{animation:nlin .35s ease-out}@keyframes nlin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}" +
    "@media (max-width:520px){.nl .row{flex-direction:column}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function el(tag, attrs, text) { var e = document.createElement(tag); for (var k in (attrs || {})) e.setAttribute(k, attrs[k]); if (text) e.textContent = text; return e; }

  function build(tag) {
    var id = "bd-email-" + tag + "-" + (n++);
    var box = el("div", { "class": "nl", "data-spot": tag });
    var f = el("form", { action: ACTION, method: "post" });
    f.appendChild(el("label", { "for": id }, LABEL));
    var row = el("div", { "class": "row" });
    row.appendChild(el("input", { type: "email", name: "email", id: id, required: "", placeholder: "you@email.com", autocomplete: "email" }));
    row.appendChild(el("input", { type: "hidden", name: "tag", value: tag }));
    row.appendChild(el("input", { type: "submit", value: "Notify me" }));
    f.appendChild(row);
    f.appendChild(el("span", { "class": "fine" }, FINE));
    var say = el("div", { "class": "say", role: "status", "aria-live": "polite" }); f.appendChild(say);
    f.addEventListener("submit", function (ev) {
      if (!window.fetch || !window.FormData) return;           // an old browser posts the form the ordinary way
      ev.preventDefault();
      var btn = f.querySelector("input[type=submit]"); btn.disabled = true;
      // no-cors: Buttondown's embed endpoint is a form target, not an API for pages; the answer cannot be read, only that it was sent
      fetch(ACTION, { method: "POST", mode: "no-cors", body: new FormData(f) }).then(function () {
        say.textContent = "Check your inbox to confirm."; box.classList.remove("bad"); box.classList.add("sent");
      }, function () {
        btn.disabled = false; say.textContent = "";
        say.appendChild(document.createTextNode("That could not be sent from here. Subscribe on "));
        say.appendChild(el("a", { href: BACKUP, rel: "noopener" }, "buttondown.com/danjindev"));
        say.appendChild(document.createTextNode(" instead.")); box.classList.add("bad");
      });
    });
    box.appendChild(f); return box;
  }

  function mount() {
    var spots = document.querySelectorAll("[data-newsletter]");
    var hasFooter = false;
    Array.prototype.forEach.call(spots, function (s) {
      var tag = s.getAttribute("data-newsletter") || "site"; if (tag === "footer") hasFooter = true;
      if (tag === "download") {
        // after the download starts, not before: the form is there, hidden, and a click on an installer link shows it
        var wrap = el("div", { "class": "nl-wrap", hidden: "" });
        wrap.appendChild(el("p", { "class": "nl-thanks" }, "Your download should be starting. The Windows build is current; checkout and macOS are not open yet."));
        wrap.appendChild(build(tag)); s.appendChild(wrap);
        document.addEventListener("click", function (ev) {
          var a = ev.target && ev.target.closest ? ev.target.closest("a[href]") : null;
          if (a && /\/releases\/download\/|\.(exe|msi|deb|appimage|dmg)(\?|$)/i.test(a.getAttribute("href") || "")) { wrap.hidden = false; wrap.classList.add("in"); }
        });
      } else { s.appendChild(build(tag)); }
    });
    if (!hasFooter) {
      var foot = document.querySelector("footer .wrap") || document.querySelector("footer");
      if (foot) { var holder = el("div", { "class": "nl-footer", style: "flex-basis:100%;width:100%;order:-1;padding:6px 0 18px" }); holder.appendChild(build("footer")); foot.insertBefore(holder, foot.firstChild); }
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
