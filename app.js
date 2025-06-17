document.addEventListener('DOMContentLoaded', () => {
    const tabMeny = document.getElementById('tab-meny');
    const tabLista = document.getElementById('tab-lista');
    const viewMeny = document.getElementById('view-meny');
    const viewLista = document.getElementById('view-lista');

    function switchView(activeTab) {
        if (activeTab === 'meny') {
            tabMeny.classList.replace('tab-inactive', 'tab-active');
            tabLista.classList.replace('tab-active', 'tab-inactive');
            viewMeny.classList.remove('hidden');
            viewLista.classList.add('hidden');
        } else {
            tabLista.classList.replace('tab-inactive', 'tab-active');
            tabMeny.classList.replace('tab-active', 'tab-inactive');
            viewLista.classList.remove('hidden');
            viewMeny.classList.add('hidden');
        }
    }
    
    tabMeny.addEventListener('click', () => switchView('meny'));
    tabLista.addEventListener('click', () => switchView('lista'));

    // Theme switcher functionality
    function initThemeSwitcher() {
        const themes = ['default', 'meadow', 'archipelago', 'wild'];
        let currentThemeIndex = 0;

        // Create theme switcher button
        const themeSwitcher = document.createElement('div');
        themeSwitcher.className = 'theme-switcher';
        themeSwitcher.innerHTML = '🎨';
        document.body.appendChild(themeSwitcher);

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            currentThemeIndex = themes.indexOf(savedTheme);
            if (savedTheme === 'default') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', savedTheme);
            }
        }

        // Theme switching logic
        themeSwitcher.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            const newTheme = themes[currentThemeIndex];
            if (newTheme === 'default') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', newTheme);
            }
            localStorage.setItem('theme', newTheme);
            
            // Add animation effect
            themeSwitcher.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeSwitcher.style.transform = '';
            }, 300);
        });
    }

    // Initialize theme switcher when DOM is loaded
    initThemeSwitcher();
}); 