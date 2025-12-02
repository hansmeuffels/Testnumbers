/**
 * BSN (Burgerservicenummer) Generator
 * Generates valid Dutch citizen service numbers that pass the 11-test
 */

/**
 * Validates a BSN number using the 11-test
 * @param {string} bsn - The BSN to validate (9 digits)
 * @returns {boolean} - True if valid
 */
function isValidBSN(bsn) {
  if (!/^\d{9}$/.test(bsn)) {
    return false;
  }

  const digits = bsn.split('').map(Number);
  const weights = [9, 8, 7, 6, 5, 4, 3, 2, -1];
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * weights[i];
  }
  
  return sum % 11 === 0;
}

/**
 * Generates a valid BSN number
 * @returns {string} - A valid 9-digit BSN
 */
function generateBSN() {
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
  
  // Calculate the 9th digit to make it pass the 11-test
  const weights = [9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += digits[i] * weights[i];
  }
  
  // We need: (sum - d9) % 11 === 0
  // So: d9 = sum % 11 (but d9 must be 0-9)
  let d9 = sum % 11;
  
  // If d9 > 9, we need to regenerate
  if (d9 > 9) {
    return generateBSN();
  }
  
  digits.push(d9);
  return digits.join('');
}

/**
 * Generates multiple valid BSN numbers
 * @param {number} count - Number of BSNs to generate
 * @returns {string[]} - Array of valid BSNs
 */
function generateMultipleBSN(count) {
  const bsns = [];
  for (let i = 0; i < count; i++) {
    bsns.push(generateBSN());
  }
  return bsns;
}

module.exports = {
  generateBSN,
  generateMultipleBSN,
  isValidBSN
};
