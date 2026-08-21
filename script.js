// EthioTBrBrTkeBpianianploymentcomexckets
// Proclamation No. 1395/2025
// Based on monthly employment income

const TAX_BRACKETS = [
    { min: 0, max: 2000, rate: 0, deduction: 0 },
    { min: 2001, max: 4000, rate: 0.15, deduction: 300 },
    { min: 4001, max: 7000, rate: 0.20, deduction: 500 },
    { min: 7001, max: 10000, rate: 0.25, deduction: 850 },
    { min: 10001, max: 14000, rate: 0.30, deduction: 1350 },
    { min: 14001, max: Infinity, rate: 0.35, deduction: 2050 }
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
function calculateSalary(grossSalary) {
    const gross = Number(grossSalary);

    if (!Number.isFinite(gross) || gross < 0) {
        return null;
    }

    const pensionEmployee = gross * PENSION_EMPLOYEE_RATE;
    const taxableIncome = gross - pensionEmployee;
    const incomeTax = calculateIncomeTax(taxableIncome);
    const pensionEmployer = gross * PENSION_EMPLOYER_RATE;
    const totalDeductions = pensionEmployee + incomeTax;
    const netSalary = gross - totalDeductions;

    return {
        grossSalary: gross,
        pensionEmployee,
        taxableIncome,
        incomeTax,
        pensionEmployer,
        totalDeductions,
        netSalary
    };
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

