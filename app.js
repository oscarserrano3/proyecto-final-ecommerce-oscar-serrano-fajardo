// 💡 CAMBIO: Declaración de selectores globales al inicio para que las funciones del carrito los encuentren.

// Selectores del DOM para la sección de Preferencias
const preferencesForm = document.getElementById('preferences-form');
const nameInput = document.getElementById('pref-name');
const colorSelect = document.getElementById('pref-bg-color');
const greetingElement = document.getElementById('saludo-usuario');
const btnBorrar = document.getElementById('btn-borrar-pref');

// Selectores del DOM para el Carrito
const cartCounterElement = document.getElementById('cart-counter'); 
const btnVaciar = document.getElementById('btn-vaciar-carrito'); 

// Selectores del DOM para la carga de la API
const API_URL = 'https://fakestoreapi.com/products?limit=6';
const productosContainer = document.getElementById('productos-container'); 
// Asumimos que tienes un div con id="productos-container" debajo del product-grid en tu HTML si usas la API.


function inicializarDescripcionDinamica() {
    // Usar el ID específico para seleccionar solo los productos estáticos
    const contenedorEstatico = document.getElementById('productos-estaticos');
    
    // Si el contenedor no existe, salimos
    if (!contenedorEstatico) {
        console.warn("Contenedor de productos estáticos (#productos-estaticos) no encontrado.");
        return;
    }
    
    // Ahora seleccionamos todos los artículos dentro de ese contenedor.
    const productItems = contenedorEstatico.querySelectorAll('.product-item');

    if (productItems.length === 0) {
        console.warn("No se encontraron productos estáticos (.product-item) para inicializar la descripción dinámica.");
        return; 
    }

    productItems.forEach(productItem => {
        // Seleccionamos el párrafo de descripción original que está en el HTML
        const descriptionElement = productItem.querySelector('p');
        
        // PREVENCIÓN DE DUPLICADOS: Si el botón ya existe, no hacemos nada
        if (productItem.querySelector('.toggle-description-btn')) {
            return;
        }

        // 1. Ocultar la descripción por defecto al cargar el script
        // 💡 REQUERIMIENTO: Necesitas una clase CSS '.hidden-description { display: none; }'
        descriptionElement.classList.add('hidden-description'); 

        // 2. Crear el botón de "Ver descripción"
        const button = document.createElement('button');
        button.className = 'toggle-description-btn';
        button.textContent = 'Ver descripción';

        // Insertar el botón en la tarjeta
        const productPrice = productItem.querySelector('.product-price');

        // Insertar el botón ANTES del precio para que quede sobre el botón de carrito
        if (productPrice) {
            productItem.insertBefore(button, productPrice);
        } else {
            productItem.appendChild(button);
        }

        // 3. Agregar el listener de eventos (addEventListener)
        button.addEventListener('click', () => {

            // Alternar la visibilidad de la descripción original
            descriptionElement.classList.toggle('hidden-description');

            // Actualizar el texto del botón basado en la nueva visibilidad
            if (descriptionElement.classList.contains('hidden-description')) {
                button.textContent = 'Ver descripción';
            } else {
                button.textContent = 'Ocultar descripción';
            }
        });
    });
}

/* ==========================================
   LÓGICA DE PREFERENCIAS DE USUARIO (LOCALSTORAGE)
   ========================================== */

// 2. Función para aplicar las preferencias (UI Update)
function aplicarPreferencias(nombre, color) {
    // Aplicar color de fondo al body
    if (color) {
        document.body.style.backgroundColor = color;
        // También actualizamos el valor del select para que coincida
        colorSelect.value = color;
    }

    // Aplicar saludo personalizado
    if (nombre) {
        greetingElement.textContent = `¡Hola de nuevo, ${nombre}!`;
        // Actualizamos el input para que el usuario vea su nombre
        nameInput.value = nombre;
    } else {
        greetingElement.textContent = ""; // Limpiar si no hay nombre
    }
}

// 3. Función para cargar datos al iniciar (Leer de LocalStorage)
function cargarPreferencias() {
    const nombreGuardado = localStorage.getItem('usuarioNombre');
    const colorGuardado = localStorage.getItem('usuarioColor');

    if (nombreGuardado || colorGuardado) {
        aplicarPreferencias(nombreGuardado, colorGuardado);
        console.log("Preferencias cargadas desde LocalStorage");
    }
}

