// 9. js/core/navigation.js
function initNavigation() {
    console.log('🔄 Инициализация навигации...');
    try {
        setupNavigationHandlers();
        setupThemeToggle();
        console.log('✅ Навигация инициализирована');
    } catch (error) {
        console.error('❌ Ошибка инициализации навигации:', error);
    }
}

function setupNavigationHandlers() {
    document.addEventListener('click', function(e) {
        const navBtn = e.target.closest('.nav-btn[data-screen]');
        if (navBtn) {
            e.preventDefault();
            const screenName = navBtn.getAttribute('data-screen');
            switchToScreen(screenName);
        }
    });
    
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', debounce(function(e) {
            const query = e.target.value.trim();
            if (query.length >= 2) console.log('🔍 Поиск:', query);
        }, 300));
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
        setTheme(savedTheme);
        updateThemeIcon();
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            updateThemeIcon();
            console.log('🎨 Тема изменена на:', newTheme);
        });
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

function switchToScreen(screenName) {
    try {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            screen.style.display = 'none';
        });
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenName);
        const targetButton = document.querySelector(`.nav-btn[data-screen="${screenName}"]`);
        
        if (targetScreen) {
            targetScreen.style.display = 'block';
            targetScreen.classList.add('active');
        }
        if (targetButton) targetButton.classList.add('active');
        
        localStorage.setItem('currentScreen', screenName);
        console.log('✅ Переключено на экран:', screenName);
    } catch (error) {
        console.error('❌ Ошибка переключения экрана:', error);
    }
}

console.log('✅ Navigation module loaded');