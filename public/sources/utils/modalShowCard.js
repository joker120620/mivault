import { fetchDataWithToken } from "./peticionServer.js";

export async function mostrarCard(id, type) {
  const URL_SERVER = `http://192.168.0.240:3000`;
  const modal = document.getElementById("modalCard");
  const contenido = document.getElementById("modalCardContent");

  const response = await fetchDataWithToken(
    `${URL_SERVER}/api/files/getcard/card${id}?type=${type}` , 
    "POST"
  );
  console.log(response);
  const data = response.data[0];
  
  const srcImage = URL_SERVER + data.file_path_image; 
  const fecha = new Date(data.created_at_image);
  contenido.innerHTML = `
    <h2>${data.file_name_image}</h2>

    <div class="container-img-modal" style="background-image:url('${srcImage}')">
      <img src="${srcImage}" alt="${data.file_name_image}">
    </div>

    <p>Autor: ${data.owner_name}.</p>
    <p>Fecha de Publicación: ${fecha.toLocaleString()}.</p>
  `;

  modal.style.display = "block";

  // cerrar al presionar la X
  document.getElementById("modalCardCerrar").onclick = () => {
    modal.style.display = "none";
  };

  // cerrar al hacer click fuera del modal
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
}