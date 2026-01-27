/**
 * Generates a valid BSN number using the 11-test
 * The first digit is constrained to be 1-7 (not 0, 8, or 9)
 * @returns {string} A valid 9-digit BSN
 */
function generateBSN() {
    const weights = [9, 8, 7, 6, 5, 4, 3, 2];

    while (true) {
        const digits = [];

        // First digit must be 1-7 (not 0, 8, or 9)
        digits.push(Math.floor(Math.random() * 7) + 1);

        // Generate next 7 digits (0-9)
        for (let i = 1; i < 8; i++) {
            digits.push(Math.floor(Math.random() * 10));
        }

        // Calculate the 9th digit using the 11-test
        let sum = 0;
        for (let i = 0; i < 8; i++) {
            sum += digits[i] * weights[i];
        }

        const d9 = sum % 11;

        // The 9th digit must be 0-9
        if (d9 > 9) {
            continue;
        }

        digits.push(d9);
        return digits.join('');
    }
}

/**
 * Validates a BSN number using the 11-test
 * @param {string} bsn - The BSN to validate (9 digits)
 * @returns {boolean} True if valid
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
 * Generates multiple valid BSN numbers
 * @param {number} count - Number of BSNs to generate
 * @returns {string[]} Array of valid BSN numbers
 */
function generateMultipleBSN(count) {
    const bsns = [];
    for (let i = 0; i < count; i++) {
        bsns.push(generateBSN());
    }
    return bsns;
}

module.exports = { generateBSN, isValidBSN, generateMultipleBSN };