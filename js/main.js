// ==================== CANVAS BACKGROUND EFFECT ====================
class ParticleBackground {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.mouse = {
      x: null,
      y: null,
      radius: 150,
    };

    // Color schemes for each section
    this.colorSchemes = {
      home: {
        particle: { r: 102, g: 126, b: 234 }, // Purple/Blue
        bg1: "#0a0e27",
        bg2: "#1a1f3a",
      },
      about: {
        particle: { r: 52, g: 211, b: 153 }, // Teal/Green
        bg1: "#0a1f1a",
        bg2: "#1a2f2a",
      },
      projects: {
        particle: { r: 245, g: 101, b: 101 }, // Coral/Red
        bg1: "#1f0a0e",
        bg2: "#2f1a1e",
      },
      contact: {
        particle: { r: 250, g: 176, b: 5 }, // Gold/Yellow
        bg1: "#1f1a0a",
        bg2: "#2f2a1a",
      },
    };

    this.currentColor = { ...this.colorSchemes.home.particle };
    this.targetColor = { ...this.colorSchemes.home.particle };
    this.currentBg1 = this.colorSchemes.home.bg1;
    this.currentBg2 = this.colorSchemes.home.bg2;
    this.targetBg1 = this.colorSchemes.home.bg1;
    this.targetBg2 = this.colorSchemes.home.bg2;

    this.init();
    this.animate();
    this.addEventListeners();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const numberOfParticles = Math.floor(
      (this.canvas.width * this.canvas.height) / 9000
    );

