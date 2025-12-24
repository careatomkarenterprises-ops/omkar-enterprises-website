// ENHANCED DASHBOARD FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Dashboard System Initializing...");
    
    // 1. CHECK AUTH FIRST
    const session = localStorage.getItem('oe_investor_session');
    if (!session) {
        window.location.href = 'investor-login.html';
        return;
    }
    
    const user = JSON.parse(session);
    console.log("👤 User:", user);
    
    // 2. INITIALIZE DASHBOARD COMPONENTS
    initSidebar();
    initNavigation();
    initFileUpload();
    initCalculators();
    loadInvestorData(user);
    initNotifications();
    
    // 3. SIDEBAR TOGGLE (MOBILE)
    function initSidebar() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const dashboardSidebar = document.getElementById('dashboardSidebar');
        const dashboardMain = document.getElementById('dashboardMain');
        
        if (sidebarToggle && dashboardSidebar) {
            sidebarToggle.addEventListener('click', function() {
                dashboardSidebar.classList.toggle('open');
                
                // Create overlay for mobile
                if (window.innerWidth <= 768) {
                    if (dashboardSidebar.classList.contains('open')) {
                        const overlay = document.createElement('div');
                        overlay.className = 'dashboard-overlay';
                        document.body.appendChild(overlay);
                        
                        overlay.addEventListener('click', function() {
                            dashboardSidebar.classList.remove('open');
                            this.remove();
                        });
                    } else {
                        const overlay = document.querySelector('.dashboard-overlay');
                        if (overlay) overlay.remove();
                    }
                }
            });
        }
    }
    
    // 4. SECTION NAVIGATION
    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.dashboard-section');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                
                // Update active nav
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Show target section
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetId) {
                        section.classList.add('active');
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
                
                // Close sidebar on mobile
                if (window.innerWidth <= 768) {
                    const sidebar = document.getElementById('dashboardSidebar');
                    if (sidebar) sidebar.classList.remove('open');
                    const overlay = document.querySelector('.dashboard-overlay');
                    if (overlay) overlay.remove();
                }
            });
        });
        
        // Set first section as active by default
        if (sections.length > 0 && navLinks.length > 0) {
            sections[0].classList.add('active');
            navLinks[0].classList.add('active');
        }
    }
    
    // 5. REAL FILE UPLOAD FUNCTIONALITY
    function initFileUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (!uploadArea || !fileInput) return;
        
        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());
        
        // Drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            uploadArea.addEventListener(event, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(event => {
            uploadArea.addEventListener(event, () => {
                uploadArea.style.borderColor = '#28a745';
                uploadArea.style.backgroundColor = '#f8f9fa';
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(event => {
            uploadArea.addEventListener(event, () => {
                uploadArea.style.borderColor = '#007bff';
                uploadArea.style.backgroundColor = 'transparent';
            }, false);
        });
        
        // Handle file drop
        uploadArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const files = e.dataTransfer.files;
            processFiles(files);
        }
        
        // Handle file input
        fileInput.addEventListener('change', function() {
            processFiles(this.files);
        });
        
        function processFiles(files) {
            if (!files.length) return;
            
            Array.from(files).forEach(file => {
                if (validateFile(file)) {
                    uploadFile(file);
                }
            });
        }
        
        function validateFile(file) {
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const maxSize = 10 * 1024 * 1024; // 10MB
            
            if (!validTypes.includes(file.type)) {
                showNotification('Please upload PDF, JPG, PNG, or DOC files only.', 'error');
                return false;
            }
            
            if (file.size > maxSize) {
                showNotification('File size must be less than 10MB.', 'error');
                return false;
            }
            
            return true;
        }
        
        function uploadFile(file) {
            // In production: Upload to server
            // For demo: Simulate upload
            
            const uploadList = document.getElementById('uploadList') || createUploadList();
            
            const fileItem = document.createElement('div');
            fileItem.className = 'upload-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-${getFileIcon(file.type)}"></i>
                    <div>
                        <h6>${file.name}</h6>
                        <small>${formatFileSize(file.size)} • Uploading...</small>
                    </div>
                </div>
                <div class="file-progress">
                    <div class="progress">
                        <div class="progress-bar" style="width: 0%"></div>
                    </div>
                    <button class="btn-icon cancel-upload" title="Cancel">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            uploadList.appendChild(fileItem);
            
            // Simulate upload progress
            simulateUploadProgress(fileItem, file);
        }
        
        function getFileIcon(type) {
            if (type.includes('pdf')) return 'file-pdf';
            if (type.includes('image')) return 'file-image';
            if (type.includes('word')) return 'file-word';
            return 'file';
        }
        
        function simulateUploadProgress(fileItem, file) {
            const progressBar = fileItem.querySelector('.progress-bar');
            let progress = 0;
            
            const interval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    // Mark as uploaded
                    fileItem.classList.add('uploaded');
                    fileItem.querySelector('.file-info small').textContent = 
                        `${formatFileSize(file.size)} • Uploaded ${new Date().toLocaleTimeString()}`;
                    
                    showNotification(`"${file.name}" uploaded successfully`, 'success');
                    
                    // Add to documents list
                    addToDocumentsList(file);
                }
                progressBar.style.width = `${progress}%`;
            }, 200);
            
            // Cancel upload button
            fileItem.querySelector('.cancel-upload').addEventListener('click', function() {
                clearInterval(interval);
                fileItem.remove();
                showNotification('Upload cancelled', 'warning');
            });
        }
        
        function addToDocumentsList(file) {
            const docsList = document.getElementById('documentsList') || 
                            document.querySelector('.documents-grid') ||
                            document.querySelector('.document-list');
            
            if (docsList) {
                const docCard = document.createElement('div');
                docCard.className = 'document-card';
                docCard.innerHTML = `
                    <div class="doc-icon">
                        <i class="fas fa-${getFileIcon(file.type)}"></i>
                    </div>
                    <div class="doc-info">
                        <h5>${file.name}</h5>
                        <p>Uploaded: ${new Date().toLocaleDateString()}</p>
                        <span class="doc-tag">Personal</span>
                    </div>
                    <div class="doc-actions">
                        <button class="btn-icon" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn-icon" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                docsList.appendChild(docCard);
            }
        }
    }
    
    // 6. LOAD REAL INVESTOR DATA
    function loadInvestorData(user) {
        console.log("📊 Loading data for:", user.id);
        
        // DEMO DATA - Replace with API call to your Excel/DB
        const demoData = {
            'OE-INV-1001': {
                totalInvested: 1000000,
                currentValue: 1105000,
                monthlyReturns: 25000,
                totalReturns: 105000,
                nextPayment: '2024-02-10',
                activeInvestments: 2,
                documents: 5,
                recentTransactions: [
                    { date: '2024-01-31', type: 'Interest', amount: 25000, status: 'Completed' },
                    { date: '2024-01-15', type: 'Investment', amount: 500000, status: 'Active' }
                ]
            },
            'OE-INV-1002': {
                totalInvested: 5000000,
                currentValue: 5250000,
                monthlyReturns: 125000,
                totalReturns: 250000,
                nextPayment: '2024-02-12',
                activeInvestments: 3,
                documents: 8,
                recentTransactions: []
            }
        };
        
        const data = demoData[user.id] || demoData['OE-INV-1001'];
        
        // Update dashboard with real data
        updateDashboardStats(data);
        updateInvestmentTable(data);
        updateTransactionHistory(data.recentTransactions);
    }
    
    function updateDashboardStats(data) {
        // Update quick stats
        document.querySelectorAll('.stat-value').forEach(el => {
            if (el.textContent.includes('₹') || el.id.includes('total')) {
                if (el.id.includes('invested') || el.classList.contains('total-invested')) {
                    el.textContent = `₹${data.totalInvested.toLocaleString('en-IN')}`;
                }
                if (el.id.includes('value') || el.classList.contains('current-value')) {
                    el.textContent = `₹${data.currentValue.toLocaleString('en-IN')}`;
                }
                if (el.id.includes('monthly') || el.classList.contains('monthly-returns')) {
                    el.textContent = `₹${data.monthlyReturns.toLocaleString('en-IN')}`;
                }
                if (el.id.includes('returns') || el.classList.contains('total-returns')) {
                    el.textContent = `₹${data.totalReturns.toLocaleString('en-IN')}`;
                }
            }
        });
        
        // Update next payment date
        const nextPaymentEl = document.querySelector('.next-payment-date');
        if (nextPaymentEl) {
            nextPaymentEl.textContent = new Date(data.nextPayment).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    }
    
    // 7. CALCULATOR WITH REAL DATA
    function initCalculators() {
        const calculator = document.querySelector('.roi-calculator');
        if (calculator) {
            // Connect calculator to real data
            const amountInput = calculator.querySelector('input[type="range"]');
            const amountDisplay = calculator.querySelector('#currentAmount');
            
            if (amountInput && amountDisplay) {
                amountInput.addEventListener('input', function() {
                    const amount = parseInt(this.value);
                    amountDisplay.textContent = formatCurrency(amount);
                    
                    // Calculate returns
                    const monthlyReturn = calculator.querySelector('#monthlyReturn');
                    const annualReturn = calculator.querySelector('#annualReturn');
                    const totalReturn = calculator.querySelector('#totalReturn');
                    
                    if (monthlyReturn) monthlyReturn.textContent = formatCurrency(amount * 0.025);
                    if (annualReturn) annualReturn.textContent = formatCurrency(amount * 0.025 * 12);
                    if (totalReturn) totalReturn.textContent = formatCurrency(amount * 0.025 * 12);
                });
            }
        }
    }
    
    // 8. HELPER FUNCTIONS
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' Bytes';
        if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / 1048576).toFixed(2) + ' MB';
    }
    
    function formatCurrency(amount) {
        return '₹' + amount.toLocaleString('en-IN');
    }
    
    function showNotification(message, type = 'info') {
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
        // Implementation from your existing dashboard.js
    }
    
    function createUploadList() {
        const list = document.createElement('div');
        list.id = 'uploadList';
        list.className = 'upload-list';
        document.querySelector('.upload-section').appendChild(list);
        return list;
    }
});
