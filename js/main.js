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

  // Phone: US mode (default) vs international mode
  var phoneInput = document.getElementById('lead-phone');
  var phoneError = document.getElementById('phone-error');
  var intlToggle = document.getElementById('intl-toggle');
  var isIntlMode = false;

  if (intlToggle) {
    intlToggle.addEventListener('click', function () {
      isIntlMode = !isIntlMode;
      if (isIntlMode) {
        this.textContent = 'US number?';
        phoneInput.value = '';
        phoneInput.placeholder = '+44 7911 123456';
        phoneInput.maxLength = 20;
      } else {
        this.textContent = 'Outside the US?';
        phoneInput.value = '';
        phoneInput.placeholder = '(555) 000-0000';
        phoneInput.maxLength = 14;
      }
      if (phoneError) { phoneError.textContent = ''; phoneInput.classList.remove('input-error'); }
      phoneInput.focus();
    });
  }

  // US auto-formatter: (555) 123-4567
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      if (isIntlMode) {
        // International: allow digits, +, spaces, dashes — just clean up
        this.value = this.value.replace(/[^\d+\-\s()]/g, '');
      } else {
        var digits = this.value.replace(/\D/g, '').slice(0, 10);
        var formatted = '';
        if (digits.length > 0) formatted = '(' + digits.slice(0, 3);
        if (digits.length >= 3) formatted += ') ';
        if (digits.length > 3) formatted += digits.slice(3, 6);
        if (digits.length >= 6) formatted += '-';
        if (digits.length > 6) formatted += digits.slice(6, 10);
        this.value = formatted;
      }
      // Clear error on edit
      if (phoneError) { phoneError.textContent = ''; phoneInput.classList.remove('input-error'); }
    });
  }

  // Validate phone
  function validatePhone(raw) {
    var digits = raw.replace(/\D/g, '');

    if (isIntlMode) {
      // International: must start with + and have 7-15 digits
      if (!raw.trim().startsWith('+')) return 'International numbers must start with + (e.g. +44).';
      if (digits.length < 7 || digits.length > 15) return 'Please enter a valid international phone number.';
      if (/^(\d)\1+$/.test(digits)) return 'Please enter a real phone number.';
      return '';
    }

    // US validation
    if (digits.length !== 10) return 'Please enter a valid 10-digit phone number.';
    if (/^(\d)\1{9}$/.test(digits)) return 'Please enter a real phone number.';
    if (digits === '1234567890' || digits === '0987654321') return 'Please enter a real phone number.';
    if (digits.slice(0, 3) === '555') return 'Please enter a real phone number.';
    if (digits[0] === '0' || digits[0] === '1') return 'Please enter a valid US phone number.';
    return '';
  }

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

    // Validate phone before submitting
    var phoneErr = validatePhone(phone);
    if (phoneErr) {
      if (phoneError) { phoneError.textContent = phoneErr; phoneEl.classList.add('input-error'); }
      phoneEl.focus();
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

    // Clean phone — handle US vs international
    var cleanPhone;
    if (isIntlMode) {
      // Keep the + prefix, strip everything else
      cleanPhone = '+' + phone.replace(/\D/g, '');
    } else {
      var digits = phone.replace(/\D/g, '');
      cleanPhone = '+1' + digits;
    }

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
