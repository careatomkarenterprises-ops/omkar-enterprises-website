// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const dashboardSidebar = document.getElementById('dashboardSidebar');
    const dashboardMain = document.getElementById('dashboardMain');
    let sidebarOverlay = null;
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            dashboardSidebar.classList.toggle('open');
            
            // Create overlay for mobile
            if (window.innerWidth <= 768) {
                if (dashboardSidebar.classList.contains('open')) {
                    sidebarOverlay = document.createElement('div');
                    sidebarOverlay.className = 'dashboard-overlay open';
                    dashboardMain.parentNode.insertBefore(sidebarOverlay, dashboardMain);
                    
                    sidebarOverlay.addEventListener('click', function() {
                        dashboardSidebar.classList.remove('open');
                        this.remove();
                    });
                } else if (sidebarOverlay) {
                    sidebarOverlay.remove();
                }
            }
        });
    }
    
    // Navigation between sections
    const navLinks = document.querySelectorAll('.nav-link');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            dashboardSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                    
                    // Scroll to top of section
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            
            // Close sidebar on mobile after selection
            if (window.innerWidth <= 768 && dashboardSidebar.classList.contains('open')) {
                dashboardSidebar.classList.remove('open');
                if (sidebarOverlay) {
                    sidebarOverlay.remove();
                }
            }
        });
    });
    
    // Document category filtering
    const catBtns = document.querySelectorAll('.cat-btn');
    const docCategories = document.querySelectorAll('.document-category');
    
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            catBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding category
            docCategories.forEach(cat => {
                cat.classList.remove('active');
                if (cat.id === category) {
                    cat.classList.add('active');
                }
            });
        });
    });
    
    // File Upload Functionality
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const browseFiles = document.getElementById('browseFiles');
    const uploadList = document.getElementById('uploadList');
    
    if (uploadArea && fileInput && browseFiles) {
        // Click to browse
        browseFiles.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            uploadArea.style.borderColor = '#28a745';
            uploadArea.style.backgroundColor = '#f8f9fa';
        }
        
        function unhighlight() {
            uploadArea.style.borderColor = '#007bff';
            uploadArea.style.backgroundColor = 'transparent';
        }
        
        // Handle drop
        uploadArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }
        
        // Handle file input change
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
        
        function handleFiles(files) {
            if (!files.length) return;
            
            // Clear previous uploads in demo mode
            if (window.location.search.includes('demo=true')) {
                uploadList.innerHTML = '';
            }
            
            Array.from(files).forEach(file => {
                if (validateFile(file)) {
                    addFileToList(file);
                }
            });
        }
        
        function validateFile(file) {
            const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            const maxSize = 10 * 1024 * 1024; // 10MB
            
            if (!validTypes.includes(file.type)) {
                showNotification('Invalid file type. Please upload PDF, JPG, or PNG files.', 'error');
                return false;
            }
            
            if (file.size > maxSize) {
                showNotification('File size exceeds 10MB limit.', 'error');
                return false;
            }
            
            return true;
        }
        
        function addFileToList(file) {
            const fileItem = document.createElement('div');
            fileItem.className = 'upload-file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file-pdf"></i>
                    <div>
                        <h5>${file.name}</h5>
                        <p>${formatFileSize(file.size)} • ${file.type}</p>
                    </div>
                </div>
                <div class="file-actions">
                    <div class="upload-progress">
                        <div class="progress-bar" style="width: 0%"></div>
                    </div>
                    <button class="btn-icon remove-file" title="Remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            uploadList.appendChild(fileItem);
            
            // Simulate upload progress
            simulateUpload(fileItem, file);
            
            // Remove file functionality
            const removeBtn = fileItem.querySelector('.remove-file');
            removeBtn.addEventListener('click', function() {
                fileItem.remove();
            });
        }
        
        function simulateUpload(fileItem, file) {
            const progressBar = fileItem.querySelector('.progress-bar');
            let progress = 0;
            
            const uploadInterval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress > 100) {
                    progress = 100;
                    clearInterval(uploadInterval);
                    
                    // Show success
                    fileItem.classList.add('uploaded');
                    fileItem.querySelector('.file-info i').className = 'fas fa-check-circle success';
                    
                    showNotification(`"${file.name}" uploaded successfully`, 'success');
                }
                progressBar.style.width = `${progress}%`;
            }, 200);
        }
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }
    
    // Notification Dropdown
    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    
    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notifDropdown.style.display = notifDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // Mark all as read
        const markAllRead = document.querySelector('.mark-all-read');
        if (markAllRead) {
            markAllRead.addEventListener('click', function() {
                document.querySelectorAll('.notif-item.unread').forEach(item => {
                    item.classList.remove('unread');
                });
                document.querySelector('.notif-count').textContent = '0';
                showNotification('All notifications marked as read', 'success');
            });
        }
    }
    
    // Profile Dropdown
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        if (notifDropdown) notifDropdown.style.display = 'none';
        if (profileDropdown) profileDropdown.style.display = 'none';
    });
    
    // Close messages panel
    const closeMessages = document.getElementById('closeMessages');
    if (closeMessages) {
        closeMessages.addEventListener('click', function() {
            document.querySelector('.dashboard-messages').style.display = 'none';
        });
    }
    
    // Logout functionality
    const logoutBtns = document.querySelectorAll('.logout-btn, .btn-logout');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to log out?')) {
                // Clear session
                localStorage.removeItem('investor_token');
                localStorage.removeItem('token_expiry');
                
                // Redirect to login
                window.location.href = 'investor-login.html';
            }
        });
    });
    
    // Export functionality
    const exportBtns = document.querySelectorAll('[class*="export"]');
    exportBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.textContent.includes('CSV') ? 'CSV' : 'PDF';
            showNotification(`Preparing ${type} export...`, 'info');
            
            // Simulate export generation
            setTimeout(() => {
                showNotification(`${type} export ready for download`, 'success');
            }, 2000);
        });
    });
    
    // Print functionality
    const printBtns = document.querySelectorAll('[class*="print"]');
    printBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            window.print();
        });
    });
    
    // Notification function
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotif = document.querySelector('.global-notification');
        if (existingNotif) {
            existingNotif.remove();
        }
        
        // Create notification
        const notif = document.createElement('div');
        notif.className = `global-notification ${type}`;
        notif.innerHTML = `
            <div class="notif-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                 type === 'error' ? 'exclamation-circle' : 
                                 type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="close-notif"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notif);
        
        // Add styles if not present
        if (!document.querySelector('#notification-styles')) {
            const styles = `
                <style id="notification-styles">
                    .global-notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 15px 20px;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 15px;
                        min-width: 300px;
                        max-width: 400px;
                        z-index: 2000;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                        animation: slideInRight 0.3s ease;
                    }
                    
                    .global-notification.success {
                        background: #d4edda;
                        color: #155724;
                        border: 1px solid #c3e6cb;
                    }
                    
                    .global-notification.error {
                        background: #f8d7da;
                        color: #721c24;
                        border: 1px solid #f5c6cb;
                    }
                    
                    .global-notification.warning {
                        background: #fff3cd;
                        color: #856404;
                        border: 1px solid #ffeaa7;
                    }
                    
                    .global-notification.info {
                        background: #d1ecf1;
                        color: #0c5460;
                        border: 1px solid #bee5eb;
                    }
                    
                    .notif-content {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        flex: 1;
                    }
                    
                    .notif-content i {
                        font-size: 1.2rem;
                    }
                    
                    .close-notif {
                        background: none;
                        border: none;
                        color: inherit;
                        cursor: pointer;
                        padding: 5px;
                    }
                    
                    @keyframes slideInRight {
                        from {
                            opacity: 0;
                            transform: translateX(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', styles);
        }
        
        // Close notification
        const closeBtn = notif.querySelector('.close-notif');
        closeBtn.addEventListener('click', function() {
            notif.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notif.parentNode) {
                notif.remove();
            }
        }, 5000);
    }
    
    // Upload file item styles
    if (!document.querySelector('#upload-styles')) {
        const uploadStyles = `
            <style id="upload-styles">
                .upload-file-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 15px;
                    background: white;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    margin-bottom: 10px;
                }
                
                .file-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    flex: 1;
                }
                
                .file-info i {
                    font-size: 2rem;
                    color: #dc3545;
                }
                
                .file-info i.success {
                    color: #28a745;
                }
                
                .file-info h5 {
                    margin: 0 0 5px 0;
                    color: var(--charcoal);
                    font-size: 0.95rem;
                }
                
                .file-info p {
                    margin: 0;
                    color: #666;
                    font-size: 0.85rem;
                }
                
                .file-actions {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .upload-progress {
                    width: 100px;
                    height: 6px;
                    background: #e9ecef;
                    border-radius: 3px;
                    overflow: hidden;
                }
                
                .upload-progress .progress-bar {
                    height: 100%;
                    background: #28a745;
                    transition: width 0.3s ease;
                }
                
                .uploaded .upload-progress .progress-bar {
                    background: #28a745;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', uploadStyles);
    }
    
    // Initialize tooltips
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('title');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            
            this.tooltip = tooltip;
        });
        
        el.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }
        });
    });
    
    // Add tooltip styles
    if (!document.querySelector('#tooltip-styles')) {
        const tooltipStyles = `
            <style id="tooltip-styles">
                .tooltip {
                    position: fixed;
                    background: #333;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 0.85rem;
                    z-index: 3000;
                    pointer-events: none;
                    white-space: nowrap;
                    opacity: 0.9;
                }
                
                .tooltip:before {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 50%;
                    transform: translateX(-50%);
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 5px solid #333;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', tooltipStyles);
    }
});