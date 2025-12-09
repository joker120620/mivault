export function mostrarConfirmacion(mensaje) {
     return new Promise((resolve) => {
    const modal = document.getElementById('modal');
    const texto = document.getElementById('modalTexto');
    texto.innerHTML = `<p>${mensaje}</p>
    <button id="confirmarBtn">Confirmar</button>
    <button id="cancelarBtn">Cancelar</button>`;
    modal.style.display = 'block';
    const btnConfirmar = document.getElementById('confirmarBtn');
    const btnCancelar = document.getElementById('cancelarBtn');
    if (btnConfirmar && btnCancelar) {
        btnConfirmar.onclick = () => {
            modal.style.display = 'none';
            texto.innerHTML = '';
            resolve(true);
        };
        btnCancelar.onclick = () => {
            modal.style.display = 'none';
            texto.innerHTML = '';
            resolve(false);
        };
    }

    // Cerrar al presionar la X
    document.getElementById('modalCerrar').onclick = () => {
        modal.style.display = 'none';
        resolve(false);
    };

    // Cerrar al hacer click fuera
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            resolve(false);
        }
    };
});
}