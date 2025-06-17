// Create meal element
function createMealElement(meal) {
    const mealDiv = document.createElement('div');
    mealDiv.className = 'themed-card rounded-lg shadow-lg themed-border p-6 space-y-4';

    // Title section with edit button
    const titleDiv = document.createElement('div');
    titleDiv.className = 'flex items-center justify-between';

    const title = document.createElement('h4');
    title.className = 'text-lg font-semibold themed-primary';
    title.textContent = meal.title;

    const iconDiv = document.createElement('div');
    iconDiv.className = 'flex items-center gap-2';

    // Add edit button
    const editButton = document.createElement('button');
    editButton.className = 'p-1.5 themed-text hover:opacity-80 transition-colors rounded-lg themed-card';
    editButton.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
            </path>
        </svg>
    `;
    editButton.addEventListener('click', () => openEditModal(meal));

    // Add comment button
    const commentButton = document.createElement('button');
    commentButton.className = 'p-1.5 themed-text hover:opacity-80 transition-colors rounded-lg themed-card';
    commentButton.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
            </path>
        </svg>
    `;
    commentButton.addEventListener('click', () => openCommentModal(meal.id));

    iconDiv.appendChild(editButton);
    iconDiv.appendChild(commentButton);
    titleDiv.appendChild(title);
    titleDiv.appendChild(iconDiv);
    mealDiv.appendChild(titleDiv);

    // Description if exists
    if (meal.description) {
        const desc = document.createElement('p');
        desc.className = 'themed-text';
        desc.textContent = meal.description;
        mealDiv.appendChild(desc);
    }

    // Items if exist
    if (meal.items && meal.items.length > 0) {
        const list = document.createElement('ul');
        list.className = 'space-y-2 themed-text';
        
        meal.items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'flex items-start gap-2';
            
            const indicators = [];
            if (item.isVegetarian) indicators.push('🌱');
            if (item.isDairyFree) indicators.push('💧');
            
            li.innerHTML = `
                <span class="mt-1">•</span>
                <span>${item.title || item} ${indicators.join(' ')}</span>
            `;
            list.appendChild(li);
        });
        
        mealDiv.appendChild(list);
    }

    // Comments section (hidden by default)
    const commentsSection = document.createElement('div');
    commentsSection.id = `comments-${meal.id}`;
    commentsSection.className = 'mt-4 space-y-2 hidden';
    mealDiv.appendChild(commentsSection);

    return mealDiv;
}

// Create day element
function createDayElement(dayData) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'space-y-6';

    const dayTitle = document.createElement('h3');
    dayTitle.className = 'text-2xl font-bold themed-primary mb-4';
    dayTitle.textContent = dayData.day;
    dayDiv.appendChild(dayTitle);

    dayData.meals.forEach(meal => {
        dayDiv.appendChild(createMealElement(meal));
    });

    return dayDiv;
}

// Render menu
async function renderMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;

    try {
        const menuData = await window.db.getMenu();
        container.innerHTML = '';
        
        menuData.forEach(day => {
            container.appendChild(createDayElement(day));
        });

        // Load comments for all sections
        menuData.forEach(day => {
            day.meals.forEach(meal => {
                loadComments(meal.id);
            });
        });
    } catch (error) {
        console.error('Error rendering menu:', error);
        container.innerHTML = '<p class="themed-text">Det gick inte att ladda menyn. Försök igen senare.</p>';
    }
}

