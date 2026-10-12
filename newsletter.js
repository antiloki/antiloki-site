/* THE EMAIL LIST: THE FOOTER FORM AND THE DOWNLOAD GATE (operator 2026-10-11: "Get notified when checkout & macOS open", the form at the end of the pages, not at the headline; 2026-10-12: "make obligatory on the landing onclick
 * download to subscribe the email to receive offers").
 *
 *   · the footer of every page that loads this script gets the form, tagged "footer" (Buttondown's tag shows which spot brought a signup)
 *   · THE DOWNLOAD GATE: clicking an installer link (the landing page, the releases page) first asks for an email. Submitting it subscribes that address to the list and THEN starts the download. The dialog says so in plain words
 *     (what the email is for, how often, unsubscribe anytime, never shared). Buttondown sends its own confirmation email, so nothing is subscribed until the person confirms.
 *   · remembered per browser (localStorage, a flag only - the address itself is never stored here), so the second download does not ask again.
 * HONEST LIMITS: this is a gate on the page, not on the file. The installers are public release files, so a person who copies the file address directly (or right-clicks and saves the link) gets them without the dialog, and a
 * browser with scripts switched off gets the plain links. It catches the ordinary click, which is what it is for. If the sign-up service cannot be reached (an ad blocker blocks it, the network is down) the person is not locked out:
 * the dialog shows the plain Buttondown page to subscribe on and a button to carry on once they have.
 * It posts to Buttondown (free plan). The footer form works without JavaScript too: the browser posts it and Buttondown answers on its own page. */
