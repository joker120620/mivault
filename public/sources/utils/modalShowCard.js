export function mostrarCard(id) {
    const modal = document.getElementById('modalCard');
    const contenido = document.getElementById('modalCardContent');
    // Aquí puedes personalizar el contenido de la tarjeta según el ID
    contenido.innerHTML = `<h2>Detalle de la tarjeta ${id}</h2>
    <p>Aquí va la información detallada de la tarjeta con ID: ${id}.</p>
    <button id="cerrarCardBtn">Cerrar</button>`;
    modal.style.display = 'block';

    
    // Cerrar al presionar la X
    document.getElementById('modalCardCerrar').onclick = () => {
        modal.style.display = 'none';
    };

    // Cerrar al hacer click fuera
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
    
}