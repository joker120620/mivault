import { fetchDataWithToken } from "./peticionServer.js";

export async function mostrarCard(id, type) {
  const URL_SERVER = `https://mivault.tailff2832.ts.net`;
  const modal = document.getElementById("modalCard");
  const contenido = document.getElementById("modalCardContent");

  const response = await fetchDataWithToken(
    `${URL_SERVER}/api/files/getcard/card${id}?type=${type}`,
    "POST"
  );
  console.log(type);
  const data = response.data[0];
  if (type == "image") {
    document.getElementById("loaderImage"+data.id_image).style.display="none"
    const srcImage = URL_SERVER + data.file_path_image;
    const fecha = new Date(data.created_at_image);
    console.log("Datos para mostrar en el modal:", data, srcImage, fecha);
    contenido.innerHTML = `
    <h2>${data.file_name_image}</h2>
    
    <div class="modal-image-container-16-9">
        <img src="${srcImage}" alt="" class="modal-image-blur-bg" Aria-hidden="true">
        
        <img src="${srcImage}" alt="${data.file_name_image}" class="modal-image-foreground">
    </div>
    
    <p>Autor: ${data.owner_name}.</p>
    <p>Fecha de Publicación: ${fecha.toLocaleString()}.</p>`;
    modal.style.display = "block";
  } else if (type == "video") {
    document.getElementById("loaderVideo"+data.id_video).style.display="none"
    const srcImage = URL_SERVER + data.file_path_video;
    const fecha = new Date(data.created_at_video);
    console.log("Datos para mostrar en el modal:", data, srcImage, fecha);
    contenido.innerHTML = `
    <h2>${data.file_name_video}</h2>

    <div class="container-video-modal">
        <video 
            id="video-dinamic"
            src="${srcImage}" 
            controls 
            autoplay 
            style="width:100%; max-height:400px;"
        >
            Tu navegador no soporta video.
        </video>
    </div>

    <p>Autor: ${data.owner_name}.</p>
    <p>Fecha de Publicación: ${fecha.toLocaleString()}.</p>
`;
    // Capturamos el video que acabamos de inyectar en el HTML
    const video = document.getElementById("video-dinamic");

    // Evento si el usuario cambia de pestaña o minimiza el navegador
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && video) {
        video.pause();
      }
    });

    // Evento si la ventana pierde el foco (ej. hace clic en otro monitor)
    window.addEventListener("blur", () => {
      if (video) {
        video.pause();
      }
    });
  }

  modal.style.display = "block";

  // cerrar al presionar la X
  document.getElementById("modalCardCerrar").onclick = () => {
    modal.style.display = "none";
    cerrarVideoPlayer()
  };

  // cerrar al hacer click fuera del modal
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
    cerrarVideoPlayer()
  };
}
function cerrarVideoPlayer() {
  const video = document.getElementById("video-dinamic");
  if (video) {
    video.pause(); // Pausa el video
    video.removeAttribute('src'); // Opcional: descarga el video de la memoria
  }
}