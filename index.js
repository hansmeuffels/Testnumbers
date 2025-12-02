#!/usr/bin/env node

/**
 * Testnumbers - Generate valid test numbers for BSN and IBAN
 */

const { generateBSN, generateMultipleBSN, isValidBSN } = require('./src/bsnGenerator');
const { generateIBAN, generateMultipleIBAN, formatIBAN, isValidIBAN, DUTCH_BANK_CODES } = require('./src/ibanGenerator');

// CLI functionality
function printHelp() {
  console.log(`
Testnumbers - Generate valid Dutch test numbers

Usage:
  node index.js <command> [options]

Commands:
  bsn [count]           Generate BSN number(s)
  iban [count] [bank]   Generate IBAN number(s)
  validate-bsn <number> Validate a BSN number
  validate-iban <iban>  Validate an IBAN number
  help                  Show this help message

Options:
  count   Number of test numbers to generate (default: 1)
  bank    Bank code for IBAN (default: random)
          Available banks: ${DUTCH_BANK_CODES.join(', ')}

Examples:
  node index.js bsn              Generate 1 BSN
  node index.js bsn 5            Generate 5 BSNs
  node index.js iban             Generate 1 IBAN
  node index.js iban 3 INGB      Generate 3 ING Bank IBANs
  node index.js validate-bsn 123456782
  node index.js validate-iban NL91ABNA0417164300
`);
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    printHelp();
    return;
  }

  switch (command.toLowerCase()) {
    case 'bsn': {
      const count = parseInt(args[1], 10) || 1;
      const bsns = generateMultipleBSN(count);
      console.log('\nGenerated BSN number(s):');
      bsns.forEach(bsn => console.log(`  ${bsn}`));
      console.log();
      break;
    }

    case 'iban': {
      const count = parseInt(args[1], 10) || 1;
      const bankCode = args[2] ? args[2].toUpperCase() : undefined;
      
      if (bankCode && !DUTCH_BANK_CODES.includes(bankCode)) {
        console.error(`Invalid bank code. Available: ${DUTCH_BANK_CODES.join(', ')}`);
        process.exit(1);
      }
      
      const ibans = generateMultipleIBAN(count, bankCode);
      console.log('\nGenerated IBAN number(s):');
      ibans.forEach(iban => console.log(`  ${formatIBAN(iban)}`));
      console.log();
      break;
    }

    case 'validate-bsn': {
      const bsn = args[1];
      if (!bsn) {
        console.error('Please provide a BSN to validate');
        process.exit(1);
      }
      const isValid = isValidBSN(bsn);
      console.log(`\nBSN ${bsn} is ${isValid ? 'VALID ✓' : 'INVALID ✗'}\n`);
      break;
    }

    case 'validate-iban': {
      const iban = args[1];
      if (!iban) {
        console.error('Please provide an IBAN to validate');
        process.exit(1);
      }
      const isValid = isValidIBAN(iban);
      console.log(`\nIBAN ${iban} is ${isValid ? 'VALID ✓' : 'INVALID ✗'}\n`);
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

// Export modules for use as a library
module.exports = {
  // BSN functions
  generateBSN,
  generateMultipleBSN,
  isValidBSN,
  // IBAN functions
  generateIBAN,
  generateMultipleIBAN,
  formatIBAN,
  isValidIBAN,
  DUTCH_BANK_CODES
};

// Run CLI if executed directly
if (require.main === module) {
  main();
}
