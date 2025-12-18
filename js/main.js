// Main Application Logic
class Portfolio {
    constructor() {
        this.dataLoader = window.dataLoader;
        this.init();
    }

    async init() {
        // Load data
        await this.dataLoader.loadData();

        // Render all sections
        this.renderHero();
        this.renderAbout();
        this.renderExperience();
        this.renderSkills();
        this.renderProjects();
        this.renderContact();
        this.renderFooter();

        // Initialize interactions
        this.initNavbar();
        this.initScrollAnimations();
        this.initSmoothScroll();
    }

    // Render Hero Section
    renderHero() {
        const personal = this.dataLoader.getPersonal();

        document.getElementById('heroName').textContent = personal.name;
        document.getElementById('heroTitle').textContent = personal.title;
        document.getElementById('heroTagline').textContent = personal.tagline;
        document.getElementById('heroImage').src = personal.photo;
        document.getElementById('heroImage').alt = personal.name;
        document.getElementById('resumeBtn').href = personal.resume;
        document.title = `${personal.name} - Portfolio`;
    }

    // Render About Section
    renderAbout() {
        const personal = this.dataLoader.getPersonal();
        document.getElementById('aboutBio').textContent = personal.bio;
    }

    // Render Experience Section
    renderExperience() {
        const experience = this.dataLoader.getExperience();
        const timeline = document.getElementById('experienceTimeline');

        timeline.innerHTML = experience.map((exp, index) => `
      <div class="timeline-item glass-card scroll-animate stagger-${(index % 5) + 1}">
        <div class="timeline-header">
          <div>
            <h3 class="timeline-company">${exp.company}</h3>
            <p class="timeline-title">${exp.position}</p>
          </div>
          <span class="timeline-date">
            ${this.formatDate(exp.startDate)} - ${exp.current ? 'Present' : this.formatDate(exp.endDate)}
          </span>
        </div>
        <p class="timeline-description">${exp.description}</p>
        ${exp.highlights && exp.highlights.length > 0 ? `
          <ul class="timeline-highlights">
            ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        ` : ''}
        ${exp.technologies && exp.technologies.length > 0 ? `
          <div class="timeline-tags">
            ${exp.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');
    }

    // Render Skills Section
    renderSkills() {
        const skills = this.dataLoader.getSkills();
        const skillsGrid = document.getElementById('skillsGrid');

        skillsGrid.innerHTML = Object.entries(skills).map(([category, skillList], index) => `
      <div class="skill-category scroll-animate stagger-${(index % 5) + 1}">
        <h3 class="skill-category-title">${category}</h3>
        ${skillList.map(skill => `
          <div class="skill-item">
            <div class="skill-header">
              <span class="skill-name">${skill.name}</span>
              <span class="skill-level">${skill.level}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-bar-fill" data-level="${skill.level}" style="width: 0%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');
    }

    // Render Projects Section
    renderProjects() {
        const projects = this.dataLoader.getProjects();
        const projectsGrid = document.getElementById('projectsGrid');

        projectsGrid.innerHTML = projects.map((project, index) => `
      <div class="project-card scroll-animate-scale stagger-${(index % 5) + 1}">
        <img src="${project.image}" alt="${project.title}" class="project-image">
        <div class="project-content">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          ${project.technologies && project.technologies.length > 0 ? `
            <div class="project-tags">
              ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
            </div>
          ` : ''}
          <div class="project-links">
            ${project.github ? `
              <a href="${project.github}" target="_blank" class="project-link">
                <i class="fab fa-github"></i> Code
              </a>
            ` : ''}
            ${project.demo ? `
              <a href="${project.demo}" target="_blank" class="project-link">
                <i class="fas fa-external-link-alt"></i> Demo
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');
    }

    // Render Contact Section
    renderContact() {
        const social = this.dataLoader.getSocial();
        const socialLinks = document.getElementById('socialLinks');

        const iconMap = {
            linkedin: 'fab fa-linkedin',
            github: 'fab fa-github',
            twitter: 'fab fa-twitter',
            email: 'fas fa-envelope',
            facebook: 'fab fa-facebook',
            instagram: 'fab fa-instagram'
        };

        socialLinks.innerHTML = social.map(link => `
      <a href="${link.url}" target="_blank" class="social-link hover-lift" title="${link.name}">
        <i class="${iconMap[link.icon] || 'fas fa-link'}"></i>
      </a>
    `).join('');
    }

    // Render Footer
    renderFooter() {
        const personal = this.dataLoader.getPersonal();
        document.getElementById('footerName').textContent = personal.name;
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    }

    // Initialize Navbar
    initNavbar() {
        const navbar = document.getElementById('navbar');
        const navbarToggle = document.getElementById('navbarToggle');
        const navbarMenu = document.getElementById('navbarMenu');

        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        navbarToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            const icon = navbarToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close menu on link click
        navbarMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navbarMenu.classList.remove('active');
                const icon = navbarToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Initialize Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');

                    // Animate skill bars
                    if (entry.target.classList.contains('skill-category')) {
                        const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
                        skillBars.forEach(bar => {
                            const level = bar.getAttribute('data-level');
                            setTimeout(() => {
                                bar.style.width = `${level}%`;
                            }, 100);
                        });
                    }
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale').forEach(el => {
            observer.observe(el);
        });
    }

    // Initialize Smooth Scroll
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Format date helper
    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new Portfolio();
});
