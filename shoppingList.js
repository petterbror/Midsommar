const DEFAULT_CATEGORIES = [
    'Dryck',
    'Frukt & Grönt',
    'Bröd & Flingor',
    'Kött & Chark',
    'Vegetariskt',
    'Fisk',
    'Mejeri & Ägg',
    'Mjölkfria alternativ 💧',
    'Skafferi & Snacks',
    'Ostbricka',
    'Glöm inte!'
];

const state = {
    items: [],
    hideCompleted: false
};

function createItemElement(item) {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-between p-4 themed-card rounded-lg shadow-lg themed-border hover:opacity-90 transition-all duration-300 group';
    
    const leftSection = document.createElement('div');
    leftSection.className = 'flex items-center gap-3';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'w-5 h-5 rounded themed-border themed-input focus:ring-2 focus:ring-primary focus:ring-offset-0';
    checkbox.checked = item.checked;
    checkbox.addEventListener('change', () => handleCheck(item.id, checkbox.checked));
    
    const text = document.createElement('span');
    text.className = `themed-text ${item.checked ? 'line-through opacity-60' : ''}`;
    text.textContent = item.text;

    // Add wishlist indicator if it's a manually added item
    if (item.is_wishlist) {
        const wishlistBadge = document.createElement('span');
        wishlistBadge.className = 'ml-2 px-2 py-0.5 text-xs wishlist-badge';
        wishlistBadge.textContent = 'Önskemål';
        text.appendChild(wishlistBadge);
    }
    
    leftSection.appendChild(checkbox);
    leftSection.appendChild(text);
    
    const rightSection = document.createElement('div');
    rightSection.className = 'flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity';
    
    const editButton = document.createElement('button');
    editButton.className = 'p-1.5 themed-text hover:opacity-80 transition-colors rounded-lg themed-card';
    editButton.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>';
    editButton.addEventListener('click', () => handleEdit(item.id, item.text));
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'p-1.5 themed-text hover:opacity-80 transition-colors rounded-lg themed-card';
    deleteButton.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>';
    deleteButton.addEventListener('click', () => handleDelete(item.id));
    
    rightSection.appendChild(editButton);
    rightSection.appendChild(deleteButton);
    
    div.appendChild(leftSection);
    div.appendChild(rightSection);
    
    return div;
}

function createCategoryElement(category, items) {
    const div = document.createElement('div');
    div.className = 'space-y-3';
    
    const header = document.createElement('h3');
    header.className = 'text-lg font-semibold text-teal-400 mb-3';
    header.textContent = category;
    
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'space-y-3';
    items.forEach(item => itemsContainer.appendChild(createItemElement(item)));
    
    div.appendChild(header);
    div.appendChild(itemsContainer);
    
    return div;
}

async function handleCheck(id, checked) {
    try {
        await window.db.updateShoppingItem(id, { checked });
        await renderList();
    } catch (error) {
        console.error('Error updating item:', error);
    }
}

async function handleEdit(id, currentText) {
    const newText = prompt('Redigera vara:', currentText);
    if (newText && newText !== currentText) {
        try {
            await window.db.updateShoppingItem(id, { text: newText });
            await renderList();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    }
}

async function handleDelete(id) {
    const password = prompt('Ange lösenord för att ta bort varan:');
    if (password !== '!!!') {
        alert('Felaktigt lösenord');
        return;
    }

    if (confirm('Är du säker på att du vill ta bort denna vara?')) {
        try {
            await window.db.deleteShoppingItem(id);
            await renderList();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }
}

function updateProgress(items) {
    const total = items.length;
    const checked = items.filter(item => item.checked).length;
    const progress = total > 0 ? (checked / total) * 100 : 0;
    
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${checked} / ${total}`;
    }
}

async function renderList() {
    try {
        const container = document.getElementById('shopping-list-container');
        if (!container) {
            console.error('Shopping list container not found');
            return;
        }

        const items = await window.db.getShoppingList();
        state.items = items;
        
        // Filter items if hideCompleted is true
        const filteredItems = state.hideCompleted 
            ? items.filter(item => !item.checked)
            : items;
        
        // Group items by category
        const groupedItems = filteredItems.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});
        
        // Sort categories
        const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
            const indexA = DEFAULT_CATEGORIES.indexOf(a);
            const indexB = DEFAULT_CATEGORIES.indexOf(b);
            return indexA - indexB;
        });
        
        // Clear container
        container.innerHTML = '';
        
        // Render each category
        sortedCategories.forEach(category => {
            const categoryElement = createCategoryElement(category, groupedItems[category]);
            container.appendChild(categoryElement);
        });
        
        // Update progress
        updateProgress(items);
    } catch (error) {
        console.error('Error rendering list:', error);
    }
}

async function addNewItem(text, category) {
    try {
        await window.db.addShoppingItem({ 
            text, 
            category,
            is_wishlist: true // Mark all manually added items as wishlist items
        });
        await renderList();
    } catch (error) {
        console.error('Error adding item:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Set up filter button
        const filterButton = document.getElementById('filter-button');
        if (filterButton) {
            filterButton.addEventListener('click', () => {
                state.hideCompleted = !state.hideCompleted;
                filterButton.textContent = state.hideCompleted ? 'Visa alla' : 'Dölj köpta';
                renderList();
            });
        }

        // Set up category select
        const categorySelect = document.getElementById('new-item-category');
        if (categorySelect) {
            DEFAULT_CATEGORIES.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        }

        // Set up form
        const form = document.getElementById('add-item-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const input = form.querySelector('#new-item-text');
                const category = form.querySelector('#new-item-category').value;
                
                if (input && input.value.trim() && category) {
                    await addNewItem(input.value.trim(), category);
                    input.value = '';
                    form.querySelector('#new-item-category').value = '';
                    form.classList.add('hidden');
                }
            });
        }

        // Initial render
        await renderList();
    } catch (error) {
        console.error('Error initializing shopping list:', error);
    }
}); 