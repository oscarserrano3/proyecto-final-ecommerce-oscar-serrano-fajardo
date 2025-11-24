/**
 * Función que inicializa la funcionalidad de mostrar/ocultar la descripción
 * utilizando el párrafo original del HTML.
 */
function inicializarDescripcionDinamica() {
    const productItems = document.querySelectorAll('.product-item');

    productItems.forEach(productItem => {
        // Seleccionamos el párrafo de descripción original que está en el HTML
        const descriptionElement = productItem.querySelector('p');

        // 1. Ocultar la descripción por defecto al cargar el script
        // Usamos una clase para manejar la visibilidad y que sea fácil de alternar.
        descriptionElement.classList.add('hidden-description');
        
        // 2. Crear el botón de "Ver descripción"
        const button = document.createElement('button');
        button.className = 'toggle-description-btn'; 
        button.textContent = 'Ver descripción';

        // Insertar el botón en la tarjeta antes del botón "Agregar al carrito"
        const addToCartButton = productItem.querySelector('.add-to-cart');
        
        if (addToCartButton) {
            productItem.insertBefore(button, addToCartButton);
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

inicializarDescripcionDinamica();

/* ==========================================
   LÓGICA DE PREFERENCIAS DE USUARIO (LOCALSTORAGE)
   ========================================== */

// 1. Seleccionar elementos del DOM
const preferencesForm = document.getElementById('preferences-form');
const nameInput = document.getElementById('pref-name');
const colorSelect = document.getElementById('pref-bg-color');
const greetingElement = document.getElementById('saludo-usuario');
const btnBorrar = document.getElementById('btn-borrar-pref');

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

// 6. Ejecutar carga al inicio
// "DOMContentLoaded" asegura que el HTML esté listo antes de ejecutar JS
document.addEventListener('DOMContentLoaded', cargarPreferencias);