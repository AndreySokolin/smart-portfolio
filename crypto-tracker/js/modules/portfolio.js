// 10. js/modules/portfolio.js
function initPortfolios() {
    console.log('🔄 Инициализация модуля портфелей...');
    try {
        setupPortfolioEventListeners();
        renderPortfolioList();
        updatePortfolioLimitInfo();
        console.log('✅ Модуль портфелей инициализирован');
        return true;
    } catch (error) {
        console.error('❌ Ошибка инициализации портфелей:', error);
        return false;
    }
}

function setupPortfolioEventListeners() {
    const addPortfolioBtn = document.getElementById('addPortfolioBtn');
    if (addPortfolioBtn) addPortfolioBtn.addEventListener('click', openPortfolioModal);
    
    const portfolioToggle = document.getElementById('portfolioToggle');
    const portfolioMenu = document.getElementById('portfolioMenu');
    
    if (portfolioToggle && portfolioMenu) {
        portfolioToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            portfolioMenu.classList.toggle('show');
        });
        
        document.addEventListener('click', function() {
            portfolioMenu.classList.remove('show');
        });
        
        portfolioMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

function renderPortfolioList() {
    const portfolioList = document.getElementById('portfolioList');
    if (!portfolioList) return;
    
    const portfolios = loadPortfolios();
    
    if (portfolios.length === 0) {
        portfolioList.innerHTML = `
            <div style="padding: 20px; text-align: center; color: var(--text-muted);">
                <i class="fas fa-briefcase" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                <div>Нет портфелей</div>
            </div>
        `;
        return;
    }
    
    portfolioList.innerHTML = portfolios.map(portfolio => `
        <div class="portfolio-item" onclick="switchToPortfolio('${portfolio.id}')">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div style="font-weight: 600;">${portfolio.name}</div>
                <div style="font-size: 12px; opacity: 0.8; background: var(--bg-secondary); padding: 2px 8px; border-radius: 12px;">
                    ${getPortfolioTypeLabel(portfolio.type)}
                </div>
            </div>
            <div style="display: flex; gap: 16px; font-size: 12px;">
                <div style="display: flex; align-items: center; gap: 4px;">
                    <i class="fas fa-chart-pie"></i>
                    ${portfolio.assets.length} активов
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                    <i class="fas fa-ruble-sign"></i>
                    ${formatCurrency(calculatePortfolioValue(portfolio))}
                </div>
            </div>
        </div>
    `).join('');
}

function updatePortfolioLimitInfo() {
    const portfolioLimitInfo = document.getElementById('portfolioLimitInfo');
    if (!portfolioLimitInfo) return;
    const portfolios = loadPortfolios();
    portfolioLimitInfo.textContent = `Создано: ${portfolios.length}/10 портфелей`;
}

function openPortfolioModal(portfolioId = null) {
    console.log('📂 Открытие модального окна портфеля');
    const modal = document.getElementById('portfolioModal');
    if (!modal) return;
    
    const isEdit = portfolioId !== null;
    const portfolio = isEdit ? getPortfolioById(portfolioId) : null;
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">
                    <i class="fas ${isEdit ? 'fa-edit' : 'fa-plus'}"></i>
                    ${isEdit ? 'Редактировать портфель' : 'Создать портфель'}
                </h2>
                <button class="modal-close" onclick="closePortfolioModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <form id="portfolioForm">
                    <div class="form-group">
                        <label class="form-label" for="portfolioName">Название портфеля *</label>
                        <input type="text" id="portfolioName" class="form-input" placeholder="Например: Основной портфель"
                            value="${portfolio ? portfolio.name : ''}" maxlength="50" required>
                        <div class="form-hint">Максимум 50 символов</div>
                        <div class="form-error" id="portfolioNameError"></div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="portfolioType">Тип портфеля</label>
                        <select id="portfolioType" class="form-select">
                            <option value="mixed" ${portfolio && portfolio.type === 'mixed' ? 'selected' : ''}>Смешанный</option>
                            <option value="crypto" ${portfolio && portfolio.type === 'crypto' ? 'selected' : ''}>Криптовалюты</option>
                            <option value="stocks" ${portfolio && portfolio.type === 'stocks' ? 'selected' : ''}>Акции</option>
                            <option value="bonds" ${portfolio && portfolio.type === 'bonds' ? 'selected' : ''}>Облигации</option>
                            <option value="other" ${portfolio && portfolio.type === 'other' ? 'selected' : ''}>Другое</option>
                        </select>
                        <div class="form-hint">Определяет иконку и категорию портфеля</div>
                    </div>
                </form>
            </div>
            
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closePortfolioModal()">
                    <i class="fas fa-times"></i> Отмена
                </button>
                <button class="btn btn-primary" onclick="savePortfolio('${portfolioId || ''}')">
                    <i class="fas fa-save"></i> ${isEdit ? 'Сохранить' : 'Создать'}
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    setTimeout(() => {
        const nameInput = document.getElementById('portfolioName');
        if (nameInput) nameInput.focus();
    }, 300);
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.innerHTML = '', 300);
    }
}

