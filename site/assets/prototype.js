/* Neighbor Rental-Ready — shared prototype: markup + state machine.
   Mounted into #proto-mount on BOTH the walkthrough and the standalone page,
   so every line of screen copy lives in exactly one place. */

var NB_PHONE_HTML = `      <div class="proto">
        <div class="phone-col">
          <div class="actor-chip" id="actorChip"><i></i><span id="actorTxt">Vehicle owner's phone</span></div>
          <div class="phone-scale">
          <div class="phone">
            <div class="notch"></div>

            <!-- Screen 1 · Lock screen push -->
            <div class="scr scr--lock" data-screen="0">
              <div class="sbar" style="color:#fff"><span></span><svg width="54" height="12" style="color:#fff"><use href="#i-sb"/></svg></div>
              <div class="lock-date" id="lockDate">Monday, August 24</div>
              <div class="lock-time" id="lockTime">9:41</div>
              <button class="push tap-hint" data-go="1">
                <span class="push__icon"><svg width="22" height="22"><use href="#i-house"/></svg></span>
                <span style="flex:1">
                  <span class="push__meta"><span>NEIGHBOR</span><span>now</span></span>
                  <span class="push__title">Your <span data-bind="vshort">Minnie</span> cost you $185 this month.</span>
                  <span class="push__body">It could have earned $474 instead.</span>
                </span>
              </button>
              <div class="lock-foot"><span>Tap the notification</span><div class="homebar"></div></div>
            </div>

            <!-- Screen 2 · Activation, pre-filled -->
            <div class="scr" data-screen="1">
              <div class="sbar"><span id="t1">9:41</span><svg width="54" height="12" style="color:#232323"><use href="#i-sb"/></svg></div>
              <div class="nb-flow-header">
                <div class="nb-flow-header__title">Enable rental</div>
                <div class="nb-flow-progress"><div class="nb-flow-progress__fill" style="transform:scaleX(0.4)"></div></div>
              </div>
              <div class="scr-body">
                <h1 class="scr-h1">Your <span data-bind="vname">Winnebago Minnie</span> is ready to rent.</h1>
                <p class="scr-sub">We pre-filled your listing from your storage reservation. Confirm one thing and you're live.</p>
                <div class="nb-step-row nb-step-row--done"><span class="nb-step-row__icon"><svg width="18" height="18" style="color:var(--nb-green)"><use href="#i-check"/></svg></span><span class="nb-step-row__label">Vehicle info<br><small style="font-weight:400;color:var(--nb-text-muted)"><span data-bind="vname">Winnebago Minnie</span> · <span data-bind="vclass">Class C</span> · <span data-bind="vlen">25 ft</span></small></span></div>
                <div class="nb-step-row nb-step-row--done"><span class="nb-step-row__icon"><svg width="18" height="18" style="color:var(--nb-green)"><use href="#i-check"/></svg></span><span class="nb-step-row__label">Photos<br><small style="font-weight:400;color:var(--nb-text-muted)"><span data-bind="vphotos">6</span> photos from your storage listing</small></span></div>
                <div class="nb-step-row nb-step-row--done"><span class="nb-step-row__icon"><svg width="18" height="18" style="color:var(--nb-green)"><use href="#i-check"/></svg></span><span class="nb-step-row__label">Location<br><small style="font-weight:400;color:var(--nb-text-muted)"><span data-bind="vlot">Emery's lot · Millcreek, UT</span></small></span></div>
                <button class="nb-step-row tap-hint" data-go="2" style="width:100%;background:none;border:none;border-bottom:1px solid var(--nb-border);text-align:left;cursor:pointer;font-family:var(--nb-font-body);font-size:16px">
                  <span class="nb-step-row__icon"><svg width="18" height="18"><use href="#i-key"/></svg></span>
                  <span class="nb-step-row__label">Access &amp; handoff</span>
                  <span class="nb-step-row__cta">Start ›</span>
                </button>
                <div class="offset-card">A typical booking pays you <b>≈&nbsp;$474</b> — your <span class="was">$185/mo</span> storage bill, covered <b>2½×&nbsp;over</b>.</div>
              </div>
            </div>

            <!-- Screen 3 · Handoff & access -->
            <div class="scr" data-screen="2">
              <div class="sbar"><span id="t2">9:41</span><svg width="54" height="12" style="color:#232323"><use href="#i-sb"/></svg></div>
              <div class="nb-flow-header">
                <div class="nb-flow-header__title">Enable rental</div>
                <div class="nb-flow-progress"><div class="nb-flow-progress__fill" style="transform:scaleX(0.75)"></div></div>
              </div>
              <div class="scr-body">
                <h1 class="scr-h1">Who hands over the keys?</h1>
                <div class="nb-radio-card nb-radio-card--selected" id="ho-host" style="margin-bottom:10px">
                  <span class="nb-radio-card__dot"></span>
                  <span style="flex:1">
                    <span style="font-weight:600;display:block">Your storage host — Emery S.</span>
                    <span style="font-size:13px;line-height:18px;color:var(--nb-text-muted);display:block;margin-top:2px">Emery opted in to handoffs on this lot. Earns $12 per handoff + $20/day for on-site add-ons.</span>
                  </span>
                </div>
                <div class="nb-radio-card" id="ho-self">
                  <span class="nb-radio-card__dot"></span>
                  <span style="flex:1">
                    <span style="font-weight:600;display:block">You handle handoffs yourself</span>
                    <span style="font-size:13px;line-height:18px;color:var(--nb-text-muted);display:block;margin-top:2px">Best if you live within ~20 minutes of the lot. You keep the handoff fee.</span>
                  </span>
                </div>
                <div class="field-label">When can renters pick up?</div>
                <div class="days" id="days"></div>
                <div class="nb-info-tip" style="margin-top:12px">
                  <svg class="nb-info-tip__icon" width="17" height="17"><use href="#i-bulb"/></svg>
                  <span>Vehicles available <strong>6+ days a week</strong> get booked <strong>3× more often</strong>.</span>
                </div>
                <div class="scr-ctas">
                  <button class="nb-btn-primary nb-btn-primary--block" data-go="3">Save &amp; continue</button>
                  <button class="nb-btn-text">Skip for now →</button>
                </div>
              </div>
            </div>

            <!-- Screen 4 · Listing live → booking request arrives -->
            <div class="scr" data-screen="3">
              <div class="sbar"><span id="t3">9:41</span><svg width="54" height="12" style="color:#232323"><use href="#i-sb"/></svg></div>
              <button class="inbanner" id="inbanner" data-req="1">
                <span class="push__icon" style="flex-basis:34px;width:34px;height:34px"><svg width="19" height="19"><use href="#i-house"/></svg></span>
                <span style="flex:1">
                  <span class="push__meta"><span>NEIGHBOR</span><span>now</span></span>
                  <span class="push__title">New booking request 🎉</span>
                  <span class="push__body"><span id="bannerAmt">$474</span> to you. Respond within 24 hours.</span>
                </span>
              </button>
              <div class="v-splash splash scr-body">
                <div><span class="bigcheck"><svg width="34" height="34"><use href="#i-check"/></svg></span></div>
                <h1 class="scr-h1">Your <span data-bind="vname">Winnebago Minnie</span> is live.</h1>
                <p class="scr-sub" style="max-width:30ch;margin:0 auto">Bookable at <span data-bind="vlotshort">Emery's lot</span>. We'll ping you the moment a request comes in.</p>
              </div>
              <div class="v-req scr-body">
                <div class="nb-flow-header" style="margin-top:-8px"><div class="nb-flow-header__title">Booking request</div></div>
                <div class="renter-row" style="margin-top:16px">
                  <span class="avatar">MC</span>
                  <span class="renter-row__meta"><b>Marcus C.</b>Verified renter · <svg width="12" height="12" style="color:var(--nb-star);vertical-align:-1px"><use href="#i-star"/></svg> 4.9 · 23 trips</span>
                </div>
                <div class="trip-card">
                  <b><span data-bind="dates">Sep 12–16</span> · 4 nights</b> · <span data-bind="vname">Winnebago Minnie</span>
                  <small id="pickupLine">Handoff by Emery S. at the lot · Fri 2:00 PM</small>
                  <small id="reqTime">Received today at 9:41 AM</small>
                </div>
                <div class="nb-price-panel" style="padding:16px 20px">
                  <div class="nb-price-panel__row"><span class="nb-price-panel__label">Renter pays · 4 nights × $145</span><span class="nb-price-panel__value-now">$580</span></div>
                  <div class="nb-price-panel__row" id="hostFeeRow"><span class="nb-price-panel__label">Handoff host (Emery S.)</span><span class="nb-price-panel__label num">− $48</span></div>
                  <div class="nb-price-panel__row"><span class="nb-price-panel__label">Neighbor service fee ⓘ</span><span class="nb-price-panel__label num">− $58</span></div>
                  <div class="nb-price-panel__row nb-price-panel__total"><span class="nb-price-panel__label" style="font-weight:600">You earn</span><span class="nb-price-panel__value-now" id="youEarn">$474</span></div>
                </div>
                <div class="covers">
                  <svg width="15" height="15" style="color:var(--nb-green);flex:0 0 15px;margin-top:2px"><use href="#i-check"/></svg>
                  <span id="coversLine">Accepting covers your storage bill <b>through November</b> — credited automatically.</span>
                </div>
                <div class="scr-ctas" style="padding-top:4px">
                  <button class="nb-btn-primary nb-btn-primary--block" data-go="4">Accept booking</button>
                  <button class="nb-btn-text" style="color:var(--nb-text-muted)">Decline</button>
                  <div class="price-note">Payout via Stripe after pickup · $1M protection included</div>
                </div>
              </div>
            </div>

            <!-- Screen 5 · Covered -->
            <div class="scr" data-screen="4">
              <div class="sbar"><span id="t4">9:41</span><svg width="54" height="12" style="color:#232323"><use href="#i-sb"/></svg></div>
              <div class="scr-body splash">
                <div><span class="bigcheck"><svg width="34" height="34"><use href="#i-check"/></svg></span></div>
                <h1 class="scr-h1">You're rental-ready.</h1>
                <p class="scr-sub" style="max-width:32ch;margin:0 auto" id="coveredSub">Marcus's trip clears your October and November storage bills — credited automatically.</p>
                <div class="flip-stage">
                  <div class="flip" id="flip">
                    <div class="flip__face flip__face--before"><span class="flip__label">Storage bill</span><span class="flip__amt">−$185/mo</span></div>
                    <div class="flip__face flip__face--after"><span class="flip__label">Storage bill — covered ✓</span><span class="flip__amt">$0/mo</span></div>
                  </div>
                </div>
                <p class="micro-note">We'll text you the departure-day checklist before pickup.</p>
                <div class="scr-ctas">
                  <button class="nb-btn-primary nb-btn-primary--block" data-go="5">Done</button>
                </div>
              </div>
            </div>

            <!-- Screen 6 · Storage-host consent (Emery's phone) -->
            <div class="scr" data-screen="5">
              <div class="sbar"><span id="t5">9:41</span><svg width="54" height="12" style="color:#232323"><use href="#i-sb"/></svg></div>
              <div class="nb-flow-header"><div class="nb-flow-header__title">Hosting</div></div>
              <div class="scr-body">
                <div class="keyart"><span style="width:64px;height:64px;border-radius:50%;background:var(--nb-blue-info-bg);display:inline-flex;align-items:center;justify-content:center"><svg width="30" height="30"><use href="#i-key"/></svg></span></div>
                <h1 class="scr-h1" style="text-align:center">Allow rental handoffs on your lot?</h1>
                <div class="nb-info-tip" style="margin:8px 0 16px">
                  <svg class="nb-info-tip__icon" width="17" height="17"><use href="#i-bulb"/></svg>
                  <span>Hosts who opt in earn <strong>$40–120 more per month</strong> and rank higher in search. You approve or decline <strong>every</strong> handoff request.</span>
                </div>
                <div class="nb-testimonial">
                  <span class="avatar avatar--sm nb-testimonial__avatar" style="background:var(--nb-green-tint);color:var(--nb-green)">DR</span>
                  <span class="nb-testimonial__body">
                    <span class="nb-testimonial__head"><span class="nb-testimonial__name">Dana R.</span><span class="nb-testimonial__tag">EXAMPLE</span></span>
                    <span class="nb-testimonial__quote">"I say yes to about 4 handoffs a month and it pays for our streaming subscriptions and then some."</span>
                  </span>
                </div>
                <div class="scr-ctas">
                  <div class="done-strip" id="consentDone" style="display:none;width:100%">You're a Handoff Host ✓ &nbsp;·&nbsp; +$12 per handoff</div>
                  <button class="nb-btn-primary nb-btn-primary--block" id="consentBtn">Allow handoffs on my lot</button>
                  <button class="nb-btn-text">Not for me →</button>
                  <p class="micro-note">You can change this any time in Settings.</p>
                </div>
              </div>
            </div>

          </div><!-- /.phone -->
          </div><!-- /.phone-scale -->
          <div class="controls">
            <button class="ctrl-btn" id="backBtn">‹ Back</button>
            <div class="dots" id="dots"></div>
            <button class="ctrl-btn" id="restartBtn">↻ Restart</button>
          </div>
        </div><!-- /.phone-col -->

        <aside class="notes" aria-live="polite">
          <span class="notes__tag">Presenter notes</span>
          <div class="notes__step" id="nStep">Screen 1 of 6</div>
          <h3 id="nTitle">The wedge</h3>
          <p id="nBody">…</p>
          <div class="notes__pm" id="nPm">…</div>
          <div class="state-line" id="stateLine"></div>
        </aside>
      </div><!-- /.proto -->`;

(function () {
  var mount = document.getElementById('proto-mount');
  if (mount) mount.innerHTML = NB_PHONE_HTML;
})();

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
  // On the standalone page the prototype IS the page, so keys are always live.
  var s3 = document.getElementById('s3');
  var protoInView = !s3;
  if (s3) new IntersectionObserver(function (es) { es.forEach(function (en) { protoInView = en.isIntersecting; }); }, { threshold: 0.15 }).observe(s3);
  document.addEventListener('keydown', function (e) {
    if (!protoInView || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowRight') { go(Math.min(5, S.screen + 1)); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { go(Math.max(0, S.screen - 1)); e.preventDefault(); }
  });

  // Rail scroll-spy — walkthrough only
  if (document.querySelector('.rail__link')) {
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
  }

  go(0);
})();