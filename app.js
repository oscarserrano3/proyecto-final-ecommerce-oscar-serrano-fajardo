// Declaración de selectores globales al inicio para que las funciones del carrito los encuentren.

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

// ==========================================
// Selectores del DOM para el MODAL del Carrito (NUEVOS)
// ==========================================
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');


function inicializarDescripcionDinamica() {
    // Usar el ID específico para seleccionar solo los productos estáticos
    const contenedorEstatico = document.getElementById('productos-estaticos');
    
    if (!contenedorEstatico) {
        console.warn("Contenedor de productos estáticos (#productos-estaticos) no encontrado.");
        return;
    }
    
    const productItems = contenedorEstatico.querySelectorAll('.product-item');

    if (productItems.length === 0) {
        console.warn("No se encontraron productos estáticos (.product-item) para inicializar la descripción dinámica.");
        return; 
    }

    productItems.forEach(productItem => {
        const descriptionElement = productItem.querySelector('p');
        
        if (!descriptionElement || productItem.querySelector('.toggle-description-btn')) {
            return;
        }

        // 1. Ocultar la descripción por defecto
        descriptionElement.classList.add('hidden-description'); 

        // 2. Crear el botón de "Ver descripción"
        const button = document.createElement('button');
        button.className = 'toggle-description-btn';
        button.textContent = 'Ver descripción';

        // Insertar el botón en la tarjeta
        const productPrice = productItem.querySelector('.product-price');
        if (productPrice) {
            productItem.insertBefore(button, productPrice);
        } else {
            productItem.appendChild(button);
        }

        // 3. Agregar el listener de eventos
        button.addEventListener('click', () => {
            descriptionElement.classList.toggle('hidden-description');
            button.textContent = descriptionElement.classList.contains('hidden-description') ? 'Ver descripción' : 'Ocultar descripción';
        });
    });
}

/* ==========================================
   LÓGICA DE PREFERENCIAS DE USUARIO (LOCALSTORAGE)
   ========================================== */

function aplicarPreferencias(nombre, color) {
    if (color) {
        document.body.style.backgroundColor = color;
        if (colorSelect) colorSelect.value = color;
    }

    if (nombre && greetingElement) {
        greetingElement.textContent = `¡Hola de nuevo, ${nombre}!`;
        if (nameInput) nameInput.value = nombre;
    } else if (greetingElement) {
        greetingElement.textContent = ""; 
    }
}

function cargarPreferencias() {
    const nombreGuardado = localStorage.getItem('usuarioNombre');
    const colorGuardado = localStorage.getItem('usuarioColor');

    if (nombreGuardado || colorGuardado) {
        aplicarPreferencias(nombreGuardado, colorGuardado);
    }
}

if (preferencesForm) {
    preferencesForm.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const nombre = nameInput.value;
        const color = colorSelect.value;

        localStorage.setItem('usuarioNombre', nombre);
        localStorage.setItem('usuarioColor', color);

        aplicarPreferencias(nombre, color);

        alert('¡Preferencias guardadas con éxito!');
    });
}

if (btnBorrar) {
    btnBorrar.addEventListener('click', () => {
        localStorage.removeItem('usuarioNombre');
        localStorage.removeItem('usuarioColor');

        document.body.style.backgroundColor = ''; 
        if (greetingElement) greetingElement.textContent = '';
        if (nameInput) nameInput.value = '';
        if (colorSelect) colorSelect.selectedIndex = 0;

        alert('Preferencias borradas.');
    });
}


/* ==========================================
   LÓGICA DEL CARRITO DINÁMICO
   ========================================== */

let carrito = obtenerCarritoGuardado(); 

function obtenerCarritoGuardado() {
    const carritoJSON = localStorage.getItem('carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : []; 
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito(); 
}

function actualizarContadorCarrito() {
    if (cartCounterElement) {
        cartCounterElement.textContent = carrito.length;
    }
}

const agregarProductoAlCarrito = (producto) => {
    const itemEnCarrito = carrito.find(item => String(item.id) === String(producto.id));

    if (itemEnCarrito) {
        itemEnCarrito.quantity++;
    } else {
        carrito.push({
            id: producto.id || producto.title.replace(/\s/g, '-'),
            title: producto.title,
            price: producto.price,
            image: producto.image || '',
            quantity: 1
        });
    }

    guardarCarrito();
    mostrarCarrito(); 
    
    // Mensaje de confirmación temporal
    alert(`🎉 ¡"${producto.title}" se añadió al carrito!`); 
};

function inicializarCarritoDinamico() {
    carrito = obtenerCarritoGuardado();
    actualizarContadorCarrito();
}

function asignarEventosCarritoAPI(productosAPI) {
    if (!productosContainer) return;
    
    const addToCartButtons = productosContainer.querySelectorAll('.product-item .add-to-cart');
    
    addToCartButtons.forEach(button => {
        const productItem = button.closest('.product-item');
        
        button.addEventListener('click', function() {
            const titleElement = productItem.querySelector('h3');
            if (!titleElement) return;

            const title = titleElement.textContent;
            const productoAAgregar = productosAPI.find(p => p.title === title);

            if (productoAAgregar) {
                agregarProductoAlCarrito(productoAAgregar);
            } else {
                console.error('Producto de la API no encontrado en el array original:', title);
            }
        });
    });
}

function manejarClickEstatico() {
    const boton = this;
    const productItem = boton.closest('.product-item');

    const title = productItem.querySelector('h3').textContent;
    const priceText = productItem.querySelector('.product-price').textContent.replace('$', '').replace(',', '');
    const price = parseFloat(priceText);

    const productoEstatico = {
        id: title.replace(/\s/g, '-'),
        title: title,
        price: price,
        image: productItem.querySelector('img').src || '',
    };

    agregarProductoAlCarrito(productoEstatico);

    const textoOriginal = boton.innerHTML;
    const colorOriginal = boton.style.backgroundColor || '';

    boton.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
    boton.style.backgroundColor = '#28a745';

    setTimeout(() => {
        boton.innerHTML = textoOriginal;
        boton.style.backgroundColor = colorOriginal;
    }, 1000);
}

function asignarEventosCarritoEstatico() {
    const addToCartButtons = document.querySelectorAll('.product-grid .add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.removeEventListener('click', manejarClickEstatico); 
        button.addEventListener('click', manejarClickEstatico);
    });
}

