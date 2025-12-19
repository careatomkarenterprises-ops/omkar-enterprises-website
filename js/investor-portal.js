// Investor Portal Authentication Logic
const VALID_CREDENTIALS = [
    { id: "OE-INV-12345", password: "investor123", name: "Rajesh Kumar", tier: "Growth" },
    { id: "OE-INV-67890", password: "demo2025", name: "Priya Sharma", tier: "Foundation" }
];

function handleLogin(investorId, password) {
    const investor = VALID_CREDENTIALS.find(
        cred => cred.id === investorId && cred.password === password
    );
    
    if (investor) {
        // IMPORTANT: Using 'oe_investor_session' to match what your dashboard expects
        localStorage.setItem('oe_investor_session', JSON.stringify({
            id: investor.id,
            name: investor.name,
            tier: investor.tier,
            loggedIn: true,
            loginTime: new Date().toISOString()
        }));
        return { success: true };
    }
    return { success: false, error: "Invalid credentials" };
}

// Add this at the bottom to handle the Login Button on the login page
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const id = document.getElementById('investorId').value;
            const pass = document.getElementById('password').value;
            const result = handleLogin(id, pass);
            
            if (result.success) {
                window.location.href = 'investor-dashboard.html';
            } else {
                alert("Invalid Login ID or Password");
            }
        });
    }
});

// Simple static credentials for testing
const VALID_CREDENTIALS = [
    { id: "OE-INV-12345", password: "investor123", name: "Rajesh Kumar", tier: "Growth" },
    { id: "OE-INV-67890", password: "demo2025", name: "Priya Sharma", tier: "Foundation" },
    { id: "OE-IN-55555", password: "test123", name: "Amit Patel", tier: "Premier" }
];

// Login function
function handleLogin(investorId, password) {
    const investor = VALID_CREDENTIALS.find(
        cred => cred.id === investorId && cred.password === password
    );
    
    if (investor) {
        // Store in localStorage for session
        localStorage.setItem('currentInvestor', JSON.stringify({
            id: investor.id,
            name: investor.name,
            tier: investor.tier,
            loggedIn: true,
            loginTime: new Date().toISOString()
        }));
        
        return { success: true, investor: investor };
    }
    
    return { success: false, error: "Invalid credentials" };
}


