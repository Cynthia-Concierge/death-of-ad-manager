(function () {
  'use strict';

  const modal = document.getElementById('lead-modal');
  const form = document.getElementById('lead-form');
  const secondPageUrl = 'watch.html';

  if (!modal || !form) return;

  var savedScrollY = 0;

  function openModal() {
    savedScrollY = window.scrollY;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '-' + savedScrollY + 'px';
    const firstInput = form.querySelector('input');
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 100);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);
  }

  document.querySelectorAll('[data-open-modal]').forEach(function (el) {
    el.addEventListener('click', openModal);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.classList.contains('modal-backdrop')) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : '';
  }

  // Capture UTM parameters on page load and persist in sessionStorage
  // so they survive if user navigates around before opting in
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var utmParams = {};
  (function captureUtm() {
    var params = new URLSearchParams(window.location.search);
    var hasNew = false;
    UTM_KEYS.forEach(function (key) {
      var val = params.get(key);
      if (val) { utmParams[key] = val; hasNew = true; }
    });
    // Persist to sessionStorage so they survive modal open/close
    if (hasNew) {
      try { sessionStorage.setItem('funnel_utm', JSON.stringify(utmParams)); } catch (e) {}
    } else {
      // Restore from sessionStorage if no new UTMs in URL
      try {
        var stored = sessionStorage.getItem('funnel_utm');
        if (stored) utmParams = JSON.parse(stored);
      } catch (e) {}
    }
  })();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nameEl = form.querySelector('#lead-name');
    var emailEl = form.querySelector('#lead-email');
    var phoneEl = form.querySelector('#lead-phone');
    var name = nameEl && nameEl.value ? nameEl.value.trim() : '';
    var email = emailEl && emailEl.value ? emailEl.value.trim() : '';
    var phone = phoneEl && phoneEl.value ? phoneEl.value.trim() : '';

    if (!name || !email || !phone) {
      if (!name) { nameEl && nameEl.focus(); return; }
      if (!email) { emailEl && emailEl.focus(); return; }
      if (!phone) { phoneEl && phoneEl.focus(); return; }
      return;
    }

    // Save to localStorage
    try {
      localStorage.setItem('webinar_lead', JSON.stringify({
        name: name, email: email, phone: phone, at: new Date().toISOString()
      }));
    } catch (err) {}

    // Disable button + show loading spinner
    var btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="btn-spinner"></span> Setting things up\u2026';
      btn.classList.add('btn-loading');
    }

    // Disable all inputs so user can't double-submit
    form.querySelectorAll('input').forEach(function (el) { el.disabled = true; });

    // Clean phone - strip non-digits, prepend +1 if 10 digits
    var cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '+1' + cleanPhone;
    else if (!cleanPhone.startsWith('+')) cleanPhone = '+' + cleanPhone;

    var redirectUrl = secondPageUrl + '?p=' + encodeURIComponent(cleanPhone);

    var payload = {
      name: name,
      email: email,
      phone: cleanPhone,
      funnel: 'death-of-ad-manager',
      fbc: getCookie('_fbc'),
      fbp: getCookie('_fbp'),
      utm: Object.keys(utmParams).length ? utmParams : undefined,
    };

    // Safety net: redirect after 6s no matter what
    var safetyTimeout = setTimeout(function () {
      closeModal();
      window.location.href = redirectUrl;
    }, 6000);

    fetch('https://app.cynthiaconcierge.com/vapi/funnel/opt-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        clearTimeout(safetyTimeout);
        if (typeof fbq === 'function' && data.eventId) {
          fbq('track', 'Lead', { content_name: 'death-of-ad-manager' }, { eventID: data.eventId });
        }
        closeModal();
        window.location.href = redirectUrl;
      })
      .catch(function () {
        clearTimeout(safetyTimeout);
        closeModal();
        window.location.href = redirectUrl;
      });
  });

  // iMessage testimonial scroll carousel
  var track = document.querySelector('.imessage-scroll-track');
  var slides = document.querySelectorAll('.imessage-card');
  if (track && slides.length) {
    // Touch/scroll-based - no dot nav needed for horizontal scroll
  }

  // Accordion
  document.querySelectorAll('[data-accordion]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
    });
  });
})();
