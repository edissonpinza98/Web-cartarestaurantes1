<template>
  <div class="login-viewport">
    <div class="login-aura"></div>
    <div class="login-card animate-reveal">
      <header class="login-header">
        <h1 class="brand-name">LUMIÈRE</h1>
        <p class="brand-tagline">Panel de Administración</p>
      </header>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="luxe-group">
          <label>Identidad</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="correo@restaurante.com" 
            required
            :disabled="loading"
          />
        </div>
        
        <div class="luxe-group">
          <label>Clave de Acceso</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            required
            :disabled="loading"
          />
        </div>

        <div v-if="errorMsg" class="error-bubble">
          {{ errorMsg }}
        </div>

        <button type="submit" class="btn btn-gold login-btn" :disabled="loading">
          <span v-if="!loading">Entrar al Command Center</span>
          <span v-else class="loader-dots">Verificando</span>
        </button>
      </form>

      <footer class="login-footer">
        <router-link to="/" class="back-link">Regresar al sitio público</router-link>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';

const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';

  // Si Supabase no está configurado (null), usamos modo Demo
  if (!supabase) {
    if (email.value === 'admin@lumiere.com' && password.value === 'admin123') {
      localStorage.setItem('lumiere_logged', 'true');
      router.push('/admin');
    } else {
      errorMsg.value = 'Modo Demo: Usa admin@lumiere.com / admin123';
    }
    loading.value = false;
    return;
  }

  // Intento de Login con Supabase
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      console.error("Error de Supabase:", error);
      errorMsg.value = `Error: ${error.message}`;
      loading.value = false;
      return;
    }

    if (data?.session) {
      router.push('/admin');
    } else {
      errorMsg.value = "No se pudo establecer una sesión activa.";
    }
  } catch (err) {
    console.error("Fallo crítico de autenticación:", err);
    errorMsg.value = "Error al conectar con Supabase. Revisa tu clave API.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-viewport {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.login-aura {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, var(--color-gold-glow) 0%, transparent 70%);
  opacity: 0.3;
}

.login-card {
  width: 100%;
  max-width: 450px;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  padding: 4rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-luxe);
  z-index: 10;
  backdrop-filter: blur(20px);
}

.login-header {
  text-align: center;
  margin-bottom: 4rem;
}

.brand-name {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  letter-spacing: 0.3em;
  color: var(--color-gold);
  margin-bottom: 0.5rem;
}

.brand-tagline {
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.luxe-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.luxe-group label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
}

.luxe-group input {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  padding: 1.25rem;
  color: white;
  border-radius: var(--radius-xs);
  transition: all 0.3s;
}

.luxe-group input:focus {
  border-color: var(--color-gold);
  background: rgba(255, 255, 255, 0.05);
  outline: none;
}

.error-bubble {
  background: rgba(255, 77, 77, 0.1);
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
  padding: 1rem;
  font-size: 0.8rem;
  border-radius: var(--radius-xs);
  text-align: center;
}

.login-btn {
  width: 100%;
  margin-top: 1rem;
}

.login-footer {
  margin-top: 3rem;
  text-align: center;
}

.back-link {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.3s;
}

.back-link:hover {
  color: var(--color-gold);
}

.loader-dots::after {
  content: '...';
  animation: dots 1.5s infinite;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60% { content: '...'; }
}
</style>