// Investor Portal JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Login Form Toggle
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tab) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Toggle Password Visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Login Form Validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const investorId = document.getElementById('investorId').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // Simple validation
            if (!investorId || !password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            if (!investorId.match(/^OE-INV-\d{5}$/)) {
                showMessage('Invalid Investor ID format. Format: OE-INV-12345', 'error');
                return;
            }
            
            if (password.length < 8) {
                showMessage('Password must be at least 8 characters', 'error');
                return;
            }
            
            // Simulate login (in real implementation, this would be an API call)
            showMessage('Logging in...', 'success');
            
            // Redirect to dashboard after successful login
            setTimeout(() => {
                window.location.href = 'investor-dashboard.html';
            }, 1500);
        });
    }
    
    // Demo Tour
    const demoTour = document.getElementById('demoTour');
    if (demoTour) {
        demoTour.addEventListener('click', function() {
            // Open dashboard in new tab with demo mode
            const demoUrl = 'investor-dashboard.html?demo=true';
            window.open(demoUrl, '_blank');
        });
    }
    
    // Forgot Password Modal
    const forgotLinks = document.querySelectorAll('.forgot-link');
    forgotLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showForgotPasswordModal();
        });
    });
    
    // Show message function
    function showMessage(message, type) {
        // Remove existing messages
        const existingMsg = document.querySelector('.login-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        // Create message element
        const msgEl = document.createElement('div');
        msgEl.className = `login-message ${type}`;
        msgEl.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span>${message}</span>
            <button class="close-msg"><i class="fas fa-times"></i></button>
        `;
        
        // Insert after login box
        const loginBox = document.querySelector('.login-box');
        if (loginBox) {
            loginBox.parentNode.insertBefore(msgEl, loginBox.nextSibling);
        }
        
        // Add close button functionality
        const closeBtn = msgEl.querySelector('.close-msg');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                msgEl.remove();
            });
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (msgEl.parentNode) {
                msgEl.remove();
            }
        }, 5000);
    }
    
    // Forgot Password Modal
    function showForgotPasswordModal() {
        const modalHtml = `
            <div class="modal-overlay" id="forgotModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3><i class="fas fa-key"></i> Reset Password</h3>
                        <button class="close-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <p>Enter your registered email address to receive password reset instructions.</p>
                        <div class="form-group">
                            <label for="resetEmail">Email Address</label>
                            <input type="email" id="resetEmail" placeholder="email@example.com">
                        </div>
                        <div class="form-group">
                            <label for="investorIdReset">Investor ID</label>
                            <input type="text" id="investorIdReset" placeholder="OE-INV-XXXXX">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline close-modal">Cancel</button>
                        <button class="btn btn-primary" id="submitReset">Send Reset Link</button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        const existingModal = document.getElementById('forgotModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Add modal styles if not present
        if (!document.querySelector('#modal-styles')) {
            const modalStyles = `
                <style id="modal-styles">
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0,0,0,0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 2000;
                        padding: 20px;
                    }
                    
                    .modal {
                        background: white;
                        border-radius: 15px;
                        width: 100%;
                        max-width: 500px;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    }
                    
                    .modal-header {
                        padding: 20px 25px;
                        border-bottom: 1px solid #e9ecef;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    .modal-header h3 {
                        margin: 0;
                        color: var(--charcoal);
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    
                    .close-modal {
                        background: none;
                        border: none;
                        font-size: 1.2rem;
                        color: #666;
                        cursor: pointer;
                        padding: 5px;
                    }
                    
                    .modal-body {
                        padding: 25px;
                    }
                    
                    .modal-body p {
                        margin: 0 0 20px 0;
                        color: #666;
                    }
                    
                    .modal-footer {
                        padding: 20px 25px;
                        border-top: 1px solid #e9ecef;
                        display: flex;
                        justify-content: flex-end;
                        gap: 15px;
                    }
                    
                    .modal .form-group {
                        margin-bottom: 20px;
                    }
                    
                    .modal .form-group label {
                        display: block;
                        margin-bottom: 8px;
                        font-weight: 500;
                        color: var(--charcoal);
                    }
                    
                    .modal .form-group input {
                        width: 100%;
                        padding: 12px 15px;
                        border: 2px solid #e9ecef;
                        border-radius: 8px;
                        font-size: 1rem;
                    }
                    
                    .modal .form-group input:focus {
                        border-color: var(--gold);
                        outline: none;
                    }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', modalStyles);
        }
        
        // Add modal functionality
        const modal = document.getElementById('forgotModal');
        const closeButtons = modal.querySelectorAll('.close-modal');
        const submitBtn = modal.querySelector('#submitReset');
        
        // Close modal
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                modal.remove();
            });
        });
        
        // Close on overlay click
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.remove();
            }
        });
        
        // Submit reset request
        if (submitBtn) {
            submitBtn.addEventListener('click', function() {
                const email = document.getElementById('resetEmail').value.trim();
                const investorId = document.getElementById('investorIdReset').value.trim();
                
                if (!email || !investorId) {
                    showMessage('Please fill in all fields', 'error');
                    return;
                }
                
                if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                    showMessage('Please enter a valid email address', 'error');
                    return;
                }
                
                if (!investorId.match(/^OE-INV-\d{5}$/)) {
                    showMessage('Invalid Investor ID format', 'error');
                    return;
                }
                
                // Simulate API call
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                this.disabled = true;
                
                setTimeout(() => {
                    showMessage('Password reset link sent to your email', 'success');
                    modal.remove();
                }, 2000);
            });
        }
    }
    
    // Add message styles
    if (!document.querySelector('#message-styles')) {
        const messageStyles = `
            <style id="message-styles">
                .login-message {
                    padding: 15px 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    animation: slideIn 0.3s ease;
                }
                
                .login-message.error {
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }
                
                .login-message.success {
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }
                
                .login-message i {
                    font-size: 1.2rem;
                }
                
                .login-message span {
                    flex: 1;
                }
                
                .close-msg {
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    padding: 5px;
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', messageStyles);
    }
});

// Session Management
class SessionManager {
    constructor() {
        this.sessionTimeout = 15 * 60 * 1000; // 15 minutes
        this.lastActivity = Date.now();
        this.init();
    }
    
    init() {
        // Track user activity
        ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, () => this.resetTimer());
        });
        
        // Check session on page load
        this.checkSession();
        
        // Start session timer
        this.startTimer();
    }
    
    resetTimer() {
        this.lastActivity = Date.now();
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            const idleTime = Date.now() - this.lastActivity;
            
            if (idleTime > this.sessionTimeout) {
                this.logout('Session expired due to inactivity');
            } else if (idleTime > this.sessionTimeout - 60000) {
                // Show warning 1 minute before expiry
                this.showWarning();
            }
        }, 30000); // Check every 30 seconds
    }
    
    checkSession() {
        const token = localStorage.getItem('investor_token');
        const expiry = localStorage.getItem('token_expiry');
        
        if (!token || !expiry || Date.now() > parseInt(expiry)) {
            if (window.location.pathname.includes('dashboard')) {
                window.location.href = 'investor-login.html?session=expired';
            }
        }
    }
    
    showWarning() {
        // Show warning modal (simplified)
        console.warn('Session will expire in 1 minute');
        // In production, show a modal asking user to extend session
    }
    
    logout(reason = '') {
        clearInterval(this.timer);
        localStorage.removeItem('investor_token');
        localStorage.removeItem('token_expiry');
        
        if (reason) {
            alert(`Logged out: ${reason}`);
        }
        
        if (window.location.pathname.includes('dashboard')) {
            window.location.href = 'investor-login.html';
        }
    }
}

// Initialize session manager on dashboard
if (window.location.pathname.includes('dashboard')) {
    const sessionManager = new SessionManager();
}

// Demo Mode Check
if (window.location.search.includes('demo=true')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Show demo banner
        const demoBanner = document.createElement('div');
        demoBanner.className = 'demo-banner';
        demoBanner.innerHTML = `
            <div class="demo-content">
                <i class="fas fa-info-circle"></i>
                <span><strong>Demo Mode:</strong> This is a preview of the investor dashboard. All data is sample data.</span>
            </div>
            <button class="close-demo"><i class="fas fa-times"></i></button>
        `;
        document.body.insertBefore(demoBanner, document.body.firstChild);
        
        // Add demo banner styles
        const demoStyles = `
            <style>
                .demo-banner {
                    background: linear-gradient(135deg, #ffc107, #ffa500);
                    color: #856404;
                    padding: 15px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 2000;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .demo-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .demo-content i {
                    font-size: 1.2rem;
                }
                
                .close-demo {
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    padding: 5px;
                }
                
                .dashboard-page .demo-banner {
                    top: 60px;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', demoStyles);
        
        // Close demo banner
        document.querySelector('.close-demo').addEventListener('click', function() {
            demoBanner.remove();
        });
    });

}
