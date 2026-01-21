<template>
  <div class="dish-card-editorial" @click="$emit('add', dish)">
    <div class="image-stage">
      <img :src="dish.image" :alt="dish.name" loading="lazy" />
      <div class="image-overlay"></div>
      
      <!-- Premium Badge -->
      <div v-if="dish.category" class="luxury-badge">
        {{ dish.category }}
      </div>

      <!-- Interaction Hint -->
      <div class="plus-indicator">
        <div class="plus-icon">
          <Plus :size="24" />
        </div>
        <span class="plus-label">Añadir</span>
      </div>
    </div>

    <div class="info-stage">
      <div class="title-row">
        <h3 class="dish-name">{{ dish.name }}</h3>
        <div class="name-line"></div>
        <div class="dish-price">${{ dish.price.toFixed(2) }}</div>
      </div>
      <p class="dish-description">{{ dish.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { Plus } from 'lucide-vue-next';

defineProps({
  dish: {
    type: Object,
    required: true
  }
});

defineEmits(['add']);
</script>

<style scoped>
.dish-card-editorial {
  cursor: pointer;
  position: relative;
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}

.image-stage {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1.2;
  overflow: hidden;
  background-color: var(--bg-tertiary);
  margin-bottom: 2rem;
  border-radius: var(--radius-xs);
}

.image-stage img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s cubic-bezier(0.19, 1, 0.22, 1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(5,7,5,0.4) 0%, transparent 60%);
  transition: opacity 0.6s ease;
}

.luxury-badge {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-gold);
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border: 1px solid rgba(197, 166, 92, 0.2);
}

.plus-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -10%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}

.plus-icon {
  width: 60px;
  height: 60px;
  background: var(--color-gold);
  color: black;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 15px 30px rgba(197, 166, 92, 0.3);
}

.plus-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: white;
  text-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

/* Hover Logistics */
.dish-card-editorial:hover .image-stage img {
  transform: scale(1.1);
}

.dish-card-editorial:hover .plus-indicator {
  opacity: 1;
  transform: translate(-50%, -50%);
}

.dish-card-editorial:hover .image-overlay {
  background: rgba(5,7,5,0.3);
}

/* Information Layout */
.info-stage {
  padding: 0 0.5rem;
}

.title-row {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.dish-name {
  font-size: 1.4rem;
  font-weight: 400;
  white-space: nowrap;
}

.name-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--text-muted), transparent);
  opacity: 0.3;
}

.dish-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-gold);
}

.dish-description {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.8;
  font-weight: 300;
  max-width: 90%;
}

@media (max-width: 768px) {
  .dish-name { font-size: 1.2rem; }
  .image-stage { aspect-ratio: 1/1; }
  .plus-indicator { opacity: 1; transform: translate(-50%, -50%); top: auto; bottom: 2rem; }
}
</style>
