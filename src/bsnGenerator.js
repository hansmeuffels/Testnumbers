function generateBSN() {
    let bsn;
    do {
        bsn = Math.floor(100000000 + Math.random() * 900000000);
    } while (bsn.toString()[0] === '8' || bsn.toString()[0] === '9');
    return bsn;
}

module.exports = { generateBSN };