/* Rollup Roadside — site behaviour
   - mobile nav
   - scroll reveal
   - form: hidden _page field, fetch submit with graceful no-JS fallback
   - "?submitted=1" confirmation
*/
(function () {
  'use strict';

  /* ---------------- mobile navigation ---------------- */
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('site-nav');

  function setNav(open) {
    if (!nav || !burger) return;
    nav.setAttribute('data-open', open ? 'true' : 'false');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      setNav(nav.getAttribute('data-open') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1040) setNav(false);
    });
  }

  /* ---------------- scroll reveal ---------------- */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });
    } else {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  /* ---------------- forms ---------------- */
  var ENDPOINT = 'https://vision.leadrai.com/api/forms/d36430c2af78651e99d9df173d33c1bb';
  var forms = document.querySelectorAll('form[data-leadr]');

  // Stamp the current URL into the hidden _page field on page load.
  forms.forEach(function (form) {
    var page = form.querySelector('input[name="_page"]');
    if (page) page.value = window.location.href;
  });

  function showThanks(form) {
    var ok = form.parentNode.querySelector('[data-thanks]');
    if (ok) {
      ok.hidden = false;
      ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    form.hidden = true;
  }

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) return; // let the browser report problems

      // Progressive enhancement: try fetch; on any failure fall back to a
      // normal POST to the same endpoint so the submission is never lost.
      if (!window.fetch || !window.FormData) return;

      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      data._page = window.location.href;

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          return res.json().catch(function () { return { ok: true }; });
        })
        .then(function (json) {
          if (json && json.ok === false) throw new Error('Rejected');
          form.reset();
          var page = form.querySelector('input[name="_page"]');
          if (page) page.value = window.location.href;
          showThanks(form);
        })
        .catch(function () {
          // Fall back to a real browser POST to the same endpoint.
          form.submit();
        });
    });
  });

  /* ------- confirmation after a plain (no-JS) HTML submission ------- */
  try {
    if (new URLSearchParams(window.location.search).get('submitted') === '1') {
      var banner = document.querySelector('[data-thanks]');
      if (banner) {
        banner.hidden = false;
        var target = document.getElementById('book') || banner;
        window.setTimeout(function () {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    }
  } catch (e) { /* URLSearchParams unsupported — nothing to do */ }
})();
