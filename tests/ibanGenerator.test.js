const { generateIBAN, generateMultipleIBAN, formatIBAN, isValidIBAN, DUTCH_BANK_CODES } = require('../src/ibanGenerator');

describe('IBAN Generator', () => {
  describe('isValidIBAN', () => {
    test('should validate correct Dutch IBANs', () => {
      // Known valid Dutch IBANs
      expect(isValidIBAN('NL91ABNA0417164300')).toBe(true);
      expect(isValidIBAN('NL20INGB0001234567')).toBe(true);
    });

    test('should validate IBANs with spaces', () => {
      expect(isValidIBAN('NL91 ABNA 0417 1643 00')).toBe(true);
    });

    test('should reject invalid IBANs', () => {
      expect(isValidIBAN('NL00ABNA0417164300')).toBe(false);
      expect(isValidIBAN('NL91ABNA0000000000')).toBe(false);
    });

    test('should reject malformed IBANs', () => {
      expect(isValidIBAN('NLABNA0417164300')).toBe(false);
      expect(isValidIBAN('DE91ABNA0417164300')).toBe(false);
      expect(isValidIBAN('')).toBe(false);
    });
  });

  describe('generateIBAN', () => {
    test('should generate valid IBANs', () => {
      for (let i = 0; i < 100; i++) {
        const iban = generateIBAN();
        expect(isValidIBAN(iban)).toBe(true);
      }
    });

    test('should generate Dutch IBANs starting with NL', () => {
      const iban = generateIBAN();
      expect(iban.startsWith('NL')).toBe(true);
    });

    test('should generate IBANs with 18 characters', () => {
      const iban = generateIBAN();
      expect(iban).toHaveLength(18);
    });

    test('should generate IBANs with specified bank code', () => {
      const iban = generateIBAN('INGB');
      expect(iban.substring(4, 8)).toBe('INGB');
      expect(isValidIBAN(iban)).toBe(true);
    });
  });

  describe('formatIBAN', () => {
    test('should format IBAN with spaces', () => {
      const formatted = formatIBAN('NL91ABNA0417164300');
      expect(formatted).toBe('NL91 ABNA 0417 1643 00');
    });
  });

  describe('generateMultipleIBAN', () => {
    test('should generate the specified number of IBANs', () => {
      const ibans = generateMultipleIBAN(5);
      expect(ibans).toHaveLength(5);
    });

    test('should generate all valid IBANs', () => {
      const ibans = generateMultipleIBAN(10);
      ibans.forEach(iban => {
        expect(isValidIBAN(iban)).toBe(true);
      });
    });

    test('should generate IBANs with specified bank code', () => {
      const ibans = generateMultipleIBAN(5, 'RABO');
      ibans.forEach(iban => {
        expect(iban.substring(4, 8)).toBe('RABO');
        expect(isValidIBAN(iban)).toBe(true);
      });
    });
  });

  describe('DUTCH_BANK_CODES', () => {
    test('should include common Dutch banks', () => {
      expect(DUTCH_BANK_CODES).toContain('ABNA');
      expect(DUTCH_BANK_CODES).toContain('INGB');
      expect(DUTCH_BANK_CODES).toContain('RABO');
    });
  });
});