// 4. Evento SUBMIT del formulario (Guardar en LocalStorage)
preferencesForm.addEventListener('submit', (evento) => {
    // Prevenir que la página se recargue
    evento.preventDefault();

    // Capturar valores
    const nombre = nameInput.value;
    const color = colorSelect.value;

    // Guardar en LocalStorage
    localStorage.setItem('usuarioNombre', nombre);
    localStorage.setItem('usuarioColor', color);

    // Aplicar los cambios inmediatamente para dar feedback visual
    aplicarPreferencias(nombre, color);

    alert('¡Preferencias guardadas con éxito!');
});

// 5. Evento para borrar preferencias (Opcional pero útil)
btnBorrar.addEventListener('click', () => {
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioColor');

    // Restaurar valores por defecto
    document.body.style.backgroundColor = ''; // Vuelve al color del CSS original
    greetingElement.textContent = '';
    nameInput.value = '';
    colorSelect.selectedIndex = 0;

    alert('Preferencias borradas.');
});


/* ==========================================
   LÓGICA DEL CARRITO DINÁMICO (UNIFICADA) 
   ========================================== */

// variable global para el array de productos en el carrito
let carrito = []; 

/**
 * 1. Recupera el carrito guardado en localStorage o crea uno vacío.
 * @returns {Array} El carrito.
 */
function obtenerCarritoGuardado() {
    const carritoJSON = localStorage.getItem('carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : []; 
}

/**
 * 2. Guarda el estado actual del carrito en localStorage.
 */
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito(); 
}

/**
 * 3. Muestra la cantidad total de ítems en el carrito.
 */
function actualizarContadorCarrito() {
    // La cuenta se basa en cuántos objetos hay en el array 'carrito'
    // 💡 DEPENDENCIA: Requiere que 'cartCounterElement' esté declarado al inicio
    cartCounterElement.textContent = carrito.length;
}

/**
 * 4. Añade un producto al array del carrito y lo guarda.
 * @param {Object} producto - El objeto completo del producto a añadir.
 */
function agregarProductoAlCarrito(producto) {
    carrito.push(producto); 
    guardarCarrito();
    //usar alert o console.log para el feedback
    alert(`🛒 ¡Producto añadido! ${producto.title}`); // 💡 CAMBIO: Usamos alert para el feedback solicitado.
    console.log(`🛒 ¡Producto añadido! ${producto.title}. Total: ${carrito.length}`);
}

/**
 * 5. Inicializa el carrito al cargar la página.
 */
function inicializarCarritoDinamico() {
    carrito = obtenerCarritoGuardado();
    actualizarContadorCarrito();
}

/**
 * Asigna el manejador de eventos a todos los botones 'Agregar al carrito' de los productos de la API.
 * @param {Array<Object>} productosAPI - El array completo de objetos de productos de la API.
 */
function asignarEventosCarritoAPI(productosAPI) {
    // Seleccionamos los botones de los productos DINÁMICOS (cargados en #productos-container)
    const addToCartButtons = productosContainer.querySelectorAll('.product-item .add-to-cart');
    
    addToCartButtons.forEach(button => {
        // Encontramos el elemento padre (la tarjeta)
        const productItem = button.closest('.product-item');
        
        button.addEventListener('click', function() {
            // Obtenemos el título (identificador) del producto desde la tarjeta.
            const title = productItem.querySelector('h3').textContent;
            
            // Buscamos el objeto completo en el array de la API usando el título como clave.
            const productoAAgregar = productosAPI.find(p => p.title === title);

            if (productoAAgregar) {
                agregarProductoAlCarrito(productoAAgregar);
            } else {
                console.error('Producto de la API no encontrado en el array original:', title);
            }
        });
    });
}

/**
 * Manejador de click para productos estáticos (obtiene la data del DOM).
 */
function manejarClickEstatico() {
    const boton = this; // El botón clickeado
    const productItem = boton.closest('.product-item'); // La tarjeta contenedora

    // 1. Obtener los datos necesarios para crear el objeto Producto
    const title = productItem.querySelector('h3').textContent;
    const priceText = productItem.querySelector('.product-price').textContent.replace('$', '').replace(',', '');
    const price = parseFloat(priceText);

    // 2. Crear un objeto producto (con ID simple para los estáticos)
    const productoEstatico = {
        id: title.replace(/\s/g, '-'), // ID simple basado en el título
        title: title,
        price: price,
    };

    // 3. Agregar al carrito y guardar
    agregarProductoAlCarrito(productoEstatico);

    // 4. Feedback visual
    const textoOriginal = boton.innerHTML;
    const colorOriginal = boton.style.backgroundColor || '';

    boton.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
    boton.style.backgroundColor = '#28a745'; // Verde

    setTimeout(() => {
        boton.innerHTML = textoOriginal;
        boton.style.backgroundColor = colorOriginal;
    }, 1000);
}


