# Testnumbers

Generate valid Dutch test numbers for BSN (Burgerservicenummer) and IBAN (International Bank Account Number).

## Installation

```bash
npm install
```

## Usage

### Command Line Interface

Generate BSN numbers:
```bash
node index.js bsn              # Generate 1 BSN
node index.js bsn 5            # Generate 5 BSNs
```

Generate IBAN numbers:
```bash
node index.js iban             # Generate 1 IBAN (random bank)
node index.js iban 3           # Generate 3 IBANs
node index.js iban 3 INGB      # Generate 3 ING Bank IBANs
```

Validate numbers:
```bash
node index.js validate-bsn 123456782
node index.js validate-iban NL91ABNA0417164300
```

Available bank codes: ABNA, INGB, RABO, SNSB, TRIO, KNAB, BUNQ, ASNB

### As a Library

```javascript
const { 
  generateBSN, 
  generateMultipleBSN, 
  isValidBSN,
  generateIBAN, 
  generateMultipleIBAN, 
  formatIBAN,
  isValidIBAN 
} = require('./index');

// Generate BSN
const bsn = generateBSN();
console.log(bsn); // e.g., "123456782"

// Generate multiple BSNs
const bsns = generateMultipleBSN(5);

// Validate BSN
console.log(isValidBSN('123456782')); // true

// Generate IBAN
const iban = generateIBAN();
console.log(iban); // e.g., "NL91ABNA0417164300"

// Generate IBAN for specific bank
const ingIban = generateIBAN('INGB');

// Format IBAN with spaces
console.log(formatIBAN(iban)); // e.g., "NL91 ABNA 0417 1643 00"

// Validate IBAN
console.log(isValidIBAN('NL91ABNA0417164300')); // true
```

## Testing

```bash
npm test
```

## About the Validation

### BSN (Burgerservicenummer)
Dutch citizen service numbers are 9-digit numbers that must pass the "11-proef" (11-test):
- Formula: (9×d1 + 8×d2 + 7×d3 + 6×d4 + 5×d5 + 4×d6 + 3×d7 + 2×d8 - 1×d9) % 11 === 0

### IBAN (International Bank Account Number)
Dutch IBANs follow the format: NLxx BANK 0000 0000 00
- Country code: NL
- Check digits: 2 digits calculated using modulo 97
- Bank code: 4 letters
- Account number: 10 digits

