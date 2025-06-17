// Login state
const AUTH = {
    username: 'midsommar',
    password: 'ela2025!',
    isLoggedIn: false
};

// Create login modal
function createLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 themed-card/90 flex items-center justify-center z-50';
    modal.id = 'login-modal';
    
    const form = document.createElement('form');
    form.className = 'themed-card p-6 rounded-lg max-w-md w-full mx-4 themed-border space-y-4';
    form.innerHTML = `
        <h2 class="text-xl font-bold themed-primary mb-4">Logga in</h2>
        
        <div class="space-y-2">
            <label class="block text-sm font-medium themed-text">Användarnamn</label>
            <input type="text" 
                   id="login-username"
                   class="w-full px-4 py-2 themed-input themed-border rounded-lg themed-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                   required>
        </div>

        <div class="space-y-2">
            <label class="block text-sm font-medium themed-text">Lösenord</label>
            <input type="password" 
                   id="login-password"
                   class="w-full px-4 py-2 themed-input themed-border rounded-lg themed-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                   required>
        </div>

        <div id="login-error" class="text-red-500 text-sm hidden">
            Felaktigt användarnamn eller lösenord
        </div>

        <div class="pt-4">
            <button type="submit"
                    class="w-full px-4 py-2 themed-primary-bg themed-text-light rounded-lg hover:opacity-80 transition-colors font-semibold">
                Logga in
            </button>
        </div>
    `;

    form.addEventListener('submit', handleLogin);
    modal.appendChild(form);
    return modal;
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    if (username === AUTH.username && password === AUTH.password) {
        AUTH.isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        document.getElementById('login-modal').remove();
        document.getElementById('app-content').classList.remove('hidden');
    } else {
        errorDiv.classList.remove('hidden');
    }
}

// Check login status
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        document.getElementById('app-content').classList.add('hidden');
        document.body.appendChild(createLoginModal());
    }
    AUTH.isLoggedIn = isLoggedIn;
}

// Logout function
function logout() {
    AUTH.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    checkLoginStatus();
}

document.addEventListener('DOMContentLoaded', () => {
    // Add logout button to header
    const header = document.querySelector('header');
    const logoutButton = document.createElement('button');
    logoutButton.className = 'fixed top-4 right-4 p-2 themed-text hover:opacity-80 transition-colors rounded-full themed-card';
    logoutButton.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    `;
    logoutButton.title = 'Logga ut';
    logoutButton.onclick = logout;
    document.body.appendChild(logoutButton);

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

            // Fun confetti explosion!
            if (window.confetti) {
                confetti({
                    particleCount: 120,
                    spread: 90,
                    origin: { y: 0.7 },
                    colors: [
                        '#1976D2', '#FFD600', '#A3B18A', '#34495E', '#FF00FF', '#00FFFF', '#FFFF00', '#43A047', '#E53935'
                    ]
                });
            }
        });
    }

    // Initialize theme switcher when DOM is loaded
    initThemeSwitcher();

    // Check login status on load
    checkLoginStatus();

    // Add item button functionality
    const addItemButtons = document.querySelectorAll('#add-item, #add-item-top');
    const addItemForm = document.getElementById('add-item-form');
    
    if (addItemButtons.length && addItemForm) {
        addItemButtons.forEach(button => {
            button.addEventListener('click', () => {
                addItemForm.classList.toggle('hidden');
                // Focus the input when showing the form
                if (!addItemForm.classList.contains('hidden')) {
                    document.getElementById('new-item-text').focus();
                }
            });
        });

        // Hide form when clicking outside
        document.addEventListener('click', (e) => {
            if (!addItemForm.contains(e.target) && !Array.from(addItemButtons).some(button => button.contains(e.target))) {
                addItemForm.classList.add('hidden');
            }
        });
    }
}); 