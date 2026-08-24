/* Immersive stage controller for demo.html.
   Runs after prototype.js has mounted the phone and wired the state machine —
   this file only manages the stage around it: fit-to-viewport scaling, the
   notes drawer, true fullscreen, and fading the chrome when idle. */
(function () {
  var body = document.body;
  var floor = document.querySelector('.stage__floor');
  var phone = document.querySelector('.phone');
  if (!floor || !phone) return;

  // The phone's intrinsic box, borders included, straight from the DOM so it
  // stays correct if the device chrome is ever restyled.
  var cs = getComputedStyle(phone);
  var PW = phone.offsetWidth || 397;
  var PH = phone.offsetHeight || 748;

  var NOTES_W = 372;
  var notesOpen = false;

  // ------------------------------------------------------------ screen rail
  var SCREENS = [
    ['Billing push', 'Vehicle owner'],
    ['Activation', 'Vehicle owner'],
    ['Handoff & access', 'Vehicle owner'],
    ['Booking request', 'Vehicle owner'],
    ['Bill covered', 'Vehicle owner'],
    ['Host consent', 'Storage host']
  ];
  var dots = document.querySelectorAll('.dot');
  var rail = document.createElement('nav');
  rail.className = 'rail-screens';
  rail.setAttribute('aria-label', 'Screens');
  rail.innerHTML = '<div class="rail-screens__hd">Screens</div>';
  var rows = SCREENS.map(function (s, i) {
    var b = document.createElement('button');
    b.className = 'rs';
    b.innerHTML = '<span class="rs__n">' + (i + 1) + '</span><span>' + s[0] +
                  '<span class="rs__who">' + s[1] + '</span></span>';
    // Reuse the state machine rather than duplicating it: the dots already
    // own navigation, so drive them.
    b.addEventListener('click', function () { if (dots[i]) dots[i].click(); });
    rail.appendChild(b);
    return b;
  });
  document.querySelector('.stage').appendChild(rail);

  // Mirror whichever screen the state machine reports as active.
  function syncRail() {
    var on = document.querySelector('.scr.on');
    var n = on ? +on.getAttribute('data-screen') : 0;
    rows.forEach(function (r, i) { r.classList.toggle('on', i === n); });
  }
  new MutationObserver(syncRail).observe(document.querySelector('.phone'),
    { attributes: true, attributeFilter: ['class'], subtree: true });
  syncRail();

  // The controls ship inside the phone column, which stops lining up once the
  // device is transform-scaled (a transform doesn't change the layout box).
  // Dock them in the bottom HUD instead, where they belong on this page.
  var controls = document.querySelector('.controls');
  var bottom = document.querySelector('.hud--bottom');
  if (controls && bottom) bottom.insertBefore(controls, bottom.firstChild);

  function fit() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var top = document.querySelector('.hud--top');
    var bottom = document.querySelector('.hud--bottom');
    var chrome = (top ? top.offsetHeight : 0) + (bottom ? bottom.offsetHeight : 0);

    // Chrome overlays the stage, so only reserve enough that the device never
    // slides under the top or bottom bars.
    var availH = vh - Math.max(chrome, 96) - 16;
    var notesW = (notesOpen && vw > 900) ? NOTES_W : 0;
    var railW = (rail && vw > 1180) ? rail.offsetWidth : 0;
    var availW = vw - notesW - railW - 40;

    var s = Math.min(availH / PH, availW / PW);
    s = Math.max(0.46, Math.min(s, 1.7));
    body.style.setProperty('--fit', s.toFixed(3));
    body.style.setProperty('--notes-w', notesW + 'px');
    body.style.setProperty('--rail-w', railW + 'px');

    // keep the floating actor chip just above the scaled device
    var chip = document.querySelector('.actor-chip');
    if (chip) {
      var offset = (PH * s) / 2 + 16;
      chip.style.top = 'calc(50% - ' + Math.round(offset + chip.offsetHeight) + 'px)';
    }
  }

  // ---------------------------------------------------------- notes drawer
  var notesBtn = document.getElementById('notesBtn');
  function setNotes(open) {
    notesOpen = open;
    body.classList.toggle('notes-open', open);
    if (notesBtn) notesBtn.setAttribute('aria-pressed', String(open));
    fit();
  }
  if (notesBtn) notesBtn.addEventListener('click', function () { setNotes(!notesOpen); });

  // ------------------------------------------------------------ fullscreen
  var fsBtn = document.getElementById('fsBtn');
  var fsLabel = document.getElementById('fsLabel');
  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(function () {});
    }
  }
  if (fsBtn) fsBtn.addEventListener('click', toggleFs);
  document.addEventListener('fullscreenchange', function () {
    var on = !!document.fullscreenElement;
    if (fsLabel) fsLabel.textContent = on ? 'Exit full screen' : 'Full screen';
    if (fsBtn) fsBtn.setAttribute('aria-pressed', String(on));
    setTimeout(fit, 60);
  });
  // Safari/iOS and permission-blocked contexts have no Fullscreen API — hide
  // the control rather than offering a button that silently does nothing.
  if (fsBtn && !document.documentElement.requestFullscreen) fsBtn.hidden = true;

  // ------------------------------------------------------- idle chrome fade
  var idleTimer;
  function wake() {
    body.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { body.classList.add('idle'); }, 2600);
  }
  ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'].forEach(function (evt) {
    document.addEventListener(evt, wake, { passive: true });
  });
  wake();

  // ------------------------------------------------------------- shortcuts
  // Arrow keys and restart already belong to prototype.js; only add what the
  // stage itself owns, and stay out of the way of typing.
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key.toLowerCase();
    if (k === 'n') { setNotes(!notesOpen); e.preventDefault(); }
    if (k === 'f') { toggleFs(); e.preventDefault(); }
  });

  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', function () { setTimeout(fit, 120); });
  // Belt and braces: mobile browsers collapsing their URL bar change the
  // viewport without reliably firing `resize`, and embedded viewers may not
  // fire it at all. Observing the root element catches both.
  if (window.ResizeObserver) new ResizeObserver(fit).observe(document.documentElement);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  // Notes are worth showing by default only when there is room beside the phone.
  setNotes(window.innerWidth >= 1180);
  fit();
})();
