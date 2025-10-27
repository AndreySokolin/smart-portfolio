// 7. js/core/utils.js
function formatCurrency(value, currency = 'RUB') {
    if (isNaN(value) || value === null || value === undefined) return '0,00 ₽';
    try {
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: currency }).format(value);
    } catch (error) {
        return `${value.toLocaleString('ru-RU')} ₽`;
    }
}

function formatNumber(value, decimals = 8) {
    if (isNaN(value) || value === null || value === undefined) return '0';
    return new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: decimals }).format(value);
}

function formatPercent(value, decimals = 2) {
    if (isNaN(value) || value === null || value === undefined) return '0.00%';
    const formatted = value.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return `${value >= 0 ? '+' : ''}${formatted}%`;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { timeout = null; if (!immediate) func(...args); };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

console.log('✅ Utils module loaded');