/**
 * Asigna el manejador de eventos a los botones de los productos ESTÁTICOS.
 */
function asignarEventosCarritoEstatico() {
    const addToCartButtons = document.querySelectorAll('.product-grid .add-to-cart');
    
    addToCartButtons.forEach(button => {
        // Aseguramos que el evento solo se añade una vez
        button.removeEventListener('click', manejarClickEstatico); 
        button.addEventListener('click', manejarClickEstatico);
    });
    console.log(`Eventos de carrito asignados a ${addToCartButtons.length} botones estáticos.`);
}


/* ==========================================
   LÓGICA PARA VACIAR EL CARRITO 
   ========================================== */

// 💡 CORRECCIÓN: Se usa la variable 'btnVaciar' declarada arriba y la lógica de 'carrito'
btnVaciar.addEventListener('click', () => {
    const confirmar = confirm('¿Estás seguro de que quieres vaciar el carrito?');

    if (confirmar) {
        // 1. Limpiar el array global del carrito
        carrito = []; 
        
        // 2. Limpiar el localStorage y actualizar el contador visual
        guardarCarrito(); 

        alert('El carrito ha sido vaciado.');
    }
});


/* ==========================================
   CONSUMIR API REST CON FETCH 
   ========================================== */

/**
 * Crea la estructura HTML para una tarjeta de producto.
 * @param {Object} producto - Objeto de producto de la API.
 */
function crearTarjetaProducto(producto) {
    // Crear el artículo principal de la tarjeta
    const article = document.createElement('article');
    article.className = 'product-item';

    // Usar la categoría como parte del alt para más contexto
    const altText = `Producto: ${producto.title}, Categoría: ${producto.category}`;
    const formattedPrice = producto.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Formato de precio USD

    article.innerHTML = `
        <img src="${producto.image}" alt="${altText}">
        <h3>${producto.title}</h3>
        <p class="api-description">${producto.description.substring(0, 100)}...</p> 
        <span class="product-price">$${formattedPrice}</span>
        <button class="add-to-cart">
            <i class="fas fa-shopping-cart"></i> Agregar al carrito
        </button>
    `;

    return article;
}


/**
 * Obtiene los productos de la API y los renderiza en el DOM,
 * y luego asigna los eventos de carrito específicos a los nuevos botones.
 */
function cargarProductosDesdeAPI() {
    // 1. Mostrar un mensaje de carga
    // 💡 DEPENDENCIA: Requiere que 'productosContainer' esté declarado al inicio
    productosContainer.innerHTML = '<p style="text-align:center;">Cargando ofertas de la API externa...</p>';

    // 2. Usar fetch para obtener los datos
    fetch(API_URL)
        .then(response => {
            // Verificar si la respuesta fue exitosa (status 200-299)
            if (!response.ok) {
                // Si la respuesta no es OK, lanza un error que será capturado por el .catch
                throw new Error(`Error de red: ${response.status}`);
            }
            return response.json(); // Convertir la respuesta a JSON
        })
        .then(productos => {
            // 3. Limpiar el mensaje de carga
            productosContainer.innerHTML = '';

            // 4. Recorrer los productos y renderizar las tarjetas
            productos.forEach(producto => {
                const tarjeta = crearTarjetaProducto(producto);
                productosContainer.appendChild(tarjeta);
            });

            // 5. Asignar eventos de carrito a los botones de los productos de la API.
            asignarEventosCarritoAPI(productos);

            console.log("Productos cargados desde la API con éxito.");
        })
        .catch(error => {
            // 6. Manejo de errores
            console.error('Error al cargar los productos de la API:', error);
            productosContainer.innerHTML = `
                <p style="color: red; text-align: center; padding: 20px; border: 1px dashed red;">
                    ❌ **¡Alerta!** Error al cargar los productos de la API. Por favor, inténtalo más tarde. (Detalle: ${error.message})
                </p>
            `;
        });
}


/* ==========================================
   EJECUCIÓN INICIAL
   ========================================== */

// "DOMContentLoaded" asegura que el HTML esté listo antes de ejecutar JS
document.addEventListener('DOMContentLoaded', () => {
    cargarPreferencias();
    inicializarCarritoDinamico();
    
    // Inicializar la descripción dinámica para los productos estáticos
    inicializarDescripcionDinamica(); 
    
    // Asignar los eventos del carrito primero a los botones estáticos
    asignarEventosCarritoEstatico();
    // cargarProductosDesdeAPI(); // Descomentar si quieres cargar los productos externos
});