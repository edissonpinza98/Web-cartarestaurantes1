<template>
  <footer class="luxe-footer">
    <div class="container footer-main">
      <div class="footer-left">
        <h2 class="brand-title">{{ store.presentation.name }}</h2>
        <p class="brand-phrase">Santuario Gastronómico</p>
      </div>

      <div class="footer-center">
        <div class="connection-card">
          <span class="card-eyebrow">¿Deseas una plataforma similar?</span>
          <a href="https://devedisof-mi-cv.netlify.app/" target="_blank" class="portfolio-link">
            <span class="dev-name">DEVEDISOF DESIGN</span>
            <div class="link-icon">
              <ExternalLink :size="16" />
            </div>
          </a>
        </div>
      </div>

      <div class="footer-right">
        <div class="legal-stack">
          <span>MMXXIV • ALL RIGHTS RESERVED</span>
          <span class="gold-dot"></span>
          <span>VANGUARDIA DIGITAL</span>
        </div>
      </div>
    </div>
    
    <div class="ambient-glow"></div>
  </footer>
</template>

<script setup>
import { store } from '../store';
import { ExternalLink } from 'lucide-vue-next';
</script>

<style scoped>
.luxe-footer {
  background: #050505;
  padding: 6rem 0;
  border-top: 1px solid rgba(226, 194, 117, 0.1);
  position: relative;
  overflow: hidden;
}

.footer-main {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  align-items: center;
  gap: 3rem;
  position: relative;
  z-index: 10;
}

.brand-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.brand-phrase {
  font-size: 0.65rem;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
}

/* Connection Card Styling */
.connection-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2rem 3rem;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.connection-card:hover {
  background: rgba(226, 194, 117, 0.03);
  border-color: rgba(226, 194, 117, 0.3);
  transform: translateY(-5px);
}

.card-eyebrow {
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.portfolio-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: white;
  background: var(--color-gold);
  color: black;
  padding: 0.8rem 2rem;
  border-radius: var(--radius-xs);
  transition: all 0.4s;
}

.portfolio-link:hover {
  background: white;
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(197, 166, 92, 0.3);
}

.dev-name {
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

/* Right Section Legal Stack */
.legal-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  font-size: 0.55rem;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.2);
}

.gold-dot {
  width: 4px;
  height: 4px;
  background: var(--color-gold);
  border-radius: 50%;
  margin: 0.5rem 0;
}

.ambient-glow {
  position: absolute;
  bottom: -10%;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 100px;
  background: radial-gradient(circle, rgba(197, 166, 92, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

@media (max-width: 1024px) {
  .footer-main {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 4rem;
  }
  
  .legal-stack {
    align-items: center;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 1.5rem;
    letter-spacing: 0.2em;
    word-break: break-word;
  }
  
  .connection-card {
    padding: 1.5rem 1rem;
  }
  
  .portfolio-link {
    padding: 0.8rem 1rem;
    font-size: 0.7rem;
    width: 100%;
    justify-content: center;
  }
  
  .legal-stack {
    font-size: 0.5rem;
    letter-spacing: 0.15em;
  }
}
</style>
