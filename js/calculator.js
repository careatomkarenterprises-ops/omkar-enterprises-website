// ROI Calculator for Omkar Enterprises
class ROICalculator {
    constructor() {
        this.investmentAmount = document.getElementById('investmentAmount');
        this.currentAmount = document.getElementById('currentAmount');
        this.monthlyReturn = document.getElementById('monthlyReturn');
        this.totalReturn = document.getElementById('totalReturn');
        this.btnSchedule = document.getElementById('viewSchedule'); // Fixed button ID
        
        if (this.investmentAmount) {
            this.init();
        }
    }
    
    init() {
        this.formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        });
        
        // Listen for input changes
        this.investmentAmount.addEventListener('input', () => this.updateCalculator());
        
        // FIX: Print Schedule Button Logic
        if (this.btnSchedule) {
            this.btnSchedule.addEventListener('click', (e) => {
                e.preventDefault();
                this.printAmortizationSchedule();
            });
        }
        
        this.updateCalculator();
    }
    
    updateCalculator() {
        const principal = parseInt(this.investmentAmount.value) || 0;
        const monthlyRate = 0.025; // 2.5% Fixed
        const monthlyFixed = principal * monthlyRate;
        
        if (this.currentAmount) this.currentAmount.textContent = this.formatter.format(principal);
        if (this.monthlyReturn) this.monthlyReturn.textContent = this.formatter.format(monthlyFixed);
        if (this.totalReturn) this.totalReturn.textContent = this.formatter.format(monthlyFixed * 12);
    }

    printAmortizationSchedule() {
        const principal = parseInt(this.investmentAmount.value) || 0;
        const monthlyReturn = principal * 0.025;
        
        // Create a new window for the print view
        const printWindow = window.open('', '_blank');
        
        let tableRows = '';
        for (let i = 1; i <= 12; i++) {
            tableRows += `
                <tr>
                    <td>Month ${i}</td>
                    <td>${this.formatter.format(principal)}</td>
                    <td>2.5%</td>
                    <td>${this.formatter.format(monthlyReturn)}</td>
                </tr>`;
        }

        printWindow.document.write(`
            <html>
            <head>
                <title>Omkar Enterprises - Amortization Schedule</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    th { background-color: #1a365d; color: white; }
                    .header { text-align: center; border-bottom: 2px solid #bd9300; padding-bottom: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Omkar Enterprises</h1>
                    <p>Amortization Schedule for Investment: ${this.formatter.format(principal)}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Principal Amount</th>
                            <th>Monthly ROI</th>
                            <th>Return Payout</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
                <p style="margin-top:20px; font-size: 12px;">* This is a computer-generated schedule for reference only.</p>
                <script>window.onload = function() { window.print(); window.close(); }</script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new ROICalculator();
});
