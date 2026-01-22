<template>
  <div class="cart-sidebar-wrapper">
    <div class="backdrop" v-if="isOpen" @click="$emit('close')"></div>
    <div class="cart-sidebar" :class="{ open: isOpen }">
      <div class="cart-header">
        <h2 class="cart-title">Orden Actual</h2>
        <button class="close-btn" @click="$emit('close')">
          <X :size="24" />
        </button>
      </div>

      <div class="cart-items" v-if="cart.length > 0">
        <div v-for="item in cart" :key="item.id" class="cart-item">
          <div class="item-img-container">
            <img :src="item.image" :alt="item.name" class="item-thumb" />
          </div>
          <div class="item-info">
            <div class="item-top">
              <h4 class="item-name">{{ item.name }}</h4>
              <span class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
            <div class="item-controls">
              <div class="qty-control">
                <button class="qty-btn" @click="$emit('update-quantity', item.id, item.quantity - 1)">
                  <Minus :size="14" />
                </button>
                <span class="qty-num">{{ item.quantity }}</span>
                <button class="qty-btn" @click="$emit('update-quantity', item.id, item.quantity + 1)">
                  <Plus :size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-cart" v-else>
        <div class="empty-icon-box">
          <ShoppingBag :size="40" />
        </div>
        <h3>La mesa está servida</h3>
        <p>Aún no ha seleccionado sus platos preferidos.</p>
        <button @click="$emit('close')" class="btn btn-primary" style="margin-top: 1rem">Continuar Explorando</button>
      </div>

      <div class="cart-footer" v-if="cart.length > 0">
        <div class="footer-details">
          <div class="summary-line">
            <span>Subtotal</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
          <div class="summary-line total">
            <span>Total Orden</span>
            <span class="gold-text">${{ total.toFixed(2) }}</span>
          </div>
        </div>
        <a :href="waLink" target="_blank" class="btn btn-gold w-full checkout-btn">
          Confirmar con el Sommelier
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { X, Minus, Plus, ShoppingBag } from 'lucide-vue-next';
import { store } from '../store';

const props = defineProps({
  isOpen: Boolean,
  cart: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'update-quantity', 'checkout']);

const total = computed(() => {
  return props.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
});

const waLink = computed(() => {
  let text = "✦ Pedido Lumière ✦\n\n";
  props.cart.forEach(item => {
    text += `▪ ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})\n`;
  });
  text += `\nTotal: $${total.value.toFixed(2)}\n\n*Gracias por preferirnos.*`;
  
  // Limpiar el número de WhatsApp (quitar espacios, guiones, paréntesis, etc.)
  let number = store.presentation.whatsapp || '573000000000';
  number = number.replace(/[^0-9]/g, ''); // Solo números
  
  // Validar que el número tenga al menos 10 dígitos
  if (number.length < 10) {
    console.warn('Número de WhatsApp inválido, usando número por defecto');
    number = '573000000000';
  }
  
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
});
</script>

<style scoped>
.cart-sidebar-wrapper {
  z-index: 2000;
}

.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: 1000;
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 450px;
  height: 100vh;
  background: var(--bg-secondary);
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: -20px 0 50px rgba(0,0,0,0.5);
}

.cart-sidebar.open {
  transform: translateX(0);
}

.cart-header {
  padding: 3rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-title {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 400;
  color: white;
}

.close-btn {
  color: var(--text-secondary);
  transition: color 0.3s;
}

.close-btn:hover {
  color: white;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cart-item {
  display: flex;
  gap: 1.5rem;
}

.item-img-container {
  width: 90px;
  height: 90px;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
}

.item-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-top {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.item-name {
  font-size: 1rem;
  font-weight: 500;
  color: white;
}

.item-price {
  color: var(--color-gold);
  font-weight: 600;
  font-size: 0.95rem;
}

.qty-control {
  display: inline-flex;
  align-items: center;
  background: var(--bg-tertiary);
  padding: 0.25rem;
  border-radius: var(--radius-full);
}

.qty-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.qty-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.qty-num {
  padding: 0 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
}

.empty-icon-box {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  color: var(--color-gold);
}

.empty-cart h3 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.empty-cart p {
  color: var(--text-secondary);
  font-weight: 300;
  line-height: 1.6;
}

.cart-footer {
  padding: 3rem 2rem;
  background: var(--bg-tertiary);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-details {
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.summary-line.total {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: white;
}

.gold-text {
  color: var(--color-gold);
}

.checkout-btn {
  padding: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
}

.w-full {
  width: 100%;
}
</style>
