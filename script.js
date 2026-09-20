document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const theme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            updateThemeIcon(theme);
        });
    }

    function updateThemeIcon(theme) {
        if (themeIcon) {
            if (theme === 'light') {
                themeIcon.className = 'fa-solid fa-sun';
            } else {
                themeIcon.className = 'fa-solid fa-moon';
            }
        }
    }

    // 2. Header Sticky Styling & Active Link Highlights on Scroll
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link on Scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Shift trigger threshold up slightly for better transition
            if (window.scrollY >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Mobile Navigation Menu Toggle
    const burgerMenu = document.getElementById('burger-menu');
    const navLinksContainer = document.getElementById('nav-links');

    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // 4. Portfolio Filtering Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Add fade out animation class first
                card.style.opacity = '0';
                card.style.transform = 'scale(0.85) translateY(10px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // Initialize all project card transitions
    projectCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease, border-color 0.2s ease, box-shadow 0.2s ease';
    });

    // 5. Scroll Reveal Intersection Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve after showing to avoid re-triggering animations on upscroll
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px' // Trigger slightly before full screen entry for easier scrolls
    });

    // Automatically apply stagger transition delays to items inside grid/list containers
    const staggerContainers = document.querySelectorAll('.skills-grid, .portfolio-grid, .timeline, .certifications-grid');
    staggerContainers.forEach(container => {
        const items = container.querySelectorAll('.reveal, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right, .reveal-scale');
        items.forEach((item, index) => {
            // Apply delay, stagger by 80ms for an extremely fluid cascade
            item.style.transitionDelay = `${index * 80}ms`;
        });
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 6. Contact Form Handle (FormSubmit AJAX Submission)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;

            // Visual sending state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-circle-notch fa-spin" style="margin-left: 8px;"></i>';

            // Prepare Form Data
            const formData = new FormData(contactForm);
            const dataObject = Object.fromEntries(formData.entries());

            // Post to FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/vishnukarthikeya123@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dataObject)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                // Success state
                submitBtn.style.background = '#10b981'; // Solid Emerald Green
                submitBtn.innerHTML = 'Message Sent! <i class="fa-solid fa-circle-check" style="margin-left: 8px;"></i>';
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                // Failure state
                submitBtn.style.background = '#ef4444'; // Solid Red
                submitBtn.innerHTML = 'Failed to Send <i class="fa-solid fa-circle-xmark" style="margin-left: 8px;"></i>';
            })
            .finally(() => {
                // Re-enable button after 3 seconds
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    submitBtn.innerHTML = originalBtnContent;
                }, 3000);
            });
        });
    }

    // 7. Certifications Lightbox Modal Logic
    const certModal = document.getElementById('cert-modal');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalClose = document.getElementById('cert-modal-close');
    const certViewButtons = document.querySelectorAll('.cert-view-btn');

    if (certModal && certModalImg && certModalClose) {
        certViewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const certImage = button.getAttribute('data-cert');
                certModalImg.src = certImage;
                certModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Stop page scrolling
            });
        });

        const closeCertModal = () => {
            certModal.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable page scrolling
            setTimeout(() => {
                certModalImg.src = ''; // Clear source after transition
            }, 300);
        };

        certModalClose.addEventListener('click', closeCertModal);
        
        // Close on clicking overlay background
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                closeCertModal();
            }
        });

        // Close on pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certModal.classList.contains('active')) {
                closeCertModal();
            }
        });
    }
});


