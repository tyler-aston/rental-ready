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

  // ------------------------------------------------------------ Next button
  // "Next" performs whatever the current screen's own primary action is, so it
  // matches what tapping the screen would do rather than skipping past it. On a
  // phone that matters: without it you have to know to tap the notification.
  function current() {
    var on = document.querySelector('.scr.on');
    return on ? +on.getAttribute('data-screen') : 0;
  }
  function primaryAction() {
    var n = current();
    var scr = document.querySelector('[data-screen="' + n + '"]');
    if (!scr) return null;
    if (n === 0) return scr.querySelector('.push');
    if (n === 3) {
      // Two beats on this screen: the request arrives, then you accept it.
      // Clicking the banner programmatically also skips its arrival delay.
      if (!scr.classList.contains('req')) return document.getElementById('inbanner');
      return scr.querySelector('[data-go="4"]');
    }
    if (n === 5) {
      var consent = document.getElementById('consentBtn');
      return (consent && consent.style.display !== 'none') ? consent : null;
    }
    return scr.querySelector('[data-go]');
  }

  var nextBtn = document.createElement('button');
  nextBtn.className = 'ctrl-btn ctrl-next';
  nextBtn.id = 'nextBtn';
  nextBtn.textContent = 'Next ›';
  nextBtn.addEventListener('click', function () {
    var el = primaryAction();
    if (el) el.click();
  });
  var restart = document.getElementById('restartBtn');
  if (restart && restart.parentNode) restart.parentNode.insertBefore(nextBtn, restart.nextSibling);

  // Mirror whichever screen the state machine reports as active.
  function syncUI() {
    var n = current();
    rows.forEach(function (r, i) { r.classList.toggle('on', i === n); });
    var el = primaryAction();
    nextBtn.disabled = !el;
    nextBtn.title = el ? 'Do this screen’s next step' : 'End of the flow';
  }
  new MutationObserver(syncUI).observe(document.querySelector('.phone'),
    { attributes: true, attributeFilter: ['class', 'style'], subtree: true });
  document.addEventListener('click', function () { setTimeout(syncUI, 0); });
  syncUI();

  // The controls ship inside the phone column, which stops lining up once the
  // device is transform-scaled (a transform doesn't change the layout box).
  // Dock them in the bottom HUD instead, where they belong on this page.
  var controls = document.querySelector('.controls');
  var bottom = document.querySelector('.hud--bottom');
  if (controls && bottom) bottom.insertBefore(controls, bottom.firstChild);

  var chip = document.querySelector('.actor-chip');

  function fit() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var top = document.querySelector('.hud--top');
    var bottom = document.querySelector('.hud--bottom');
    // offsetHeight is 0 when a bar is display:none, which is exactly what we
    // want — on narrow screens the top bar is gone and the device gets its space.
    var topH = top ? top.offsetHeight : 0;
    var botH = bottom ? bottom.offsetHeight : 0;
    var chipH = chip ? chip.offsetHeight : 0;

    // Reserve the chip's space at the TOP only. Centring the device in the
    // whole viewport and merely shrinking it splits the reclaimed space above
    // and below equally, which still lets the chip ride up into the top bar.
    var padTop = topH + chipH + 14;
    var padBot = botH + 8;
    var band = vh - padTop - padBot;

    var notesW = (notesOpen && vw > 900) ? NOTES_W : 0;
    var railW = (rail && vw > 1180) ? rail.offsetWidth : 0;
    var availW = vw - notesW - railW - 40;

    var s = Math.min(band / PH, availW / PW);
    s = Math.max(0.46, Math.min(s, 1.7));

    body.style.setProperty('--fit', s.toFixed(3));
    body.style.setProperty('--notes-w', notesW + 'px');
    body.style.setProperty('--rail-w', railW + 'px');
    body.style.setProperty('--pad-top', padTop + 'px');
    body.style.setProperty('--pad-bot', padBot + 'px');

    // Park the chip directly above the device's real (scaled) box.
    if (chip) {
      var phoneTop = padTop + (band - PH * s) / 2;
      chip.style.top = Math.round(Math.max(topH + 4, phoneTop - chipH - 10)) + 'px';
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
  [notesBtn, document.getElementById('notesBtnM')].forEach(function (b) {
    if (b) b.addEventListener('click', function () { setNotes(!notesOpen); });
  });

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
  // Only on pointer devices. On a touchscreen there is no hover to wake the
  // chrome back up, so fading it would strand the reader with the controls —
  // including Next — invisible until they guessed to tap the screen.
  var canFade = window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var idleTimer;
  function wake() {
    body.classList.remove('idle');
    clearTimeout(idleTimer);
    if (!canFade) return;
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
  // fire it at all. Observing the body catches both (it is the element sized
  // to the viewport; <html> is auto-height and can stay put).
  if (window.ResizeObserver) new ResizeObserver(fit).observe(document.body);
  // The first measurement can land before the bars have their final height —
  // webfonts in particular change them — and a fit that is only ever computed
  // once leaves the device stuck at the wrong size. Re-run as layout settles.
  requestAnimationFrame(fit);
  window.addEventListener('load', fit);
  setTimeout(fit, 300);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  // Notes are worth showing by default only when there is room beside the phone.
  setNotes(window.innerWidth >= 1180);
  fit();
})();
