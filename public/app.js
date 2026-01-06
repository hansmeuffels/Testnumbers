/**
 * Dutch Test Numbers Generator Web App
 * Generates valid BSN and IBAN numbers for testing
 */

(function () {
    'use strict';

    // Common Dutch bank codes for IBAN generation
    const DUTCH_BANK_CODES = ['ABNA', 'INGB', 'RABO', 'SNSB', 'TRIO', 'KNAB', 'BUNQ', 'ASNB'];

    // DOM Elements - BSN
    const bsnForm = document.getElementById('bsnForm');
    const bsnCountInput = document.getElementById('bsnCount');
    const currentBsnEl = document.getElementById('currentBsn');
    const copyBsnBtn = document.getElementById('copyBsnBtn');
    const bsnHistoryList = document.getElementById('bsnHistoryList');
    const copyAllBsnBtn = document.getElementById('copyAllBsnBtn');
    const eraseBsnBtn = document.getElementById('eraseBsnBtn');

    // DOM Elements - IBAN
    const ibanForm = document.getElementById('ibanForm');
    const ibanCountInput = document.getElementById('ibanCount');
    const currentIbanEl = document.getElementById('currentIban');
    const copyIbanBtn = document.getElementById('copyIbanBtn');
    const ibanHistoryList = document.getElementById('ibanHistoryList');
    const copyAllIbanBtn = document.getElementById('copyAllIbanBtn');
    const eraseIbanBtn = document.getElementById('eraseIbanBtn');

    // DOM Elements - Loonheffingennummer
    const loonheffingennummerForm = document.getElementById('loonheffingennummerForm');
    const loonheffingennummerCountInput = document.getElementById('loonheffingennummerCount');
    const currentLoonheffingennummerEl = document.getElementById('currentLoonheffingennummer');
    const copyLoonheffingennummerBtn = document.getElementById('copyLoonheffingennummerBtn');
    const loonheffingennummerHistoryList = document.getElementById('loonheffingennummerHistoryList');
    const copyAllLoonheffingennummerBtn = document.getElementById('copyAllLoonheffingennummerBtn');
    const eraseLoonheffingennummerBtn = document.getElementById('eraseLoonheffingennummerBtn');

    // State
    let bsnHistory = [];
    let ibanHistory = [];
    let loonheffingennummerHistory = [];

    // ========================
    // BSN Generator Functions
    // ========================

    /**
     * Generates a valid BSN number using the 11-test
     * @returns {string} A valid 9-digit BSN
     */
    function generateBSN() {
        const weights = [9, 8, 7, 6, 5, 4, 3, 2];

        while (true) {
            const digits = [];

            for (let i = 0; i < 8; i++) {
                if (i === 0) {
                    digits.push(Math.floor(Math.random() * 9) + 1);
                } else {
                    digits.push(Math.floor(Math.random() * 10));
                }
            }

            let sum = 0;
            for (let i = 0; i < 8; i++) {
                sum += digits[i] * weights[i];
            }

            const d9 = sum % 11;

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

    // =========================
    // IBAN Generator Functions
    // =========================

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
     * Generates a valid Dutch IBAN number
     * @returns {string} - A valid Dutch IBAN
     */
    function generateIBAN() {
        const bank = DUTCH_BANK_CODES[Math.floor(Math.random() * DUTCH_BANK_CODES.length)];

        let accountNumber = '';
        for (let i = 0; i < 10; i++) {
            accountNumber += Math.floor(Math.random() * 10).toString();
        }

        const checkString = bank + accountNumber + 'NL00';
        const numeric = lettersToNumbers(checkString);
        const checkDigits = (98 - mod97(numeric)).toString().padStart(2, '0');

        return `NL${checkDigits}${bank}${accountNumber}`;
    }

    /**
     * Formats an IBAN with spaces for readability
     * @param {string} iban - The IBAN to format
     * @returns {string} - Formatted IBAN
     */
    function formatIBAN(iban) {
        return iban.replace(/(.{4})/g, '$1 ').trim();
    }

    /**
     * Validates an IBAN using modulo 97
     * @param {string} iban - The IBAN to validate
     * @returns {boolean} - True if valid
     */
    function isValidIBAN(iban) {
        const cleanIban = iban.replace(/\s/g, '').toUpperCase();

        if (!/^[A-Z]{2}\d{2}[A-Z]{4}\d{10}$/.test(cleanIban)) {
            return false;
        }

        const rearranged = cleanIban.slice(4) + cleanIban.slice(0, 4);
        const numeric = lettersToNumbers(rearranged);

        return mod97(numeric) === 1;
    }

    // ==========================================
    // Loonheffingennummer Generator Functions
    // ==========================================

    // Weights for modulus-11 validation
    const LOONHEFFINGENNUMMER_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2];

    /**
     * Generates a valid Loonheffingennummer using the modulus-11 test
     * @returns {string} A valid 9-digit Loonheffingennummer with L01 suffix
     */
    function generateLoonheffingennummer() {
        while (true) {
            const digits = [];

            for (let i = 0; i < 8; i++) {
                if (i === 0) {
                    digits.push(Math.floor(Math.random() * 9) + 1);
                } else {
                    digits.push(Math.floor(Math.random() * 10));
                }
            }

            let sum = 0;
            for (let i = 0; i < 8; i++) {
                sum += digits[i] * LOONHEFFINGENNUMMER_WEIGHTS[i];
            }

            const checkDigit = sum % 11;

            if (checkDigit > 9) {
                continue;
            }

            digits.push(checkDigit);
            return digits.join('') + 'L01';
        }
    }

    /**
     * Validates a Loonheffingennummer using the modulus-11 test
     * @param {string} loonheffingennummer - The number to validate (9 digits + L01 suffix)
     * @returns {boolean} True if valid
     */
    function isValidLoonheffingennummer(loonheffingennummer) {
        // Must end with L01
        if (!loonheffingennummer.endsWith('L01')) {
            return false;
        }
        
        // Extract the 9 digits before L01
        const numericPart = loonheffingennummer.slice(0, -3);
        
        if (!/^\d{9}$/.test(numericPart)) {
            return false;
        }

        const digits = numericPart.split('').map(Number);

        let sum = 0;
        for (let i = 0; i < 8; i++) {
            sum += digits[i] * LOONHEFFINGENNUMMER_WEIGHTS[i];
        }

        const remainder = sum % 11;

        return digits[8] === remainder;
    }

    // ======================
    // UI Update Functions
    // ======================

    /**
     * Updates the UI to display the current BSN
     * @param {string} bsn - The BSN to display
     */
    function displayBSN(bsn) {
        currentBsnEl.textContent = bsn;
        copyBsnBtn.disabled = false;
    }

    /**
     * Updates the UI to display the current IBAN
     * @param {string} iban - The IBAN to display
     */
    function displayIBAN(iban) {
        currentIbanEl.textContent = formatIBAN(iban);
        copyIbanBtn.disabled = false;
    }

    /**
     * Updates the UI to display the current Loonheffingennummer
     * @param {string} loonheffingennummer - The Loonheffingennummer to display
     */
    function displayLoonheffingennummer(loonheffingennummer) {
        currentLoonheffingennummerEl.textContent = loonheffingennummer;
        copyLoonheffingennummerBtn.disabled = false;
    }

    /**
     * Adds BSNs to the history list
     * @param {string[]} bsns - Array of BSNs to add
     */
    function addBSNsToHistory(bsns) {
        bsns.forEach(bsn => {
            bsnHistory.unshift(bsn);
        });

        if (bsnHistory.length > 50) {
            bsnHistory = bsnHistory.slice(0, 50);
        }

        renderBSNHistory();
        updateBSNButtons();
    }

    /**
     * Adds IBANs to the history list
     * @param {string[]} ibans - Array of IBANs to add
     */
    function addIBANsToHistory(ibans) {
        ibans.forEach(iban => {
            ibanHistory.unshift(iban);
        });

        if (ibanHistory.length > 50) {
            ibanHistory = ibanHistory.slice(0, 50);
        }

        renderIBANHistory();
        updateIBANButtons();
    }

    /**
     * Adds Loonheffingennummers to the history list
     * @param {string[]} loonheffingennummers - Array of Loonheffingennummers to add
     */
    function addLoonheffingennummersToHistory(loonheffingennummers) {
        loonheffingennummers.forEach(lhn => {
            loonheffingennummerHistory.unshift(lhn);
        });

        if (loonheffingennummerHistory.length > 50) {
            loonheffingennummerHistory = loonheffingennummerHistory.slice(0, 50);
        }

        renderLoonheffingennummerHistory();
        updateLoonheffingennummerButtons();
    }

    /**
     * Renders the BSN history list in the DOM
     */
    function renderBSNHistory() {
        bsnHistoryList.innerHTML = '';

        if (bsnHistory.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'empty-state';
            emptyItem.textContent = 'No BSNs generated yet';
            bsnHistoryList.appendChild(emptyItem);
            return;
        }

        bsnHistory.forEach((bsn, index) => {
            const li = document.createElement('li');
            if (index === 0) {
                li.className = 'new-item';
            }

            const bsnSpan = document.createElement('span');
            bsnSpan.textContent = bsn;

            const indexSpan = document.createElement('span');
            indexSpan.className = 'history-index';
            indexSpan.textContent = `#${index + 1}`;

            li.appendChild(bsnSpan);
            li.appendChild(indexSpan);
            bsnHistoryList.appendChild(li);
        });
    }

    /**
     * Renders the IBAN history list in the DOM
     */
    function renderIBANHistory() {
        ibanHistoryList.innerHTML = '';

        if (ibanHistory.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'empty-state';
            emptyItem.textContent = 'No IBANs generated yet';
            ibanHistoryList.appendChild(emptyItem);
            return;
        }

        ibanHistory.forEach((iban, index) => {
            const li = document.createElement('li');
            if (index === 0) {
                li.className = 'new-item';
            }

            const ibanSpan = document.createElement('span');
            ibanSpan.textContent = formatIBAN(iban);

            const indexSpan = document.createElement('span');
            indexSpan.className = 'history-index';
            indexSpan.textContent = `#${index + 1}`;

            li.appendChild(ibanSpan);
            li.appendChild(indexSpan);
            ibanHistoryList.appendChild(li);
        });
    }

    /**
     * Renders the Loonheffingennummer history list in the DOM
     */
    function renderLoonheffingennummerHistory() {
        loonheffingennummerHistoryList.innerHTML = '';

        if (loonheffingennummerHistory.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'empty-state';
            emptyItem.textContent = 'No Loonheffingennummers generated yet';
            loonheffingennummerHistoryList.appendChild(emptyItem);
            return;
        }

        loonheffingennummerHistory.forEach((lhn, index) => {
            const li = document.createElement('li');
            if (index === 0) {
                li.className = 'new-item';
            }

            const lhnSpan = document.createElement('span');
            lhnSpan.textContent = lhn;

            const indexSpan = document.createElement('span');
            indexSpan.className = 'history-index';
            indexSpan.textContent = `#${index + 1}`;

            li.appendChild(lhnSpan);
            li.appendChild(indexSpan);
            loonheffingennummerHistoryList.appendChild(li);
        });
    }

    /**
     * Updates BSN action buttons state
     */
    function updateBSNButtons() {
        const hasItems = bsnHistory.length > 0;
        copyAllBsnBtn.disabled = !hasItems;
        eraseBsnBtn.disabled = !hasItems;
    }

    /**
     * Updates IBAN action buttons state
     */
    function updateIBANButtons() {
        const hasItems = ibanHistory.length > 0;
        copyAllIbanBtn.disabled = !hasItems;
        eraseIbanBtn.disabled = !hasItems;
    }

    /**
     * Updates Loonheffingennummer action buttons state
     */
    function updateLoonheffingennummerButtons() {
        const hasItems = loonheffingennummerHistory.length > 0;
        copyAllLoonheffingennummerBtn.disabled = !hasItems;
        eraseLoonheffingennummerBtn.disabled = !hasItems;
    }

    /**
     * Erases the BSN history
     */
    function eraseBSNHistory() {
        bsnHistory = [];
        currentBsnEl.textContent = '—';
        copyBsnBtn.disabled = true;
        renderBSNHistory();
        updateBSNButtons();
    }

    /**
     * Erases the IBAN history
     */
    function eraseIBANHistory() {
        ibanHistory = [];
        currentIbanEl.textContent = '—';
        copyIbanBtn.disabled = true;
        renderIBANHistory();
        updateIBANButtons();
    }

    /**
     * Erases the Loonheffingennummer history
     */
    function eraseLoonheffingennummerHistory() {
        loonheffingennummerHistory = [];
        currentLoonheffingennummerEl.textContent = '—';
        copyLoonheffingennummerBtn.disabled = true;
        renderLoonheffingennummerHistory();
        updateLoonheffingennummerButtons();
    }

    // ======================
    // Clipboard Functions
    // ======================

    /**
     * Copies text to clipboard with visual feedback
     * @param {string} text - Text to copy
     * @param {HTMLElement} button - Button to show feedback on
     * @param {string} originalContent - Original button content to restore
     */
    async function copyWithFeedback(text, button, originalContent) {
        try {
            await navigator.clipboard.writeText(text);
            showCopiedFeedback(button, originalContent);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopiedFeedback(button, originalContent);
        }
    }

    /**
     * Shows copied feedback on a button
     * @param {HTMLElement} button - Button element
     * @param {string} originalContent - Original button content
     */
    function showCopiedFeedback(button, originalContent) {
        button.textContent = '✓';
        button.classList.add('copied');

        setTimeout(() => {
            button.textContent = originalContent;
            button.classList.remove('copied');
        }, 1500);
    }

    /**
     * Copies current BSN to clipboard
     */
    function copyCurrentBSN() {
        const bsn = currentBsnEl.textContent;
        if (bsn === '—') return;
        copyWithFeedback(bsn, copyBsnBtn, '📋');
    }

    /**
     * Copies current IBAN to clipboard
     */
    function copyCurrentIBAN() {
        const iban = currentIbanEl.textContent;
        if (iban === '—') return;
        copyWithFeedback(iban.replace(/\s/g, ''), copyIbanBtn, '📋');
    }

    /**
     * Copies current Loonheffingennummer to clipboard
     */
    function copyCurrentLoonheffingennummer() {
        const lhn = currentLoonheffingennummerEl.textContent;
        if (lhn === '—') return;
        copyWithFeedback(lhn, copyLoonheffingennummerBtn, '📋');
    }

    /**
     * Copies all BSNs to clipboard
     */
    function copyAllBSNs() {
        if (bsnHistory.length === 0) return;
        const text = bsnHistory.join('\n');
        copyWithFeedback(text, copyAllBsnBtn, '📋 Copy All');
    }

    /**
     * Copies all IBANs to clipboard
     */
    function copyAllIBANs() {
        if (ibanHistory.length === 0) return;
        const text = ibanHistory.join('\n');
        copyWithFeedback(text, copyAllIbanBtn, '📋 Copy All');
    }

    /**
     * Copies all Loonheffingennummers to clipboard
     */
    function copyAllLoonheffingennummers() {
        if (loonheffingennummerHistory.length === 0) return;
        const text = loonheffingennummerHistory.join('\n');
        copyWithFeedback(text, copyAllLoonheffingennummerBtn, '📋 Copy All');
    }

    // ======================
    // Event Handlers
    // ======================

    /**
     * Handles BSN form submission
     * @param {Event} e - Form submit event
     */
    function handleBSNGenerate(e) {
        e.preventDefault();

        const count = Math.min(Math.max(parseInt(bsnCountInput.value, 10) || 1, 1), 50);
        bsnCountInput.value = count;

        const bsns = [];
        for (let i = 0; i < count; i++) {
            const bsn = generateBSN();
            if (isValidBSN(bsn)) {
                bsns.push(bsn);
            }
        }

        if (bsns.length > 0) {
            displayBSN(bsns[0]);
            addBSNsToHistory(bsns);
        }
    }

    /**
     * Handles IBAN form submission
     * @param {Event} e - Form submit event
     */
    function handleIBANGenerate(e) {
        e.preventDefault();

        const count = Math.min(Math.max(parseInt(ibanCountInput.value, 10) || 1, 1), 50);
        ibanCountInput.value = count;

        const ibans = [];
        for (let i = 0; i < count; i++) {
            const iban = generateIBAN();
            if (isValidIBAN(iban)) {
                ibans.push(iban);
            }
        }

        if (ibans.length > 0) {
            displayIBAN(ibans[0]);
            addIBANsToHistory(ibans);
        }
    }

    /**
     * Handles Loonheffingennummer form submission
     * @param {Event} e - Form submit event
     */
    function handleLoonheffingennummerGenerate(e) {
        e.preventDefault();

        const count = Math.min(Math.max(parseInt(loonheffingennummerCountInput.value, 10) || 1, 1), 50);
        loonheffingennummerCountInput.value = count;

        const loonheffingennummers = [];
        for (let i = 0; i < count; i++) {
            const lhn = generateLoonheffingennummer();
            if (isValidLoonheffingennummer(lhn)) {
                loonheffingennummers.push(lhn);
            }
        }

        if (loonheffingennummers.length > 0) {
            displayLoonheffingennummer(loonheffingennummers[0]);
            addLoonheffingennummersToHistory(loonheffingennummers);
        }
    }

    // ======================
    // Event Listeners
    // ======================

    // BSN events
    bsnForm.addEventListener('submit', handleBSNGenerate);
    copyBsnBtn.addEventListener('click', copyCurrentBSN);
    copyAllBsnBtn.addEventListener('click', copyAllBSNs);
    eraseBsnBtn.addEventListener('click', eraseBSNHistory);

    // IBAN events
    ibanForm.addEventListener('submit', handleIBANGenerate);
    copyIbanBtn.addEventListener('click', copyCurrentIBAN);
    copyAllIbanBtn.addEventListener('click', copyAllIBANs);
    eraseIbanBtn.addEventListener('click', eraseIBANHistory);

    // Loonheffingennummer events
    loonheffingennummerForm.addEventListener('submit', handleLoonheffingennummerGenerate);
    copyLoonheffingennummerBtn.addEventListener('click', copyCurrentLoonheffingennummer);
    copyAllLoonheffingennummerBtn.addEventListener('click', copyAllLoonheffingennummers);
    eraseLoonheffingennummerBtn.addEventListener('click', eraseLoonheffingennummerHistory);

    // ======================
    // Initialization
    // ======================

    renderBSNHistory();
    renderIBANHistory();
    renderLoonheffingennummerHistory();
    updateBSNButtons();
    updateIBANButtons();
    updateLoonheffingennummerButtons();
})();
