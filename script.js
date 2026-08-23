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
const annualGrossSalarySpan = document.getElementById('annualGrossSalary');
const annualIncomeTaxSpan = document.getElementById('annualIncomeTax');
const annualPensionEmployeeSpan = document.getElementById('annualPensionEmployee');
const annualTotalDeductionsSpan = document.getElementById('annualTotalDeductions');
const annualNetSalarySpan = document.getElementById('annualNetSalary');
const annualPensionEmployerSpan = document.getElementById('annualPensionEmployer');
const annualEmployerPensionItem = document.getElementById('annualEmployerPensionItem');
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
    if (!Number.isFinite(gross) || gross <= 0) {
        return 0;
    }

    for (const bracket of TAX_BRACKETS) {
        if (gross >= bracket.min && gross <= bracket.max) {
            const tax = gross * bracket.rate - bracket.deduction;
            return Math.max(0, tax);
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
    netSalary,

    // Annual salary summary
    annualGrossSalary: gross * 12,
    annualPensionEmployee: pensionEmployee * 12,
    annualIncomeTax: incomeTax * 12,
    annualTotalDeductions: totalDeductions * 12,
    annualNetSalary: netSalary * 12,
    annualPensionEmployer: pensionEmployer * 12
};
}
function updateUI() {
    let gross = parseFloat(grossInput.value);

    if (isNaN(gross) || gross < 0) {
        gross = 0;
    }

    const result = calculateSalary(gross);

    if (!result) return;

    netSalarySpan.textContent = formatCurrency(result.netSalary);
    incomeTaxSpan.textContent = formatCurrency(result.incomeTax);
    pensionEmployeeSpan.textContent = formatCurrency(result.pensionEmployee);
    totalDeductionsSpan.textContent = formatCurrency(result.totalDeductions);

    if (includeEmployerCheckbox.checked) {
        pensionEmployerSpan.textContent = formatCurrency(result.pensionEmployer);
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
    updateUI();
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
grossInput.addEventListener('input', updateUI);
includeEmployerCheckbox.addEventListener('change', updateUI);
downloadBtn.addEventListener('click', downloadPDF);
resetBtn.addEventListener('click', resetCalculator);

// Initial calculation
updateUI();
// Development tests for salary calculations
function runSalaryTests() {
    const testSalaries = [
    0,
    1999,
    2000,
    2001,
    3999,
    4000,
    4001,
    6999,
    7000,
    7001,
    9999,
    10000,
    10001,
    13999,
    14000,
    14001,
    20000
];
    testSalaries.forEach((salary) => {
        const result = calculateSalary(salary);

        console.assert(
            result !== null,
            `Salary calculation failed for ${salary} ETB`
        );

        if (result) {
            console.assert(
                result.grossSalary === salary,
                `Gross salary mismatch for ${salary} ETB`
            );

            console.assert(
                result.pensionEmployee >= 0,
                `Employee pension is invalid for ${salary} ETB`
            );

            console.assert(
                result.incomeTax >= 0,
                `Income tax is negative for ${salary} ETB`
            );

            console.assert(
                result.netSalary >= 0,
                `Net salary is negative for ${salary} ETB`
            );
        }
    });

    console.log('Salary calculation tests completed.');
}

// Run development tests
runSalaryTests();
