<template>
  <div class="menu-experience">
    <!-- Immersive Fixed Header -->
    <header class="editorial-header">
      <div class="header-vignette"></div>
      <div class="container header-inner">
        <div class="brand-eyebrow animate-reveal">Nuestra Selección</div>
        <h1 class="main-title animate-reveal" style="animation-delay: 0.2s">
          La Colección <span class="gold-accent italic serif">{{ store.presentation.name }}</span>
        </h1>
        <div class="header-divider animate-reveal" style="animation-delay: 0.4s"></div>
      </div>
    </header>

    <!-- Floating Navigation -->
    <nav class="sticky-nav" :class="{ 'is-stuck': isStuck }">
      <div class="container nav-content">
        <div class="glass-pill">
          <button 
            v-for="cat in categories" 
            :key="cat"
            class="nav-pill-btn"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Catalog Section -->
    <section class="catalog container">
      <transition-group 
        name="catalog-fade" 
        tag="div" 
        class="editorial-grid"
      >
        <DishCard 
          v-for="(dish, index) in filteredDishes" 
          :key="dish.id" 
          :dish="dish" 
          @add="addToCart"
          class="grid-item"
          :style="{ transitionDelay: `${index * 100}ms` }"
        />
      </transition-group>

      <div v-if="filteredDishes.length === 0" class="empty-state">
        <span class="empty-mark">Coming Soon</span>
        <p>Estamos perfeccionando nuevas creaciones para esta temporada.</p>
      </div>
    </section>

    <!-- Floating Cart Interface -->
    <div class="cart-trigger-container" v-if="cartCount > 0">
      <button class="cart-trigger-btn" @click="isCartOpen = true">
        <div class="trigger-label">Ver Mesa</div>
        <div class="trigger-count">{{ cartCount }}</div>
      </button>
    </div>

    <CartSidebar 
      :is-open="isCartOpen" 
      :cart="store.cart"
      @close="isCartOpen = false"
      @update-quantity="actions.updateQuantity"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { store, actions } from '../store';
import DishCard from '../components/DishCard.vue';
import CartSidebar from '../components/CartSidebar.vue';

const isCartOpen = ref(false);
const activeCategory = ref('Todos');
const categories = ['Todos', 'Entradas', 'Platos Fuertes', 'Postres', 'Bebidas'];
const isStuck = ref(false);

const filteredDishes = computed(() => {
  if (activeCategory.value === 'Todos') return store.dishes;
  return store.dishes.filter(d => d.category === activeCategory.value);
});

const cartCount = computed(() => store.cart.reduce((acc, item) => acc + item.quantity, 0));

const addToCart = (dish) => {
  actions.addToCart(dish);
  // Optional: pulse animation for the cart trigger
};

const handleScroll = () => {
  isStuck.value = window.scrollY > 200;
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style scoped>
.menu-experience {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding-bottom: 12rem;
}

.editorial-header {
  height: 60vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  background-image: url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
}

.header-vignette {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(5,7,5,0.4) 0%, var(--bg-primary) 100%);
}

.header-inner {
  position: relative;
  z-index: 10;
}

.brand-eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: 1.5rem;
}

.main-title {
  font-size: clamp(3rem, 8vw, 6rem);
  text-transform: uppercase;
  line-height: 0.9;
  margin-bottom: 2rem;
}

.gold-accent {
  color: var(--color-gold);
}

.header-divider {
  width: 1px;
  height: 80px;
  background: linear-gradient(to bottom, var(--color-gold), transparent);
  margin: 2rem auto 0;
}

/* Floating Scroll Navigation */
.sticky-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 2rem 0;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.sticky-nav.is-stuck {
  padding: 1rem 0;
}

.nav-content {
  display: flex;
  justify-content: center;
}

.glass-pill {
  background: rgba(10, 10, 10, 0.9); /* Casi negro para máximo contraste */
  backdrop-filter: blur(24px);
  padding: 0.4rem;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 0.5rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.nav-pill-btn {
  padding: 0.7rem 1.8rem;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #ffffff; /* Texto blanco puro */
  background: rgba(255, 255, 255, 0.05); /* Fondo muy sutil para definir el botón */
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  cursor: pointer;
}

.nav-pill-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.nav-pill-btn.active {
  background: var(--color-gold);
  color: #000000; /* Texto negro sobre fondo dorado para lectura clara */
  border-color: var(--color-gold);
  box-shadow: 0 0 20px rgba(197, 166, 92, 0.4);
}

/* Grid Layout */
.editorial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 6rem 4rem;
  margin-top: 6rem;
}

.empty-state {
  text-align: center;
  padding: 10rem 0;
}

.empty-mark {
  display: block;
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 2rem;
  color: var(--color-gold-soft);
  margin-bottom: 1rem;
}

/* Floating Cart */
.cart-trigger-container {
  position: fixed;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
}

.cart-trigger-btn {
  background: white;
  color: black;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 1rem 0 2rem;
  border-radius: var(--radius-full);
  box-shadow: 0 30px 60px rgba(0,0,0,0.5);
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.cart-trigger-btn:hover {
  transform: translateY(-5px) scale(1.05);
}

.trigger-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.trigger-count {
  width: 40px;
  height: 40px;
  background: black;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}

/* Transitions */
.catalog-fade-enter-active,
.catalog-fade-leave-active {
  transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);
}

.catalog-fade-enter-from {
  opacity: 0;
  transform: translateY(60px) scale(0.95);
}

.catalog-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}

@media (max-width: 768px) {
  .editorial-header { height: 40vh; }
  .editorial-grid { 
    grid-template-columns: 1fr; 
    gap: 3rem; 
    margin-top: 3rem;
  }
  
  .brand-eyebrow {
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    padding: 0 1rem;
    white-space: normal;
  }

  .main-title {
    font-size: clamp(2rem, 10vw, 3.5rem);
    padding: 0 1rem;
    word-break: break-word;
  }
  
  .sticky-nav {
    padding: 0.75rem 0;
    /* Efecto de desvanecimiento lateral para indicar scroll */
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  }

  .nav-content {
    justify-content: flex-start;
    padding: 0.5rem 1.5rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    /* Animación de "asomarse" o rebote inicial */
    animation: peekScroll 1.5s ease-out 1s;
    will-change: transform;
  }
  
  .nav-content::-webkit-scrollbar { display: none; }

  .glass-pill {
    flex-wrap: nowrap;
    white-space: nowrap;
    background: rgba(5, 5, 5, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
  }

  .nav-pill-btn { 
    padding: 0.9rem 1.5rem; /* Botones más altos para mejor tacto */
    font-size: 0.75rem; 
    color: #ffffff;
    background: transparent;
    border: none;
  }

  .nav-pill-btn.active {
    background: var(--color-gold);
    color: #000000;
    box-shadow: 0 4px 15px rgba(197, 166, 92, 0.3);
  }
}

/* Animación de aviso de scroll lateral */
@keyframes peekScroll {
  0% { transform: translateX(0); }
  25% { transform: translateX(-40px); } /* Se mueve a la izquierda */
  50% { transform: translateX(0); }    /* Regresa */
  75% { transform: translateX(-20px); } /* Rebote más suave */
  100% { transform: translateX(0); }
}

/* Soporte para pantallas extra pequeñas */
@media (max-width: 480px) {
  .main-title { font-size: 3rem; }
  .brand-eyebrow { font-size: 0.6rem; letter-spacing: 0.3em; }
  .nav-pill-btn { padding: 0.8rem 1.2rem; }
}
</style>
