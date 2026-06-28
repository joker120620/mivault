//importacion de modulos
import { mostrarMensaje } from "./utils/modalTexto.js";
import { mostrarConfirmacion } from "./utils/modalConfim.js";
import { UploadFile } from "./utils/modalUploadFile.js";
import { changeDataUser } from "./utils/changeDataUserConfig.js"
import { mostrarCard } from "./utils/modalShowCard.js";
import { deleteFilesWithIds } from "./utils/deleteFilesWithId.js";
import { renderHome, initPollingHome, stopPollingHome } from "./renders/renderHome.js";
import { renderPhotos } from "./renders/renderSectionPhotos.js"
import { renderVideos } from "./renders/renderSectionVideo.js";
import { renderPapelera } from "./renders/renderSectionPapelera.js"

//redigirir si no hay session
const session = localStorage.getItem("token") || sessionStorage.getItem("token");

// Si no hay token → devolver al login
if (!session) {
  window.location.href = "/";
}
//Funciones auxiliares para el dashboard
function capturarItem(nombre) {
  return document.querySelector(`#${nombre}, .${nombre}, [name='${nombre}']`);
}
//mostrar usuario en el nav
function showUserBody() {
  const infoUserEmail = localStorage.getItem("user_email") || sessionStorage.getItem("user_email");
  const infoUserName = localStorage.getItem("user_name") || sessionStorage.getItem("user_name");
  capturarItem("show-info-user-nav").innerHTML = `<span>${infoUserName}</span><br><span>${infoUserEmail}</span>`

}
showUserBody()
//abrir modal de configuracion
capturarItem("btn-perfil-confi-nav").addEventListener('click', async () => {
  let contentConfig = `<div>
                        <h2>Configuracion</h2>
                        <div>
                          <label for="changeNameUser">Cambiar usuario:</label>
                          <input type="text" id="changeNameUser">
                        </div>
                        <div>
                          <label for="changePassUser">Nueva contraseña:</label>
                          <input type="pass" id="changePassUser" minlength="8">
                        </div>
                        <div>
                          <label for="PassUserConfig">Contraseña actual:</label>
                          <input type="pass" id="PassUserConfig" minlength="8">
                        </div>
                    </div>`
  ///obtener datos del modal
  let btnSendChangeConfigClick = await mostrarConfirmacion(contentConfig)
  if (btnSendChangeConfigClick) {
    let newNameUser = capturarItem("changeNameUser").value
    let newPassUser = capturarItem("changePassUser").value
    let actualPassUser = capturarItem("PassUserConfig").value
    if (actualPassUser != "" && (newNameUser != "" || newPassUser != "" && newPassUser.length >= 8)) {
      let statusChangeDataUser = await changeDataUser(newNameUser, newPassUser, actualPassUser)
      if (statusChangeDataUser.success) {
        if (newNameUser != "") {
          localStorage.setItem("user_name", newNameUser) || sessionStorage.setItem("user_name", "user_name", newNameUser);
        }
        mostrarMensaje("¡Datos actualizados Correctamente!")
        showUserBody()
      } else {
        if (statusChangeDataUser.error == "userFail") {
          mostrarMensaje("Contraseña Incorrecta")
        } else {
          mostrarMensaje("Error al actualizar: nombre de usuario ya existente")
        }
      }
    } else {
      mostrarMensaje("Faltan datos")
    }
  }

})
//navegacion dashboard
const btnHomeDashboard = capturarItem("btnHomeDashboard");
const btnFotosDashboard = capturarItem("btnFotosDashboard");
const btnVideosDashboard = capturarItem("btnVideosDashboard");
const btnPapeleraDashboard = capturarItem("btnPapeleraDashboard")

//ocultar demas secciones y dejar visible home
function mostrarSeccion(nombreVer) {
  const secciones = document.querySelectorAll(".container-content-dashboard");
  secciones.forEach(seccion => {
    seccion.style.display = "none";
    stopPollingHome()
  });
  const seccionVer = capturarItem(nombreVer);
  disableCheckboxes();
  seccionVer.style.display = "block";
  capturarItem("menu-mobile-dashboard").classList.remove("menu-mobile-dashboard-open");
}

btnHomeDashboard.addEventListener("click", () => {
  mostrarSeccion("sectionHomeDashboard");
  initPollingHome()
  console.log("home dashboard");
});

btnFotosDashboard.addEventListener("click", () => {
  mostrarSeccion("sectionFotosDashboard");
  renderPhotos()
  console.log("fotos dashboard");
});

