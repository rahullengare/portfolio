/* ═══ INIT ═══ */
document.addEventListener('DOMContentLoaded', () => {

    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 80 });
    initParticles();
    initTyping();
    initScrollProgress();
    initThemeToggle();
    initHamburger();
    initBackToTop();

    Promise.all([
    fetch('about.html').then(r=>r.text()),
    fetch('skills.html').then(r=>r.text()),
    fetch('projects.html').then(r=>r.text()),
    fetch('certifications.html').then(r=>r.text()),
    fetch('contact.html').then(r=>r.text())
  ]).then(([about, skills, projects, certs, contact]) => {

    document.getElementById('about-container').innerHTML = about;
    document.getElementById('skills-container').innerHTML = skills;
    document.getElementById('projects-container').innerHTML = projects;
    document.getElementById('certifications-container').innerHTML = certs;
    document.getElementById('contact-container').innerHTML = contact;

    // ✅ NOW run functions that need those sections
    initSkillBars();
    initProjectFilter();
    initContactForm();
    initActiveNav();

  });

});
    /* ═══ PARTICLES ═══ */
    function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {this.reset(); }
    reset() {
        this.x = Math.random() * W; this.y = Math.random()*H;
    this.r = Math.random()*2+0.5;
    this.dx = (Math.random()-0.5)*0.4; this.dy = (Math.random()-0.5)*0.4-0.2;
    this.alpha = Math.random()*0.5+0.1;
      this.type = Math.random()>0.8?'cloud':'dot';
    }
    update() {
        this.x += this.dx; this.y+=this.dy;
    if(this.y<-20||this.x<-50||this.x>W+50) this.reset();
    }
    draw() {
        ctx.save(); ctx.globalAlpha = this.alpha;
    if(this.type==='cloud') {
        ctx.fillStyle = '#3b82f6'; ctx.font=`${this.r * 8}px sans-serif`;
    ctx.fillText('☁',this.x,this.y);
      } else {
        ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fillStyle=Math.random()>0.5?'#3b82f6':'#8b5cf6'; ctx.fill();
      }
    ctx.restore();
    }
  }

    for(let i=0;i<80;i++) particles.push(new Particle());

    function drawLines() {
    for(let i=0;i<particles.length;i++) {
      for(let j=i+1;j<particles.length;j++) {
        const d=Math.hypot(particles[i].x-particles[j].x,particles[i].y-particles[j].y);
    if(d<100) {
        ctx.save(); ctx.globalAlpha=(1-d/100)*0.06;
    ctx.strokeStyle='#3b82f6'; ctx.lineWidth=0.5;
    ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y);
    ctx.lineTo(particles[j].x,particles[j].y); ctx.stroke(); ctx.restore();
        }
      }
    }
  }

    (function animate() {
        ctx.clearRect(0, 0, W, H);
    particles.forEach(p=>{p.update();p.draw();});
    drawLines(); requestAnimationFrame(animate);
  })();
}

    /* ═══ TYPING ═══ */
    function initTyping() {
  const roles = ['Cloud Developer','DevOps Engineer','AWS Specialist','Cloud Architect','CI/CD Engineer','Cloud Operations Engineer'];
    const el = document.getElementById('typing-text');
    let ri=0, ci=0, deleting=false;
    function type() {
    const cur=roles[ri];
    if(!deleting) {el.textContent = cur.slice(0, ++ci); if(ci===cur.length){deleting = true;setTimeout(type,1800);return;} }
    else {el.textContent = cur.slice(0, --ci); if(ci===0){deleting = false;ri=(ri+1)%roles.length;} }
    setTimeout(type, deleting?60:110);
  }
    type();
}

    /* ═══ SCROLL PROGRESS ═══ */
    function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
        bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
  });
}

