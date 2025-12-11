// ROI Calculator for Omkar Enterprises

class ROICalculator {
    constructor() {
        this.investmentAmount = document.getElementById('investmentAmount');
        this.currentAmount = document.getElementById('currentAmount');
        this.monthlyReturn = document.getElementById('monthlyReturn');
        this.annualReturn = document.getElementById('annualReturn');
        this.totalReturn = document.getElementById('totalReturn');
        
        if (this.investmentAmount) {
            this.init();
        }
    }
    
    init() {
        // Initialize number formatter
        this.formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        // Initial calculation
        this.updateCalculator();
        
        // Add event listeners
        this.investmentAmount.addEventListener('input', () => this.updateCalculator());
        
        // Create amount input field
        this.createAmountInput();
        
        // Create tier buttons
        this.createTierButtons();
        
        // Add amortization table functionality
        this.addAmortizationFeature();
    }
    
    updateCalculator() {
        const amount = parseInt(this.investmentAmount.value);
        
        // Update current amount display
        if (this.currentAmount) {
            this.currentAmount.textContent = this.formatter.format(amount);
        }
        
        // Calculate returns
        const monthly = amount * 0.025; // 2.5%
        const annual = monthly * 12;
        const total = annual;
        
        // Update result displays
        if (this.monthlyReturn) {
            this.monthlyReturn.textContent = this.formatter.format(monthly);
        }
        if (this.annualReturn) {
            this.annualReturn.textContent = this.formatter.format(annual);
        }
        if (this.totalReturn) {
            this.totalReturn.textContent = this.formatter.format(total);
        }
        
        // Update slider background
        this.updateSliderBackground(amount);
        
        // Store current amount for other functions
        this.currentInvestment = amount;
    }
    
    updateSliderBackground(amount) {
        const percentage = ((amount - 25000) / (2500000 - 25000)) * 100;
        this.investmentAmount.style.background = `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${percentage}%, #E0E0E0 ${percentage}%, #E0E0E0 100%)`;
    }
    
    createAmountInput() {
        // Create input field for exact amount
        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.min = '25000';
        amountInput.max = '2500000';
        amountInput.step = '1000';
        amountInput.value = '100000';
        amountInput.className = 'amount-input';
        amountInput.style.cssText = `
            width: 100%;
            padding: 10px;
            margin-top: 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            text-align: center;
        `;
        
        amountInput.addEventListener('input', (e) => {
            let value = parseInt(e.target.value);
            if (value < 25000) value = 25000;
            if (value > 2500000) value = 2500000;
            
            this.investmentAmount.value = value;
            this.updateCalculator();
        });
        
        // Insert after slider
        this.investmentAmount.parentNode.appendChild(amountInput);
    }
    
