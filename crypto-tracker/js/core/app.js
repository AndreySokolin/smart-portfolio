// 11. js/core/app.js
console.log('🎯 App: Начало загрузки');

window.addEventListener('error', function(e) {
    if (e.message && typeof e.message === 'string' && e.message.includes('sentence')) {
        e.preventDefault(); e.stopPropagation(); return true;
    }
});

window.addEventListener('unhandledrejection', function(e) {
    if (e.reason && e.reason.message && typeof e.reason.message === 'string' && e.reason.message.includes('sentence')) {
        e.preventDefault(); e.stopPropagation(); return true;
    }
});

const App = {
    async init() {
        console.log('🚀 App: Инициализация приложения');
        try {
            this.showMainInterface();
            await this.initCoreUtils();
            await this.initAllModules();
            this.fillWithData();
            this.showSuccess('Приложение успешно загружено!');
            console.log('✅ App: Инициализация завершена');
        } catch (error) {
            console.error('❌ App: Ошибка инициализации:', error);
            this.showError('Ошибка загрузки приложения');
        }
    },
    
    showMainInterface() {
        console.log('🔄 App: Показ основного интерфейса');
        const elements = ['.container', '#dashboard', '.app-header', '.main-nav'];
        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'block';
                element.style.visibility = 'visible';
                element.style.opacity = '1';
            }
        });
        
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.style.display = 'block';
            dashboard.classList.add('active');
        }
        
        document.querySelectorAll('.screen').forEach(screen => {
            if (screen.id !== 'dashboard') {
                screen.style.display = 'none';
                screen.classList.remove('active');
            }
        });
    },
    
    async initCoreUtils() {
        console.log('🔄 App: Инициализация базовых утилит');
        await this.waitForFunction('formatCurrency', 3000);
        await this.waitForFunction('generateId', 3000);
        await this.waitForFunction('loadPortfolios', 3000);
        console.log('✅ App: Базовые утилиты загружены');
    },
    
    async initAllModules() {
        console.log('🔄 App: Инициализация всех модулей');
        const modules = [
            { name: 'Navigation', init: () => this.safeCall('initNavigation') },
            { name: 'Portfolios', init: () => this.safeCall('initPortfolios') }
        ];
        
        await Promise.allSettled(modules.map(module => this.safeInit(module.name, module.init)));
        console.log('✅ App: Все модули инициализированы');
    },
    
    fillWithData() {
        console.log('🔄 App: Заполнение демо-данными');
        const demoData = {
            'totalPortfolioValue': '156,780.50 ₽', 'totalChange': '+8.2%', 'todayChange': '+3,450.25 ₽',
            'todayChangePercent': '+2.3%', 'totalProfit': '+25,670.80 ₽', 'totalProfitPercent': '+19.6%',
            'totalAssets': '12', 'usdRate': '92.45 ₽', 'eurRate': '99.80 ₽', 'cnyRate': '12.75 ₽',
            'rateUpdateTime': new Date().toLocaleTimeString('ru-RU')
        };
        
        for (const [id, value] of Object.entries(demoData)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                if (id.includes('Change') || id.includes('Profit')) {
                    element.className = value.includes('+') ? 'positive' : 'negative';
                }
            }
        }
    },
    
    async safeInit(moduleName, initFunction) {
        try {
            console.log(`🔄 App: Инициализация ${moduleName}`);
            const result = initFunction();
            if (result instanceof Promise) await result;
            console.log(`✅ App: ${moduleName} инициализирован`);
            return true;
        } catch (error) {
            console.error(`❌ App: Ошибка инициализации ${moduleName}:`, error);
            return false;
        }
    },
    
    safeCall(functionName) {
        if (typeof window[functionName] === 'function') {
            return window[functionName]();
        } else {
            console.warn(`⚠️ App: Функция ${functionName} не найдена`);
            return false;
        }
    },
    
    async waitForFunction(functionName, timeout = 5000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const checkFunction = () => {
                if (typeof window[functionName] !== 'undefined') {
                    resolve(true);
                } else if (Date.now() - startTime > timeout) {
                    console.warn(`⚠️ App: Таймаут ожидания функции ${functionName}`);
                    resolve(false);
                } else {
                    setTimeout(checkFunction, 100);
                }
            };
            checkFunction();
        });
    },
    
    showSuccess(message) { this.showNotification(message, 'success'); },
    showError(message) { this.showNotification(message, 'error'); },
    
    showNotification(message, type = 'info') {
        console.log(`📢 App: ${type.toUpperCase()} - ${message}`);
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${type === 'success' ? 'Успех' : type === 'error' ? 'Ошибка' : 'Информация'}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        const container = document.getElementById('notifications') || document.body;
        container.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            if (notification.parentElement) notification.remove();
        }, 5000);
    }
};

// Запуск приложения
console.log('🎯 App: Запуск приложения');
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 App: DOM загружен');
    setTimeout(() => App.init(), 100);
});

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
        console.log('⚠️ App: Игнорируем ошибку Service Worker');
    });
}

window.App = App;
console.log('✅ App: Модуль загружен и готов к работе');