btnVideosDashboard.addEventListener("click", () => {
  mostrarSeccion("sectionVideosDashboard");
  renderVideos()
  console.log("videos dashboard");
});

btnPapeleraDashboard.addEventListener("click" , ()=>{
  mostrarSeccion("sectionPapeleraDashboard");
  renderPapelera();
  console.log("papelera")
})

//inicializar vista dashboard
mostrarSeccion("sectionHomeDashboard");


//mostrar media del home
initPollingHome()
const btnOpenMenuMobile = capturarItem("btnOpenMenuMobile");
const menuMobile = capturarItem("menu-mobile-dashboard");

// Abrir menú mobile
btnOpenMenuMobile.addEventListener("click", (e) => {
  e.stopPropagation();
  menuMobile.classList.add("menu-mobile-dashboard-open");
});

// Evitar que clics dentro del menú lo cierren
menuMobile.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Cerrar al hacer clic fuera del menú
window.addEventListener("click", (e) => {
  const clickFueraMenu = !menuMobile.contains(e.target);
  const clickEnBoton = btnOpenMenuMobile.contains(e.target);

  if (clickFueraMenu && !clickEnBoton) {
    menuMobile.classList.remove("menu-mobile-dashboard-open");
  }
});
//cargar media/////////////////////////////////////////////////////////////////////////////
//funcion de subir foto
const btnSubirFoto = capturarItem("btnUploadPhoto");
btnSubirFoto.addEventListener("click", () => {
  UploadFile("photo")
});

//funcion cargar videos 
const btnSubirVideo = capturarItem("btnUploadVideo");
btnSubirVideo.addEventListener("click", () => {
  UploadFile("video")
});
//eliminar media ///////////////////////////////////////////////////////////////////////////////////////
//funcion de eliminar foto
function deleteFoto() {
  const seleccionadas = document.querySelectorAll(".checkbox-delete-file:checked");
  if (seleccionadas.length > 0) {
    const arrayDelPhotos = []
    seleccionadas.forEach(chk => {
      const idPhoto = chk.id
      arrayDelPhotos.push(idPhoto)
    });
    let statusDelete = deleteFilesWithIds(arrayDelPhotos , "photo")
    if (statusDelete){
      mostrarMensaje("¡"+seleccionadas.length+" Fotos enviadas a la papelera!")
      renderPhotos()
    }else{
      mostrarMensaje("error")
    }
    return;
  }


}

document.getElementById("btnEliminarFoto").addEventListener("click", () => {
  //cambiar estilos de content fotos
  const contentFotos = capturarItem("content-Fotos-dashboard");
  const btnCancelDelete = capturarItem("btnCancelDelete");
  const checkboxes = document.querySelectorAll(".checkbox-delete-file");
  checkboxes.forEach(chk => {
    chk.style.display = "inline-block";
    chk.disabled = false;
  });
  contentFotos.classList.add("content-Fotos-dashboard-delete");
  btnCancelDelete.style.display = "inline-block";
  // Busca todos los seleccionados
  deleteFoto();
});
///seleccionar card a eliminar 
document.addEventListener("click", e => {
  const card = e.target.closest(".card-file-dashboard");
  if (!card) return;
  const check = card.querySelector(".checkbox-delete-file");
  console.log("Checkbox asociado:", check);
  if (check.disabled) {
    if (check.dataset.type == "image"){
    capturarItem("loaderImage"+check.id).style.display="inline-block"
    }else if(check.dataset.type =="video"){
    capturarItem("loaderVideo"+check.id).style.display="inline-block"
    
    }
    
    mostrarCard(check.id, check.dataset.type);
  } else {
    check.checked = !check.checked;  //  alterna el checkbox
    return
  };

});
//cancelar eliminacion

//desactivar los checkbox
function disableCheckboxes() {
  const checkboxes = document.querySelectorAll(".checkbox-delete-file");
  checkboxes.forEach(chk => {
    chk.style.display = "none";
    chk.checked = false;
    chk.disabled = true;
  });

}
document.getElementById("btnCancelDelete").addEventListener("click", async () => {
  const contentFotos = capturarItem("content-Fotos-dashboard");
  const btnCancelDelete = capturarItem("btnCancelDelete");
  disableCheckboxes();
  contentFotos.classList.remove("content-Fotos-dashboard-delete");
  btnCancelDelete.style.display = "none";
  let f = await mostrarConfirmacion("¿Desea cancelar la eliminación de fotos?");
  console.log("Confirmación de cancelación:", f);

});
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});