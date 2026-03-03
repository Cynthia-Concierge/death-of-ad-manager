(function () {
  'use strict';

  var form = document.getElementById('catering-form');
  var formPanel = document.getElementById('form-panel');
  var successPanel = document.getElementById('success-panel');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var business = (form.querySelector('#lead-business') || {}).value || '';
    var name = (form.querySelector('#lead-name') || {}).value || '';
    var email = (form.querySelector('#lead-email') || {}).value || '';
    var phone = (form.querySelector('#lead-phone') || {}).value || '';

    business = business.trim();
    name = name.trim();
    email = email.trim();
    phone = phone.trim();

    if (!business) { form.querySelector('#lead-business').focus(); return; }
    if (!name) { form.querySelector('#lead-name').focus(); return; }
    if (!email) { form.querySelector('#lead-email').focus(); return; }
    if (!phone) { form.querySelector('#lead-phone').focus(); return; }

    // Save lead data
    try {
      localStorage.setItem('catering_lead', JSON.stringify({
        business: business,
        name: name,
        email: email,
        phone: phone,
        at: new Date().toISOString()
      }));
    } catch (err) {}

    // Show success, hide form
    formPanel.style.display = 'none';
    successPanel.style.display = 'block';

    // Scroll to top of form area
    successPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
