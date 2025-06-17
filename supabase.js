// Initialize Supabase client
const supabaseUrl = 'https://oyjgwqqsmyiziwjzsdhh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95amd3cXFzbXlpeml3anpzZGhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTI1NzksImV4cCI6MjA2NTcyODU3OX0.ZjvYqmQEKDgFwLqlYTu03KdWm3aeDsEUp339qPaLkE0'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

// Database interface
window.db = {
    // Shopping list functions
    async getShoppingList() {
        console.log('Fetching shopping list...')
        try {
            const { data, error } = await supabase
                .from('shopping_items')
                .select('*')
                .order('category')
            
            if (error) throw error;
            console.log('Received data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching shopping list:', error);
            return [];
        }
    },

    async addShoppingItem({ text, category, is_wishlist }) {
        try {
            const { data, error } = await supabase
                .from('shopping_items')
                .insert([{ 
                    text,
                    category,
                    is_wishlist,
                    checked: false,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error adding shopping item:', error);
            return null;
        }
    },

    async updateShoppingItem(id, updates) {
        try {
            const { data, error } = await supabase
                .from('shopping_items')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating shopping item:', error);
            return null;
        }
    },

    async deleteShoppingItem(id) {
        try {
            const { error } = await supabase
                .from('shopping_items')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting shopping item:', error);
            return false;
        }
    },

    // Menu functions
    async getMenu() {
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .order('day, meal_order');
            
            if (error) throw error;

            // Helper function to get day number
            const getDayNumber = (day) => {
                const dayMap = {
                    'tors': 4,
                    'fre': 5,
                    'lor': 6,
                    'son': 7
                };
                return dayMap[day.toLowerCase()] || 0;
            };

            // Transform the flat data into a nested structure
            const menu = [];
            let currentDay = null;
            let currentDayData = null;

            // Sort data by custom day order
            const sortedData = [...data].sort((a, b) => {
                const dayA = getDayNumber(a.day);
                const dayB = getDayNumber(b.day);
                if (dayA !== dayB) return dayA - dayB;
                return a.meal_order - b.meal_order;
            });

            sortedData.forEach(item => {
                if (currentDay !== item.day) {
                    if (currentDayData) {
                        menu.push(currentDayData);
                    }
                    currentDay = item.day;
                    currentDayData = {
                        day: item.day_title,
                        meals: []
                    };
                }

                const meal = {
                    id: item.id,
                    title: item.title,
                    description: item.description || '',
                    items: item.items || [],
                    isVegetarian: item.is_vegetarian,
                    isDairyFree: item.is_dairy_free
                };

                currentDayData.meals.push(meal);
            });

            if (currentDayData) {
                menu.push(currentDayData);
            }

            return menu;
        } catch (error) {
            console.error('Error fetching menu:', error);
            return [];
        }
    },

    async updateMenuItem(id, updates) {
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .update({
                    title: updates.title,
                    description: updates.description,
                    items: updates.items,
                    is_vegetarian: updates.is_vegetarian,
                    is_dairy_free: updates.is_dairy_free,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating menu item:', error);
            throw error;
        }
    },

    // Comment functions
    async getMenuComments(sectionId) {
        try {
            const { data, error } = await supabase
                .from('menu_comments')
                .select('*')
                .eq('section_id', sectionId)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    },

    async addMenuComment(sectionId, text) {
        try {
            const { data, error } = await supabase
                .from('menu_comments')
                .insert([{ section_id: sectionId, text }])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error adding comment:', error);
            return null;
        }
    }
}; 