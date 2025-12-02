const { generateBSN, generateMultipleBSN, isValidBSN } = require('../src/bsnGenerator');

describe('BSN Generator', () => {
  describe('isValidBSN', () => {
    test('should validate correct BSN numbers', () => {
      // Known valid BSN numbers
      expect(isValidBSN('123456782')).toBe(true);
      expect(isValidBSN('111222333')).toBe(true);
    });

    test('should reject invalid BSN numbers', () => {
      expect(isValidBSN('123456789')).toBe(false);
      expect(isValidBSN('987654321')).toBe(false);
      expect(isValidBSN('123123123')).toBe(false);
    });

    test('should reject non-9-digit strings', () => {
      expect(isValidBSN('12345678')).toBe(false);
      expect(isValidBSN('1234567890')).toBe(false);
      expect(isValidBSN('abcdefghi')).toBe(false);
      expect(isValidBSN('')).toBe(false);
    });
  });

  describe('generateBSN', () => {
    test('should generate valid BSN numbers', () => {
      for (let i = 0; i < 100; i++) {
        const bsn = generateBSN();
        expect(isValidBSN(bsn)).toBe(true);
      }
    });

    test('should generate 9-digit numbers', () => {
      const bsn = generateBSN();
      expect(bsn).toMatch(/^\d{9}$/);
    });

    test('should not start with 0', () => {
      for (let i = 0; i < 100; i++) {
        const bsn = generateBSN();
        expect(bsn[0]).not.toBe('0');
      }
    });
  });

  describe('generateMultipleBSN', () => {
    test('should generate the specified number of BSNs', () => {
      const bsns = generateMultipleBSN(5);
      expect(bsns).toHaveLength(5);
    });

    test('should generate all valid BSNs', () => {
      const bsns = generateMultipleBSN(10);
      bsns.forEach(bsn => {
        expect(isValidBSN(bsn)).toBe(true);
      });
    });
  });
});
