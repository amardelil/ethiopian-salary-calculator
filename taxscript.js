// Ethiopian Tax Brackets (as of 2024)
// Based on monthly income
const TAX_BRACKETS = [
    { min: 0, max: 600, rate: 0, deduction: 0 },
    { min: 601, max: 1650, rate: 0.10, deduction: 60 },
    { min: 1651, max: 3200, rate: 0.15, deduction: 142.5 },
    { min: 3201, max: 5250, rate: 0.20, deduction: 302.5 },
    { min: 5251, max: 7800, rate: 0.25, deduction: 565 },
    { min: 7801, max: 10900, rate: 0.30, deduction: 955 },
    { min: 10901, max: Infinity, rate: 0.35, deduction: 1500 }
];

// Pension rates
const PENSION_EMPLOYEE_RATE = 0.07;  // 7%
const PENSION_EMPLOYER_RATE = 0.11;  // 11%

// DOM Elements
const grossInput = document.getElementById('grossSalary');
const netSalarySpan = document.getElementById('netSalary');
const incomeTaxSpan = document.getElementById('incomeTax');
const pensionEmployeeSpan = document.getElementById('pensionEmployee');
const pensionEmployerSpan = document.getElementById('pensionEmployer');
const totalDeductionsSpan = document.getElementById('totalDeductions');
const employerPensionItem = document.getElementById('employerPensionItem');
const includeEmployerCheckbox = document.getElementById('includeEmployerPension');
const downloadBtn = document.getElementById('downloadPDF');
const resetBtn = document.getElementById('resetBtn');

// Helper: Calculate income tax based on gross salary
function calculateIncomeTax(gross) {
    for (const bracket of TAX_BRACKETS) {
        if (gross >= bracket.min && gross <= bracket.max) {
            return gross * bracket.rate - bracket.deduction;
        }
    }
    return 0;
}

// Helper: Format currency in ETB
function formatCurrency(amount) {
    return amount.toFixed(2) + ' ብር';
}

// Main calculation function
function calculateSalary() {
    let gross = parseFloat(grossInput.value);
    if (isNaN(gross) || gross < 0) gross = 0;

    // Calculate pension (employee)
    const pensionEmployee = gross * PENSION_EMPLOYEE_RATE;
    
    // Calculate income tax (based on gross - pension? In Ethiopia, pension is deducted before tax)
    const taxableIncome = gross - pensionEmployee;
    const incomeTax = calculateIncomeTax(taxableIncome);
    
    // Net salary
    const netSalary = gross - pensionEmployee - incomeTax;
    
    // Employer pension (if checkbox is checked)
    const pensionEmployer = gross * PENSION_EMPLOYER_RATE;
    
    // Total deductions
    const totalDeductions = pensionEmployee + incomeTax;
    
    // Update DOM
    netSalarySpan.textContent = formatCurrency(netSalary);
    incomeTaxSpan.textContent = formatCurrency(incomeTax);
    pensionEmployeeSpan.textContent = formatCurrency(pensionEmployee);
    totalDeductionsSpan.textContent = formatCurrency(totalDeductions);
    
    if (includeEmployerCheckbox.checked) {
        pensionEmployerSpan.textContent = formatCurrency(pensionEmployer);
        employerPensionItem.style.display = 'block';
    } else {
        employerPensionItem.style.display = 'none';
    }
}

// Reset to default
function resetCalculator() {
    grossInput.value = '10000';
    includeEmployerCheckbox.checked = false;
    employerPensionItem.style.display = 'none';
    calculateSalary();
}

// Download as PDF using html2pdf
function downloadPDF() {
    const element = document.querySelector('.calculator-card');
    const opt = {
        margin:       0.5,
        filename:     'Ethiopian_Salary_Calculation.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, letterRendering: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

// Event listeners
grossInput.addEventListener('input', calculateSalary);
includeEmployerCheckbox.addEventListener('change', calculateSalary);
downloadBtn.addEventListener('click', downloadPDF);
resetBtn.addEventListener('click', resetCalculator);

// Initial calculation
calculateSalary();

