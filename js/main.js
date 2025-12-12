// Main JavaScript for Omkar Enterprises Website

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const currentYearSpan = document.getElementById('currentYear');
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    // Toggle current item
                    item.classList.toggle('active');
                });
            }
        });
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
                    hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    // Calculator functionality (if exists)
    const investmentSlider = document.getElementById('investmentAmount');
    if (investmentSlider) {
        investmentSlider.addEventListener('input', function() {
            const amount = parseInt(this.value);
            const monthlyReturn = amount * 0.025;
            const annualReturn = monthlyReturn * 12;
            
            // Format numbers with Indian Rupee format
            const formatter = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            
            // Update display
            document.getElementById('currentAmount').textContent = formatter.format(amount);
            document.getElementById('monthlyReturn').textContent = formatter.format(monthlyReturn);
            document.getElementById('annualReturn').textContent = formatter.format(annualReturn);
            document.getElementById('totalReturn').textContent = formatter.format(annualReturn);
        });
    }
});

// Form Submission Handling
class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
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
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        try {
            // Validate form
            if (!this.validateForm()) {
                throw new Error('Please fill all required fields correctly.');
            }
            
            // Simulate API call (replace with actual Formspree or backend)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showSuccess();
        } catch (error) {
            this.showError(error.message);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
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
        
        setTimeout(() => {
            if (errorDiv.parentNode === this.form) {
                this.form.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Initialize form handler
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contactForm')) {
        new FormHandler('contactForm');
    }
});
