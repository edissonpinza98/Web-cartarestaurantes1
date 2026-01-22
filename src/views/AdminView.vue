<template>
  <div class="admin-wrapper">
    <!-- Sophisticated "Zen" Loader -->
    <transition name="aura-fade">
      <div v-if="isPageLoading" class="zen-loader">
        <div class="brand-entrance">
          <div class="brand-reveal-text">LUMIÈRE</div>
          <div class="brand-line-load"></div>
        </div>
      </div>
    </transition>

    <div class="admin-layout" v-if="!isPageLoading">
      <!-- Minimalist Architectural Sidebar -->
      <aside class="luxe-sidebar animate-aura">
        <div class="sidebar-brand">
          <div class="brand-reveal">
            <span class="reveal-inner">ADMIN</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="nav-tab" 
            :class="{ active: currentTab === tab.id }"
            @click="currentTab = tab.id"
            :data-tooltip="tab.label"
          >
            <div class="tab-icon-box">
              <component :is="tab.icon" :size="20" stroke-width="1.5" />
            </div>
            <span class="tab-tooltip">{{ tab.label }}</span>
          </button>
        </nav>

        <div class="sidebar-bottom">
          <button @click="handleLogout" class="circle-btn logout" title="Cerrar Sesión">
            <LogOut :size="18" />
          </button>
        </div>
      </aside>

      <!-- Main Stage -->
      <main class="main-stage">
        <header class="stage-topbar animate-reveal">
          <div class="header-content container">
            <div class="context-info">
              <span class="eyebrow">{{ activeTabLabel }}</span>
              <h1 class="page-title">{{ store.presentation.name }}</h1>
            </div>
            <div class="header-actions">
              <button class="action-btn gold" v-if="currentTab === 'dishes'" @click="openEditor()">
                <Plus :size="20" />
                <span>Agregar Plato</span>
              </button>
              <router-link to="/" class="action-btn ghost">
                <Monitor :size="18" />
                <span>Ver Sitio</span>
              </router-link>
            </div>
          </div>
        </header>

        <div class="workspace-area container animate-aura">
          <!-- Presentation View -->
          <div v-if="currentTab === 'presentation'" class="workspace-grid single">
            <div class="luxe-panel-v4">
              <div class="panel-header">
                <h3>Identidad Visual</h3>
                <p>Configure la esencia de su marca.</p>
              </div>
              
              <div class="editor-sections">
                <div class="section-row">
                  <div class="input-field luxe">
                    <label>Nombre del Restaurante</label>
                    <input v-model="store.presentation.name" type="text" />
                  </div>
                  <div class="input-field luxe">
                    <label>Eslogan / Subtítulo</label>
                    <input v-model="store.presentation.subtitle" type="text" />
                  </div>
                </div>

                <div class="section-row">
                  <div class="input-field luxe full">
                    <label>Número de WhatsApp (solo 10 dígitos colombianos)</label>
                    <input v-model="store.presentation.whatsapp" type="text" placeholder="Ej: 3001234567" maxlength="12" />
                  </div>
                </div>

                <div class="section-row">
                  <div class="input-field luxe full">
                    <label>Imagen de Portada Premium</label>
                    <div class="luxe-upload">
                      <div class="upload-info" v-if="!store.presentation.heroImage">
                        <Image :size="30" class="muted-icon" />
                        <p>Subir archivo de alta resolución</p>
                      </div>
                      <div class="image-stack" v-else>
                        <img :src="store.presentation.heroImage" class="preview-img" />
                        <div class="stack-overlay">
                          <button @click="$refs.heroInput.click()" class="mini-btn">Cambiar</button>
                        </div>
                      </div>
                      <input ref="heroInput" type="file" @change="handleHeroUpload" accept="image/*" class="hidden" />
                      <input v-model="store.presentation.heroImage" type="text" placeholder="URL externa..." class="luxe-input-sm" />
                    </div>
                  </div>
                </div>

                <div class="section-row">
                  <div class="input-field luxe">
                    <label>Instagram</label>
                    <input v-model="store.presentation.instagram" type="text" placeholder="@usuario" />
                  </div>
                  <div class="input-field luxe">
                    <label>Teléfono de Contacto</label>
                    <input v-model="store.presentation.phone" type="text" placeholder="+57 ..." />
                  </div>
                </div>

                <div class="section-row">
                  <div class="input-field luxe full">
                    <label>Dirección Física</label>
                    <input v-model="store.presentation.address" type="text" placeholder="Calle ..., Ciudad" />
                  </div>
                </div>

                <div class="section-row">
                  <div class="input-field luxe full">
                    <label>Historia / Introducción</label>
                    <textarea v-model="store.presentation.phrase" rows="4"></textarea>
                  </div>
                </div>


                <!-- Botón de Guardar Cambios -->
                <div class="section-row">
                  <button @click="savePresentation" class="save-btn-luxe">
                    <Save :size="18" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Dishes Catalog View (Unified List) -->
          <div v-if="currentTab === 'dishes'" class="catalog-interface-v6">
            <!-- Header Bar: Search & Filters -->
            <div class="catalog-header-bar">
              <div class="search-box">
                <Search :size="18" />
                <input type="text" placeholder="Buscar en el catálogo..." />
              </div>
              <div class="filter-pills">
                <button class="pill active">Todos</button>
                <button v-for="cat in categories" :key="cat" class="pill">{{ cat }}</button>
              </div>
            </div>

            <div class="visual-catalog">
              <div v-for="dish in store.dishes" :key="dish.id" class="dish-card-v2 animate-reveal">
                <div class="card-media">
                  <img :src="dish.image" alt="" @error="dish.image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'" />
                  <div class="status-indicator" :class="dish.status.toLowerCase()"></div>
                  <div class="card-hover-actions">
                    <button class="action-circle" @click="openEditor(dish)"><Edit2 :size="16" /></button>
                    <button class="action-circle delete" @click="handleDelete(dish.id)"><Trash2 :size="16" /></button>
                  </div>
                </div>
                <div class="card-info">
                  <div class="info-top">
                    <span class="info-cat">{{ dish.category }}</span>
                    <span class="info-price">${{ (dish.price || 0).toFixed(2) }}</span>
                  </div>
                  <h4 class="info-name">{{ dish.name }}</h4>
                </div>
              </div>
            </div>
          </div>

          <!-- Categories Dedicated Environment -->
          <div v-if="currentTab === 'categories'" class="categories-env animate-aura">
            <div class="env-header">
              <h2 class="env-title">Gestión de Secciones</h2>
              <p class="env-subtitle">Organice la estructura de su menú, añada nuevas categorías o renombre las existentes.</p>
            </div>

            <div class="category-manager-luxe env-mode">
              <div class="cat-controls-row">
                <div class="cat-input-group">
                  <input v-model="newCatName" type="text" placeholder="Nombre de la nueva sección..." @keyup.enter="addCat" />
                  <button @click="addCat" class="add-cat-btn">
                    <Plus :size="18" />
                    <span>Añadir Categoría</span>
                  </button>
                </div>

                <div class="cat-tags-wrapper">
                  <label class="inner-label">Secciones actuales habilitadas</label>
                  <div class="cat-tags">
                    <div v-for="cat in store.presentation.categories" :key="cat" class="cat-tag luxe-badge">
                      <div v-if="editingCatName === cat" class="inline-editor-box">
                        <input 
                          v-model="tempCatName"
                          class="inline-edit-input"
                          @blur="finishEditingCat(cat)"
                          @keyup.enter="finishEditingCat(cat)"
                          @keyup.esc="editingCatName = null"
                          v-focus
                        />
                      </div>
                      <template v-else>
                        <span class="cat-name-trigger" @click="startEditingCat(cat)">
                          {{ cat }}
                          <Edit2 :size="10" class="mini-icon" />
                        </span>
                        <button @click="actions.deleteCategory(cat)" class="del-tag">
                          <Trash2 :size="14" />
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dashboard Tab -->
          <div v-if="currentTab === 'dashboard'" class="dashboard-grid animate-aura">
            <div class="stats-card luxe">
              <div class="stats-icon"><Utensils :size="24" /></div>
              <div class="stats-data">
                <span class="stats-value">{{ store.dishes.length }}</span>
                <span class="stats-label">Items en Menú</span>
              </div>
            </div>
            <div class="stats-card luxe">
              <div class="stats-icon"><LayoutDashboard :size="24" /></div>
              <div class="stats-data">
                <span class="stats-value">{{ store.presentation.categories.length }}</span>
                <span class="stats-label">Categorías</span>
              </div>
            </div>
            <div class="stats-card luxe">
              <div class="stats-icon gold"><Monitor :size="24" /></div>
              <div class="stats-data">
                <span class="stats-value">Online</span>
                <span class="stats-label">Estado del Sitio</span>
              </div>
            </div>

            <div class="dashboard-hero-panel luxe">
              <div class="hero-left">
                <h2>Bienvenido, {{ store.presentation.name }}</h2>
                <p>Su vitrina gastronómica digital está funcionando correctamente. Desde aquí puede gestionar cada detalle de la experiencia de sus clientes.</p>
                <div class="hero-actions">
                  <button @click="currentTab = 'dishes'" class="btn-micro gold">Nuevo Plato</button>
                  <button @click="currentTab = 'presentation'" class="btn-micro ghost">Ajustar Branding</button>
                </div>
              </div>
              <div class="hero-right">
                <div class="floating-brand-logo">
                  {{ store.presentation.name.charAt(0) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Tab -->
          <div v-if="currentTab === 'analytics'" class="analytics-wrapper animate-aura">
            <div class="analytics-header">
              <h3>Métricas de Rendimiento</h3>
              <p>Visualización del impacto digital de su menú.</p>
            </div>
            
            <div class="metrics-grid">
              <div class="metric-panel">
                <div class="p-header">Visitas al Menú (Simulado)</div>
                <div class="p-chart-sim">
                  <div v-for="h in [40, 70, 45, 90, 65, 80, 50]" :key="h" class="bar" :style="{ height: h + '%' }"></div>
                </div>
                <div class="p-footer">Últimos 7 días</div>
              </div>

              <div class="metric-panel list">
                <div class="p-header">Platos Más Vistos</div>
                <div class="top-dishes-list">
                  <div v-for="(dish, i) in store.dishes.slice(0, 3)" :key="dish.id" class="top-dish-item">
                    <span class="rank">#{{ i + 1 }}</span>
                    <span class="name">{{ dish.name }}</span>
                    <span class="view-count">{{ 120 - (i * 30) }} vistas</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="empty-zen nested" style="padding: 4rem 0;">
              <div class="zen-circle small">
                <BarChart3 :size="30" stroke-width="1" class="pulse-icon" />
              </div>
              <p>Datos avanzados de Supabase en proceso de integración.</p>
            </div>
          </div>
        </div>
      </main>

      <!-- Advanced Editor Modal -->
      <transition name="modal-bounce">
        <div v-if="isModalOpen" class="modal-root" @click.self="isModalOpen = false">
          <div class="focused-editor">
            <button class="close-editor" @click="isModalOpen = false"><X :size="24" /></button>
            
            <div class="editor-layout">
              <div class="editor-side-preview">
                <div class="preview-frame">
                  <img :src="editingDish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'" />
                  <div class="preview-overlay">
                    <span class="p-category">{{ editingDish.category }}</span>
                    <h2 class="p-name">{{ editingDish.name || 'Nombre del Plato' }}</h2>
                    <span class="p-price">${{ (editingDish.price || 0).toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <div class="editor-controls">
                <div class="editor-header">
                  <h2>Editar Creación</h2>
                  <p>Defina los detalles técnicos de su item.</p>
                </div>

                <form @submit.prevent="saveDish" class="luxe-form-v5">
                  <div class="form-group">
                    <label>Nombre del Item</label>
                    <input v-model="editingDish.name" type="text" placeholder="Ej: Risotto de Trufa Negra" required />
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Precio Unitario</label>
                      <input v-model.number="editingDish.price" type="number" step="0.01" required />
                    </div>
                    <div class="form-group">
                      <label>Categoría</label>
                      <select v-model="editingDish.category">
                        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <label>URL de Imagen o Subir vía Cloud</label>
                    <div class="upload-input-group">
                      <input v-model="editingDish.image" type="text" placeholder="https://..." />
                      <button type="button" class="upload-btn" @click="$refs.dishInput.click()">
                        <Image :size="18" />
                      </button>
                      <input ref="dishInput" type="file" @change="handleFileUpload" accept="image/*" class="hidden" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Descripción Gastronómica</label>
                    <textarea v-model="editingDish.description" rows="4" placeholder="Describa los ingredientes y la historia del plato..."></textarea>
                  </div>

                  <div class="form-actions">
                    <button type="submit" class="apply-btn">
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { store, actions } from '../store';
import { supabase } from '../supabase';
import { 
  LayoutDashboard, 
  Utensils, 
  Settings, 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Plus,
  LayoutGrid,
  BarChart3,
  Monitor,
  X,
  LogOut,
  Image,
  Search,
  Save
} from 'lucide-vue-next';

const router = useRouter();
const isPageLoading = ref(true);

const handleHeroUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!supabase) {
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      store.presentation.heroImage = e.target.result;
      actions.updatePresentation(store.presentation);
    };
    reader.readAsDataURL(file);
    return;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `brand_hero_${Date.now()}.${fileExt}`;
  const filePath = `branding/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('restaurant-assets')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('restaurant-assets')
      .getPublicUrl(filePath);

    store.presentation.heroImage = publicUrl;
    actions.updatePresentation(store.presentation);
  } catch (error) {
    console.error('Error uploading hero:', error.message);
    alert('Error al subir la imagen de portada.');
  }
};

const handleLogout = async () => {
  if (supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem('lumiere_logged');
  router.push('/');
};
const currentTab = ref('dishes');
const isModalOpen = ref(false);
const newCatName = ref('');

const addCat = () => {
  if (newCatName.value.trim()) {
    actions.addCategory(newCatName.value.trim());
    newCatName.value = '';
  }
};

const categories = computed(() => store.presentation.categories);
const editingCatName = ref(null);
const tempCatName = ref('');

const startEditingCat = (cat) => {
  editingCatName.value = cat;
  tempCatName.value = cat;
};

const finishEditingCat = async (oldCat) => {
  if (tempCatName.value.trim() && tempCatName.value !== oldCat) {
    await actions.updateCategory(oldCat, tempCatName.value.trim());
  }
  editingCatName.value = null;
};

// Custom directive for auto-focus
const vFocus = {
  mounted: (el) => el.focus()
};

const editingDish = reactive({
  id: null,
  name: '',
  price: 0,
  description: '',
  category: store.presentation.categories[0] || '',
  image: ''
});

const tabs = [
  { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
  { id: 'presentation', label: 'Identidad', icon: Monitor },
  { id: 'categories', label: 'Categorías', icon: LayoutGrid },
  { id: 'dishes', label: 'Catálogo', icon: Utensils },
  { id: 'analytics', label: 'Métricas', icon: BarChart3 },
];

const activeTabLabel = computed(() => {
  return tabs.find(t => t.id === currentTab.value)?.label || 'Gestión';
});

onMounted(() => {
  // Safeguard: Ensure categories is always an array
  if (!store.presentation.categories) {
    store.presentation.categories = ['Entradas', 'Platos Fuertes', 'Postres', 'Bebidas'];
  }
  
  setTimeout(() => {
    isPageLoading.value = false;
  }, 1000);
});

const savePresentation = async () => {
  try {
    // Limpiar y validar número de WhatsApp
    let whatsappNumber = store.presentation.whatsapp?.replace(/[^0-9]/g, '') || '';
    
    // Si el número ya tiene el código de país 57, quitarlo
    if (whatsappNumber.startsWith('57') && whatsappNumber.length === 12) {
      whatsappNumber = whatsappNumber.substring(2);
    }
    
    // Validar que tenga exactamente 10 dígitos (número colombiano)
    if (whatsappNumber.length !== 10) {
      alert('⚠️ El número debe tener exactamente 10 dígitos.\nEjemplo: 3001234567');
      return;
    }
    
    // Agregar automáticamente el código de país de Colombia (57)
    store.presentation.whatsapp = '57' + whatsappNumber;
    
    await actions.updatePresentation(store.presentation);
    alert('✅ Cambios guardados exitosamente\nNúmero guardado: +57 ' + whatsappNumber);
  } catch (error) {
    console.error('Error al guardar:', error);
    alert('❌ Hubo un error al guardar los cambios');
  }
};

const openEditor = (dish = null) => {
  if (dish) {
    editingDish.id = dish.id;
    editingDish.name = dish.name || '';
    editingDish.price = parseFloat(dish.price) || 0;
    editingDish.description = dish.description || '';
    editingDish.category = dish.category || 'Entradas';
    editingDish.image = dish.image || '';
  } else {
    editingDish.id = null;
    editingDish.name = '';
    editingDish.price = 0;
    editingDish.description = '';
    editingDish.category = 'Entradas';
    editingDish.image = '';
  }
  isModalOpen.value = true;
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    alert('Por favor seleccione un archivo de imagen válido');
    return;
  }

  // Validar tamaño (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('La imagen es demasiado grande. Máximo 5MB.');
    return;
  }

  // Si no hay Supabase, usar base64
  if (!supabase) {
    const reader = new FileReader();
    reader.onload = (e) => {
      editingDish.image = e.target.result;
    };
    reader.readAsDataURL(file);
    return;
  }

  // Subir a Supabase Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `dish_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `dishes/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('restaurant-assets')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('restaurant-assets')
      .getPublicUrl(filePath);

    editingDish.image = publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error.message);
    alert('Error al subir la imagen. Verifica que el bucket "restaurant-assets" exista y sea público.');
  }
};

const saveDish = async () => {
  // Validación básica
  if (!editingDish.name || !editingDish.name.trim()) {
    alert('Por favor ingrese un nombre para el plato');
    return;
  }
  
  if (editingDish.price < 0) {
    alert('El precio no puede ser negativo');
    return;
  }

  const dishData = {
    name: editingDish.name.trim(),
    description: editingDish.description?.trim() || '',
    price: parseFloat(editingDish.price) || 0,
    category: editingDish.category || 'Entradas',
    image: editingDish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    status: 'Activo'
  };

  try {
    if (editingDish.id) {
      // Actualizar plato existente
      await actions.updateDish(editingDish.id, dishData);
      console.log('Plato actualizado:', editingDish.id);
    } else {
      // Agregar nuevo plato
      await actions.addDish(dishData);
      console.log('Plato agregado');
    }
    isModalOpen.value = false;
  } catch (error) {
    console.error('Error al guardar el plato:', error);
    alert('Hubo un error al guardar el plato. Por favor intente de nuevo.');
  }
};

const handleDelete = (id) => {
  if (confirm('¿Está seguro de que desea eliminar este ítem?')) {
    actions.deleteDish(id);
  }
};
</script>

<style scoped>
.admin-wrapper {
  color: white;
  background: var(--bg-primary);
  min-height: 100vh;
}

/* --- Brand Entrance Loader --- */
.zen-loader {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-entrance {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.brand-reveal-text {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: var(--color-gold);
  letter-spacing: 0.5em;
  text-transform: uppercase;
  animation: txtExpand 2s cubic-bezier(0.19, 1, 0.22, 1) infinite alternate;
}

.brand-line-load {
  width: 0;
  height: 1px;
  background: var(--color-gold);
  box-shadow: 0 0 15px var(--color-gold-glow);
  animation: lineFlow 2s cubic-bezier(0.19, 1, 0.22, 1) infinite;
}

@keyframes txtExpand {
  from { letter-spacing: 0.3em; opacity: 0.4; filter: blur(2px); }
  to { letter-spacing: 0.8em; opacity: 1; filter: blur(0); }
}

@keyframes lineFlow {
  0% { width: 0; transform: translateX(-50%); opacity: 0; }
  50% { width: 120px; transform: translateX(0); opacity: 1; }
  100% { width: 0; transform: translateX(50%); opacity: 0; }
}

/* Admin Layout Architecture */
.admin-layout {
  display: flex;
  height: 100vh;
  position: relative;
}

/* Sidebar: Slim & Luxe */
.luxe-sidebar {
  width: 90px;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(20px);
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 0;
  z-index: 100;
}

.sidebar-brand {
  margin-bottom: 4rem;
}

.brand-reveal {
  padding: 0.5rem;
  border: 1px solid var(--color-gold);
  transform: rotate(-90deg);
}

.reveal-inner {
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  color: var(--color-gold);
  font-weight: 700;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.nav-tab {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  position: relative;
}

.nav-tab:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.nav-tab.active {
  background: var(--color-gold-soft);
  border-color: var(--color-gold);
  color: var(--color-gold);
  box-shadow: 0 0 20px var(--color-gold-glow);
}

.tab-tooltip {
  position: absolute;
  left: 70px;
  background: var(--color-gold);
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translateX(-10px);
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.nav-tab:hover .tab-tooltip {
  opacity: 1;
  transform: translateX(0);
}

/* Tooltip Arrow */
.tab-tooltip::after {
  content: '';
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: var(--color-gold);
}

.sidebar-bottom {
  margin-top: auto;
}

.circle-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.4s;
}

.circle-btn:hover {
  background: rgba(255, 77, 77, 0.1);
  color: #ff4d4d;
  border-color: #ff4d4d;
}

/* Main Stage */
.main-stage {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

.stage-topbar {
  padding: 3rem 0;
  border-bottom: 1px solid var(--glass-border);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.eyebrow {
  color: var(--color-gold);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
}

.page-title {
  font-size: 2rem;
  font-weight: 400;
  font-family: var(--font-heading);
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  cursor: pointer;
  border: 1px solid transparent;
}

.action-btn.gold {
  background: var(--color-gold);
  color: #000;
}

.action-btn.gold:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px var(--color-gold-glow);
}

.action-btn.ghost {
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
  border-color: var(--glass-border);
  text-decoration: none;
}

.action-btn.ghost:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

/* Content Area */
.workspace-area {
  padding: 4rem 0;
}

.luxe-panel-v4 {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  padding: 3rem;
  border-radius: var(--radius-sm);
  max-width: 900px;
  margin: 0 auto;
}

.panel-header {
  margin-bottom: 3rem;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 2rem;
}

.panel-header h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
.panel-header p { color: var(--text-muted); font-size: 0.8rem; }

.section-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.input-field.luxe {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.input-field.luxe.full { grid-column: span 2; }

.input-field label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
}

.input-field input, .input-field textarea {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  padding: 1.25rem;
  color: white;
  border-radius: var(--radius-xs);
  font-size: 0.9rem;
  transition: all 0.4s;
  outline: none;
}

.input-field input:focus {
  border-color: var(--color-gold);
  background: rgba(255, 255, 255, 0.05);
}

.luxe-upload {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 2rem;
  border: 1px dashed var(--glass-border);
  border-radius: var(--radius-xs);
}

.image-stack {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
}

.preview-img { width: 100%; height: 100%; object-fit: cover; }

.stack-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 0.3s;
}

.image-stack:hover .stack-overlay { opacity: 1; }

.mini-btn {
  background: white;
  color: black;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
}

.luxe-input-sm {
  background: transparent !important;
  border: none !important;
  border-bottom: 1px solid var(--glass-border) !important;
  font-size: 0.7rem !important;
  padding: 0.5rem 0 !important;
}

/* Visual Catalog Grid */
.catalog-grid-wrapper {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.catalog-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-full);
  width: 350px;
}

.search-box input {
  flex: 1;
  min-width: 0;
  background: none;
  border: none;
  padding: 1rem 0;
  color: white;
  outline: none;
}

.filter-pills {
  display: flex;
  gap: 0.8rem;
}

.pill {
  padding: 0.6rem 1.5rem;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  font-size: 0.75rem;
  transition: all 0.4s;
  cursor: pointer;
}

.pill.active {
  background: var(--color-gold);
  color: black;
  border-color: var(--color-gold);
}

.visual-catalog {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
}

.dish-card-v2 {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  display: flex;
  flex-direction: column;
}

.dish-card-v2:hover {
  transform: translateY(-12px);
  border-color: rgba(226, 194, 117, 0.4);
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8);
}

.card-media {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.card-media img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1); 
}

.dish-card-v2:hover .card-media img { 
  transform: scale(1.15); 
}

.status-indicator {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-full);
  font-size: 0.55rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  z-index: 5;
}

.status-indicator.activo { 
  color: #4ade80; 
  border-color: rgba(74, 222, 128, 0.3);
  box-shadow: 0 0 15px rgba(74, 222, 128, 0.1); 
}

.card-hover-actions {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1.5rem;
  padding-bottom: 2rem;
  opacity: 0;
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.dish-card-v2:hover .card-hover-actions { opacity: 1; }

.action-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s;
}

.action-circle:hover { 
  background: white; 
  color: black; 
  transform: scale(1.1);
}

.action-circle.delete:hover { 
  background: var(--color-danger); 
  color: white; 
  border-color: var(--color-danger); 
}

.card-info { 
  padding: 2rem; 
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-top { 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
}

.info-cat { 
  font-size: 0.6rem; 
  text-transform: uppercase; 
  letter-spacing: 0.2em; 
  color: var(--color-gold); 
  font-weight: 700;
}

.info-price { 
  font-size: 1.1rem; 
  font-weight: 600; 
  color: white; 
  font-family: var(--font-body);
}

.info-name { 
  font-size: 1.5rem; 
  font-weight: 400; 
  font-family: var(--font-heading); 
  line-height: 1.2;
}

/* Advanced Modal V5 */
.modal-root {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(15px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.focused-editor {
  background: var(--bg-secondary);
  width: 100%;
  max-width: 1100px;
  height: 85vh;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  position: relative;
  overflow: hidden;
}

.close-editor {
  position: absolute;
  top: 2rem;
  right: 2.5rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  z-index: 10;
  transition: 0.3s;
}

.close-editor:hover { color: white; transform: rotate(90deg); }

.editor-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.editor-side-preview {
  width: 100%;
  background: #080808;
  padding: 2rem 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.preview-frame {
  width: 100%;
  max-width: 300px;
  aspect-ratio: 4/3;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
}

.preview-frame img { width: 100%; height: 100%; object-fit: cover; }

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
}

.p-category { font-size: 0.6rem; text-transform: uppercase; color: var(--color-gold); letter-spacing: 0.2em; }
.p-name { font-size: 1.2rem; margin: 0.3rem 0; font-family: var(--font-heading); }
.p-price { font-size: 1rem; font-weight: 800; }

.editor-controls {
  flex: 1;
  padding: 3rem 4rem;
  overflow-y: auto;
}

.editor-header { margin-bottom: 2.5rem; }
.editor-header h2 { font-size: 1.8rem; margin-bottom: 0.3rem; }
.editor-header p { color: var(--text-muted); font-size: 0.9rem; }

.luxe-form-v5 { display: flex; flex-direction: column; gap: 1.5rem; }

.form-group { display: flex; flex-direction: column; gap: 0.8rem; }
.form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }

.form-group label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: var(--text-muted); }

.form-group input, .form-group textarea, .form-group select {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  padding: 1.25rem;
  color: white;
  border-radius: var(--radius-xs);
  outline: none;
  font-size: 1rem;
  width: 100%;
  max-width: 100%;
}

.upload-input-group { 
  display: flex; 
  gap: 1rem; 
  width: 100%;
}
.upload-input-group input {
  flex: 1;
  min-width: 0;
}
.upload-btn { 
  background: var(--bg-secondary); 
  border: 1px solid var(--glass-border); 
  padding: 0 1.2rem; 
  color: white; 
  border-radius: 8px; 
  cursor: pointer;
  flex-shrink: 0;
}

.apply-btn {
  background: var(--color-gold);
  color: black;
  border: none;
  padding: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.4s;
}

.apply-btn:hover { background: white; transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }

.save-btn-luxe {
  background: var(--color-gold);
  color: black;
  border: none;
  padding: 1.25rem 3rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  cursor: pointer;
  border-radius: var(--radius-xs);
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  width: 100%;
  max-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.save-btn-luxe:hover { 
  background: white; 
  transform: translateY(-3px); 
  box-shadow: 0 15px 40px rgba(197, 166, 92, 0.3); 
}

.save-btn-luxe:active {
  transform: translateY(0);
}

/* Empty Zen */
.empty-zen { text-align: center; padding: 10rem 0; color: var(--text-muted); }
.zen-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 3rem;
  background: var(--color-gold-soft);
  border: 1px solid var(--glass-border);
}

.pulse-icon { animation: pulse 3s infinite; }

@keyframes pulse { 0% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 0.6; } 100% { transform: scale(1); opacity: 0.3; } }

/* --- New Administration Environments Styles --- */

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.stats-card {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  padding: 2rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.4s;
}

.stats-card:hover { transform: translateY(-5px); border-color: var(--color-gold); }

.stats-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.stats-icon.gold { color: var(--color-gold); background: var(--color-gold-soft); }

.stats-data { display: flex; flex-direction: column; }
.stats-value { font-size: 1.5rem; font-weight: 700; font-family: var(--font-heading); }
.stats-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }

.dashboard-hero-panel {
  grid-column: span 3;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, #050505 100%);
  border: 1px solid var(--glass-border);
  padding: 4rem;
  border-radius: var(--radius-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.hero-left h2 { font-size: 2.5rem; margin-bottom: 1rem; }
.hero-left p { color: var(--text-secondary); max-width: 500px; margin-bottom: 2.5rem; line-height: 1.8; }

.hero-actions { display: flex; gap: 1rem; }
.btn-micro {
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-xs);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.3s;
  border: 1px solid transparent;
}

.btn-micro.gold { background: var(--color-gold); color: black; }
.btn-micro.ghost { background: transparent; border-color: var(--glass-border); color: white; }

.floating-brand-logo {
  width: 120px;
  height: 120px;
  border: 1px solid var(--color-gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 4rem;
  color: var(--color-gold);
  box-shadow: 0 0 40px var(--color-gold-glow);
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Analytics Styles */
.analytics-wrapper { display: flex; flex-direction: column; gap: 3rem; }
.analytics-header h3 { font-size: 1.8rem; margin-bottom: 0.5rem; }
.analytics-header p { color: var(--text-muted); }

.metrics-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2.5rem; }
.metric-panel {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  padding: 2.5rem;
  border-radius: var(--radius-sm);
}

.p-header { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em; color: var(--text-muted); margin-bottom: 2rem; }

.p-chart-sim {
  height: 200px;
  display: flex;
  align-items: flex-end;
  gap: 1rem;
}

.p-chart-sim .bar {
  flex: 1;
  background: var(--color-gold-soft);
  border: 1px solid var(--color-gold-glow);
  border-radius: 4px 4px 0 0;
  transition: all 1s;
}

.p-chart-sim .bar:hover { background: var(--color-gold); }

.top-dishes-list { display: flex; flex-direction: column; gap: 1.5rem; }
.top-dish-item { display: flex; align-items: center; gap: 1rem; }
.rank { color: var(--color-gold); font-weight: 800; }
.name { flex: 1; font-size: 0.9rem; }
.view-count { font-size: 0.7rem; color: var(--text-muted); }

/* Catalog Interface V6 Layout */
.catalog-interface-v6 {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.catalog-header-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  padding: 3.5rem;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.02), transparent);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  margin-bottom: 2rem;
  text-align: center;
}

.catalog-header-bar .search-box {
  width: 100%;
  max-width: 600px;
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(226, 194, 117, 0.2);
}

/* Categories Environment Dedicated */
.categories-env {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;
}

.env-header {
  margin-bottom: 4rem;
  text-align: center;
}

.env-title {
  font-size: 2.5rem;
  font-family: var(--font-heading);
  margin-bottom: 1rem;
}

.env-subtitle {
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
  font-size: 1rem;
}

.category-manager-luxe.env-mode {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  padding: 4rem;
  border-radius: var(--radius-lg);
  box-shadow: 0 50px 100px rgba(0, 0, 0, 0.5);
}

.category-manager-luxe.env-mode .cat-input-group {
  max-width: 100%;
  margin-bottom: 4rem;
}

.category-manager-luxe.env-mode .add-cat-btn {
  padding: 0 3rem;
  height: 60px;
}

/* Sidebar Optimized Category Manager (Minimal) */
.category-manager-luxe.sidebar-mode {
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

.category-manager-luxe.sidebar-mode .manager-header {
  margin-bottom: 2.5rem;
}

.category-manager-luxe.sidebar-mode .cat-input-group {
  margin-bottom: 2.5rem;
}

.category-manager-luxe.sidebar-mode .add-cat-btn {
  width: 50px;
  padding: 0;
}

/* Category Manager UI */
.category-manager-luxe {
  margin-bottom: 4rem;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  width: 100%;
}

.category-manager-luxe.menu-context {
  background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%);
  box-shadow: 0 30px 60px rgba(0,0,0,0.3);
}

.manager-header { margin-bottom: 2.5rem; }
.manager-header label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.3em; color: var(--color-gold); display: block; margin-bottom: 0.8rem; font-weight: 700; }
.manager-header p { font-size: 0.85rem; color: var(--text-secondary); }

.cat-controls-row {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.controls-lower-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}

.cat-input-group { 
  display: flex; 
  gap: 1rem; 
  margin-bottom: 2.5rem; 
  width: 100%;
  max-width: 600px; 
}

.cat-input-group input { 
  flex: 1; 
  background: rgba(255, 255, 255, 0.03); 
  border: 1px solid var(--glass-border); 
  padding: 1.2rem 1.8rem; 
  border-radius: 12px; 
  color: white; 
  outline: none; 
  transition: 0.4s; 
  font-size: 0.9rem;
}

.cat-input-group input:focus { 
  border-color: var(--color-gold); 
  background: rgba(255, 255, 255, 0.05);
}

.add-cat-btn { 
  display: flex; 
  align-items: center; 
  gap: 1rem;
  padding: 0 2rem;
  background: var(--color-gold); 
  color: black; 
  border: none; 
  border-radius: 12px; 
  cursor: pointer; 
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.4s; 
}

.add-cat-btn:hover { 
  background: white; 
  transform: translateY(-3px) scale(1.02); 
  box-shadow: 0 10px 30px var(--color-gold-glow);
}

.cat-tags-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.inner-label {
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 700;
}

.cat-tags { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 1rem; 
  margin-top: 0.5rem;
}

.cat-tag.luxe-badge {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.cat-tag.luxe-badge:hover {
  background: rgba(226, 194, 117, 0.05);
  border-color: var(--color-gold);
  transform: translateY(-2px);
}

.cat-name-trigger {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  color: white;
}

.mini-icon {
  opacity: 0.3;
  transition: 0.3s;
}

.cat-tag.luxe-badge:hover .mini-icon {
  opacity: 1;
  color: var(--color-gold);
}

.inline-edit-input {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-gold);
  color: var(--color-gold);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  width: 150px;
  outline: none;
}

.del-tag { background: none; border: none; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.del-tag:hover { color: var(--color-danger); }

/* Mobile Adjustments for New Sections */
@media (max-width: 768px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .dashboard-hero-panel { flex-direction: column; padding: 2rem; text-align: center; gap: 3rem; }
  .hero-left p { margin: 0 auto 2rem; }
  .hero-actions { justify-content: center; }
  .metrics-grid { grid-template-columns: 1fr; }
  .stats-card { padding: 1.5rem; }

  .categories-env {
    padding: 1rem;
  }

  .env-title {
    font-size: 1.8rem;
  }

  .category-manager-luxe.env-mode {
    padding: 2rem;
  }

  .category-manager-luxe.env-mode .add-cat-btn {
    padding: 0 1.5rem;
  }

  .tab-tooltip {
    display: none;
  }
}

.hidden { display: none; }

@media (max-width: 1024px) {
  .editor-layout { flex-direction: column; overflow-y: auto; }
  .editor-side-preview { padding: 2rem; }
  .editor-controls { padding: 3rem; }
}

/* Mobile Optimizations - Comprehensive */
@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  /* Transform Sidebar to Bottom Nav */
  .luxe-sidebar {
    width: 100% !important;
    height: 70px;
    flex-direction: row;
    padding: 0 1.5rem;
    position: fixed;
    bottom: 0;
    top: auto;
    border-right: none;
    border-top: 1px solid var(--glass-border);
    justify-content: space-between;
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(25px);
  }

  .sidebar-brand {
    display: none;
  }

  .sidebar-nav {
    flex-direction: row;
    gap: 1rem;
    flex: 1;
    justify-content: center;
  }

  .nav-tab {
    width: 45px;
    height: 45px;
  }

  .sidebar-bottom {
    margin-top: 0;
  }

  .circle-btn {
    width: 40px;
    height: 40px;
  }

  /* Adjust Main Stage */
  .main-stage {
    padding-bottom: 80px; /* Space for bottom nav */
  }

  .stage-topbar {
    padding: 2rem 0;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .header-actions {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }

  .action-btn {
    justify-content: center;
    padding: 1rem;
    font-size: 0.7rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  /* Catalog Optimizations */
  .catalog-controls {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .search-box {
    width: 100%;
  }

  .filter-pills {
    width: 100%;
    overflow-x: auto;
    padding: 0.5rem 1rem;
    white-space: nowrap;
    display: flex;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    /* Fade mask for scroll indication */
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    /* Peek animation */
    animation: peekScroll 1.5s ease-out 1s;
    will-change: transform;
  }
  
  .filter-pills::-webkit-scrollbar {
    display: none;
  }

  @keyframes peekScroll {
    0% { transform: translateX(0); }
    25% { transform: translateX(-40px); }
    50% { transform: translateX(0); }
    75% { transform: translateX(-20px); }
    100% { transform: translateX(0); }
  }

  .visual-catalog {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  /* Panel Optimizations */
  .luxe-panel-v4 {
    padding: 1.5rem;
    border: none;
    background: transparent;
  }

  .section-row, .form-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .input-field.luxe.full {
    grid-column: span 1;
  }

  .save-btn-luxe {
    max-width: 100%;
  }

  /* Modal Optimizations */
  .modal-root {
    padding: 0;
  }

  .focused-editor {
    height: 100vh;
    border-radius: 0;
    border: none;
  }

  .editor-controls {
    padding: 2rem 1.5rem;
  }

  .editor-side-preview {
    padding: 1rem;
  }

  .preview-frame {
    max-width: 250px;
  }

  .input-field input, .input-field textarea, .form-group input, .form-group textarea, .form-group select {
    font-size: 16px !important;
  }

  .card-hover-actions {
    opacity: 1;
    background: rgba(0, 0, 0, 0.3);
    align-items: flex-end;
    padding: 1rem;
    justify-content: flex-end;
  }

  .action-circle {
    width: 35px;
    height: 35px;
    background: rgba(0, 0, 0, 0.6);
  }

  .editor-header h2 {
    font-size: 1.5rem;
    word-break: break-word;
  }

  .focused-editor {
    display: flex;
    flex-direction: column;
    width: 100% !important;
    max-width: 100vw !important;
  }

  .admin-layout, .main-stage, .workspace-area {
    max-width: 100vw;
    overflow-x: hidden;
  }
}

@media (max-width: 480px) {
  .brand-reveal-text {
    font-size: 1.8rem;
    letter-spacing: 0.3em;
  }
  
  .header-actions {
    grid-template-columns: 1fr;
  }
}

/* Transitions */
.aura-fade-leave-active {
  transition: opacity 1s cubic-bezier(0.19, 1, 0.22, 1);
}
.aura-fade-leave-to { opacity: 0; }

.modal-bounce-enter-active {
  animation: bounceIn 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}
.modal-bounce-leave-active {
  animation: bounceIn 0.4s cubic-bezier(0.19, 1, 0.22, 1) reverse;
}

@keyframes bounceIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); filter: blur(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
}
</style>
