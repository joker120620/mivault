import { fetchDataWithToken } from "./peticionServer.js";
export async function mostrarCard(id, type) {
    console.log(type)
    const URL_SERVER = `http://192.168.0.240:3000`
    const modal = document.getElementById('modalCard');
    const contenido = document.getElementById('modalCardContent');
    // fetch y contenido
    const response = await fetchDataWithToken(`${URL_SERVER}/api/files/getcard/card${id}?type=${type}`)
    console.log(response)

    contenido.innerHTML = `<h2> ${response.data[0].file_name_image}</h2>
     <img src="${URL_SERVER + response.data[0].file_path_image}" alt="${response.data[0].file_name_image}">
     <p>Autor: ${response.data[0].owner_name}.</p>
     <p>Fecha de Publicacion: ${response.data[0].created_at_image}.</p>`;
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