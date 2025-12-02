/**
 * BSN (Burgerservicenummer) Generator Web App
 * Generates valid Dutch citizen service numbers that pass the 11-test
 */

(function () {
    'use strict';

    // DOM Elements
    const generateBtn = document.getElementById('generateBtn');
    const currentBsnEl = document.getElementById('currentBsn');
    const copyBtn = document.getElementById('copyBtn');
    const historyList = document.getElementById('historyList');
    const clearBtn = document.getElementById('clearBtn');

    // State
    let history = [];

    /**
     * Generates a valid BSN number using the 11-test
     * @returns {string} A valid 9-digit BSN
     */
    function generateBSN() {
        const weights = [9, 8, 7, 6, 5, 4, 3, 2];

        // Use a while loop to avoid potential stack overflow from recursion
        while (true) {
            const digits = [];

            // Generate first 8 random digits
            for (let i = 0; i < 8; i++) {
                // First digit should not be 0
                if (i === 0) {
                    digits.push(Math.floor(Math.random() * 9) + 1);
                } else {
                    digits.push(Math.floor(Math.random() * 10));
                }
            }

            // Calculate the 9th digit to make it pass the 11-test
            // Formula: (9×d1 + 8×d2 + 7×d3 + 6×d4 + 5×d5 + 4×d6 + 3×d7 + 2×d8 - 1×d9) % 11 === 0
            let sum = 0;
            for (let i = 0; i < 8; i++) {
                sum += digits[i] * weights[i];
            }

            // We need: (sum - d9) % 11 === 0
            // So: d9 = sum % 11 (but d9 must be 0-9)
            const d9 = sum % 11;

            // If d9 > 9, retry (this happens when sum % 11 === 10)
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
     * Updates the UI to display the current BSN
     * @param {string} bsn - The BSN to display
     */
    function displayBSN(bsn) {
        currentBsnEl.textContent = bsn;
        copyBtn.disabled = false;
    }

    /**
     * Adds a BSN to the history list
     * @param {string} bsn - The BSN to add
     */
    function addToHistory(bsn) {
        history.unshift(bsn);

        // Keep only last 50 items
        if (history.length > 50) {
            history.pop();
        }

        renderHistory();
        clearBtn.disabled = false;
    }

    /**
     * Renders the history list in the DOM
     */
    function renderHistory() {
        historyList.innerHTML = '';

        if (history.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'empty-state';
            emptyItem.textContent = 'No BSNs generated yet';
            historyList.appendChild(emptyItem);
            return;
        }

        history.forEach((bsn, index) => {
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
            historyList.appendChild(li);
        });
    }

    /**
     * Clears the history
     */
    function clearHistory() {
        history = [];
        renderHistory();
        clearBtn.disabled = true;
    }

    /**
     * Copies the current BSN to clipboard
     */
    async function copyToClipboard() {
        const bsn = currentBsnEl.textContent;
        if (bsn === '—') return;

        try {
            await navigator.clipboard.writeText(bsn);
            copyBtn.textContent = '✓';
            copyBtn.classList.add('copied');

            setTimeout(() => {
                copyBtn.textContent = '📋';
                copyBtn.classList.remove('copied');
            }, 1500);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bsn;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            copyBtn.textContent = '✓';
            copyBtn.classList.add('copied');

            setTimeout(() => {
                copyBtn.textContent = '📋';
                copyBtn.classList.remove('copied');
            }, 1500);
        }
    }

    /**
     * Handles the generate button click
     */
    function handleGenerate() {
        const bsn = generateBSN();

        // Verify the BSN is valid (should always be true)
        if (!isValidBSN(bsn)) {
            console.error('Generated invalid BSN:', bsn);
            return;
        }

        displayBSN(bsn);
        addToHistory(bsn);
    }

    // Event Listeners
    generateBtn.addEventListener('click', handleGenerate);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearHistory);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Press Enter or Space to generate
        if (e.key === 'Enter' || e.key === ' ') {
            if (document.activeElement === document.body || document.activeElement === generateBtn) {
                e.preventDefault();
                handleGenerate();
            }
        }
        // Press 'c' to copy
        if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
            if (document.activeElement === document.body) {
                copyToClipboard();
            }
        }
    });

    // Initialize
    renderHistory();
})();
