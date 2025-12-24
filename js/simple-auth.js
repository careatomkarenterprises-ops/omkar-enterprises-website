// FIXED AUTH SYSTEM - Replace ALL auth files with this
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Enhanced Auth System Loaded");
    
    // 1. DEMO CREDENTIALS (Replace with real database later)
    const DEMO_INVESTORS = {
        'OE-INV-1001': { 
            password: 'demo123', 
            name: 'Rajesh Kumar',
            tier: 'Growth',
            portfolio: 1000000,
            investments: [
                { id: 'INV-001', amount: 500000, date: '2024-01-15' },
                { id: 'INV-002', amount: 500000, date: '2024-03-20' }
            ]
        },
        'OE-INV-1002': { 
            password: 'demo456', 
            name: 'Priya Sharma',
            tier: 'Premium',
            portfolio: 5000000
        },
        'OE-INV-1003': { 
            password: 'demo789', 
            name: 'Amit Patel',
            tier: 'Emerging',
            portfolio: 250000
        }
    };
    
    // 2. CHECK IF USER IS LOGGED IN
    function checkAuth() {
        const session = localStorage.getItem('oe_investor_session');
        if (!session) return null;
        
        try {
            return JSON.parse(session);
        } catch (e) {
            localStorage.removeItem('oe_investor_session');
            return null;
        }
    }
    
    // 3. LOGIN PAGE FUNCTIONALITY
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log("🔄 Setting up login form...");
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const investorId = document.getElementById('investorId').value.trim().toUpperCase();
            const password = document.getElementById('password').value;
            
            // Validate input
            if (!investorId || !password) {
                showAuthMessage('Please enter Investor ID and password', 'error');
                return;
            }
            
            // Check credentials
            if (DEMO_INVESTORS[investorId] && DEMO_INVESTORS[investorId].password === password) {
                // ✅ SUCCESS - Create session
                const userData = {
                    id: investorId,
                    name: DEMO_INVESTORS[investorId].name,
                    tier: DEMO_INVESTORS[investorId].tier,
                    portfolio: DEMO_INVESTORS[investorId].portfolio,
                    loginTime: new Date().toISOString(),
                    token: 'tok_' + Date.now() + Math.random().toString(36).substr(2)
                };
                
                // Save session
                localStorage.setItem('oe_investor_session', JSON.stringify(userData));
                
                // Show success message
                showAuthMessage(`Welcome back, ${userData.name}! Redirecting...`, 'success');
                
                // Redirect to dashboard after 1.5 seconds
                setTimeout(() => {
                    window.location.href = 'investor-dashboard.html';
                }, 1500);
                
            } else {
                // ❌ FAILED
                showAuthMessage(
                    'Invalid credentials! Try:<br>' +
                    '• OE-INV-1001 / demo123<br>' +
                    '• OE-INV-1002 / demo456<br>' +
                    '• OE-INV-1003 / demo789',
                    'error'
                );
            }
        });
        
        // Add demo fill button
        addDemoButton();
    }
    
    // 4. DASHBOARD PROTECTION
    if (window.location.pathname.includes('dashboard')) {
        console.log("🛡️ Checking dashboard access...");
        
        const user = checkAuth();
        if (!user) {
            // Not logged in - redirect to login
            window.location.href = 'investor-login.html?redirect=' + encodeURIComponent(window.location.pathname);
            return;
        }
        
        // User is logged in - update dashboard
        updateDashboard(user);
        
        // Setup session timeout (30 minutes)
        setupSessionTimeout();
    }
    
    // 5. LOGOUT FUNCTIONALITY
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('logout-btn') || 
            e.target.closest('.logout-btn') ||
            e.target.classList.contains('btn-logout')) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('oe_investor_session');
                window.location.href = 'investor-login.html?logout=true';
            }
        }
    });
    
    // 6. HELPER FUNCTIONS
    function showAuthMessage(message, type) {
        // Remove existing messages
        const existing = document.querySelector('.auth-message');
        if (existing) existing.remove();
        
        // Create message element
        const msg = document.createElement('div');
        msg.className = `auth-message ${type}`;
        msg.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
                <div>${message}</div>
            </div>
            <button class="close-message"><i class="fas fa-times"></i></button>
        `;
        
        // Add styles if not present
        if (!document.querySelector('#auth-styles')) {
            const styles = `
                <style id="auth-styles">
                    .auth-message {
                        padding: 15px 20px;
                        border-radius: 8px;
                        margin: 20px 0;
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        animation: slideIn 0.3s ease;
                    }
                    .auth-message.error {
                        background: #f8d7da;
                        color: #721c24;
                        border: 1px solid #f5c6cb;
                    }
                    .auth-message.success {
                        background: #d4edda;
                        color: #155724;
                        border: 1px solid #c3e6cb;
                    }
                    .auth-message.info {
                        background: #d1ecf1;
                        color: #0c5460;
                        border: 1px solid #bee5eb;
                    }
                    .message-content {
                        display: flex;
                        align-items: flex-start;
                        gap: 10px;
                        flex: 1;
                    }
                    .message-content i {
                        margin-top: 2px;
                    }
                    .close-message {
                        background: none;
                        border: none;
                        color: inherit;
                        cursor: pointer;
                        padding: 5px;
                        margin-left: 10px;
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
            document.head.insertAdjacentHTML('beforeend', styles);
        }
        
        // Insert message
        const loginBox = document.querySelector('.login-box');
        if (loginBox) {
            loginBox.parentNode.insertBefore(msg, loginBox);
        } else {
            document.body.insertBefore(msg, document.body.firstChild);
        }
        
        // Close button
        msg.querySelector('.close-message').addEventListener('click', function() {
            msg.remove();
        });
        
        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                if (msg.parentNode) msg.remove();
            }, 5000);
        }
    }
    
    function addDemoButton() {
        const demoBtn = document.createElement('button');
        demoBtn.type = 'button';
        demoBtn.className = 'demo-credentials-btn';
        demoBtn.innerHTML = `
            <i class="fas fa-user-secret"></i>
            Fill Demo Credentials (OE-INV-1001)
        `;
        demoBtn.style.cssText = `
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 20px;
            margin-top: 20px;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.3s ease;
        `;
        
        demoBtn.onclick = function() {
            document.getElementById('investorId').value = 'OE-INV-1001';
            document.getElementById('password').value = 'demo123';
            
            // Optional: Auto-submit
            // loginForm.dispatchEvent(new Event('submit'));
            
            showAuthMessage('Demo credentials filled. Click "Sign In" to continue.', 'info');
        };
        
        demoBtn.onmouseenter = function() {
            this.style.background = '#218838';
            this.style.transform = 'translateY(-2px)';
        };
        
        demoBtn.onmouseleave = function() {
            this.style.background = '#28a745';
            this.style.transform = 'translateY(0)';
        };
        
        const form = document.querySelector('.login-form') || loginForm;
        if (form) {
            form.appendChild(demoBtn);
        }
    }
    
    function updateDashboard(user) {
        // Update user info throughout dashboard
        setTimeout(() => {
            // Update welcome message
            const welcomeEl = document.querySelector('.welcome-message, .user-name, [class*="welcome"]');
            if (welcomeEl) {
                welcomeEl.textContent = `Welcome, ${user.name}`;
            }
            
            // Update investor ID
            const idEls = document.querySelectorAll('.investor-id, [class*="id"]');
            idEls.forEach(el => {
                if (el.textContent.includes('ID') || el.textContent.includes('Id')) {
                    el.textContent = `Investor ID: ${user.id}`;
                }
            });
            
            // Update portfolio value
            const portfolioEls = document.querySelectorAll('.portfolio-value, [class*="portfolio"]');
            portfolioEls.forEach(el => {
                if (el.textContent.includes('₹') || el.textContent.includes('Portfolio')) {
                    el.textContent = `₹${user.portfolio.toLocaleString('en-IN')}`;
                }
            });
            
            // Update tier badge
            const tierEls = document.querySelectorAll('.tier-badge, [class*="tier"]');
            tierEls.forEach(el => {
                if (el.textContent.includes('Tier') || !el.textContent) {
                    el.textContent = user.tier;
                    el.className = `tier-badge ${user.tier.toLowerCase()}`;
                }
            });
        }, 100);
    }
    
    function setupSessionTimeout() {
        let timeout;
        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (confirm('Your session will expire due to inactivity. Extend session?')) {
                    resetTimer();
                } else {
                    localStorage.removeItem('oe_investor_session');
                    window.location.href = 'investor-login.html?session=expired';
                }
            }, 30 * 60 * 1000); // 30 minutes
        };
        
        // Reset on user activity
        ['click', 'keypress', 'mousemove', 'scroll'].forEach(event => {
            document.addEventListener(event, resetTimer);
        });
        
        resetTimer(); // Start timer
    }
    
    // 7. CHECK LOGOUT/REDIRECT PARAMETERS
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('logout')) {
        showAuthMessage('You have been successfully logged out.', 'info');
    }
    if (urlParams.has('session')) {
        showAuthMessage('Your session has expired. Please log in again.', 'error');
    }
});