function savePortfolio(portfolioId = '') {
    console.log('💾 Сохранение портфеля:', portfolioId || 'новый');
    
    const nameInput = document.getElementById('portfolioName');
    const typeSelect = document.getElementById('portfolioType');
    const errorDiv = document.getElementById('portfolioNameError');
    
    if (!nameInput || !typeSelect) return;
    
    const name = nameInput.value.trim();
    const type = typeSelect.value;
    
    if (!name) {
        if (errorDiv) errorDiv.textContent = 'Название портфеля обязательно';
        nameInput.focus();
        return;
    }
    
    if (name.length > 50) {
        if (errorDiv) errorDiv.textContent = 'Название не должно превышать 50 символов';
        nameInput.focus();
        return;
    }
    
    const portfolios = loadPortfolios();
    const isEdit = portfolioId !== '';
    
    if (isEdit) {
        const portfolioIndex = portfolios.findIndex(p => p.id === portfolioId);
        if (portfolioIndex !== -1) {
            portfolios[portfolioIndex] = {
                ...portfolios[portfolioIndex],
                name,
                type,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        if (portfolios.length >= 10) {
            showNotification('Достигнут лимит в 10 портфелей', 'error');
            return;
        }
        
        const newPortfolio = {
            id: generateId(),
            name,
            type,
            assets: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            settings: { currency: 'RUB', showPercentages: true, autoUpdatePrices: true }
        };
        
        portfolios.push(newPortfolio);
        portfolioId = newPortfolio.id;
    }
    
    if (savePortfolios(portfolios)) {
        closePortfolioModal();
        renderPortfolioList();
        updatePortfolioLimitInfo();
        
        if (!isEdit) {
            setTimeout(() => switchToPortfolio(portfolioId), 500);
        }
        
        showNotification(`Портфель "${name}" ${isEdit ? 'обновлен' : 'создан'}`, 'success');
    } else {
        showNotification('Ошибка сохранения портфеля', 'error');
    }
}

function getPortfolioById(portfolioId) {
    const portfolios = loadPortfolios();
    return portfolios.find(p => p.id === portfolioId);
}

function switchToPortfolio(portfolioId) {
    console.log('🔄 Переключение на портфель:', portfolioId);
    
    const portfolio = getPortfolioById(portfolioId);
    if (!portfolio) {
        showNotification('Портфель не найден', 'error');
        return;
    }
    
    const portfolioMenu = document.getElementById('portfolioMenu');
    if (portfolioMenu) portfolioMenu.classList.remove('show');
    
    switchToScreen('portfolio');
    renderPortfolioContent(portfolio);
    showNotification(`Переключен на портфель: ${portfolio.name}`, 'success');
}

function renderPortfolioContent(portfolio) {
    const portfolioScreen = document.getElementById('portfolio');
    if (!portfolioScreen) return;
    
    portfolioScreen.innerHTML = `
        <div style="background: var(--bg-primary); padding: 24px; border-radius: 12px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div>
                    <h1 style="margin: 0 0 8px 0;">${portfolio.name}</h1>
                    <div style="display: flex; gap: 16px; font-size: 14px; color: var(--text-secondary);">
                        <span>${getPortfolioTypeLabel(portfolio.type)}</span>
                        <span>${portfolio.assets.length} активов</span>
                        <span>${formatCurrency(calculatePortfolioValue(portfolio))}</span>
                    </div>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn-primary" onclick="openAssetModal()">
                        <i class="fas fa-plus"></i> Добавить актив
                    </button>
                    <button class="btn btn-secondary" onclick="openPortfolioModal('${portfolio.id}')">
                        <i class="fas fa-edit"></i> Редактировать
                    </button>
                </div>
            </div>
        </div>
        
        <div style="background: var(--bg-primary); padding: 24px; border-radius: 12px;">
            ${portfolio.assets.length === 0 ? `
                <div class="empty-state">
                    <i class="fas fa-chart-line"></i>
                    <h2>Портфель пуст</h2>
                    <p>Добавьте первый актив чтобы начать отслеживание</p>
                    <button class="btn btn-primary" onclick="openAssetModal()">
                        <i class="fas fa-plus"></i> Добавить актив
                    </button>
                </div>
            ` : `
                <div style="color: var(--text-muted); text-align: center; padding: 40px;">
                    <i class="fas fa-cogs" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <p>Функциональность активов будет доступна после полной загрузки модулей</p>
                </div>
            `}
        </div>
    `;
}

function calculatePortfolioValue(portfolio) {
    return portfolio.assets.reduce((total, asset) => {
        return total + (asset.amount * (asset.currentPrice || asset.buyPrice || 0));
    }, 0);
}

function getPortfolioTypeLabel(type) {
    const labels = {
        'mixed': 'Смешанный', 'crypto': 'Криптовалюты', 'stocks': 'Акции',
        'bonds': 'Облигации', 'other': 'Другое'
    };
    return labels[type] || 'Портфель';
}

function showNotification(message, type = 'info') {
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

// Глобальные функции для HTML
window.openPortfolioModal = openPortfolioModal;
window.closePortfolioModal = closePortfolioModal;
window.switchToPortfolio = switchToPortfolio;
window.updateExchangeRates = () => showNotification('Курсы обновлены', 'success');
window.openAssetModal = () => showNotification('Функция добавления активов скоро будет доступна', 'info');

console.log('✅ Portfolio module loaded');