(function () {
  var ACTION = "https://buttondown.com/api/emails/embed-subscribe/danjindev";
  var BACKUP = "https://buttondown.com/danjindev";
  var LABEL = "Get notified when checkout & macOS open";
  var FINE = "One email every ~2 weeks. No spam, unsubscribe anytime. We never share your email.";
  var ASSET = /\/releases\/download\/|\/releases\/latest\/download\/|\.(exe|msi|deb|appimage|dmg)(\?|$)/i;   // an installer link
  var FLAG = "antiloki:dl-subscribed";
  var n = 0;

  var css = ".nl{max-width:460px;margin:18px auto 0;text-align:left;font-family:inherit;color:#efe9e2}" +
    ".nl label{display:block;font-size:14px;font-weight:600;margin:0 0 8px;color:#efe9e2}" +
    ".nl .row{display:flex;gap:8px}" +
    ".nl input[type=email]{flex:1;min-width:0;padding:10px 12px;border-radius:9px;border:1px solid #3b3530;background:#2a2521;color:#efe9e2;font:inherit;font-size:14px}" +
    ".nl input[type=email]::placeholder{color:#6f665e}" +
    ".nl input[type=email]:focus-visible,.nl input[type=submit]:focus-visible,.dlg button:focus-visible,.dlg input:focus-visible{outline:2px solid #c97c5c;outline-offset:2px}" +
    ".nl input[type=submit]{padding:10px 16px;border-radius:9px;border:0;background:#c97c5c;color:#211e1b;font:inherit;font-size:14px;font-weight:700;cursor:pointer}" +
    ".nl input[type=submit]:hover{filter:brightness(1.08)}.nl input[type=submit]:disabled{opacity:.6;cursor:default}" +
    ".nl .fine{display:block;margin-top:8px;font-size:12px;line-height:1.5;color:#a3998f}" +
    ".nl .say{display:none;margin-top:8px;font-size:14px;color:#7fc48f}.nl .say a{color:#c97c5c}.nl.sent .say,.nl.bad .say{display:block}.nl.bad .say{color:#d9b45a}.nl.sent form>*{display:none}.nl.sent form .say{display:block}" +
    "@media (max-width:520px){.nl .row{flex-direction:column}}" +
    // the download dialog
    ".dlg-back{position:fixed;inset:0;z-index:2000;background:rgba(10,8,6,.72);display:grid;place-items:center;padding:16px;backdrop-filter:blur(3px)}" +
    ".dlg{width:min(460px,100%);background:#2a2521;border:1px solid #3b3530;border-radius:14px;padding:22px 22px 18px;color:#efe9e2;font-family:inherit;box-shadow:0 20px 60px rgba(0,0,0,.5);position:relative}" +
    ".dlg h2{margin:0 0 6px;font-size:20px;letter-spacing:-.01em;color:#efe9e2}.dlg p{margin:0 0 12px;font-size:14px;line-height:1.55;color:#cfc6bd}" +
    ".dlg .x{position:absolute;top:10px;right:12px;background:transparent;border:0;color:#a3998f;font-size:20px;line-height:1;cursor:pointer}" +
    ".dlg input[type=email]{width:100%;box-sizing:border-box;padding:11px 12px;border-radius:9px;border:1px solid #3b3530;background:#211e1b;color:#efe9e2;font:inherit;font-size:15px}" +
    ".dlg .go{margin-top:10px;width:100%;padding:11px 16px;border-radius:9px;border:0;background:#c97c5c;color:#211e1b;font:inherit;font-size:15px;font-weight:700;cursor:pointer}.dlg .go:disabled{opacity:.6;cursor:default}" +
    ".dlg .fine{margin:10px 0 0;font-size:12px;line-height:1.5;color:#a3998f}.dlg .fine a,.dlg .msg a{color:#c97c5c}" +
    ".dlg .msg{margin-top:10px;font-size:13.5px;line-height:1.5;color:#d9b45a}.dlg .ok{color:#7fc48f}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function el(tag, attrs, text) { var e = document.createElement(tag); for (var k in (attrs || {})) e.setAttribute(k, attrs[k]); if (text) e.textContent = text; return e; }
  function subscribed() { try { return localStorage.getItem(FLAG) === "1"; } catch (e) { return false; } }
  function remember() { try { localStorage.setItem(FLAG, "1"); } catch (e) { /* private window: asked again next time */ } }

  // ── the footer form ─────────────────────────────────────────────────────────────────────────────────────────
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

  // ── the download gate ───────────────────────────────────────────────────────────────────────────────────────
  var open = null;   // the dialog that is showing, if any
  function startDownload(url) { if (typeof window.__startDownload === "function") return window.__startDownload(url); window.location.href = url; }   // the hook is a test seam

  function openGate(url) {
    if (open) return;
    var prevFocus = document.activeElement;
    var back = el("div", { "class": "dlg-back" });
    var dlg = el("div", { "class": "dlg", role: "dialog", "aria-modal": "true", "aria-labelledby": "dlg-title", "data-testid": "download-gate" });
    var close = el("button", { "class": "x", type: "button", "aria-label": "Close" }, "×");
    dlg.appendChild(close);
    dlg.appendChild(el("h2", { id: "dlg-title" }, "Download antiloki"));
    dlg.appendChild(el("p", {}, "Enter your email and the download starts. It also signs you up for antiloki's release news and offers, about one email every two weeks. Unsubscribe anytime; we never share your email."));
    var form = el("form", { novalidate: "" });
    var input = el("input", { type: "email", name: "email", required: "", placeholder: "you@email.com", autocomplete: "email", "aria-label": "Your email" });
    var go = el("button", { "class": "go", type: "submit" }, "Subscribe and download");
    var msg = el("div", { "class": "msg", role: "status", "aria-live": "polite" });
    form.appendChild(input); form.appendChild(go); form.appendChild(msg); dlg.appendChild(form);
    var fine = el("p", { "class": "fine" }); fine.appendChild(document.createTextNode("Buttondown sends a confirmation email first. See the "));
    fine.appendChild(el("a", { href: "/privacy.html" }, "privacy policy")); fine.appendChild(document.createTextNode(" for what happens to your address."));
    dlg.appendChild(fine);
    back.appendChild(dlg); document.body.appendChild(back); open = back;
    setTimeout(function () { input.focus(); }, 0);

    function shut() { if (open === back) { document.body.removeChild(back); open = null; document.removeEventListener("keydown", onKey, true); if (prevFocus && prevFocus.focus) { try { prevFocus.focus(); } catch (e) { /* gone */ } } } }
    function onKey(e) { if (e.key === "Escape") { e.preventDefault(); shut(); } }
    document.addEventListener("keydown", onKey, true);
    close.addEventListener("click", shut);
    back.addEventListener("mousedown", function (e) { if (e.target === back) shut(); });

    function done(text) {
      remember(); msg.className = "msg ok"; msg.textContent = text; go.disabled = true; input.disabled = true;
      startDownload(url); setTimeout(shut, 4000);
    }
    var carryOn = false;   // set when the sign-up service could not be reached: the button then means "I subscribed on Buttondown, carry on"
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (carryOn) { done("Thank you. Your download is starting."); return; }
      var v = (input.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { msg.className = "msg"; msg.textContent = "Please enter a valid email address to download."; input.focus(); return; }
      go.disabled = true; msg.className = "msg"; msg.textContent = "";
      var fd = new FormData(); fd.append("email", v); fd.append("tag", "download");
      if (!window.fetch) { carryOn = true; go.disabled = false; failed(); return; }
      // no-cors: the answer cannot be read, only that it was sent (Buttondown confirms by email)
      fetch(ACTION, { method: "POST", mode: "no-cors", body: fd }).then(function () { done("Check your inbox to confirm. Your download is starting."); }, function () { carryOn = true; go.disabled = false; failed(); });
    });
    function failed() {
      msg.className = "msg"; msg.textContent = "";
      msg.appendChild(document.createTextNode("We could not reach the sign-up service (an ad blocker can cause this). Subscribe on "));
      msg.appendChild(el("a", { href: BACKUP, target: "_blank", rel: "noopener" }, "buttondown.com/danjindev"));
      msg.appendChild(document.createTextNode(", then press the button to download."));
      go.textContent = "I subscribed, download";
    }
  }

  function gateClick(ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest("a[href]") : null;
    if (!a || !ASSET.test(a.getAttribute("href") || "")) return;
    if (subscribed()) return;                                 // already asked in this browser: the browser downloads it
    ev.preventDefault(); ev.stopPropagation();
    openGate(a.href);
  }

  function mount() {
    var spots = document.querySelectorAll("[data-newsletter]");
    var hasFooter = false;
    Array.prototype.forEach.call(spots, function (s) { var tag = s.getAttribute("data-newsletter") || "site"; if (tag === "footer") hasFooter = true; s.appendChild(build(tag)); });
    if (!hasFooter) {
      var foot = document.querySelector("footer .wrap") || document.querySelector("footer");
      if (foot) { var holder = el("div", { "class": "nl-footer", style: "flex-basis:100%;width:100%;order:-1;padding:6px 0 18px" }); holder.appendChild(build("footer")); foot.insertBefore(holder, foot.firstChild); }
    }
    document.addEventListener("click", gateClick, true);       // capture: before the link's own handling
    document.addEventListener("auxclick", gateClick, true);    // a middle click opens it in a new tab: ask there too
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
