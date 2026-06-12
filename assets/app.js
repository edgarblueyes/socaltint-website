/* SoCal Tint Chino — redesign interactions */
(function(){
  "use strict";

  /* sticky header */
  var hdr = document.querySelector('.hdr');
  if(hdr){
    var sc = function(){ hdr.classList.toggle('scr', window.scrollY > 16); };
    sc(); window.addEventListener('scroll', sc, {passive:true});
  }

  /* mobile drawer */
  var burger = document.querySelector('.burger');
  var drawer = document.querySelector('.drawer');
  var ovl = document.querySelector('.nav-ovl');
  function closeDrawer(){ if(drawer)drawer.classList.remove('open'); if(ovl)ovl.classList.remove('show'); if(burger)burger.classList.remove('x'); document.body.style.overflow=''; }
  if(burger && drawer){
    burger.addEventListener('click', function(){
      var open = drawer.classList.toggle('open');
      burger.classList.toggle('x', open);
      if(ovl) ovl.classList.toggle('show', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    if(ovl) ovl.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach(function(a){
      if(a.getAttribute('href') && a.getAttribute('href') !== '#') a.addEventListener('click', closeDrawer);
    });
  }

  /* hero slider + rotating copy (one service per photo) */
  var slides = document.querySelectorAll('.hero-bg .sl');
  var dotsWrap = document.querySelector('.hero-dots');
  if(slides.length){
    var i = 0, t;
    // copy must match the order of .sl background slides in the HTML
    var copy = [
      {k:'We Are', a:'Tesla Certified', b:'Experts',
       l:'Tint, full-front PPF & ceramic coating — dialed in for every Tesla model.'},
      {k:'Self-Healing Protection', a:'Paint', b:'Protection Film',
       l:"XPEL clear bra shields your paint from rocks, bugs, sand, salt & the road's worst."},
      {k:'Color Change Wraps', a:'Custom', b:'Vehicle Wraps',
       l:'Premium color-change wraps & custom prints — gloss, satin or matte.'},
      {k:'Beat The Heat', a:'Ceramic', b:'Window Tint',
       l:'Up to 98% infrared heat rejection & 99% UV protection, backed by a lifetime warranty.'}
    ];
    var hc = document.getElementById('heroCopy');
    var hK = document.getElementById('hKicker'), hL1 = document.getElementById('hL1'),
        hL2 = document.getElementById('hL2'), hLd = document.getElementById('hLead');
    function setCopy(n){
      if(!hc || !copy[n]) return;
      hc.classList.add('fading');
      setTimeout(function(){
        hK.textContent = copy[n].k; hL1.textContent = copy[n].a;
        hL2.textContent = copy[n].b; hLd.textContent = copy[n].l;
        hc.classList.remove('fading');
      }, 280);
    }
    if(dotsWrap){
      slides.forEach(function(_,n){
        var b = document.createElement('button');
        if(n===0) b.classList.add('on');
        b.addEventListener('click', function(){ go(n); reset(); });
        dotsWrap.appendChild(b);
      });
    }
    var dots = dotsWrap ? dotsWrap.querySelectorAll('button') : [];
    function go(n){
      slides[i].classList.remove('on'); if(dots[i]) dots[i].classList.remove('on');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('on'); if(dots[i]) dots[i].classList.add('on');
      setCopy(i);
    }
    function reset(){ clearInterval(t); t = setInterval(function(){ go(i+1); }, 4000); }
    reset();
  }

  /* reveal on scroll */
  var rv = document.querySelectorAll('.rv');
  if('IntersectionObserver' in window && rv.length){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.12});
    rv.forEach(function(el){ io.observe(el); });
  } else rv.forEach(function(el){ el.classList.add('in'); });

  /* count up */
  var counters = document.querySelectorAll('[data-count]');
  if('IntersectionObserver' in window && counters.length){
    var cio = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var el = e.target, end = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', dec = (end % 1 !== 0) ? 1 : 0, st = null, dur = 1600;
        function tick(ts){ if(!st) st = ts; var p = Math.min((ts-st)/dur,1); var v = (end*(0.5-Math.cos(Math.PI*p)/2)); el.textContent = v.toFixed(dec) + suf; if(p<1) requestAnimationFrame(tick); else el.textContent = end.toFixed(dec)+suf; }
        requestAnimationFrame(tick); cio.unobserve(el);
      });
    }, {threshold:.5});
    counters.forEach(function(el){ cio.observe(el); });
  }

  /* before/after sliders */
  document.querySelectorAll('.ba').forEach(function(ba){
    var after = ba.querySelector('.after'), line = ba.querySelector('.ba-line'), handle = ba.querySelector('.ba-handle');
    var drag = false;
    function set(x){
      var r = ba.getBoundingClientRect();
      var pct = Math.max(0, Math.min(100, ((x - r.left)/r.width)*100));
      after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      line.style.left = pct + '%'; handle.style.left = pct + '%';
    }
    function px(e){ return e.touches ? e.touches[0].clientX : e.clientX; }
    ba.addEventListener('mousedown', function(e){ drag=true; set(px(e)); });
    window.addEventListener('mousemove', function(e){ if(drag) set(px(e)); });
    window.addEventListener('mouseup', function(){ drag=false; });
    ba.addEventListener('touchstart', function(e){ drag=true; set(px(e)); }, {passive:true});
    ba.addEventListener('touchmove', function(e){ if(drag) set(px(e)); }, {passive:true});
    ba.addEventListener('touchend', function(){ drag=false; });
    // hover-follow on desktop
    ba.addEventListener('mousemove', function(e){ if(!drag) set(px(e)); });
  });

  /* gallery filters */
  var fbtns = document.querySelectorAll('.filters button');
  var gitems = document.querySelectorAll('.gi');
  if(fbtns.length){
    fbtns.forEach(function(b){
      b.addEventListener('click', function(){
        fbtns.forEach(function(x){ x.classList.remove('on'); });
        b.classList.add('on');
        var f = b.dataset.filter;
        gitems.forEach(function(it){ it.style.display = (f==='all' || it.dataset.cat.indexOf(f)>-1) ? '' : 'none'; });
      });
    });
  }

  /* lightbox */
  var lb = document.querySelector('.lb');
  if(lb && gitems.length){
    var lbImg = lb.querySelector('img'), vis = [], cur = 0;
    function build(){ vis = Array.prototype.filter.call(gitems, function(it){ return it.style.display !== 'none'; }); }
    function open(it){ build(); cur = vis.indexOf(it); show(); lb.classList.add('open'); document.body.style.overflow='hidden'; }
    function show(){ var im = vis[cur].querySelector('img'); lbImg.src = im.dataset.full || im.src; }
    function step(d){ cur = (cur+d+vis.length)%vis.length; show(); }
    function close(){ lb.classList.remove('open'); document.body.style.overflow=''; }
    gities();
    function gities(){ gitems.forEach(function(it){ it.addEventListener('click', function(){ open(it); }); }); }
    lb.querySelector('.x').addEventListener('click', close);
    lb.querySelector('.n').addEventListener('click', function(e){ e.stopPropagation(); step(1); });
    lb.querySelector('.p').addEventListener('click', function(e){ e.stopPropagation(); step(-1); });
    lb.addEventListener('click', function(e){ if(e.target===lb) close(); });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key==='Escape') close(); if(e.key==='ArrowRight') step(1); if(e.key==='ArrowLeft') step(-1);
    });
  }

  /* quote form — sends via Web3Forms when an access key is set, else demo success */
  document.querySelectorAll('form[data-quote]').forEach(function(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var ok = f.querySelector('.fok');
      var btn = f.querySelector('button[type="submit"]');
      var btnText = btn ? btn.textContent : '';
      var key = f.querySelector('[name="access_key"]');
      var live = f.getAttribute('action') && key && key.value && key.value.indexOf('YOUR_') === -1;
      function finish(msg){
        if(ok){ if(msg) ok.textContent = msg; ok.style.display = 'block'; ok.scrollIntoView({behavior:'smooth', block:'center'}); }
        f.reset();
        if(btn){ btn.disabled = false; btn.textContent = btnText; }
      }
      if(live){
        if(btn){ btn.disabled = true; btn.textContent = 'Sending…'; }
        fetch(f.action, {method:'POST', body:new FormData(f), headers:{'Accept':'application/json'}})
          .then(function(r){ return r.json(); })
          .then(function(d){ finish(d.success ? "✅ Thanks! Your request is in. We'll be in touch shortly." : "⚠️ Something went wrong — please call (909) 203-9837."); })
          .catch(function(){ finish("⚠️ Network error — please call (909) 203-9837."); });
      } else {
        finish(); /* preview/demo mode until access key is added */
      }
    });
  });

  /* hours: mark today (rows ordered Sun..Sat) */
  var ht = document.querySelector('.hours');
  if(ht){ var d=new Date().getDay(); var rows=ht.querySelectorAll('tr'); if(rows[d]) rows[d].classList.add('now'); }

  /* year */
  document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = new Date().getFullYear(); });
})();
