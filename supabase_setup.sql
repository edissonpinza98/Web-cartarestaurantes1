-- ============================================================
-- SQL SETUP PARA SUPABASE - WEB CARTAS RESTAURANTES (OPTIMIZADO)
-- ============================================================
-- Instrucciones:
-- 1. Ve al "SQL Editor" en tu panel de Supabase.
-- 2. Haz clic en "New Query".
-- 3. Pega este código y haz clic en "Run".

-- Borrar tablas si existen (Opcional, usar con cuidado)
-- DROP TABLE IF EXISTS public.dishes;
-- DROP TABLE IF EXISTS public.presentation;

-- 1. TABLA DE PRESENTACIÓN (IDENTIDAD Y CONTACTO)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.presentation (
    id BIGINT PRIMARY KEY DEFAULT 1,
    name TEXT DEFAULT 'LUMIÈRE',
    subtitle TEXT DEFAULT 'Experiencia Gastronómica',
    eyebrow TEXT DEFAULT 'EST. 2024 • VANGUARDIA',
    phrase TEXT DEFAULT 'Descubra un santuario gastronómico donde la vanguardia culinaria se fusiona con la sofisticación del diseño contemporáneo.',
    heroImage TEXT DEFAULT 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop',
    whatsapp TEXT DEFAULT '573000000000',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT only_one_row CHECK (id = 1) -- Asegura que solo exista UNA fila de configuración
);

-- Insertar configuración inicial optimizada
INSERT INTO public.presentation (id, name, subtitle, eyebrow, phrase, whatsapp) 
VALUES (1, 'LUMIÈRE', 'Redefinida', 'EST. 2024 • VANGUARDIA', 'Bienvenido a la nueva era culinaria.', '573000000000')
ON CONFLICT (id) DO NOTHING;

-- 2. TABLA DE PLATOS (CATÁLOGO DINÁMICO)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dishes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0, -- Uso de NUMERIC para precisión de moneda
    category TEXT DEFAULT 'Entradas',
    image TEXT DEFAULT 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    status TEXT DEFAULT 'Activo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SEGURIDAD (ROW LEVEL SECURITY)
-- ------------------------------------------------------------
-- Habilitamos RLS para proteger los datos de personas no autorizadas.

ALTER TABLE public.presentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA LA TABLA PRESENTATION
-- Public: Cualquiera puede ver los datos del sitio.
-- Admin: Solo tú (logueado) puedes editar.
DROP POLICY IF EXISTS "Lectura publica presentacion" ON public.presentation;
CREATE POLICY "Lectura publica presentacion" ON public.presentation FOR SELECT USING (true);

DROP POLICY IF EXISTS "Gestion completa admin presentacion" ON public.presentation;
CREATE POLICY "Gestion completa admin presentacion" ON public.presentation FOR ALL USING (auth.role() = 'authenticated');

-- POLÍTICAS PARA LA TABLA DISHES
-- Public: Cualquiera puede ver el menú.
-- Admin: Solo tú (logueado) puedes agregar/quitar/editar platos.
DROP POLICY IF EXISTS "Lectura publica platos" ON public.dishes;
CREATE POLICY "Lectura publica platos" ON public.dishes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Gestion completa admin platos" ON public.dishes;
CREATE POLICY "Gestion completa admin platos" ON public.dishes FOR ALL USING (auth.role() = 'authenticated');

-- 4. CONFIGURACIÓN DE STORAGE (RECORDATORIO)
-- ------------------------------------------------------------
-- IMPORTANTE:
-- Para que las imágenes funcionen, ve a "Storage" en Supabase:
-- 1. Crea un bucket llamado 'restaurant-assets'.
-- 2. Marcalo como "Public bucket".
-- 3. Agrega una política en Storage para que los usuarios autenticados puedan subir archivos.

COMMENT ON TABLE public.presentation IS 'Almacena la identidad de marca, frases hero y número de pedidos.';
COMMENT ON TABLE public.dishes IS 'Almacena el catálogo de productos y platos del restaurante.';
