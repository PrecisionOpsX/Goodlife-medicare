/**
 * Newsletter forms: submit to Google Apps Script in hidden iframe,
 * show loading state, then success alert.
 */
(function () {
    var frame = document.getElementById('newsletter-submit-frame');
    if (!frame) return;

    var forms = [
        {
            form: document.getElementById('footer-newsletter-form'),
            btn: document.getElementById('footer-newsletter-btn'),
            successEl: document.getElementById('footer-newsletter-success'),
            idleLabel: 'Enter'
        },
        {
            form: document.getElementById('blog-subscribe-form'),
            btn: document.getElementById('blog-subscribe-btn'),
            successEl: null,
            idleLabel: 'Subscribe'
        }
    ];

    var active = null;

    forms.forEach(function (entry) {
        if (!entry.form || !entry.btn) return;

        entry.form.addEventListener('submit', function () {
            active = entry;
            entry.btn.disabled = true;
            entry.btn.classList.add('is-loading');
            entry.btn.textContent = 'Submitting…';
            if (entry.successEl) entry.successEl.hidden = true;
        });
    });

    frame.addEventListener('load', function () {
        if (!active) return;
        var entry = active;
        active = null;
        entry.btn.disabled = false;
        entry.btn.classList.remove('is-loading');
        entry.btn.textContent = entry.idleLabel;
        entry.form.reset();
        if (entry.successEl) entry.successEl.hidden = false;
        alert('Thank you! You\'ve been subscribed to our newsletter.');
    });
})();
