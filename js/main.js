// Servnology · site behaviors shared by every page:
// header, mobile menu, photo fallback, time-of-day tabs, call demo, demo form.

// Example conversations for the "Hear how a call goes" demo on voice-agent.html.
// Edit the lines here. "who" is guest, agent, or event (a status note in the middle).
var CALL_SCENARIOS = {
  breakfast: {
    title: 'Incoming call · 6:42 a.m.',
    lines: [
      { who: 'agent', text: 'Good morning, thank you for calling. How can I help you today?' },
      { who: 'guest', text: 'Hi, I’m staying in room 312. What time is breakfast, and is it included?' },
      { who: 'agent', text: 'Breakfast is served from 6:30 to 10:00 in the lobby café, and it’s included with your stay. Would you like anything brought up to your room instead?' },
      { who: 'guest', text: 'No, that’s perfect. Thank you!' },
      { who: 'agent', text: 'My pleasure. Enjoy your breakfast.' },
      { who: 'event', text: 'Answered without staff' }
    ]
  },
  checkout: {
    title: 'Incoming call · 9:15 p.m.',
    lines: [
      { who: 'agent', text: 'Good evening, thank you for calling. How can I help?' },
      { who: 'guest', text: 'Could I get a late checkout tomorrow? My flight isn’t until the evening.' },
      { who: 'agent', text: 'Of course. May I have your name and room number?' },
      { who: 'guest', text: 'Maria Lopez, room 207.' },
      { who: 'agent', text: 'Thank you, Ms. Lopez. I’ve set your checkout for 1:00 p.m. tomorrow. Our team can also hold your bags at the front desk after that.' },
      { who: 'event', text: 'Updated in the reservation system' }
    ]
  },
  complaint: {
    title: 'Incoming call · 11:48 p.m.',
    lines: [
      { who: 'agent', text: 'Good evening, thank you for calling. How can I help?' },
      { who: 'guest', text: 'I’m in room 418 and the air conditioning isn’t working. It’s really warm in here.' },
      { who: 'agent', text: 'I’m so sorry. That’s no way to try to sleep. I’ve sent an urgent request to maintenance for room 418 right now.' },
      { who: 'agent', text: 'Would you like to move to another room while they take a look?' },
      { who: 'guest', text: 'Yes, please.' },
      { who: 'agent', text: 'Of course. I’m connecting you to the front desk now so they can arrange it. They already have your details.' },
      { who: 'event', text: 'Handed to the front desk with full context' }
    ]
  }
};

(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Header: turns solid once you scroll ----------
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Mobile menu ----------
  function setMenu(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  toggle.addEventListener('click', function () {
    setMenu(!header.classList.contains('is-open'));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // ---------- Photos: hide any that fail to load so the colored frame shows ----------
  document.querySelectorAll('img').forEach(function (img) {
    function hide() { img.classList.add('is-missing'); }
    if (img.complete && img.naturalWidth === 0) hide();
    img.addEventListener('error', hide);
  });

  // ---------- Footer year ----------
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Time-of-day tabs (problem.html) ----------
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.day-tab'));
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); selectTab(next); next.focus(); }
    });
  });

  // ---------- Call demo (voice-agent.html) ----------
  var transcript = document.getElementById('transcript');
  if (transcript) {
    var callTitle = document.getElementById('call-title');
    var buttons = document.querySelectorAll('.scenario');
    var current = 'breakfast';
    var timers = [];

    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }

    function lineEl(line) {
      var li = document.createElement('li');
      if (line.who === 'event') {
        li.className = 'msg msg-event';
        li.textContent = line.text;
        return li;
      }
      li.className = 'msg msg-' + line.who;
      var who = document.createElement('span');
      who.className = 'msg-who';
      who.textContent = line.who === 'agent' ? 'Servnology' : 'Guest';
      var text = document.createElement('p');
      text.className = 'msg-text';
      text.textContent = line.text;
      li.appendChild(who);
      li.appendChild(text);
      return li;
    }

    function typingEl(who) {
      var li = document.createElement('li');
      li.className = 'typing' + (who === 'guest' ? ' is-guest' : '');
      li.setAttribute('aria-hidden', 'true');
      li.innerHTML = '<span></span><span></span><span></span>';
      return li;
    }

    function play(key) {
      clearTimers();
      current = key;
      var scenario = CALL_SCENARIOS[key];
      callTitle.textContent = scenario.title;
      transcript.innerHTML = '';
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-scenario') === key));
      });

      if (reduceMotion) {
        scenario.lines.forEach(function (line) { transcript.appendChild(lineEl(line)); });
        return;
      }

      var t = 300;
      scenario.lines.forEach(function (line) {
        var typing = null;
        if (line.who !== 'event') {
          timers.push(setTimeout(function () {
            typing = typingEl(line.who);
            transcript.appendChild(typing);
          }, t));
          t += Math.min(1400, 500 + line.text.length * 12);
        }
        timers.push(setTimeout(function () {
          if (typing) typing.remove();
          transcript.appendChild(lineEl(line));
        }, t));
        t += 500;
      });
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () { play(b.getAttribute('data-scenario')); });
    });
    document.getElementById('call-replay').addEventListener('click', function () { play(current); });

    // Start the first call when the demo scrolls into view (right away if it is already visible).
    if ('IntersectionObserver' in window && !reduceMotion) {
      var started = false;
      var io = new IntersectionObserver(function (entries) {
        if (!started && entries[0].isIntersecting) {
          started = true;
          io.disconnect();
          play(current);
        }
      }, { threshold: 0.3 });
      io.observe(transcript);
      // Show the full conversation until it plays, so the panel is never empty.
      CALL_SCENARIOS[current].lines.forEach(function (line) { transcript.appendChild(lineEl(line)); });
    } else {
      play(current);
    }
  }

  // ---------- Demo request form (demo.html) ----------
  // Submissions go to the URL in the form's data-endpoint attribute
  // (for example a free Formspree form: https://formspree.io/f/xxxxxxx).
  var form = document.getElementById('demo-form');
  if (form) {
    var status = document.getElementById('form-status');
    var CONTACT = 'aew244@cornell.edu';

    var setStatus = function (text, kind) {
      status.textContent = text;
      status.className = 'form-status' + (kind ? ' is-' + kind : '');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstInvalid = null;
      form.querySelectorAll('[required]').forEach(function (el) {
        var bad = !el.checkValidity();
        el.closest('.field').classList.toggle('has-error', bad);
        el.setAttribute('aria-invalid', String(bad));
        if (bad && !firstInvalid) firstInvalid = el;
      });
      if (firstInvalid) {
        setStatus('Please fill in your name, hotel, a valid email and the number of properties.', 'error');
        firstInvalid.focus();
        return;
      }

      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) {
        setStatus('This form is not connected yet. Please email ' + CONTACT + ' and we will set up your demo.', 'error');
        return;
      }

      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      setStatus('Sending…');

      fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          setStatus('Thank you. We received your request and will be in touch soon.', 'success');
        })
        .catch(function () {
          setStatus('Something went wrong sending your request. Please try again, or email ' + CONTACT + '.', 'error');
        })
        .finally(function () {
          button.disabled = false;
        });
    });
  }
})();
