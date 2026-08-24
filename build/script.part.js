(function () {
  // The pretend storage record every "pre-filled" field renders from.
  var VEHICLE = { vname: 'Winnebago Minnie', vshort: 'Minnie', vclass: 'Class C', vlen: '25 ft',
    vphotos: '6', vlot: "Emery's lot · Millcreek, UT", vlotshort: "Emery's lot", bill: 185, host: 'Emery S.' };
  var S = { screen: 0, handoff: 'host', days: { Su: false, Mo: true, Tu: true, We: true, Th: true, Fr: true, Sa: true }, consented: false };

  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
  var MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var MOFULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // Dynamic trip dates: ~3 weeks out, 4 nights, so the demo stays plausible on any day.
  var now = new Date();
  var start = new Date(now.getTime() + 19 * 864e5), end = new Date(start.getTime() + 4 * 864e5);
  var dates = start.getMonth() === end.getMonth()
    ? MO[start.getMonth()] + ' ' + start.getDate() + '–' + end.getDate()
    : MO[start.getMonth()] + ' ' + start.getDate() + ' – ' + MO[end.getMonth()] + ' ' + end.getDate();
  VEHICLE.dates = dates;
  var m1 = MOFULL[(end.getMonth() + 1) % 12], m2 = MOFULL[(end.getMonth() + 2) % 12];

  $$('[data-bind]').forEach(function (el) { var v = VEHICLE[el.getAttribute('data-bind')]; if (v != null) el.textContent = v; });
  $('coversLine').innerHTML = 'Accepting covers your storage bill <b>through ' + m2 + '</b> — credited automatically.';
  $('coveredSub').textContent = "Marcus's trip clears your " + m1 + ' and ' + m2 + ' storage bills — credited automatically.';

  // Clock chrome
  function fmtTime(d) { var h = d.getHours() % 12 || 12, m = d.getMinutes(); return h + ':' + (m < 10 ? '0' : '') + m; }
  var DAYS_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  $('lockTime').textContent = fmtTime(now);
  $('lockDate').textContent = DAYS_FULL[now.getDay()] + ', ' + MOFULL[now.getMonth()] + ' ' + now.getDate();
  ['t1','t2','t3','t4','t5'].forEach(function (id) { $(id).textContent = fmtTime(now); });

  // Presenter notes per screen
  var NOTES = [
    { t: 'The wedge', b: 'Neighbor owns the one moment no rental marketplace can buy: the monthly bill for an idle vehicle. Naming the asset and using the past conditional — <b>“could have earned”</b> — turns a routine charge into regret. Loss aversion, not income appeal.', pm: 'Anchor moment beat post-booking and search badges in the tradeoff: the bill is recurring, emotional, and 100% Neighbor-owned.' },
    { t: 'The data advantage, visible', b: 'Three of four steps arrive <b>already done</b> — pulled live from the storage record (watch the fields; they render from one JS object). A ~20-minute RVshare listing becomes a 90-second confirmation.', pm: 'Every green check is a form the owner never fills in. Activation rate is the north star; pre-fill is its biggest lever.' },
    { t: 'The depot advantage, priced', b: "Emery — the storage host — is the <b>default key-handler</b>, and the labor is priced, not assumed: $12 per handoff plus on-site add-ons. Self-handoff exists for owners who live close. <b>Try selecting it</b> — the payout math on the next screen follows.", pm: 'This is the screen Outdoorsy cannot ship: they have no one at the lot to hand over the keys.' },
    { t: 'Offset math at decision time', b: 'The price panel reuses Neighbor’s green was/now pricing language, but the closing line is the product thesis: <b>accepting makes the storage bill disappear</b>. The notification’s 24-hour window is Neighbor’s real auto-decline rule, and its dollar figure reflects your handoff choice on screen 3.', pm: 'Renter pays $580 · Emery earns $48 · Neighbor takes $58 — every party in the three-sided market is paid on one receipt.' },
    { t: 'The retention metric', b: 'The flip — <b>−$185/mo becoming $0/mo</b> — is the whole pitch in one animation, in Neighbor’s own discount-green. A storage bill at $0 is a subscription that cannot churn.', pm: '“Offset ratio” — share of storage bills covered by rentals — is a metric no competitor can even compute.' },
    { t: 'The screen that makes it launchable', b: 'Rewind three weeks, to Emery’s phone: <b>consent ships first</b>. Strangers on the lot is the storage host’s biggest fear, so opt-in is paid, veto is kept per-request, and the ask uses Neighbor’s quiet vouch pattern — no “New feature!” banner.', pm: 'Three-sided marketplaces die at the weakest side. Host opt-out rate is the guardrail metric — watched weekly.' }
  ];

  var screens = $$('.scr'), dotsWrap = $('dots'), dots = [];
  for (var i = 0; i < 6; i++) {
    var d = document.createElement('button');
    d.className = 'dot'; d.setAttribute('aria-label', 'Screen ' + (i + 1));
    d.title = ['Push','Activate','Handoff','Request','Covered','Host consent'][i];
    (function (n) { d.addEventListener('click', function () { go(n); }); })(i);
    dotsWrap.appendChild(d); dots.push(d);
  }

  var bannerTimer = null;
  function payout() { return S.handoff === 'host' ? 474 : 522; }
  function renderRequest() {
    $('hostFeeRow').style.display = S.handoff === 'host' ? 'flex' : 'none';
    $('youEarn').textContent = '$' + payout();
    $('bannerAmt').textContent = '$' + payout();
    $('pickupLine').textContent = (S.handoff === 'host' ? 'Handoff by Emery S. at the lot' : 'You hand off at the lot') + ' · 2:00 PM';
    var rt = new Date();
    $('reqTime').textContent = 'Received today at ' + fmtTime(rt) + (rt.getHours() < 12 ? ' AM' : ' PM')
      + ' · respond within 24 hours';
  }
  function dayCount() { var n = 0; for (var k in S.days) if (S.days[k]) n++; return n; }
  function stateText() {
    return 'live state · handoff: ' + (S.handoff === 'host' ? 'Emery S.' : 'self') + ' · pickup days: ' + dayCount() + '/7 · payout: $' + payout() + (S.consented ? ' · host: opted in' : '');
  }

  function go(n, opts) {
    opts = opts || {};
    S.screen = n;
    clearTimeout(bannerTimer);
    var reqScr = screens[3], banner = $('inbanner');
    if (n === 3) {
      renderRequest();
      if (opts.viaSave) {
        reqScr.classList.remove('req'); banner.classList.remove('in');
        bannerTimer = setTimeout(function () { banner.classList.add('in'); }, 1500);
      } else { reqScr.classList.add('req'); banner.classList.remove('in'); }
    } else { banner.classList.remove('in'); }
    screens.forEach(function (s, i) { s.classList.toggle('on', i === n); });
    dots.forEach(function (d, i) { d.classList.toggle('on', i === n); });
    if (n === 4) { var f = $('flip'); f.classList.remove('go'); void f.offsetWidth; setTimeout(function () { f.classList.add('go'); }, 60); }
    var host = n === 5;
    $('actorChip').classList.toggle('host', host);
    $('actorTxt').textContent = host ? "Emery's phone — storage host, three weeks earlier" : "Vehicle owner's phone";
    $('nStep').textContent = 'Screen ' + (n + 1) + ' of 6';
    $('nTitle').textContent = NOTES[n].t;
    $('nBody').innerHTML = NOTES[n].b;
    $('nPm').innerHTML = NOTES[n].pm;
    $('stateLine').textContent = stateText();
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-go]');
    if (el) {
      var n = +el.getAttribute('data-go');
      var fromJourney = el.classList.contains('thumb');
      go(n, { viaSave: !fromJourney && el.textContent.indexOf('Save') > -1 });
      if (fromJourney) document.querySelector('.proto').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (e.target.closest('[data-req]')) { clearTimeout(bannerTimer); screens[3].classList.add('req'); $('inbanner').classList.remove('in'); renderRequest(); $('stateLine').textContent = stateText(); }
  });

  // Handoff radio cards + day pills (screen 3)
  function pickHandoff(which) {
    S.handoff = which;
    $('ho-host').classList.toggle('nb-radio-card--selected', which === 'host');
    $('ho-self').classList.toggle('nb-radio-card--selected', which === 'self');
    $('stateLine').textContent = stateText();
  }
  $('ho-host').addEventListener('click', function () { pickHandoff('host'); });
  $('ho-self').addEventListener('click', function () { pickHandoff('self'); });

  var DAY_KEYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  DAY_KEYS.forEach(function (k) {
    var b = document.createElement('button');
    b.className = 'day' + (S.days[k] ? ' on' : ''); b.textContent = k[0] === 'T' || k[0] === 'S' ? k : k[0];
    b.textContent = { Su: 'S', Mo: 'M', Tu: 'T', We: 'W', Th: 'T', Fr: 'F', Sa: 'S' }[k];
    b.setAttribute('aria-pressed', String(S.days[k])); b.title = k;
    b.addEventListener('click', function () {
      S.days[k] = !S.days[k]; b.classList.toggle('on', S.days[k]);
      b.setAttribute('aria-pressed', String(S.days[k])); $('stateLine').textContent = stateText();
    });
    $('days').appendChild(b);
  });

  $('consentBtn').addEventListener('click', function () {
    S.consented = true;
    this.style.display = 'none'; $('consentDone').style.display = 'block';
    $('stateLine').textContent = stateText();
  });
  $('backBtn').addEventListener('click', function () { go(Math.max(0, S.screen - 1)); });
  $('restartBtn').addEventListener('click', function () {
    S.handoff = 'host'; S.consented = false;
    pickHandoff('host');
    $('consentBtn').style.display = ''; $('consentDone').style.display = 'none';
    screens[3].classList.remove('req');
    go(0);
  });

  // Arrow keys drive the prototype while it's on screen
  var protoInView = false;
  new IntersectionObserver(function (es) { es.forEach(function (en) { protoInView = en.isIntersecting; }); }, { threshold: 0.15 })
    .observe(document.getElementById('s3'));
  document.addEventListener('keydown', function (e) {
    if (!protoInView || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowRight') { go(Math.min(5, S.screen + 1)); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { go(Math.max(0, S.screen - 1)); e.preventDefault(); }
  });

  // Rail scroll-spy
  var links = $$('.rail__link');
  new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('on', l.getAttribute('href') === '#' + en.target.id); });
    });
  }, { rootMargin: '-20% 0px -65% 0px' }).observe(document.getElementById('s1'));
  ['s2','s3','s4','s5','s6'].forEach(function (id) {
    new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('on', l.getAttribute('href') === '#' + id); });
      });
    }, { rootMargin: '-20% 0px -65% 0px' }).observe(document.getElementById(id));
  });

  go(0);
})();