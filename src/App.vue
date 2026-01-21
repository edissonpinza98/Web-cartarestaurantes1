<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TheFooter from './components/TheFooter.vue';

const route = useRoute();
const showFooter = computed(() => route.name !== 'admin' && route.name !== 'login');
</script>

<template>
  <div class="app-container">
    <!-- Quick Access Admin Button (Floating) -->
    <router-link v-if="showFooter && route.name !== 'login'" to="/admin" class="floating-admin-btn">
      <div class="glow-bg"></div>
      <span class="btn-txt">Admin Panel</span>
    </router-link>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <TheFooter v-if="showFooter" />
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.floating-admin-btn {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: none;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.btn-txt {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-secondary);
  position: relative;
  z-index: 2;
}

.glow-bg {
  position: absolute;
  inset: 0;
  background: var(--color-gold-glow);
  transform: translateX(-100%);
  transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: 1;
}

.floating-admin-btn:hover {
  border-color: var(--color-gold);
  transform: translateX(10px);
}

.floating-admin-btn:hover .btn-txt {
  color: white;
}

.floating-admin-btn:hover .glow-bg {
  transform: translateX(0);
}

@media (max-width: 768px) {
  .floating-admin-btn {
    top: auto;
    bottom: 2rem;
    left: 2rem;
  }
}
</style>
