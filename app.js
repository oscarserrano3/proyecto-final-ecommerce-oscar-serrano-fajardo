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