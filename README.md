
# 🚀 ELSE - E-Learning Script Engine

**ELSE** es un motor inteligente de diseño instruccional diseñado para transformar contenido bruto (notas, manuales, transcripciones) en guiones educativos estructurados, utilizando principios de **Diseño Atómico** y la potencia de la familia de modelos **Google Gemini**.

---

## 💡 Visión del Producto
Facilitar a los Diseñadores Instruccionales (ID) la creación de blueprints técnicos y pedagógicos en segundos, permitiendo una iteración rápida, auditoría de calidad inmediata y generación de recursos multimedia integrados.

---

## 🛠️ Stack Tecnológico
- **Frontend:** React 19 + TypeScript.
- **Estilos:** Tailwind CSS (Arquitectura responsiva y utilitaria).
- **Iconografía:** Lucide React.
- **Inteligencia Artificial:** SDK `@google/genai` (Gemini API).
- **Exportación:** Soporte para JSON, HTML5 e Impresión optimizada (PDF).

---

## 🧠 Inteligencia Artificial: Uso de Modelos
ELSE utiliza una orquestación de diferentes modelos según la complejidad de la tarea:

| Función | Modelo Gemini | Por qué |
| :--- | :--- | :--- |
| **Generación de Guion** | `gemini-3-flash-preview` | Balance perfecto entre velocidad y razonamiento estructurado (JSON). |
| **Auditoría Pedagógica** | `gemini-3-pro-preview` | Máxima capacidad de razonamiento y "thinking" para crítica profunda. |
| **Generación de Imágenes** | `gemini-2.5-flash-image` | Creación rápida de visuales pedagógicos en formato 16:9. |
| **Generación de Video** | `veo-3.1-fast-generate-preview` | Producción de clips educativos cinematográficos de alta calidad. |
| **Narración (TTS)** | `gemini-2.5-flash-preview-tts` | Voces naturales (Kore/Zephyr) con soporte nativo de audio PCM. |
| **Reescritura (Rewrite)** | `gemini-3-flash-preview` | Optimización lingüística rápida y eficiente. |

---

## 🏗️ Arquitectura de Componentes Atómicos
El motor segmenta el aprendizaje en 4 átomos fundamentales:

1.  **Theory (Teoría):** Contenido base con soporte de glosarios inteligentes (tooltips) y narrativa técnica.
2.  **Media (Multimedia):** Foco visual. Incluye prompts sugeridos para IA y visualizadores de video/imagen.
3.  **Steps (Pasos):** Desglose procedural para procesos técnicos o manuales de "How-to".
4.  **Assessment (Evaluación):** Verificación de conocimientos con feedback inmediato y lógica de opciones correctas/incorrectas.

---

## 🚀 Funcionalidades Clave

### 1. Auditoría de Calidad
Un sistema de crítica que analiza el guion buscando:
- **Carga Cognitiva:** ¿Es demasiado texto?
- **Consistencia:** ¿El tono coincide con la audiencia?
- **Validez:** ¿Las preguntas de evaluación realmente miden el contenido?
- **Smart Fix:** Capacidad de aplicar las correcciones de la auditoría directamente a cada bloque.

### 2. Exportación Avanzada
- **JSON Blueprint:** Para integración técnica en LMS o bases de datos.
- **Interactive Player (HTML):** Un archivo autónomo con un diseño limpio para previsualización del cliente.
- **Technical Sheet (PDF):** Formato optimizado para impresión y firmas de aprobación.

### 3. Estimación de Costos API
Cálculo en tiempo real del valor estimado de las llamadas a la API (Input/Output tokens, imágenes, videos y caracteres TTS) para control de presupuesto del proyecto.

---

## 📖 Guía de Uso Rápido
1.  **Ingesta:** Pega tu texto fuente o sube un archivo (.txt, .md).
2.  **Configuración:** Selecciona el público (Principiante, Técnico, Ejecutivo) y el tono.
3.  **Generación:** Pulsa "Generar Guion" y observa cómo Gemini estructura los bloques.
4.  **Curaduría:** Edita títulos, genera imágenes para los bloques multimedia o pide a la IA que reescriba secciones.
5.  **Auditoría:** Ejecuta la auditoría pedagógica para asegurar la calidad.
6.  **Exportación:** Descarga el resultado en el formato que necesites.

---

## 📄 Licencia
ELSE - E-Learning Structured Blueprint Engine v1.0.
Construido bajo principios de eficiencia pedagógica.
