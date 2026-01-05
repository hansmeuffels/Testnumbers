const { generateLoonheffingennummer, generateMultipleLoonheffingennummer, isValidLoonheffingennummer } = require('../src/loonheffingennummerGenerator');

describe('Loonheffingennummer Generator', () => {
  describe('isValidLoonheffingennummer', () => {
    test('should validate correct Loonheffingennummer numbers', () => {
      // Test with manually calculated valid numbers
      // Example: 123456780
      // Sum = 1*9 + 2*8 + 3*7 + 4*6 + 5*5 + 6*4 + 7*3 + 8*2
      //     = 9 + 16 + 21 + 24 + 25 + 24 + 21 + 16 = 156
      // 156 % 11 = 2, but we need check digit 0
      // Let me recalculate: 111111110
      // Sum = 1*9 + 1*8 + 1*7 + 1*6 + 1*5 + 1*4 + 1*3 + 1*2
      //     = 9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 = 44
      // 44 % 11 = 0, so check digit should be 0
      expect(isValidLoonheffingennummer('111111110')).toBe(true);
      
      // Another example: 123456785
      // Sum = 1*9 + 2*8 + 3*7 + 4*6 + 5*5 + 6*4 + 7*3 + 8*2
      //     = 9 + 16 + 21 + 24 + 25 + 24 + 21 + 16 = 156
      // 156 % 11 = 2, so check digit should be 2
      expect(isValidLoonheffingennummer('123456782')).toBe(true);
    });

    test('should reject invalid Loonheffingennummer numbers', () => {
      expect(isValidLoonheffingennummer('123456789')).toBe(false);
      expect(isValidLoonheffingennummer('987654321')).toBe(false);
      expect(isValidLoonheffingennummer('111111111')).toBe(false);
    });

    test('should reject non-9-digit strings', () => {
      expect(isValidLoonheffingennummer('12345678')).toBe(false);
      expect(isValidLoonheffingennummer('1234567890')).toBe(false);
      expect(isValidLoonheffingennummer('abcdefghi')).toBe(false);
      expect(isValidLoonheffingennummer('')).toBe(false);
    });
  });

  describe('generateLoonheffingennummer', () => {
    test('should generate valid Loonheffingennummer numbers', () => {
      for (let i = 0; i < 100; i++) {
        const loonheffingennummer = generateLoonheffingennummer();
        expect(isValidLoonheffingennummer(loonheffingennummer)).toBe(true);
      }
    });

    test('should generate 9-digit numbers', () => {
      const loonheffingennummer = generateLoonheffingennummer();
      expect(loonheffingennummer).toMatch(/^\d{9}$/);
    });

    test('should not start with 0', () => {
      for (let i = 0; i < 100; i++) {
        const loonheffingennummer = generateLoonheffingennummer();
        expect(loonheffingennummer[0]).not.toBe('0');
      }
    });
  });

  describe('generateMultipleLoonheffingennummer', () => {
    test('should generate the specified number of Loonheffingennummers', () => {
      const loonheffingennummers = generateMultipleLoonheffingennummer(5);
      expect(loonheffingennummers).toHaveLength(5);
    });

    test('should generate all valid Loonheffingennummers', () => {
      const loonheffingennummers = generateMultipleLoonheffingennummer(10);
      loonheffingennummers.forEach(loonheffingennummer => {
        expect(isValidLoonheffingennummer(loonheffingennummer)).toBe(true);
      });
    });
  });
});
