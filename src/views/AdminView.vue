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
          >
            <div class="tab-icon-box">
              <component :is="tab.icon" :size="20" stroke-width="1.5" />
            </div>
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
                  <div class="input-field luxe full">
                    <label>Historia / Introducción</label>
                    <textarea v-model="store.presentation.phrase" rows="4"></textarea>
                  </div>
                </div>

                <!-- Botón de Guardar Cambios -->
                <div class="section-row">
                  <button @click="savePresentation" class="save-btn-luxe">
                    <span>💾 Guardar Cambios</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Dishes Catalog View (Redesigned as Grid) -->
          <div v-if="currentTab === 'dishes'" class="catalog-grid-wrapper">
            <div class="catalog-controls">
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

          <!-- Analytics & Dashboard -->
          <div v-if="currentTab === 'dashboard' || currentTab === 'analytics'" class="empty-zen">
            <div class="zen-circle">
              <BarChart3 :size="60" stroke-width="1" class="pulse-icon" />
            </div>
            <h3>En Construcción</h3>
            <p>Estamos diseñando una experiencia analítica sin precedentes para su negocio.</p>
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
  BarChart3,
  Monitor,
  X,
  LogOut,
  Image,
  Search
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
const categories = ['Entradas', 'Platos Fuertes', 'Postres', 'Bebidas'];

const editingDish = reactive({
  id: null,
  name: '',
  price: 0,
  description: '',
  category: 'Entradas',
  image: ''
});

const tabs = [
  { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
  { id: 'presentation', label: 'Identidad', icon: Monitor },
  { id: 'dishes', label: 'Catálogo', icon: Utensils },
  { id: 'analytics', label: 'Métricas', icon: BarChart3 },
];

const activeTabLabel = computed(() => {
  return tabs.find(t => t.id === currentTab.value)?.label || 'Gestión';
});

onMounted(() => {
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
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.dish-card-v2:hover {
  transform: translateY(-10px);
  border-color: var(--color-gold-glow);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

.card-media {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-media img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
.card-media:hover img { transform: scale(1.1); }

.status-indicator {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #555;
}

.status-indicator.activo { background: #4ade80; box-shadow: 0 0 10px #4ade80; }

.card-hover-actions {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: 0.4s;
}

.card-media:hover .card-hover-actions { opacity: 1; }

.action-circle {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
}

.action-circle:hover { background: white; color: black; }
.action-circle.delete:hover { background: #ff4d4d; color: white; border-color: #ff4d4d; }

.card-info { padding: 1.5rem; }
.info-top { display: flex; justify-content: space-between; margin-bottom: 0.8rem; }
.info-cat { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }
.info-price { font-size: 0.9rem; font-weight: 700; color: var(--color-gold); }
.info-name { font-size: 1.25rem; font-weight: 400; font-family: var(--font-heading); }

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
}

.upload-input-group { display: flex; gap: 1rem; }
.upload-btn { background: var(--bg-secondary); border: 1px solid var(--glass-border); padding: 0 1.5rem; color: white; border-radius: 8px; cursor: pointer; }

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

.hidden { display: none; }

@media (max-width: 1024px) {
  .editor-layout { flex-direction: column; overflow-y: auto; }
  .editor-side-preview { padding: 2rem; }
  .editor-controls { padding: 3rem; }
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
