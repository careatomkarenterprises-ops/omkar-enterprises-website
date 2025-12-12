// js/simple-auth.js - SIMPLE WORKING VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log("Auth system loaded");
    
    // Define demo credentials
    const DEMO_CREDENTIALS = {
        'OE-INV-1001': { password: 'demo123', name: 'Rajesh Kumar' },
        'OE-INV-1002': { password: 'demo456', name: 'Priya Sharma' },
        'OE-INV-1003': { password: 'demo789', name: 'Amit Patel' }
    };
    
    // Check if we're on login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log("Login form found");
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Form submitted");
            
            const investorId = document.getElementById('investorId').value.trim();
            const password = document.getElementById('password').value;
            
            console.log("Trying:", investorId, password);
            
            // Check credentials
            if (DEMO_CREDENTIALS[investorId]) {
                if (DEMO_CREDENTIALS[investorId].password === password) {
                    // SUCCESS - Login
                    console.log("Login successful!");
                    
                    // Save session
                    const userData = {
                        id: investorId,
                        name: DEMO_CREDENTIALS[investorId].name,
                        loginTime: new Date().toISOString()
                    };
                    
                    localStorage.setItem('oe_investor_session', JSON.stringify(userData));
                    
                    // Redirect
                    window.location.href = 'investor-dashboard.html';
                    return;
                }
            }
            
            // FAILED - Show error
            console.log("Login failed");
            alert(`Invalid credentials! Try:\n\nOE-INV-1001 / demo123\nOE-INV-1002 / demo456\nOE-INV-1003 / demo789`);
        });
        
        // Add test button
        const testBtn = document.createElement('button');
        testBtn.type = 'button';
        testBtn.textContent = 'Fill Test Credentials (OE-INV-1001)';
        testBtn.style.cssText = `
            background: #28a745;
            color: white;
            border: none;
            padding: 10px;
            margin-top: 15px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
        `;
        testBtn.onclick = function() {
            document.getElementById('investorId').value = 'OE-INV-1001';
            document.getElementById('password').value = 'demo123';
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        };
        
        loginForm.appendChild(testBtn);
    }
    
    // Check if we're on dashboard
    if (window.location.pathname.includes('dashboard')) {
        console.log("Dashboard check");
        
        const session = localStorage.getItem('oe_investor_session');
        if (!session) {
            window.location.href = 'investor-login.html';
            return;
        }
        
        try {
            const userData = JSON.parse(session);
            console.log("User:", userData);
            
            // Update user info on dashboard
            setTimeout(function() {
                const nameElements = document.querySelectorAll('[class*="name"], [class*="user"]');
                nameElements.forEach(el => {
                    if (el.textContent.includes('User') || el.textContent.includes('User')) {
                        el.textContent = userData.name;
                    }
                });
            }, 100);
            
        } catch (e) {
            localStorage.removeItem('oe_investor_session');
            window.location.href = 'investor-login.html';
        }
    }
});
