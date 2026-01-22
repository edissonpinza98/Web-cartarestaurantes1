import { reactive } from 'vue';
import { supabase } from './supabase';

// State definition
export const store = reactive({
  presentation: {
    name: 'LUMIÈRE',
    subtitle: 'Redefinida',
    eyebrow: 'EST. 2024 • VANGUARDIA',
    phrase: 'Descubra un santuario gastronómico donde la vanguardia culinaria se fusiona con la sofisticación del diseño contemporáneo.',
    heroImage: '/images/hero.png',
    whatsapp: '573000000000',
    instagram: '@lumiere_res',
    address: 'Calle de la Gastronomía #123, Bogotá',
    phone: '+57 123 456 7890',
    categories: ['Entradas', 'Platos Fuertes', 'Postres', 'Bebidas']
  },
  dishes: [],
  cart: [],
  loading: true
});

// Mock data for fallback
const mockDishes = [
  { id: 1, name: 'Tartar de Atún Noir', description: 'Atún aleta amarilla, emulsión de soja añeja y perlas de trufa.', price: 21.00, category: 'Entradas', image: '/images/tartar.png', status: 'Activo' },
  { id: 2, name: 'Risotto Esmeralda', description: 'Arroz Acquerello, clorofila de albahaca y espuma de parmesano.', price: 28.50, category: 'Platos Fuertes', image: '/images/risotto.png', status: 'Activo' },
];

// Load data from Supabase on start
export const initStore = async () => {
  store.loading = true;

  if (!supabase) {
    console.warn('Supabase client not initialized. Using local fallback.');
    store.dishes = mockDishes;
    store.loading = false;
    return;
  }

  try {
    // 1. Fetch Presentation
    const { data: pres, error: presErr } = await supabase
      .from('presentation')
      .select('*')
      .maybeSingle(); // Better than .single() if table is empty

    if (pres && !presErr) {
      Object.assign(store.presentation, pres);
    } else if (presErr) {
      console.warn('Using default presentation due to Supabase error/missing configuration');
    }

    // 2. Fetch Dishes
    const { data: dishes, error: dishErr } = await supabase
      .from('dishes')
      .select('*')
      .order('created_at', { ascending: true });

    if (dishes && dishes.length > 0 && !dishErr) {
      store.dishes = dishes;
    } else {
      console.warn('Using mock dishes as fallback');
      store.dishes = mockDishes;
    }
  } catch (err) {
    console.error('Connection failed, using local fallback:', err);
    store.dishes = mockDishes;
  } finally {
    store.loading = false;
  }
};

export const actions = {
  // --- Presentation Actions ---
  async updatePresentation(newData) {
    Object.assign(store.presentation, newData);
    if (!supabase) return;

    const { error } = await supabase
      .from('presentation')
      .upsert({ id: 1, ...store.presentation });

    if (error) console.error('Supabase error:', error);
  },

  async addCategory(cat) {
    if (!store.presentation.categories.includes(cat)) {
      store.presentation.categories.push(cat);
      await this.updatePresentation(store.presentation);
    }
  },

  async updateCategory(oldCat, newCat) {
    if (oldCat === newCat || !newCat.trim()) return;

    // Update categories list
    const index = store.presentation.categories.indexOf(oldCat);
    if (index !== -1) {
      store.presentation.categories[index] = newCat.trim();
    }

    // Update all dishes in this category
    store.dishes.forEach(dish => {
      if (dish.category === oldCat) {
        this.updateDish(dish.id, { category: newCat.trim() });
      }
    });

    await this.updatePresentation(store.presentation);
  },

  async deleteCategory(cat) {
    store.presentation.categories = store.presentation.categories.filter(c => c !== cat);
    // Reset category of dishes in this category to first available
    const firstCat = store.presentation.categories[0] || 'Sin categoría';
    store.dishes.forEach(dish => {
      if (dish.category === cat) {
        this.updateDish(dish.id, { category: firstCat });
      }
    });
    await this.updatePresentation(store.presentation);
  },

  // --- Dish Actions ---
  async addDish(dish) {
    if (!supabase) {
      const newDish = { ...dish, id: Date.now(), status: 'Activo' };
      store.dishes.push(newDish);
      return { data: [newDish], error: null };
    }

    const { data, error } = await supabase
      .from('dishes')
      .insert([dish])
      .select();

    if (data && !error) {
      store.dishes.push(data[0]);
    }
    return { data, error };
  },

  async updateDish(id, updatedFields) {
    const index = store.dishes.findIndex(d => d.id === id);
    if (index !== -1) {
      store.dishes[index] = { ...store.dishes[index], ...updatedFields };
    }

    if (!supabase) return;

    const { error } = await supabase
      .from('dishes')
      .update(updatedFields)
      .eq('id', id);

    if (error) console.error('Supabase error:', error);
  },

  async deleteDish(id) {
    store.dishes = store.dishes.filter(d => d.id !== id);
    if (!supabase) return;

    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id);

    if (error) console.error('Supabase error:', error);
  },

  // --- Cart Actions (Stay Local) ---
  addToCart(dish) {
    const existing = store.cart.find(item => item.id === dish.id);
    if (existing) {
      existing.quantity++;
    } else {
      store.cart.push({ ...dish, quantity: 1 });
    }
  },

  updateQuantity(id, quantity) {
    const index = store.cart.findIndex(item => item.id === id);
    if (index !== -1) {
      if (quantity <= 0) {
        store.cart.splice(index, 1);
      } else {
        store.cart[index].quantity = quantity;
      }
    }
  }
};
