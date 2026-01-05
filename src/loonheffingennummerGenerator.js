/**
 * Loonheffingennummer Generator
 * Generates valid Dutch payroll tax numbers that pass the modulus-11 test
 */

// Weights for modulus-11 validation
const LOONHEFFINGENNUMMER_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Validates a Loonheffingennummer using the modulus-11 test
 * @param {string} loonheffingennummer - The number to validate (9 digits)
 * @returns {boolean} - True if valid
 */
function isValidLoonheffingennummer(loonheffingennummer) {
  if (!/^\d{9}$/.test(loonheffingennummer)) {
    return false;
  }

  const digits = loonheffingennummer.split('').map(Number);
  
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += digits[i] * LOONHEFFINGENNUMMER_WEIGHTS[i];
  }
  
  const remainder = sum % 11;
  
  // The 9th digit (check digit) must equal the remainder
  return digits[8] === remainder;
}

/**
 * Generates a valid Loonheffingennummer
 * @returns {string} - A valid 9-digit Loonheffingennummer
 */
function generateLoonheffingennummer() {
  while (true) {
    // Generate first 8 random digits
    const digits = [];
    for (let i = 0; i < 8; i++) {
      // First digit should not be 0
      if (i === 0) {
        digits.push(Math.floor(Math.random() * 9) + 1);
      } else {
        digits.push(Math.floor(Math.random() * 10));
      }
    }
    
    // Calculate the 9th digit (check digit) using modulus-11
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += digits[i] * LOONHEFFINGENNUMMER_WEIGHTS[i];
    }
    
    const checkDigit = sum % 11;
    
    // If check digit is 10, we need to regenerate (since it must be a single digit)
    if (checkDigit > 9) {
      continue;
    }
    
    digits.push(checkDigit);
    return digits.join('');
  }
}

/**
 * Generates multiple valid Loonheffingennummer numbers
 * @param {number} count - Number of Loonheffingennummers to generate
 * @returns {string[]} - Array of valid Loonheffingennummers
 */
function generateMultipleLoonheffingennummer(count) {
  const loonheffingennummers = [];
  for (let i = 0; i < count; i++) {
    loonheffingennummers.push(generateLoonheffingennummer());
  }
  return loonheffingennummers;
}

module.exports = {
  generateLoonheffingennummer,
  generateMultipleLoonheffingennummer,
  isValidLoonheffingennummer
};
