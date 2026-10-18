import { fetchDataWithToken } from "../utils/peticionServer.js";

const BASE_URL = "http://192.168.0.112:3000";

const searchCache = {};
let activeTab = 'all';

// Objeto para llevar el control independiente de la paginacion por cada seccion
const statePages = {
  all: 1,
  users: 1,
  images: 1,
  videos: 1,
  documents: 1
};

export async function renderSearch(currentQuery, incomingPage = null) {
  try {
    const container = document.getElementById('contentSearch');

    // Si incomingPage es 1 (significa que el usuario hizo una nueva busqueda desde el buscador superior)
    if (incomingPage === 1) {
      activeTab = 'all';
      statePages.all = 1;
      statePages.users = 1;
      statePages.images = 1;
      statePages.videos = 1;
      statePages.documents = 1;
    }

    // Usamos la pagina actual segun la pestaña activa
    const currentPage = statePages[activeTab];
    const cacheKey = `${currentQuery}_${currentPage}`;
    let dataSearch;

    if (searchCache[cacheKey]) {
      dataSearch = searchCache[cacheKey];
      console.log(`Datos cargados desde la cache (Pagina ${currentPage}):`, dataSearch);
    } else {
      container.innerHTML = '<span class="loader-content-home" style="grid-column: 1 / -1;"></span>';
      
      const url_search = `${BASE_URL}/api/search?q=${currentQuery}&page=${currentPage}`;
      dataSearch = await fetchDataWithToken(url_search);
      console.log(`Datos obtenidos del servidor (Pagina ${currentPage}):`, dataSearch);

      if (dataSearch && dataSearch.ok) {
        searchCache[cacheKey] = dataSearch;
      }
    }

    if (!dataSearch || !dataSearch.ok) {
      container.innerHTML = `
        <div class="card-file-empty" style="grid-column: 1 / -1;">
            <img src="https://cdn-icons-png.flaticon.com/512/5445/5445197.png" alt="error">
            <p class="title-file-dashboard">Ocurrio un error en la busqueda</p>
        </div>
      `;
      return false; 
    }

    renderUI(container, dataSearch, currentQuery);
    return true;

  } catch (error) {
    console.error("Error al renderizar la busqueda:", error);
    return false;
  }
}