/* ═══ THEME TOGGLE ═══ */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // This part handles the icon on refresh
  const currentTheme = html.dataset.theme; // Already set by your snippet
  if (currentTheme === 'dark') {
    themeIcon.className = 'fas fa-cog';
  } else {
    themeIcon.className = 'fas fa-moon';
  }

  btn.addEventListener('click', () => {
    const isDark = html.dataset.theme === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    html.dataset.theme = newTheme;
    themeIcon.className = newTheme === 'dark' ? 'fas fa-cog' : 'fas fa-moon';

    localStorage.setItem('portfolio-theme', newTheme);
  });
}

    /* ═══ HAMBURGER ═══ */
    function initHamburger() {
  const btn=document.getElementById('hamburger'), nav=document.getElementById('mobileNav');
  btn.addEventListener('click', () => {
    const open=nav.classList.toggle('open');
    nav.setAttribute('aria-hidden', String(!open));
  });
}
    function closeMobile() {
  const nav=document.getElementById('mobileNav');
    nav.classList.remove('open'); nav.setAttribute('aria-hidden','true');
}

    /* ═══ SKILL BARS ═══ */
    function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.querySelectorAll('.skill-fill').forEach(f => f.style.width = f.dataset.fill + '%');
        });
  }, {threshold:0.3});
  document.querySelectorAll('.skill-category').forEach(el=>obs.observe(el));
}

    /* ═══ PROJECT FILTER ═══ */
    function initProjectFilter() {
  const tabs=document.querySelectorAll('.filter-tab'), cards=document.querySelectorAll('.project-card');
  tabs.forEach(tab => tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active')); tab.classList.add('active');
    const f=tab.dataset.filter;
    cards.forEach(c=>c.classList.toggle('hidden', f!=='all'&&c.dataset.category!==f));
  }));
}

    /* ═══ CONTACT FORM ═══ */
    function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
      const fields = {name: 'formName', phone: 'formPhone', msg: 'formMessage' };
    const errs = {name: 'nameError', phone: 'phoneError', msg: 'msgError' };
    const success = document.getElementById('formSuccess');
    let isValid = true;

    if (success) success.innerHTML = "&#10003; msg is send to rahul";

      Object.keys(fields).forEach(key => {
        const input = document.getElementById(fields[key]);
    const errEl = document.getElementById(errs[key]);
    if (errEl) errEl.classList.remove('show');

    if (!input || !input.value.trim()) {
          if (errEl) errEl.classList.add('show');
    isValid = false;
        }
      });

    if (!isValid) return e.preventDefault();

    if (success) success.classList.add('show');
      setTimeout(() => {
        form.reset();
    if (success) success.classList.remove('show');
      }, 800);
    });
  }

    initContactForm();

    /* ═══ ACTIVE NAV ═══ */
    function initActiveNav() {
  const sections=document.querySelectorAll('section[id]');
    const links=document.querySelectorAll('.nav-links li a');
  const obs=new IntersectionObserver(entries=>{
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => {
                    l.classList.remove('active');
                    if (l.getAttribute('href') === '#' + entry.target.id) l.classList.add('active');
                });
            }
        });
  },{threshold:0.45});
  sections.forEach(s=>obs.observe(s));
}

    /* ═══ BACK TO TOP ═══ */
    function initBackToTop() {
  const btn=document.getElementById('back-to-top');
  window.addEventListener('scroll',()=>btn.classList.toggle('visible',window.scrollY>400));
  btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}
    fetch('about.html')
  .then(res => res.text())
  .then(data => document.getElementById('about-container').innerHTML = data);

    fetch('skills.html')
  .then(res => res.text())
  .then(data => document.getElementById('skills-container').innerHTML = data);

    fetch('projects.html')
  .then(res => res.text())
  .then(data => document.getElementById('projects-container').innerHTML = data);

    fetch('certifications.html')
  .then(res => res.text())
  .then(data => document.getElementById('certifications-container').innerHTML = data);

    fetch('contact.html')
  .then(res => res.text())
  .then(data => document.getElementById('contact-container').innerHTML = data);
