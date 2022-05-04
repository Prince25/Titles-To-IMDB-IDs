// Sleep for a given number of milliseconds
module.exports = function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}