<template>
  <div class="home-viewport" @mousemove="handleMouseMove" @mouseleave="resetMouse">
    <!-- Animated Light Leaks for Atmosphere -->
    <div class="light-leak leak-1" :style="leak1Style"></div>
    <div class="light-leak leak-2" :style="leak2Style"></div>
    
    <div class="parallax-canvas" :style="bgTransform">
      <div class="hero-image" :style="{ backgroundImage: `url(${store.presentation.heroImage})` }"></div>
    </div>
    
    <div class="vignette"></div>

    <div class="hero-content container">
      <div class="meta-info animate-reveal" style="animation-delay: 0.1s">
        <span class="eyebrow-accent">{{ store.presentation.eyebrow }}</span>
      </div>

      <div class="main-title-block">
        <h1 class="hero-title animate-reveal" style="animation-delay: 0.3s">
          <span class="line-1">{{ store.presentation.name }}</span>
          <span class="line-2 italic">{{ store.presentation.subtitle }}</span>
        </h1>
      </div>

      <div class="desc-block animate-reveal" style="animation-delay: 0.5s">
        <p class="hero-description">{{ store.presentation.phrase }}</p>
      </div>

      <div class="cta-block animate-reveal" style="animation-delay: 0.7s">
        <button @click="goMenu" class="btn btn-gold btn-luxe">
          <span>Explorar la Colección</span>
          <div class="arrow-container">
            <ArrowRight :size="18" />
          </div>
        </button>
      </div>
    </div>

    <!-- Decorative Corner Accents -->
    <div class="corner-mark top-left"></div>
    <div class="corner-mark bottom-right"></div>

    <div class="scroll-invitation">
      <div class="scroll-v-line"></div>
      <span class="scroll-text">Descubrir</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRight } from 'lucide-vue-next';
import { store } from '../store';

const router = useRouter();
const mouseX = ref(0);
const mouseY = ref(0);

const handleMouseMove = (e) => {
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;
  mouseX.value = x;
  mouseY.value = y;
};

const resetMouse = () => {
  mouseX.value = 0;
  mouseY.value = 0;
};

const bgTransform = computed(() => ({
  transform: `translate(${mouseX.value * -40}px, ${mouseY.value * -40}px) scale(1.1)`,
  transition: 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)'
}));

const leak1Style = computed(() => ({
  transform: `translate(${mouseX.value * 100}px, ${mouseY.value * 100}px)`,
  opacity: 0.6 + (Math.abs(mouseX.value) * 0.4)
}));

const leak2Style = computed(() => ({
  transform: `translate(${mouseX.value * -150}px, ${mouseY.value * -80}px)`,
}));

const goMenu = () => router.push('/menu');
</script>

<style scoped>
.home-viewport {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.parallax-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
}

.hero-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: brightness(0.65) contrast(1.05);
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%);
  pointer-events: none;
  z-index: 10;
}

.light-leak {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: 5;
  mix-blend-mode: screen;
}

.leak-1 {
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, rgba(197, 166, 92, 0.15) 0%, transparent 70%);
  top: -10%;
  left: -10%;
}

.leak-2 {
  width: 40vw;
  height: 40vw;
  background: radial-gradient(circle, rgba(45, 90, 67, 0.1) 0%, transparent 70%);
  bottom: -5%;
  right: -5%;
}

.hero-content {
  position: relative;
  z-index: 20;
  text-align: center;
  max-width: 1100px;
}

.eyebrow-accent {
  font-size: 0.75rem;
  letter-spacing: 0.6em;
  color: var(--color-gold);
  text-transform: uppercase;
  margin-bottom: 2.5rem;
  display: block;
}

.hero-title {
  font-size: clamp(3.5rem, 12vw, 9rem);
  text-transform: uppercase;
  line-height: 0.85;
  margin-bottom: 3rem;
}

.line-2 {
  display: block;
  color: var(--color-gold);
}

.hero-description {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  max-width: 650px;
  margin: 0 auto 5rem;
  line-height: 2;
  font-weight: 300;
}

.btn-luxe {
  gap: 2rem;
  border-radius: var(--radius-xs);
  box-shadow: 0 10px 40px rgba(0,0,0,0.4);
}

.arrow-container {
  transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.btn-luxe:hover .arrow-container {
  transform: translateX(10px);
}

.corner-mark {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(197, 166, 92, 0.2);
  z-index: 25;
}

.top-left { top: 3rem; left: 3rem; border-right: none; border-bottom: none; }
.bottom-right { bottom: 3rem; right: 3rem; border-left: none; border-top: none; }

.scroll-invitation {
  position: absolute;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  z-index: 20;
}

.scroll-v-line {
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, var(--color-gold), transparent);
  animation: scrollLine 2s infinite cubic-bezier(0.19, 1, 0.22, 1);
}

.scroll-text {
  font-size: 0.65rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
}

@keyframes scrollLine {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  51% { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

@media (max-width: 768px) {
  .hero-title { font-size: 4.5rem; }
  .corner-mark { display: none; }
  .container { padding: 0 2rem; }
}
</style>
