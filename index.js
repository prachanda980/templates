// ====================== MOBILE MENU ======================
const menuBtn = document.querySelector('.mobile-menu-btn');
const navList = document.getElementById('navList');
const overlay = document.getElementById('overlay');

// Toggle mobile menu
menuBtn.addEventListener('click', () => {
    const isActive = navList.classList.toggle('active');
    menuBtn.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
});

// Close menu functions
function closeMenu() {
    navList.classList.remove('active');
    menuBtn.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners for closing menu
overlay.addEventListener('click', closeMenu);
document.querySelectorAll('.list a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});

// ====================== SKILLS INTERACTIONS ======================
document.querySelectorAll('.skill-list h3').forEach(skill => {
    // Click animation
    skill.addEventListener('click', function () {
        this.style.transform = 'translateY(-3px) scale(0.98)';
        this.style.backgroundColor = 'rgba(0, 173, 181, 0.15)';

        setTimeout(() => {
            this.style.transform = this.matches(':hover')
                ? 'translateY(-5px)'
                : 'translateY(0)';
            this.style.backgroundColor = this.matches(':hover')
                ? 'rgba(0, 173, 181, 0.1)'
                : 'rgba(255, 255, 255, 0.05)';
        }, 200);
    });

    // Add hover state restoration
    skill.addEventListener('mouseenter', function () {
        if (!this.classList.contains('clicked')) {
            this.style.transform = 'translateY(-5px)';
            this.style.backgroundColor = 'rgba(0, 173, 181, 0.1)';
        }
    });

    skill.addEventListener('mouseleave', function () {
        if (!this.classList.contains('clicked')) {
            this.style.transform = 'translateY(0)';
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }
    });
});

// ====================== PROJECT BUTTONS ======================
document.querySelectorAll('.project-info button').forEach(button => {
    button.addEventListener('click', function (e) {
        // Prevent form submission if inside form
        if (this.closest('form')) {
            e.preventDefault();
        }

        // Click animation
        this.style.transform = 'translateY(0) scale(0.98)';

        setTimeout(() => {
            this.style.transform = this.matches(':hover')
                ? 'translateY(-3px)'
                : 'translateY(0)';
        }, 200);

        // Optional: Add project-specific functionality
        const projectName = this.closest('.project-info')?.querySelector('h3')?.textContent || 'Project';
        console.log(`Viewing details for: ${projectName}`);
    });
});

// ====================== FORM INTERACTIONS ======================
const formInputs = document.querySelectorAll('.right-contect-side input');
const contactForm = document.querySelector('.right-contect-side');
const submitBtn = document.querySelector('.submit-btn button');

// Focus effects for inputs
formInputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'translateY(-2px)';
        this.style.borderColor = '#00adb5';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'translateY(0)';
        if (!this.value.trim()) {
            this.style.borderColor = '';
        }
    });

    // Clear error state on input
    input.addEventListener('input', function () {
        this.style.borderColor = this.style.borderColor === 'rgb(255, 107, 53)' ? '' : this.style.borderColor;
    });
});

// Form validation and submission
if (contactForm && submitBtn) {
    // Make form submit on button click
    submitBtn.addEventListener('click', handleFormSubmit);

    // Also allow form submission on Enter key in last input
    const lastInput = formInputs[formInputs.length - 1];
    if (lastInput) {
        lastInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleFormSubmit(e);
            }
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    // Reset all error states
    formInputs.forEach(input => {
        input.style.borderColor = '';
    });

    // Validate each field
    let isValid = true;
    const formData = {};

    formInputs.forEach((input, index) => {
        const value = input.value.trim();
        formData[input.type === 'email' ? 'email' : index === 0 ? 'name' : 'message'] = value;

        if (!value) {
            isValid = false;
            input.style.borderColor = '#ff6b35';
            showFieldError(input, 'This field is required');
        }
    });

    // Email validation
    if (isValid && !isValidEmail(formData.email)) {
        isValid = false;
        const emailInput = document.querySelector('input[type="email"]');
        emailInput.style.borderColor = '#ff6b35';
        showFieldError(emailInput, 'Please enter a valid email address');
    }

    if (!isValid) {
        showNotification('Please fill in all fields correctly', 'error');
        return;
    }

    // Submit animation
    submitBtn.disabled = true;
    submitBtn.style.transform = 'translateY(0) scale(0.98)';
    submitBtn.textContent = 'Sending...';

    // Simulate API call
    setTimeout(() => {
        submitBtn.style.transform = '';
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.backgroundColor = '#4CAF50';

        showNotification('Message sent successfully! I will get back to you soon.', 'success');

        // Clear form
        formInputs.forEach(input => {
            input.value = '';
        });

        // Reset button after delay
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send message';
            submitBtn.style.backgroundColor = '';
        }, 2000);

    }, 1500);
}

// ====================== HELPER FUNCTIONS ======================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#ff6b35' : type === 'success' ? '#00adb5' : '#28313f'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 4000);
}

function showFieldError(input, message) {
    // Remove existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create error message
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.cssText = `
        color: #ff6b35;
        font-size: 12px;
        margin-top: 5px;
        animation: fadeIn 0.3s ease;
    `;

    // Add fadeIn animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    input.parentElement.appendChild(error);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        error.style.opacity = '0';
        error.style.transform = 'translateY(-5px)';
        setTimeout(() => {
            error.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// ====================== ADDITIONAL ENHANCEMENTS ======================
// Smooth scroll for anchor links (if you add section navigation)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const targetElement = document.querySelector(href);
        if (targetElement) {
            e.preventDefault();
            closeMenu(); // Close mobile menu if open

            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Highlight active navigation link on scroll
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 100;

    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.list a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded successfully!');

    // Add loading animation for images (optional)
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function () {
            this.style.opacity = '1';
        });
        img.style.transition = 'opacity 0.3s ease';
        img.style.opacity = img.complete ? '1' : '0';
    });
});