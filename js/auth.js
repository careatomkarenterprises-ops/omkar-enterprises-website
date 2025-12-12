// js/auth.js - Simple authentication system

// Demo investor credentials (REPLACE with real database later)
const DEMO_INVESTORS = {
    'OE-INV-1001': { password: 'demo123', name: 'Rajesh Kumar', tier: 'Growth', portfolio: 1000000 },
    'OE-INV-1002': { password: 'demo456', name: 'Priya Sharma', tier: 'Premium', portfolio: 5000000 },
    'OE-INV-1003': { password: 'demo789', name: 'Amit Patel', tier: 'Emerging', portfolio: 250000 }
};

// Session management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.init();
    }

    init() {
        // Check for existing session
        this.checkSession();
        
        // Track activity to prevent timeout
        ['click', 'keypress', 'mousemove'].forEach(event => {
            document.addEventListener(event, () => this.resetTimer());
        });
    }

    login(investorId, password) {
        // Validate credentials
        if (!DEMO_INVESTORS[investorId]) {
            return { success: false, error: 'Investor ID not found' };
        }

        const investor = DEMO_INVESTORS[investorId];
        
        if (investor.password !== password) {
            return { success: false, error: 'Incorrect password' };
        }

        // Create session
        this.currentUser = {
            id: investorId,
            name: investor.name,
            tier: investor.tier,
            portfolio: investor.portfolio,
            loginTime: new Date().toISOString(),
            token: this.generateToken()
        };

        // Save to localStorage
        localStorage.setItem('oe_investor_session', JSON.stringify(this.currentUser));
        
        // Start session timer
        this.startSessionTimer();

        return { success: true, user: this.currentUser };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('oe_investor_session');
        window.location.href = 'investor-login.html';
    }

    checkSession() {
        const session = localStorage.getItem('oe_investor_session');
        
        if (!session) return false;

        const userData = JSON.parse(session);
        const loginTime = new Date(userData.loginTime);
        const now = new Date();
        
        // Check if session expired
        if ((now - loginTime) > this.sessionTimeout) {
            this.logout();
            return false;
        }

        this.currentUser = userData;
        return true;
    }

    generateToken() {
        return 'tok_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
    }

    startSessionTimer() {
        setTimeout(() => {
            if (confirm('Your session will expire in 1 minute. Extend session?')) {
                this.resetTimer();
            } else {
                this.logout();
            }
        }, this.sessionTimeout - 60000);
    }

    resetTimer() {
        if (this.currentUser) {
            this.currentUser.loginTime = new Date().toISOString();
            localStorage.setItem('oe_investor_session', JSON.stringify(this.currentUser));
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// Initialize authentication
const auth = new AuthManager();

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = { auth, DEMO_INVESTORS };
}
