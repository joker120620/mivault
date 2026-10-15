import { fetchData, fetchDataWithToken } from "../utils/peticionServer.js";

const BASE_URL = "http://192.168.0.112:3000";


//Renderiza la  busqueda de productos en la página de resultados

export async function renderSearch(currentQuery, currentPage) {
  try {
    const url_search = `${BASE_URL}/api/search?q=${currentQuery}&page=${currentPage}`;
    const data = await fetchDataWithToken(url_search);
    console.log("Datos obtenidos de la búsqueda:", data);

    const container = document.getElementById('search-results-container');

    // Si es una búsqueda nueva (página 1), limpia los resultados anteriores
    if (currentPage === 1) {
      container.innerHTML = '';
    }

    // Si no hay resultados y es la primera página
    if (data.results.length === 0 && currentPage === 1) {
      container.innerHTML = '<p>No se encontraron resultados.</p>';
      return false;
    }

    // Renderizar los resultados en el DOM a medida que van llegando
    data.results.forEach(item => {
      const resultElement = document.createElement('div');
      resultElement.className = 'search-item';
      resultElement.innerHTML = `
        <h3>${item.titulo}</h3>
        <p>${item.descripcion}</p>
      `;
      container.appendChild(resultElement);
    });

    // Retornamos 'hasMore' para controlar el evento de scroll
    // Si es false, debes remover o desactivar el event listener del scroll
    return data.hasMore;
    
  } catch (error) {
    console.error("Error al renderizar la búsqueda:", error);
    return false; // Detener el scroll en caso de error
  }
}
