// Tests the footer form and the DOWNLOAD GATE in newsletter.js with jsdom. Run:  node scripts/test-newsletter.cjs
// jsdom comes from the front-end repo's node_modules (override with JSDOM_PATH).
const path = require("path"), fs = require("fs");
const { JSDOM } = require(process.env.JSDOM_PATH || path.join(__dirname, "..", "..", "antiloki-v3-FE", "node_modules", "jsdom"));
const src = fs.readFileSync(path.join(__dirname, "..", "newsletter.js"), "utf8");
const EXE = "https://github.com/antiloki/antiloki-releases/releases/download/v0.5.4.3/antiloki_0.5.5-4.3_x64-setup.exe";
let failures = 0; const ok = (c, m) => { if (!c) { failures++; console.error("FAIL:", m); } else console.log("ok  :", m); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function page(opts = {}) {
  const dom = new JSDOM(`<!doctype html><html><head></head><body><a id="exe" href="${EXE}">Windows</a><a id="deb" href="https://github.com/antiloki/antiloki-releases/releases/download/v0.5.4.3/antiloki_0.5.5-4.3_amd64.deb">Linux</a>` +
    `<a id="list" href="/releases.html">all</a><a id="gh" href="https://github.com/antiloki/antiloki-releases/releases">releases</a><a id="priv" href="/privacy.html">privacy</a><footer><div class="wrap"><span>x</span></div></footer></body></html>`,
    { runScripts: "outside-only", pretendToBeVisual: true, url: "https://antiloki.com/" });
  const w = dom.window, fetches = [], started = [];
  w.__startDownload = (u) => started.push(u);
  w.fetch = (url, o) => { fetches.push([url, o.method, o.mode, [...o.body.entries()]]); return opts.failFetch ? Promise.reject(new Error("blocked")) : Promise.resolve({}); };
  if (opts.flag) w.localStorage.setItem("antiloki:dl-subscribed", "1");
  w.eval(src);
  return { w, d: w.document, fetches, started, click: (id, type = "click") => { const e = new w.MouseEvent(type, { bubbles: true, cancelable: true }); w.document.getElementById(id).dispatchEvent(e); return e; } };
}

(async () => {
  // the footer form is still there
  { const p = await (async () => { const x = page(); await wait(30); return x; })();
    ok(!!p.d.querySelector('.nl[data-spot="footer"] form'), "the footer form is on the page"); }

  // an installer click, not yet subscribed: the dialog opens and nothing downloads
  { const p = page(); await wait(30);
    const e = p.click("exe");
    ok(e.defaultPrevented, "a click on an installer link is stopped");
    const dlg = p.d.querySelector('[role="dialog"]');
    ok(!!dlg && dlg.getAttribute("aria-modal") === "true", "a modal dialog opens");
    ok(/signs you up/.test(dlg.textContent) && /Unsubscribe anytime/.test(dlg.textContent), "it says in plain words that the email subscribes them");
    ok(p.started.length === 0 && p.fetches.length === 0, "nothing is downloaded or sent yet");

    // an invalid email
    const input = dlg.querySelector('input[type="email"]'), form = dlg.querySelector("form");
    input.value = "not-an-email"; form.dispatchEvent(new p.w.Event("submit", { cancelable: true, bubbles: true })); await wait(10);
    ok(/valid email/.test(dlg.textContent) && p.started.length === 0 && p.fetches.length === 0, "an invalid email is refused, nothing sent, no download");

    // a valid email: subscribed, then the download starts
    input.value = "a@b.co"; form.dispatchEvent(new p.w.Event("submit", { cancelable: true, bubbles: true })); await wait(30);
    ok(p.fetches.length === 1 && p.fetches[0][0] === "https://buttondown.com/api/emails/embed-subscribe/danjindev" && p.fetches[0][1] === "POST" && p.fetches[0][2] === "no-cors", "the address is posted once to Buttondown");
    const body = Object.fromEntries(p.fetches[0][3]); ok(body.email === "a@b.co" && body.tag === "download", "with the email and the tag 'download'");
    ok(p.started.length === 1 && p.started[0] === EXE, "then the download of that very installer starts");
    ok(/Check your inbox to confirm/.test(dlg.textContent), "it says to check the inbox to confirm");
    ok(p.w.localStorage.getItem("antiloki:dl-subscribed") === "1" && !JSON.stringify(Object.assign({}, p.w.localStorage)).includes("a@b.co"), "a flag is remembered, never the address");

    // the next click in the same browser is not gated
    const dlgs = () => p.d.querySelectorAll('[role="dialog"]').length;
    p.d.querySelector(".dlg .x").click();
    const e2 = p.click("deb"); ok(!e2.defaultPrevented && dlgs() === 0, "the second installer click goes straight through");
  }

  // links that are not installers are left alone
  { const p = page(); await wait(30);
    for (const id of ["list", "gh", "priv"]) { const e = p.click(id); ok(!e.defaultPrevented, id + " is not an installer link: not gated"); }
    ok(p.d.querySelectorAll('[role="dialog"]').length === 0, "no dialog for them");
  }

  // Esc closes the dialog and the download does not start
  { const p = page(); await wait(30); p.click("exe");
    p.d.dispatchEvent(new p.w.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })); await wait(10);
    ok(p.d.querySelectorAll('[role="dialog"]').length === 0 && p.started.length === 0, "Esc closes the dialog and the download does not start");
  }

  // a middle click is gated too
  { const p = page(); await wait(30); const e = p.click("exe", "auxclick");
    ok(e.defaultPrevented && p.d.querySelectorAll('[role="dialog"]').length === 1, "a middle click on an installer is gated too");
  }

  // the sign-up service cannot be reached: not locked out
  { const p = page({ failFetch: true }); await wait(30); p.click("exe");
    const dlg = p.d.querySelector('[role="dialog"]'), input = dlg.querySelector('input[type="email"]'), form = dlg.querySelector("form");
    input.value = "x@y.zz"; form.dispatchEvent(new p.w.Event("submit", { cancelable: true, bubbles: true })); await wait(30);
    ok(/could not reach/.test(dlg.textContent) && !!dlg.querySelector('a[href="https://buttondown.com/danjindev"]') && p.started.length === 0, "a blocked sign-up shows the Buttondown link and does not download yet");
    ok(dlg.querySelector(".go").textContent === "I subscribed, download", "the button now offers to carry on");
    form.dispatchEvent(new p.w.Event("submit", { cancelable: true, bubbles: true })); await wait(10);
    ok(p.started.length === 1 && p.started[0] === EXE, "carrying on starts the download, so a person with an ad blocker is not locked out");
  }

  // pages no longer carry the after-download form
  for (const f of ["releases.html", "index.html"]) {
    const html = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
    ok(!html.includes('data-newsletter="download"'), f + " has no after-download form (the gate replaced it)");
  }
  ok(/signs you up|sign.*up/i.test(fs.readFileSync(path.join(__dirname, "..", "privacy.html"), "utf8")) && /Before the first download/.test(fs.readFileSync(path.join(__dirname, "..", "privacy.html"), "utf8")), "the privacy policy says the download enters the list");

  console.log(failures ? `\n${failures} FAILED` : "\nall site newsletter checks pass"); process.exit(failures ? 1 : 0);
})();