    for (let i = 0; i < numberOfParticles; i++) {
      const size = Math.random() * 3 + 1;
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const speedX = (Math.random() - 0.5) * 0.5;
      const speedY = (Math.random() - 0.5) * 0.5;

      this.particles.push(new Particle(x, y, size, speedX, speedY));
    }
  }

  setColorForSection(sectionId) {
    const scheme = this.colorSchemes[sectionId] || this.colorSchemes.home;
    this.targetColor = { ...scheme.particle };
    this.targetBg1 = scheme.bg1;
    this.targetBg2 = scheme.bg2;
  }

  lerpColor(start, end, t) {
    return {
      r: start.r + (end.r - start.r) * t,
      g: start.g + (end.g - start.g) * t,
      b: start.b + (end.b - start.b) * t,
    };
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = Math.round(x).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  lerpHexColor(start, end, t) {
    const startRgb = this.hexToRgb(start);
    const endRgb = this.hexToRgb(end);
    const lerpedRgb = this.lerpColor(startRgb, endRgb, t);
    return this.rgbToHex(lerpedRgb.r, lerpedRgb.g, lerpedRgb.b);
  }

  animate() {
    // Smoothly transition colors
    const colorTransitionSpeed = 0.05;
    this.currentColor = this.lerpColor(
      this.currentColor,
      this.targetColor,
      colorTransitionSpeed
    );
    this.currentBg1 = this.lerpHexColor(
      this.currentBg1,
      this.targetBg1,
      colorTransitionSpeed
    );
    this.currentBg2 = this.lerpHexColor(
      this.currentBg2,
      this.targetBg2,
      colorTransitionSpeed
    );

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw gradient background with current colors
    const gradient = this.ctx.createLinearGradient(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    gradient.addColorStop(0, this.currentBg1);
    gradient.addColorStop(1, this.currentBg2);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles.forEach((particle) => {
      particle.update(this.canvas, this.mouse);
      particle.draw(this.ctx, this.currentColor);
    });

    // Connect particles
    this.connectParticles();

    requestAnimationFrame(() => this.animate());
  }

  connectParticles() {
    const color = this.currentColor;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.5;
          this.ctx.strokeStyle = `rgba(${Math.round(color.r)}, ${Math.round(
            color.g
          )}, ${Math.round(color.b)}, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  addEventListeners() {
    window.addEventListener("resize", () => {
      this.resizeCanvas();
      this.particles = [];
      this.createParticles();
    });

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });

    window.addEventListener("mouseout", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }
}

class Particle {
  constructor(x, y, size, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.baseX = x;
    this.baseY = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.density = Math.random() * 30 + 1;
  }

  update(canvas, mouse) {
    // Bounce off walls
    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
      this.speedY = -this.speedY;
    }

    // Mouse interaction
    if (mouse.x != null && mouse.y != null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const maxDistance = mouse.radius;
      const force = (maxDistance - distance) / maxDistance;
      const directionX = forceDirectionX * force * this.density;
      const directionY = forceDirectionY * force * this.density;

      if (distance < mouse.radius) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          const dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          const dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
      }
    } else {
      // Return to base position
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }

    // Normal movement
    this.x += this.speedX;
    this.y += this.speedY;
    this.baseX += this.speedX;
    this.baseY += this.speedY;
  }

  draw(ctx, color) {
    const r = Math.round(color.r);
    const g = Math.round(color.g);
    const b = Math.round(color.b);

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    // Glow effect
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size * 3
    );
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

// ==================== SMOOTH SCROLL & ACTIVE NAV ====================
function initSmoothScroll() {
  // Smooth scroll to sections
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = target.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
        
        // Update active nav link
        updateActiveNav(targetId);
      }
    });
  });

  // Update active nav on scroll
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]");
    const navHeight = document.querySelector(".navbar").offsetHeight;
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight - 100;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    if (current) {
      updateActiveNav("#" + current);
      // Update particle colors based on current section
      if (window.particleBackground) {
        window.particleBackground.setColorForSection(current);
      }
    }
  });
}

function updateActiveNav(targetId) {
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === targetId) {
      link.classList.add("active");
    }
  });
}

// ==================== PARALLAX SCROLLING ====================
function initParallaxScrolling() {
  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;

    // Parallax for hero content
    const heroContent = document.querySelector(".hero-content");
    if (heroContent) {
      const heroOffset = scrolled * 0.5;
      heroContent.style.transform = `translateY(${heroOffset}px)`;
      heroContent.style.opacity = 1 - scrolled / 600;
    }

    // Parallax for profile image
    const profileImage = document.querySelector(".profile-image-container");
    if (profileImage) {
      const imageOffset = scrolled * 0.3;
      profileImage.style.transform = `translateY(${imageOffset}px) scale(${
        1 - scrolled / 2000
      })`;
    }

    // Parallax for scroll indicator
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (scrollIndicator) {
      scrollIndicator.style.opacity = 1 - scrolled / 300;
      scrollIndicator.style.transform = `translateY(${scrolled * 0.8}px)`;
    }

    // Parallax for cards and elements
    const parallaxElements = document.querySelectorAll(
      ".project-card, .skill-card, .about-card, .timeline-content"
    );
    parallaxElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight && elementTop + elementHeight > 0) {
        const scrollPercent =
          (windowHeight - elementTop) / (windowHeight + elementHeight);
        const parallaxOffset = (scrollPercent - 0.5) * 30;
        el.style.transform = `translateY(${parallaxOffset}px)`;
      }
    });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestTick);
  updateParallax(); // Initial call
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document
    .querySelectorAll(
      ".project-card, .skill-card, .timeline-item, .contact-item, .social-icon"
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      observer.observe(el);
    });
}

// ==================== NAVBAR SCROLL EFFECT ====================
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(10, 14, 39, 0.95)";
      navbar.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.3)";
    } else {
      navbar.style.background = "rgba(10, 14, 39, 0.9)";
      navbar.style.boxShadow = "none";
    }
  });
}

// ==================== CURSOR GLOW EFFECT ====================
function initCursorGlow() {
  const canvas = document.getElementById("canvas");
  let cursorGlow = null;

  canvas.addEventListener("mousemove", (e) => {
    if (!cursorGlow) {
      cursorGlow = document.createElement("div");
      cursorGlow.style.position = "fixed";
      cursorGlow.style.width = "300px";
      cursorGlow.style.height = "300px";
      cursorGlow.style.borderRadius = "50%";
      cursorGlow.style.background =
        "radial-gradient(circle, rgba(102, 126, 234, 0.15), transparent 70%)";
      cursorGlow.style.pointerEvents = "none";
      cursorGlow.style.zIndex = "1";
      cursorGlow.style.transition = "transform 0.15s ease";
      document.body.appendChild(cursorGlow);
    }

    cursorGlow.style.left = e.clientX - 150 + "px";
    cursorGlow.style.top = e.clientY - 150 + "px";
  });
}

// ==================== PROJECT MODAL ====================
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const modalOverlay = modal.querySelector('.modal-overlay');
  const modalClose = modal.querySelector('.modal-close');
  const viewButtons = document.querySelectorAll('.btn-view');

  // Project data
  const projects = [
    {
      title: "E-Commerce Platform",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      description: "A full-featured e-commerce platform with payment integration, inventory management, and real-time analytics dashboard. Built with modern tech stack for optimal performance, this platform handles thousands of transactions daily with 99.9% uptime.",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      features: [
        "Secure payment processing with Stripe integration",
        "Real-time inventory management system",
        "Advanced analytics dashboard with data visualization",
        "Responsive design for all devices",
        "Admin panel for product and order management"
      ],
      technologies: ["React 18", "Express.js", "MongoDB Atlas", "Stripe API", "Redux Toolkit", "JWT Auth", "AWS S3", "Cloudflare CDN"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Task Management App",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      description: "Collaborative project management tool with real-time updates, team collaboration features, and intuitive drag-and-drop interface. Supports multiple project views and integrations with popular productivity tools.",
      tags: ["Vue.js", "Firebase", "TypeScript", "WebSocket"],
      features: [
        "Real-time collaboration with WebSocket",
        "Drag-and-drop task organization",
        "Multiple project views (Kanban, List, Calendar)",
        "Team chat and file sharing",
        "Integration with Slack and Google Calendar"
      ],
      technologies: ["Vue 3", "TypeScript", "Firebase", "WebSocket", "Pinia", "Vite", "TailwindCSS", "Chart.js"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Social Media Dashboard",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      description: "Analytics dashboard for managing multiple social media accounts. Features include scheduled posting, engagement tracking, and comprehensive reporting tools for data-driven decision making.",
      tags: ["React", "Express", "PostgreSQL", "Chart.js"],
      features: [
        "Multi-platform social media integration",
        "Scheduled post publishing",
        "Advanced analytics and insights",
        "Engagement tracking and reporting",
        "Custom dashboard with drag-and-drop widgets"
      ],
      technologies: ["React", "Express", "PostgreSQL", "Chart.js", "Node-cron", "OAuth 2.0", "Redis Cache", "Docker"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Weather Forecast App",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      description: "Beautiful weather application with detailed forecasts, interactive maps, and personalized notifications. Integrates multiple weather APIs for accurate predictions and provides location-based alerts.",
      tags: ["JavaScript", "REST API", "Leaflet.js", "PWA"],
      features: [
        "7-day detailed weather forecasts",
        "Interactive weather maps with radar",
        "Location-based weather alerts",
        "Offline support with PWA",
        "Hourly and daily forecasts"
      ],
      technologies: ["JavaScript ES6", "OpenWeather API", "Leaflet.js", "Service Workers", "IndexedDB", "Geolocation API", "PWA", "Webpack"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Portfolio Builder",
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
      description: "Drag-and-drop portfolio builder for developers and designers. Users can create beautiful portfolios without coding, with multiple templates and customization options. Export to HTML or deploy directly.",
      tags: ["React", "Node.js", "AWS S3", "Tailwind"],
      features: [
        "Intuitive drag-and-drop interface",
        "20+ professional templates",
        "Custom domain support",
        "One-click deployment",
        "Export to HTML/CSS/JS"
      ],
      technologies: ["React", "Node.js", "AWS S3", "TailwindCSS", "MongoDB", "Vercel", "Cloudflare", "Stripe Billing"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Blog Platform",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      description: "Modern blogging platform with markdown support, SEO optimization, and comment system. Features a clean admin panel and responsive design for all devices. Built for speed and SEO performance.",
      tags: ["Next.js", "GraphQL", "Prisma", "Vercel"],
      features: [
        "Markdown editor with live preview",
        "SEO-optimized with meta tags",
        "Comment system with moderation",
        "Image optimization and lazy loading",
        "Analytics integration"
      ],
      technologies: ["Next.js 14", "GraphQL", "Prisma ORM", "PostgreSQL", "Vercel", "NextAuth.js", "TipTap Editor", "Algolia Search"],
      demoUrl: "#",
      githubUrl: "#"
    }
  ];

  // Open modal
  function openModal(projectIndex) {
    const project = projects[projectIndex];
    if (!project) return;

    // Populate modal content
    document.querySelector('.modal-placeholder').style.background = project.gradient;
    document.querySelector('.modal-title').textContent = project.title;
    document.querySelector('.modal-description').textContent = project.description;

    // Tags
    const tagsContainer = document.querySelector('.modal-tags');
    tagsContainer.innerHTML = project.tags.map(tag => `<span>${tag}</span>`).join('');

    // Features
    const featuresList = document.querySelector('.features-list');
    featuresList.innerHTML = project.features.map(feature => `<li>${feature}</li>`).join('');

    // Technologies
    const techGrid = document.querySelector('.tech-grid');
    techGrid.innerHTML = project.technologies.map(tech => `<span>${tech}</span>`).join('');

    // Action links
    const modalActions = document.querySelector('.modal-actions');
    modalActions.querySelectorAll('a')[0].href = project.demoUrl;
    modalActions.querySelectorAll('a')[1].href = project.githubUrl;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners
  viewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectCard = button.closest('.project-card');
      const projectIndex = projectCard.getAttribute('data-project');
      openModal(parseInt(projectIndex));
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ==================== BURGER MENU TOGGLE ====================
function initBurgerMenu() {
  const burgerMenu = document.querySelector('.burger-menu');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  if (!burgerMenu || !navMenu) return;

  // Toggle menu on burger click
  burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
    if (mobileOverlay) mobileOverlay.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking on a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      burgerMenu.classList.remove('active');
      navMenu.classList.remove('active');
      if (mobileOverlay) mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking on overlay
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => {
      burgerMenu.classList.remove('active');
      navMenu.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}

// ==================== INITIALIZE EVERYTHING ====================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize particle background and store globally for color changes
  window.particleBackground = new ParticleBackground();

  // Initialize other features
  initBurgerMenu();
  initSmoothScroll();
  initScrollAnimations();
  initParallaxScrolling();
  initNavbarScroll();
  initCursorGlow();
  initProjectModal();

  // Add loading animation
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});

// ==================== PAGE VISIBILITY ====================
// Pause animations when page is not visible
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Page is hidden, could pause heavy animations here
    console.log("Page hidden - animations paused");
  } else {
    // Page is visible again
    console.log("Page visible - animations resumed");
  }
});

