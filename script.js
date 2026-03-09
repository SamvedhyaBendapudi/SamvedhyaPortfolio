/* ==========================================================
   SAMVEDHYA PORTFOLIO - Enhanced Scripts
   ========================================================== */

// -- Canvas Particle Animation (Refined) --
var canvas = document.getElementById('nokey');
var ctx = canvas.getContext('2d');

var canW, canH;
var PARTICLE_COUNT = 60;
var particles = [];
var CONNECT_DISTANCE = 160;
var LINE_WIDTH = 0.5;
var PARTICLE_COLOR = { r: 148, g: 163, b: 184 };

var mouseIn = false;
var mouseBall = { x: 0, y: 0, type: 'mouse' };

function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canW = canvas.width;
  canH = canvas.height;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle() {
  return {
    x: randomBetween(0, canW),
    y: randomBetween(0, canH),
    vx: randomBetween(-0.3, 0.3),
    vy: randomBetween(-0.3, 0.3),
    r: randomBetween(1, 2.5),
    alpha: randomBetween(0.2, 0.7),
    phase: randomBetween(0, Math.PI * 2)
  };
}

function initParticles() {
  particles.length = 0;
  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }
}

function drawParticles() {
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    if (p.type === 'mouse') continue;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + PARTICLE_COLOR.r + ',' + PARTICLE_COLOR.g + ',' + PARTICLE_COLOR.b + ',' + p.alpha + ')';
    ctx.fill();
  }
}

function drawLines() {
  for (var i = 0; i < particles.length; i++) {
    for (var j = i + 1; j < particles.length; j++) {
      var dx = particles[i].x - particles[j].x;
      var dy = particles[i].y - particles[j].y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECT_DISTANCE) {
        var alpha = (1 - dist / CONNECT_DISTANCE) * 0.25;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = 'rgba(' + PARTICLE_COLOR.r + ',' + PARTICLE_COLOR.g + ',' + PARTICLE_COLOR.b + ',' + alpha + ')';
        ctx.lineWidth = LINE_WIDTH;
        ctx.stroke();
      }
    }
  }
}

function updateParticles() {
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    if (p.type === 'mouse') continue;
    p.x += p.vx;
    p.y += p.vy;
    p.phase += 0.008;
    p.alpha = 0.2 + Math.abs(Math.sin(p.phase)) * 0.5;

    if (p.x < -10) p.x = canW + 10;
    if (p.x > canW + 10) p.x = -10;
    if (p.y < -10) p.y = canH + 10;
    if (p.y > canH + 10) p.y = -10;
  }
}

function animate() {
  ctx.clearRect(0, 0, canW, canH);
  drawParticles();
  drawLines();
  updateParticles();
  requestAnimationFrame(animate);
}

initCanvas();
initParticles();
animate();

window.addEventListener('resize', function() {
  initCanvas();
});

document.addEventListener('mousemove', function(e) {
  mouseBall.x = e.clientX;
  mouseBall.y = e.clientY;
  if (!mouseIn) {
    mouseIn = true;
    particles.push(mouseBall);
  }
});

document.addEventListener('mouseleave', function() {
  mouseIn = false;
  var idx = particles.indexOf(mouseBall);
  if (idx !== -1) particles.splice(idx, 1);
});

// -- Cursor Glow Follower --
var cursorGlow = document.getElementById('cursorGlow');
var glowX = 0, glowY = 0;
var targetGlowX = 0, targetGlowY = 0;

document.addEventListener('mousemove', function(e) {
  targetGlowX = e.clientX;
  targetGlowY = e.clientY;
  cursorGlow.classList.add('active');
});

document.addEventListener('mouseleave', function() {
  cursorGlow.classList.remove('active');
});

function animateGlow() {
  glowX += (targetGlowX - glowX) * 0.12;
  glowY += (targetGlowY - glowY) * 0.12;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

// -- Scroll Progress Bar --
var scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  var scrollTop = window.scrollY || window.pageYOffset;
  var docHeight = document.documentElement.scrollHeight - window.innerHeight;
  var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = percent + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// -- Navigation --
function toggleMenu() {
  var menu = document.querySelector('.menu-links');
  var icon = document.querySelector('.hamburger-icon');
  menu.classList.toggle('open');
  icon.classList.toggle('open');
}

var desktopNav = document.getElementById('desktop-nav');

function updateNavScroll() {
  if (desktopNav) {
    if (window.scrollY > 50) {
      desktopNav.classList.add('scrolled');
    } else {
      desktopNav.classList.remove('scrolled');
    }
  }
}

window.addEventListener('scroll', updateNavScroll);

// Active link highlighting
var navLinksAll = document.querySelectorAll('.nav-links a');
var allSections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  var scrollY = window.scrollY + 200;
  allSections.forEach(function(section) {
    var top = section.offsetTop;
    var height = section.offsetHeight;
    var id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinksAll.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

// -- Typing Effect --
var typedElement = document.getElementById('typed-text');
var roles = [
  'Software Engineer',
  'Full Stack Developer',
  'ML Enthusiast',
  'Problem Solver'
];
var roleIndex = 0;
var charIndex = 0;
var isDeleting = false;

function typeEffect() {
  var currentRole = roles[roleIndex];
  var speed = 100;

  if (isDeleting) {
    typedElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    speed = 50;
  } else {
    typedElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    speed = 100;
  }

  if (!isDeleting && charIndex === currentRole.length) {
    speed = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 400;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();

// -- Experience Tabs --
var tabBtns = document.querySelectorAll('.tab-btn');
var tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    tabBtns.forEach(function(b) { b.classList.remove('active'); });
    tabPanels.forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
    var target = document.getElementById(btn.dataset.target);
    if (target) target.classList.add('active');
  });
});

// -- 3D Tilt Effect on Project Cards --
var tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(function(card) {
  card.addEventListener('mousemove', function(e) {
    var rect = card.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var centerX = rect.width / 2;
    var centerY = rect.height / 2;
    var rotateX = ((y - centerY) / centerY) * -8;
    var rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
  });

  card.addEventListener('mouseleave', function() {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});

// -- Back to Top Button --
var backToTop = document.getElementById('backToTop');

function updateBackToTop() {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', updateBackToTop);

backToTop.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// -- Scroll Reveal (Intersection Observer) --
var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');

var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      var el = entry.target;
      if (el.classList.contains('reveal-up') && el.parentElement) {
        var siblings = Array.from(el.parentElement.children);
        var idx = siblings.indexOf(el);
        var delay = idx * 120;
        setTimeout(function() {
          el.classList.add('visible');
        }, delay);
      } else {
        el.classList.add('visible');
      }
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(function(el) {
  revealObserver.observe(el);
});