if (btnVaciar) {
    btnVaciar.addEventListener('click', () => {
        const confirmar = confirm('¿Estás seguro de que quieres vaciar el carrito?');

        if (confirmar) {
            carrito = []; 
            guardarCarrito(); 
            mostrarCarrito(); 
            alert('El carrito ha sido vaciado.');
        }
    });
}

/* ==========================================
   LÓGICA DEL MODAL DEL CARRITO
   ========================================== */

const toggleCarritoModal = () => {
    if (cartModal) {
        cartModal.classList.toggle('open');
    }
};

const gestionarCantidadProducto = (id, accion) => {
    const itemIndex = carrito.findIndex(item => String(item.id) === String(id));
    
    if (itemIndex > -1) {
        if (accion === 'increase') {
            carrito[itemIndex].quantity++;
        } else if (accion === 'decrease') {
            carrito[itemIndex].quantity--;
            if (carrito[itemIndex].quantity < 1) {
                carrito.splice(itemIndex, 1);
            }
        } else if (accion === 'remove') {
            carrito.splice(itemIndex, 1);
        }

        guardarCarrito();
        mostrarCarrito(); 
    }
};

const asignarEventosCarritoModal = () => {
    if (!cartItemsContainer) return;

    cartItemsContainer.querySelectorAll('.quantity-btn, .remove-item-btn').forEach(btn => {
        const id = btn.dataset.id;
        
        // Usamos una función anónima para que se pueda reasignar sin problemas
        btn.onclick = (e) => {
            e.preventDefault();
            if (e.target.classList.contains('increase-btn')) {
                gestionarCantidadProducto(id, 'increase');
            } else if (e.target.classList.contains('decrease-btn')) {
                gestionarCantidadProducto(id, 'decrease');
            } else if (e.target.classList.contains('remove-item-btn')) {
                gestionarCantidadProducto(id, 'remove');
            }
        };
    });
};

const mostrarCarrito = () => {
    if (!cartModal || !cartItemsContainer || !cartTotalPrice) {
        console.error("Error: Elementos del modal de carrito no encontrados en el DOM.");
        return;
    }

    // 1. Asegura que el modal esté abierto
    cartModal.classList.add('open');
    
    let total = 0;
    let htmlContent = '';

    if (carrito.length === 0) {
        htmlContent = '<p class="empty-cart-message">Tu carrito está vacío. ¡Añade productos!</p>';
        cartTotalPrice.textContent = '$0.00';
    } else {
        carrito.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal; 

            htmlContent += `
                <div class="cart-item" data-item-id="${item.id}">
                    <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: contain;">
                    <div class="cart-item-info">
                        <strong>${item.title}</strong>
                        <p>$${item.price.toFixed(2)} c/u</p>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">X</button>
                </div>
            `;
        });
        
        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
    }

    cartItemsContainer.innerHTML = htmlContent;
    asignarEventosCarritoModal();
};


/* ==========================================
   CONSUMIR API REST CON FETCH 
   ========================================== */

function crearTarjetaProducto(producto) {
    const article = document.createElement('article');
    article.className = 'product-item';

    const altText = `Producto: ${producto.title}, Categoría: ${producto.category}`;
    const formattedPrice = producto.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); 

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


function cargarProductosDesdeAPI() {
    if (!productosContainer) return;
    
    productosContainer.innerHTML = '<p style="text-align:center;">Cargando ofertas de la API externa...</p>';

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error de red: ${response.status}`);
            }
            return response.json();
        })
        .then(productos => {
            productosContainer.innerHTML = '';

            productos.forEach(producto => {
                const tarjeta = crearTarjetaProducto(producto);
                productosContainer.appendChild(tarjeta);
            });

            asignarEventosCarritoAPI(productos);
        })
        .catch(error => {
            console.error('Error al cargar los productos de la API:', error);
            productosContainer.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">❌ Error al cargar productos: ${error.message}</p>`;
        });
}


/* ==========================================
   INICIALIZACIÓN: SE EJECUTA AL CARGAR EL DOM
   ========================================== */

function init() {
    cargarPreferencias();
    cargarProductosDesdeAPI();
    inicializarDescripcionDinamica();
    asignarEventosCarritoEstatico(); 
    inicializarCarritoDinamico(); 

    // --- EVENT LISTENERS PARA EL MODAL DEL CARRITO ---
    
    const closeCartBtn = document.getElementById('close-cart-btn');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCarritoModal);
    }
    
    const cartIconContainer = document.querySelector('.cart-icon-container a'); // Selecciona el <a> dentro del li
    if (cartIconContainer) {
        cartIconContainer.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // al hacer click en el icono siempre abre el carrito
            if (!e.target.closest('#btn-vaciar-carrito')) {
                 mostrarCarrito(); 
            }
        });
    }

    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                toggleCarritoModal();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', init);