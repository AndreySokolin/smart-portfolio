// 8. js/core/storage.js
const STORAGE_KEYS = {
    PORTFOLIOS: 'smart_portfolio_portfolios',
    SETTINGS: 'smart_portfolio_settings',
    THEME: 'portfolio-theme',
    CURRENT_SCREEN: 'currentScreen',
    CURRENT_PORTFOLIO: 'currentPortfolioId'
};

function loadPortfolios() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.PORTFOLIOS);
        if (saved) return JSON.parse(saved);
        
        const defaultPortfolio = [{
            id: generateId(),
            name: 'Мой первый портфель',
            type: 'mixed',
            assets: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            settings: { currency: 'RUB', showPercentages: true, autoUpdatePrices: true }
        }];
        savePortfolios(defaultPortfolio);
        return defaultPortfolio;
    } catch (error) {
        console.error('❌ Ошибка загрузки портфелей:', error);
        return [];
    }
}

function savePortfolios(portfolios) {
    try {
        localStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(portfolios));
        return true;
    } catch (error) {
        console.error('❌ Ошибка сохранения портфелей:', error);
        return false;
    }
}

function loadSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return saved ? JSON.parse(saved) : { theme: 'light', currency: 'RUB', language: 'ru' };
    } catch (error) {
        return { theme: 'light', currency: 'RUB', language: 'ru' };
    }
}

function saveSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        return true;
    } catch (error) {
        return false;
    }
}

console.log('✅ Storage module loaded');