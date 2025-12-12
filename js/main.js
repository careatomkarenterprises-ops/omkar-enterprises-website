// Main JavaScript for Omkar Enterprises Website

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const currentYearSpan = document.getElementById('currentYear');

// Mobile Menu Toggle
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        menuToggle.innerHTML = isActive 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    });
}

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = '';
    }
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', () => {
    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
    
    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            if (href.startsWith('#') && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.step-card, .tier-card, .legal-card').forEach(el => {
        observer.observe(el);
    });
});

// Form Submission Handling
class FormHandler {
    constructor(formId, successMessage) {
        this.form = document.getElementById(formId);
        this.successMessage = successMessage || 'Thank you for your submission!';
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const originalState = submitBtn.disabled;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        try {
            // Validate form
            if (!this.validateForm()) {
                throw new Error('Please fill all required fields correctly.');
            }
            
            // Collect form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Add timestamp and page info
            data._timestamp = new Date().toISOString();
            data._page = window.location.href;
            
            // Submit to Formspree
            const response = await fetch(this.form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                this.showSuccess();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Form submission failed');
            }
        } catch (error) {
            this.showError(error.message);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = originalState;
        }
    }
    
    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                this.highlightError(field);
            } else {
                this.removeHighlight(field);
            }
        });
        
        return isValid;
    }
    
    highlightError(field) {
        field.style.borderColor = 'var(--danger)';
        field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    }
    
    removeHighlight(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }
    
    showSuccess() {
        const successHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h3>Thank You for Your Interest!</h3>
                <p>We've received your consultation request. Our team will contact you within 24 hours.</p>
                <p><strong>Next Steps:</strong></p>
                <ol>
                    <li>Check your email for confirmation</li>
                    <li>Review the sample agreement</li>
                    <li>Prepare your questions for our call</li>
                </ol>
                <p class="form-note">
                    <small>If you don't hear from us within 24 hours, please email us directly at partners@omkarenterprises.in</small>
                </p>
            </div>
        `;
        
        this.form.innerHTML = successHTML;
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `
            <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #f5c6cb;">
                <i class="fas fa-exclamation-circle"></i>
                <strong>Error:</strong> ${message}
            </div>
        `;
        
        this.form.insertBefore(errorDiv, this.form.firstChild);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode === this.form) {
                this.form.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contactForm')) {
        new FormHandler('contactForm');
    }
});

// Export for global use

window.FormHandler = FormHandler;
