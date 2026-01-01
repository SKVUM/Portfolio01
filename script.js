// ==================== Animated Geometric Background ==================== //
function initAnimatedBackground() {
    const canvas = document.getElementById('animationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Set canvas size
    function resizeCanvas() {
        const heroSection = canvas.parentElement;
        canvas.width = heroSection.clientWidth;
        canvas.height = heroSection.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles/nodes
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Keep within bounds
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
        
        draw() {
            ctx.fillStyle = `rgba(0, 208, 132, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Draw connection lines between nearby particles
    function drawConnections() {
        const maxDistance = 150;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    ctx.strokeStyle = `rgba(0, 208, 132, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
}

// ==================== Dark Mode Toggle ==================== //
function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return; // safety: exit if button not present
    const html = document.documentElement;
    
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        html.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        html.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        // Trigger click and icon animations
        themeToggle.classList.add('is-active');
        themeToggle.classList.add('is-rotating');
        setTimeout(() => {
            themeToggle.classList.remove('is-active');
            themeToggle.classList.remove('is-rotating');
        }, 700);

        html.classList.toggle('dark-mode');
        const isDark = html.classList.contains('dark-mode');
        
        // Update icon with wrapper
        themeToggle.innerHTML = isDark 
            ? '<span class="theme-toggle-icon"><i class="fas fa-sun"></i></span>' 
            : '<span class="theme-toggle-icon"><i class="fas fa-moon"></i></span>';
        themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        
        // Save preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// ==================== Mobile Menu Toggle ==================== //
document.addEventListener('DOMContentLoaded', function() {
    initAnimatedBackground();
    initDarkMode();
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navMenu.classList.remove('active');
            
            // Update active state
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ==================== Smooth Scrolling ==================== //
    // Handle smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==================== Active Navigation Indicator ==================== //
    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // ==================== Form Handling ==================== //
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Basic validation
            if (!name.trim() || !email.trim() || !message.trim()) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            // In a real application, you would send this data to a backend server
                // Open WhatsApp with the filled details using click-to-chat
                // Convert local Sri Lankan number (starting with 0) to international (+94) format
                // User provided number: 0770056533 -> international: 94770056533
                try {
                    const phone = '94770056533';
                    const text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
                    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

                    // Open WhatsApp in a new tab/window
                    window.open(waUrl, '_blank');

                    showNotification('Opening WhatsApp with your message...', 'success');

                    // Reset form after opening
                    this.reset();
                } catch (err) {
                    console.error(err);
                    showNotification('Unable to open WhatsApp. Please try manually.', 'error');
                }
        });
    }

    // ==================== Utility Functions ==================== //
    
    /**
     * Validate email format
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Show notification to user
     */
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background-color: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease-in-out;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // ==================== Add Animation Styles ==================== //
    // Create a style element for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @media (max-width: 768px) {
            [style*="position: fixed"][style*="top: 20px"][style*="right: 20px"] {
                left: 20px !important;
                right: 20px !important;
                width: calc(100% - 40px) !important;
            }
        }
    `;
    document.head.appendChild(style);

    // ==================== Scroll-to-Top Button ==================== //
    const scrollTopButton = createScrollTopButton();
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopButton.style.display = 'block';
        } else {
            scrollTopButton.style.display = 'none';
        }
    });

    /**
     * Create and return scroll to top button
     */
    function createScrollTopButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'scroll-top-button';
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: #c41e3a;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            display: none;
            z-index: 999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#a01729';
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#c41e3a';
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(button);
        
        // Hide on mobile
        if (window.innerWidth <= 768) {
            button.style.display = 'none';
        }
        
        return button;
    }

    // ==================== Update Scroll Top Button Visibility on Resize ==================== //
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            scrollTopButton.style.display = 'none';
        } else {
            if (window.pageYOffset > 300) {
                scrollTopButton.style.display = 'block';
            }
        }
    });

    // ==================== Animate Progress Bars on Scroll ==================== //
    const progressBars = document.querySelectorAll('.progress');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger animation
                entry.target.style.animation = 'none';
                setTimeout(() => {
                    entry.target.style.animation = '';
                }, 10);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => {
        observer.observe(bar);
    });

    // ==================== Resume Download Button (local file) ==================== //
    const downloadBtn = document.getElementById('downloadResumeBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            const btn = this;
            btn.disabled = true;
            const orig = btn.innerHTML;
            btn.innerHTML = 'Preparing...';

            try {
                const a = document.createElement('a');
                a.href = 'Resume.pdf';
                a.download = 'Resume.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();

                showNotification('Download started', 'success');
            } catch (err) {
                console.error(err);
                showNotification('Failed to start download. Opening file instead.', 'error');
                window.open('Resume.pdf', '_blank');
            } finally {
                btn.disabled = false;
                btn.innerHTML = orig;
            }
        });
    }

    // ==================== Add Fade-in Animation to Elements on Scroll ==================== //
    const observerFadeIn = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observerFadeIn.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    // Apply fade-in to cards and items
    document.querySelectorAll('.education-card, .project-card, .skill-item').forEach(element => {
        element.style.opacity = '0';
        observerFadeIn.observe(element);
    });

});
