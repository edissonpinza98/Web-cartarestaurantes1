<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TheFooter from './components/TheFooter.vue';
import { Settings } from 'lucide-vue-next';

const route = useRoute();
const showFooter = computed(() => route.name !== 'admin' && route.name !== 'login');
</script>

<template>
  <div class="app-container">
    <!-- Exclusive Admin Pulse Button -->
    <router-link v-if="showFooter && route.name !== 'login'" to="/admin" class="admin-pulse-trigger" title="Panel de Administración">
      <div class="pulse-ring"></div>
      <div class="btn-core">
        <Settings :size="20" class="admin-icon" />
        <span class="admin-label">GESTIÓN</span>
      </div>
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

/* Redesigned Admin Button */
.admin-pulse-trigger {
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  z-index: 9999;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.btn-core {
  position: relative;
  z-index: 2;
  background: #000;
  border: 1px solid rgba(226, 194, 117, 0.3);
  padding: 0.8rem 1.2rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--color-gold);
  backdrop-filter: blur(10px);
  transition: all 0.4s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.admin-icon {
  transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}

.admin-label {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.pulse-ring {
  position: absolute;
  inset: -4px;
  border: 1px solid var(--color-gold);
  border-radius: var(--radius-full);
  opacity: 0;
  animation: pulseRotate 4s linear infinite;
}

@keyframes pulseRotate {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.3); opacity: 0; }
}

.admin-pulse-trigger:hover .btn-core {
  background: var(--color-gold);
  color: #000;
  border-color: #fff;
  transform: translateY(-5px) scale(1.05);
}

.admin-pulse-trigger:hover .admin-icon {
  transform: rotate(90deg);
}

.admin-pulse-trigger:hover .pulse-ring {
  opacity: 1;
}

@media (max-width: 768px) {
  .admin-pulse-trigger {
    bottom: 1.5rem;
    right: 1.5rem;
  }
  
  .btn-core {
    padding: 0.8rem;
    gap: 0;
  }
  
  .admin-label {
    display: none;
  }
}
</style>