    createTierButtons() {
        const tierSuggestions = document.createElement('div');
        tierSuggestions.className = 'tier-suggestions';
        tierSuggestions.innerHTML = `
            <p style="margin: 15px 0 10px; font-weight: 600; color: var(--primary-blue);">Quick Select:</p>
            <div class="tier-buttons" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
                <button data-amount="25000" style="flex: 1; min-width: 80px;">₹25K</button>
                <button data-amount="100000" style="flex: 1; min-width: 80px;">₹1L</button>
                <button data-amount="500000" style="flex: 1; min-width: 80px;">₹5L</button>
                <button data-amount="1000000" style="flex: 1; min-width: 80px;">₹10L</button>
                <button data-amount="2500000" style="flex: 1; min-width: 80px;">₹25L</button>
            </div>
        `;
        
        // Add styles for tier buttons
        const style = document.createElement('style');
        style.textContent = `
            .tier-buttons button {
                padding: 10px 15px;
                background: white;
                border: 2px solid var(--primary-blue);
                color: var(--primary-blue);
                border-radius: 5px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            .tier-buttons button:hover {
                background: var(--primary-blue);
                color: white;
                transform: translateY(-2px);
            }
            .tier-buttons button:active {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
        
        this.investmentAmount.parentNode.parentNode.appendChild(tierSuggestions);
        
        // Add tier button functionality
        document.querySelectorAll('.tier-buttons button').forEach(button => {
            button.addEventListener('click', () => {
                const amount = parseInt(button.getAttribute('data-amount'));
                this.investmentAmount.value = amount;
                document.querySelector('.amount-input').value = amount;
                this.updateCalculator();
            });
        });
    }
    
    addAmortizationFeature() {
        const calculatorLink = document.querySelector('.calculator-link');
        if (calculatorLink) {
            calculatorLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAmortizationModal();
            });
        }
    }
    
    generateAmortizationTable(principal) {
        const table = document.createElement('table');
        table.className = 'amortization-table';
        
        // Calculate dates starting from next month
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() + 1);
        
        let html = `
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Payment Date</th>
                    <th>Fixed Return (2.5%)</th>
                    <th>Cumulative Returns</th>
                    <th>Principal Balance</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        let cumulativeReturns = 0;
        
        for (let month = 1; month <= 13; month++) {
            const isPrincipalMonth = month === 13;
            const returnAmount = isPrincipalMonth ? 0 : principal * 0.025;
            cumulativeReturns += returnAmount;
            const principalBalance = isPrincipalMonth ? 0 : principal;
            
            // Calculate payment date (1st-7th of each month)
            const paymentDate = new Date(startDate);
            paymentDate.setMonth(paymentDate.getMonth() + (month - 1));
            
            const formattedDate = paymentDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            
            html += `
                <tr>
                    <td>${month}</td>
                    <td>${formattedDate}</td>
                    <td>${isPrincipalMonth ? '-' : this.formatter.format(returnAmount)}</td>
                    <td>${this.formatter.format(cumulativeReturns)}</td>
                    <td>${isPrincipalMonth ? 'Repaid' : this.formatter.format(principalBalance)}</td>
                </tr>
            `;
        }
        
        html += `
                <tr style="background: #f8f9fa; font-weight: 600;">
                    <td colspan="2">Total</td>
                    <td>${this.formatter.format(principal * 0.3)}</td>
                    <td>${this.formatter.format(principal * 0.3)}</td>
                    <td>${this.formatter.format(principal)}</td>
                </tr>
            </tbody>
        `;
        
        table.innerHTML = html;
        return table;
    }
    
    showAmortizationModal() {
        const principal = this.currentInvestment || 100000;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Amortization Schedule for ${this.formatter.format(principal)}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Detailed payment schedule for your investment:</p>
                    <div class="table-container" style="overflow-x: auto; margin: 20px 0;">
                        ${this.generateAmortizationTable(principal).outerHTML}
                    </div>
                    <div class="modal-note" style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Note:</strong></p>
                        <ul style="margin: 10px 0 0 20px;">
                            <li>Monthly returns are paid by the 10th working day</li>
                            <li>Principal is repaid in the 13th month</li>
                            <li>Performance-based returns (if any) are additional</li>
                            <li>All dates are approximate and may vary by ±3 days</li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary print-schedule">
                            <i class="fas fa-print"></i> Print Schedule
                        </button>
                        <button class="btn btn-outline modal-close-btn">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close modal functionality
        const closeModal = () => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Print functionality
        modal.querySelector('.print-schedule').addEventListener('click', () => {
            const printContent = `
                <html>
                    <head>
                        <title>Omkar Enterprises - Amortization Schedule</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { color: #001F3F; }
                            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                            th { background: #001F3F; color: white; }
                            .footer { margin-top: 40px; font-size: 12px; color: #666; }
                        </style>
                    </head>
                    <body>
                        <h1>Omkar Enterprises</h1>
                        <h2>Amortization Schedule</h2>
                        <p>Investment Amount: ${this.formatter.format(principal)}</p>
                        ${this.generateAmortizationTable(principal).outerHTML}
                        <div class="footer">
                            <p>Generated on: ${new Date().toLocaleDateString('en-IN')}</p>
                            <p>This is a computer-generated schedule. For official documents, refer to your Loan Agreement.</p>
                        </div>
                    </body>
                </html>
            `;
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('investmentAmount')) {
        new ROICalculator();
    }
});

// Export for global use
window.ROICalculator = ROICalculator;