// Open edit modal
function openEditModal(meal) {
    const password = prompt('Ange admin lösenord för att redigera menyn:');
    if (password !== 'midsommar2024') {
        alert('Felaktigt lösenord');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 themed-card/90 flex items-center justify-center z-50';
    modal.id = 'edit-modal';
    
    const form = document.createElement('form');
    form.className = 'themed-card p-6 rounded-lg max-w-2xl w-full mx-4 themed-border space-y-4';
    
    // Title
    form.innerHTML = `
        <h3 class="text-lg font-semibold themed-primary mb-4">Redigera måltid</h3>
        
        <div class="space-y-2">
            <label class="block text-sm font-medium themed-text">Titel</label>
            <input type="text" 
                   value="${meal.title}"
                   class="w-full px-4 py-2 themed-input themed-border rounded-lg themed-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                   id="edit-title">
        </div>

        <div class="space-y-2">
            <label class="block text-sm font-medium themed-text">Beskrivning</label>
            <textarea class="w-full px-4 py-2 themed-input themed-border rounded-lg themed-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows="2"
                      id="edit-description">${meal.description || ''}</textarea>
        </div>

        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <label class="block text-sm font-medium themed-text">Rätter</label>
                <button type="button" 
                        class="px-3 py-1 text-sm themed-primary-bg themed-text-light rounded hover:opacity-80 transition-colors"
                        onclick="addDishRow()">
                    + Lägg till rätt
                </button>
            </div>
            
            <div id="dishes-container" class="space-y-3">
                ${meal.items ? meal.items.map((item, index) => `
                    <div class="dish-row flex items-center gap-3 p-3 themed-input themed-border rounded-lg">
                        <input type="text" 
                               value="${item.title || item}"
                               class="flex-1 px-3 py-2 themed-input themed-border rounded themed-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                               placeholder="Rättens namn">
                        
                        <label class="flex items-center gap-1 themed-text">
                            <input type="checkbox" 
                                   class="rounded themed-border themed-input"
                                   ${item.isVegetarian ? 'checked' : ''}>
                            🌱
                        </label>
                        
                        <label class="flex items-center gap-1 themed-text">
                            <input type="checkbox"
                                   class="rounded themed-border themed-input"
                                   ${item.isDairyFree ? 'checked' : ''}>
                            💧
                        </label>
                        
                        <button type="button"
                                class="p-1 themed-text hover:opacity-80 transition-colors"
                                onclick="removeDishRow(this)">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                `).join('') : ''}
            </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
            <button type="button" 
                    class="px-4 py-2 themed-text hover:opacity-80 transition-colors"
                    onclick="closeEditModal()">
                Avbryt
            </button>
            <button type="submit"
                    class="px-4 py-2 themed-primary-bg themed-text-light rounded-lg hover:opacity-80 transition-colors font-semibold">
                Spara
            </button>
        </div>
    `;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const dishes = Array.from(document.querySelectorAll('.dish-row')).map(row => {
            const title = row.querySelector('input[type="text"]').value;
            const isVegetarian = row.querySelector('input[type="checkbox"]:nth-of-type(1)').checked;
            const isDairyFree = row.querySelector('input[type="checkbox"]:nth-of-type(2)').checked;
            
            return {
                title,
                isVegetarian,
                isDairyFree
            };
        });

        const updates = {
            title: document.getElementById('edit-title').value,
            description: document.getElementById('edit-description').value,
            items: dishes,
            is_vegetarian: dishes.some(dish => dish.isVegetarian),
            is_dairy_free: dishes.some(dish => dish.isDairyFree)
        };

        try {
            await window.db.updateMenuItem(meal.id, updates);
            await renderMenu();
            closeEditModal();
        } catch (error) {
            console.error('Error updating menu item:', error);
        }
    });

    modal.appendChild(form);
    document.body.appendChild(modal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEditModal();
        }
    });
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.remove();
    }
}

// Open comment modal
function openCommentModal(sectionId) {
    const modal = document.getElementById('comment-modal');
    const sectionIdInput = document.getElementById('comment-section-id');
    
    if (modal && sectionIdInput) {
        modal.classList.remove('hidden');
        sectionIdInput.value = sectionId;
    }
}

// Close comment modal
function closeCommentModal() {
    const modal = document.getElementById('comment-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Handle comment submission
async function handleCommentSubmit(event) {
    event.preventDefault();
    
    const sectionId = document.getElementById('comment-section-id').value;
    const commentText = document.getElementById('comment-text').value;
    
    try {
        await window.db.addMenuComment(sectionId, commentText);
        await loadComments(sectionId);
        closeCommentModal();
        document.getElementById('comment-text').value = '';
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}

// Load comments for a section
async function loadComments(sectionId) {
    try {
        const comments = await window.db.getMenuComments(sectionId);
        const commentsSection = document.getElementById(`comments-${sectionId}`);
        
        if (commentsSection && comments.length > 0) {
            commentsSection.innerHTML = '';
            commentsSection.classList.remove('hidden');
            
            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'themed-card rounded-lg p-3 themed-text text-sm';
                commentDiv.textContent = comment.text;
                commentsSection.appendChild(commentDiv);
            });
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Add new dish row
function addDishRow() {
    const container = document.getElementById('dishes-container');
    const row = document.createElement('div');
    row.className = 'dish-row flex items-center gap-3 p-3 themed-input themed-border rounded-lg';
    row.innerHTML = `
        <input type="text" 
               class="flex-1 px-3 py-2 themed-input themed-border rounded themed-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
               placeholder="Rättens namn">
        
        <label class="flex items-center gap-1 themed-text">
            <input type="checkbox" 
                   class="rounded themed-border themed-input">
            🌱
        </label>
        
        <label class="flex items-center gap-1 themed-text">
            <input type="checkbox"
                   class="rounded themed-border themed-input">
            💧
        </label>
        
        <button type="button"
                class="p-1 themed-text hover:opacity-80 transition-colors"
                onclick="removeDishRow(this)">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    `;
    container.appendChild(row);
}

// Remove dish row
function removeDishRow(button) {
    button.closest('.dish-row').remove();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    
    // Set up comment form
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmit);
    }

    // Add closeEditModal to window for global access
    window.closeEditModal = closeEditModal;

    // Set up comment modal close button
    const closeModalButton = document.getElementById('close-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeCommentModal);
    }

    // Set up comment modal background click
    const commentModal = document.getElementById('comment-modal');
    if (commentModal) {
        commentModal.addEventListener('click', (e) => {
            if (e.target === commentModal) {
                closeCommentModal();
            }
        });
    }
}); 