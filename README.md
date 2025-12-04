# 🍏 Imax - Tu Tienda Apple de Confianza

Este repositorio contiene el código fuente de la página de inicio (landing page) para **Imax**, una tienda ficticia especializada en la venta de productos Apple (iPhones, MacBooks, Apple Watches, etc.) con una sólida presencia en Argentina.

---

##  Funcionalidades y Tecnologías Usadas

La página ha sido diseñada con un enfoque en la experiencia de usuario, accesibilidad y diseño responsivo, utilizando HTML5 semántico y CSS moderno (Flexbox y Grid).

### Tecnologías Clave:

* **HTML5:** Estructura semántica del contenido.
* **CSS3:** Estilos responsivos, Flexbox, Grid y **Variables CSS** (`:root`) para la paleta de colores.
* **JavaScript (ES6+):** Lógica dinámica del carrito, persistencia de datos y manipulación del DOM.
* **Web APIs:** Uso de **`fetch`** para cargar productos dinámicamente desde una API externa (`fakestoreapi.com`).
* **`localStorage`:** Persistencia de datos para el **carrito de compras** y las **preferencias del usuario**.

---

##  Características Dinámicas (JavaScript)

El proyecto incluye un robusto sistema dinámico que mejora la interactividad:

1.  **Carrito de Compras Persistente:**
    * Los productos estáticos y dinámicos (cargados por API) pueden ser añadidos al carrito.
    * El carrito se almacena como un array de objetos en `localStorage`, manteniendo su contenido incluso después de recargar la página.
    * Un contador visible (`#cart-counter`) refleja la cantidad total de ítems.
    * Funcionalidad para **vaciar el carrito**.
2.  **Preferencias de Usuario:**
    * Permite al usuario guardar su **nombre** y un **color de fondo** preferido usando `localStorage`.
    * Al cargar la página, se recupera el nombre para un saludo personalizado y se aplica el color de fondo.
3.  **Descripción Dinámica de Productos:**
    * Implementación de botones "Ver descripción" que ocultan/muestran detalles del producto sin recargar la página.
4.  **Carga Dinámica de Productos (API):**
    * Utilización de `fetch` para consumir una API externa y mostrar productos adicionales en la sección `productos-container`.

---

##  Estructura del Sitio

| Sección | Contenido y Propósito |
| :--- | :--- |
| Encabezado (`<header>`) | Logo y menú de navegación principal. |
| Hero (`<section class="hero-section">`) | Presentación principal, título, descripción y **video promocional**. |
| Productos Estáticos (`<section class="product-grid">`) | Grilla de productos estrella con precios y botón de carrito. |
| Productos Dinámicos (`#productos-container`) | Grilla de productos cargados vía **Fetch/API**. |
| Opiniones (`<section class="reviews-section">`) | Muestra testimonios de clientes. |
| Mensajes (`<section class="messages-section">`) | Tabla administrativa de ejemplo. |
| Contacto (`<section class="contact-section">`) | Formulario simple para consultas. |
| Pie de página (`<footer>`) | Enlaces a redes sociales y derechos de autor. |

---

##  Instrucciones de Instalación

Para ejecutar este proyecto localmente, segui estos sencillos pasos:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://docs.github.com/es/repositories/creating-and-managing-repositories/quickstart-for-repositories](https://docs.github.com/es/repositories/creating-and-managing-repositories/quickstart-for-repositories)
    ```

2.  **Navegar al directorio del proyecto:**
    ```bash
    cd imax-tienda-apple
    ```

3.  **Abrir en el navegador:**
    Simplemente abri el archivo `index.html` en tu navegador web preferido. No requiere servidor web, ya que todas las operaciones de `fetch` y `localStorage` funcionan desde un archivo local.

