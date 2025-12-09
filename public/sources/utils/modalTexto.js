export function mostrarMensaje(mensaje) {
  const modal = document.getElementById('modal');
  const texto = document.getElementById('modalTexto');
  texto.textContent = mensaje;

  modal.style.display = 'block';

  // Cerrar al presionar la X
  document.getElementById('modalCerrar').onclick = () => {
    modal.style.display = 'none';
  };

  // Cerrar al hacer click fuera
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
  };
}
//funcione abrir modal de mensaje
