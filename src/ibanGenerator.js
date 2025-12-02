/**
 * IBAN (International Bank Account Number) Generator
 * Generates valid Dutch IBAN numbers with proper checksums
 */

// Common Dutch bank codes
const DUTCH_BANK_CODES = ['ABNA', 'INGB', 'RABO', 'SNSB', 'TRIO', 'KNAB', 'BUNQ', 'ASNB'];

/**
 * Converts letters to numbers for IBAN validation (A=10, B=11, etc.)
 * @param {string} str - String to convert
 * @returns {string} - Numeric string
 */
function lettersToNumbers(str) {
  return str.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return (code - 55).toString();
    }
    return char;
  }).join('');
}

/**
 * Calculates modulo 97 for large numbers (as string)
 * @param {string} numStr - Number as string
 * @returns {number} - Result of modulo 97
 */
function mod97(numStr) {
  let remainder = 0;
  for (let i = 0; i < numStr.length; i++) {
    remainder = (remainder * 10 + parseInt(numStr[i], 10)) % 97;
  }
  return remainder;
}

/**
 * Validates an IBAN using modulo 97
 * @param {string} iban - The IBAN to validate
 * @returns {boolean} - True if valid
 */
function isValidIBAN(iban) {
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // Basic format check for Dutch IBAN
  if (!/^[A-Z]{2}\d{2}[A-Z]{4}\d{10}$/.test(cleanIban)) {
    return false;
  }
  
  // Rearrange: move first 4 characters to end
  const rearranged = cleanIban.slice(4) + cleanIban.slice(0, 4);
  
  // Convert letters to numbers
  const numeric = lettersToNumbers(rearranged);
  
  // Check if modulo 97 equals 1
  return mod97(numeric) === 1;
}

/**
 * Generates a valid Dutch IBAN number
 * @param {string} [bankCode] - Optional bank code (defaults to random Dutch bank)
 * @returns {string} - A valid Dutch IBAN
 */
function generateIBAN(bankCode) {
  // Use provided bank code or pick a random one
  const bank = bankCode || DUTCH_BANK_CODES[Math.floor(Math.random() * DUTCH_BANK_CODES.length)];
  
  // Generate random 10-digit account number
  let accountNumber = '';
  for (let i = 0; i < 10; i++) {
    accountNumber += Math.floor(Math.random() * 10).toString();
  }
  
  // Calculate check digits
  // Rearrange: BANK + account + NL00
  const checkString = bank + accountNumber + 'NL00';
  const numeric = lettersToNumbers(checkString);
  
  // Check digits = 98 - (numeric mod 97)
  const checkDigits = (98 - mod97(numeric)).toString().padStart(2, '0');
  
  return `NL${checkDigits}${bank}${accountNumber}`;
}

/**
 * Formats an IBAN with spaces for readability
 * @param {string} iban - The IBAN to format
 * @returns {string} - Formatted IBAN (e.g., "NL91 ABNA 0417 1643 00")
 */
function formatIBAN(iban) {
  return iban.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Generates multiple valid Dutch IBAN numbers
 * @param {number} count - Number of IBANs to generate
 * @param {string} [bankCode] - Optional bank code
 * @returns {string[]} - Array of valid IBANs
 */
function generateMultipleIBAN(count, bankCode) {
  const ibans = [];
  for (let i = 0; i < count; i++) {
    ibans.push(generateIBAN(bankCode));
  }
  return ibans;
}

module.exports = {
  generateIBAN,
  generateMultipleIBAN,
  formatIBAN,
  isValidIBAN,
  DUTCH_BANK_CODES
};
