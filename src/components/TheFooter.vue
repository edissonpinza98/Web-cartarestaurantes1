<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-section brand">
        <h2 class="footer-logo">{{ store.presentation.name }}</h2>
        <p class="footer-tagline">Vanguardia Gastronómica</p>
      </div>
      
      <div class="footer-section credits">
        <div class="credit-item">
          <span class="label">SISTEMA DESARROLLADO POR</span>
          <span class="value gold">EDISSON</span>
        </div>
        <div class="credit-item">
          <span class="label">EDICIÓN</span>
          <span class="value">PREMIUM LUXE • 2024</span>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>&copy; 2024 LUMIÈRE RESTAURANT. TODOS LOS DERECHOS RESERVADOS.</p>
        
        <router-link to="/admin" class="admin-link">
          <span>Panel de Control</span>
        </router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { store } from '../store';
</script>

<style scoped>
.site-footer {
  background-color: #050505;
  color: white;
  padding-top: 6rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 4rem;
  padding-bottom: 6rem;
}

.footer-logo {
  font-family: var(--font-heading);
  letter-spacing: 0.2em;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.footer-tagline {
  font-size: 0.8rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.credits {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.credit-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  color: var(--text-muted);
}

.value {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.1em;
}

.gold {
  color: var(--color-gold);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  padding: 2.5rem 0;
}

.footer-bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-bottom p {
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
}

.admin-link {
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-muted);
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-full);
}

.admin-link:hover {
  color: var(--color-gold);
  border-color: var(--color-gold-soft);
  background: var(--color-gold-soft);
}

@media (max-width: 768px) {
  .footer-bottom-inner {
    flex-direction: column;
    text-align: center;
  }
}

@media (min-width: 768px) {
  .credits {
    align-items: flex-end;
    text-align: right;
  }
}
</style>