function renderUI(container, dataSearch, currentQuery) {
  const { users = [], images = [], videos = [], documents = [] } = dataSearch;
  const currentPage = statePages[activeTab];

  const getTabStyle = (isActive) => `
    padding: 8px 16px; 
    border: 2px solid var(--morado); 
    border-radius: 20px; 
    background: ${isActive ? 'var(--morado)' : 'transparent'}; 
    color: ${isActive ? '#fff' : 'var(--morado)'}; 
    cursor: pointer; 
    font-weight: 600;
    transition: 0.3s;
  `;

  let htmlContent = `
    <div class="search-tabs-container" ">
      <button class="btn-tab-search" data-tab="all" style="${getTabStyle(activeTab === 'all')}">Todos </button>
      <button class="btn-tab-search" data-tab="users" style="${getTabStyle(activeTab === 'users')}">Usuarios </button>
      <button class="btn-tab-search" data-tab="images" style="${getTabStyle(activeTab === 'images')}">Imagenes </button>
      <button class="btn-tab-search" data-tab="videos" style="${getTabStyle(activeTab === 'videos')}">Videos </button>
      <button class="btn-tab-search" data-tab="documents" style="${getTabStyle(activeTab === 'documents')}">Documentos </button>
    </div>
  `;

  // Variables para saber si el boton "Siguiente" debe estar activo
  // (Si devuelve 10 resultados, es probable que haya una pagina siguiente)
  let hasNextPage = false;
  if (activeTab === 'all') {
    hasNextPage = users.length === 10 || images.length === 10 || videos.length === 10 || documents.length === 10;
  } else if (activeTab === 'users') {
    hasNextPage = users.length === 10;
  } else if (activeTab === 'images') {
    hasNextPage = images.length === 10;
  } else if (activeTab === 'videos') {
    hasNextPage = videos.length === 10;
  } else if (activeTab === 'documents') {
    hasNextPage = documents.length === 10;
  }

  let contentAdded = false;

  // Renderizar Usuarios
  if ((activeTab === 'all' || activeTab === 'users') && users.length > 0) {
      contentAdded = true;
      htmlContent += `<div class="separate-seccion-home" style="grid-column: 1 / -1;"><h2>Usuarios Encontrados</h2></div>`;
      users.forEach(user => {
        htmlContent += `
          <div class="card-file-dashboard" style="justify-content: center;">
              <img src="./assets/userDefault.png" alt="perfil" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 10px auto;">
              <p class="title-file-dashboard">${user.name_user}</p>
              <p class="info-file-dashboard">${user.email_user}</p>
          </div>
        `;
      });
  }

  // Renderizar Imagenes
  if ((activeTab === 'all' || activeTab === 'images') && images.length > 0) {
      contentAdded = true;
      htmlContent += `<div class="separate-seccion-home" style="grid-column: 1 / -1;"><h2>Imagenes Encontradas</h2></div>`;
      images.forEach(img => {
        const imgSrc = img.file_path_thumbnail ? `${BASE_URL}${img.file_path_thumbnail}` : '';
        htmlContent += `
          <div class="card-file-dashboard">
              <span class="loader" id="loaderImage${img.id_image}" style="display: none;"></span>
              <input disabled type="checkbox" class="checkbox-delete-file" id="${img.id_image}" data-type="image">
              <img src="${imgSrc}" alt="${img.file_name_image}" loading="lazy">
              <p class="title-file-dashboard">${img.file_name_image}</p>
              <p class="info-file-dashboard">De: ${img.owner_name}</p>
              <p class="date-file-dashboard">${new Date(img.created_at_image).toLocaleString()}.</p>
          </div>
        `;
      });
  }

  // Renderizar Videos
  if ((activeTab === 'all' || activeTab === 'videos') && videos.length > 0) {
      contentAdded = true;
      htmlContent += `<div class="separate-seccion-home" style="grid-column: 1 / -1;"><h2>Videos Encontrados</h2></div>`;
      videos.forEach(video => {
        const videoSrc = video.thumbnail_path_video ? `${BASE_URL}${video.thumbnail_path_video}` : '';
        htmlContent += `
          <div class="card-file-dashboard">
              <span class="loader" id="loaderVideo${video.id_video}" style="display: none;"></span>
              <input disabled type="checkbox" class="checkbox-delete-file" id="${video.id_video}" data-type="video">
              <div class="container-video-modal">
                  <img src="${videoSrc}" loading="lazy">
              </div>
              <p class="title-file-dashboard">${video.file_name_video}</p>
              <p class="info-file-dashboard">De: ${video.owner_name}</p>
              <p class="date-file-dashboard">${new Date(video.created_at_video).toLocaleString()}.</p>
          </div>
        `;
      });
  }

  // Renderizar Documentos
  if ((activeTab === 'all' || activeTab === 'documents') && documents.length > 0) {
      contentAdded = true;
      htmlContent += `<div class="separate-seccion-home" style="grid-column: 1 / -1;"><h2>Documentos Encontrados</h2></div>`;
      documents.forEach(doc => {
        const docSrc = doc.file_path_document ? `${BASE_URL}${doc.file_path_document}` : '#';
        htmlContent += `
          <div class="card-file-dashboard">
              <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" class="doc-icon" style="width: 80px; height: 80px; object-fit: contain; margin: 0 auto 10px auto;"/>
              <a href="${docSrc}" target="_blank" class="title-file-dashboard">${doc.file_name_document}</a>
              <p class="info-file-dashboard">De: ${doc.owner_name}</p>
          </div>
        `;
      });
  }

  // Mensaje de vacio si no hay nada en la pestaña seleccionada
  if (!contentAdded) {
    htmlContent += `
      <div class="card-file-empty" style="grid-column: 1 / -1; margin-top: 20px;">
          <p class="title-file-dashboard">No se encontraron resultados en esta seccion.</p>
      </div>
    `;
  }

  // Paginacion
  htmlContent += `
    <div class="pagination-container" style="grid-column: 1 / -1; margin-top: 30px; display: flex; gap: 15px; align-items: center; justify-content: center; width: 100%;">
      <button class="btn" id="prevPage" style="width: auto; padding: 10px 20px;" ${currentPage === 1 ? 'disabled' : ''}>Anterior</button>
      <span style="font-weight: 600;">Pagina ${currentPage}</span>
      <button class="btn" id="nextPage" style="width: auto; padding: 10px 20px;" ${!hasNextPage ? 'disabled' : ''}>Siguiente</button>
    </div>
  `;

  container.innerHTML = htmlContent;

  setTimeout(() => {
    // Evento de cambio de Pestaña
    const tabButtons = document.querySelectorAll('.btn-tab-search');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeTab = e.target.getAttribute('data-tab');
        // Vuelve a llamar la API pero usando la pagina independiente de esta pestaña
        renderSearch(currentQuery);
      });
    });

    // Eventos de Paginacion
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        if (statePages[activeTab] > 1) {
          statePages[activeTab]--;
          renderSearch(currentQuery);
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        if (hasNextPage) {
          statePages[activeTab]++;
          renderSearch(currentQuery);
        }
      });
    }
  }, 0);
}