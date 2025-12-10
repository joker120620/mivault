//importacion de modulos
import { mostrarMensaje } from "./utils/modalTexto.js";
import { mostrarConfirmacion } from "./utils/modalConfim.js";
import { UploadFile } from "./utils/modalUploadFile.js"
import { mostrarCard } from "./utils/modalShowCard.js";
import { renderHome } from "./renders/renderHome.js";


//redigirir si no hay session
const session = localStorage.getItem("token") || sessionStorage.getItem("token");

// Si no hay token → devolver al login
if (!session) {
    window.location.href = "/index.html";
}
//Funciones auxiliares para el dashboard
function capturarItem(nombre) {
  return document.querySelector(`#${nombre}, .${nombre}, [name='${nombre}']`);
}
//navegacion dashboard
const btnHomeDashboard = capturarItem("btnHomeDashboard");
const btnFotosDashboard = capturarItem("btnFotosDashboard");
const btnVideosDashboard = capturarItem("btnVideosDashboard");

//ocultar demas seccionesy dejar visible home
function mostrarSeccion(nombreVer) {
    const secciones = document.querySelectorAll(".container-content-dashboard");
    secciones.forEach(seccion => {
        seccion.style.display = "none";
    });
    const seccionVer = capturarItem(nombreVer);
    disableCheckboxes();
    seccionVer.style.display = "block";
}

btnHomeDashboard.addEventListener("click", () => {
    mostrarSeccion("sectionHomeDashboard");
    console.log("home dashboard");
});

btnFotosDashboard.addEventListener("click", () => {
    mostrarSeccion("sectionFotosDashboard");
    console.log("fotos dashboard");
});

btnVideosDashboard.addEventListener("click", () => {
    mostrarSeccion("sectionVideosDashboard");
    console.log("videos dashboard");
});

//inicializar vista dashboard
mostrarSeccion("sectionHomeDashboard");


//mostrar media del home
renderHome()


//funcion de subir foto
const btnSubirFoto = capturarItem("btn-subir");
btnSubirFoto.addEventListener("click", () => {
    UploadFile("photo")
});

//funcion de eliminar foto
function deleteFoto() {
  const seleccionadas = document.querySelectorAll(".checkbox-delete-file:checked");
 if(seleccionadas.length > 0) {
  mostrarMensaje(`Se eliminarán ${seleccionadas.length} fotos seleccionadas.`);
    seleccionadas.forEach(chk => {
    console.log("Checkbox seleccionado:", chk)
    const card = chk.id
    console.log("Eliminar foto asociada a la tarjeta:", card);
  });
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
  if (check.disabled){
    mostrarCard(check.id);
  }else{
    check.checked = !check.checked;  //  alterna el checkbox
    return};
  
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
document.getElementById("btnCancelDelete").addEventListener("click",async () => {
  const contentFotos = capturarItem("content-Fotos-dashboard");
  const btnCancelDelete = capturarItem("btnCancelDelete");
  disableCheckboxes();
  contentFotos.classList.remove("content-Fotos-dashboard-delete");
  btnCancelDelete.style.display = "none";
  let f =  await mostrarConfirmacion("¿Desea cancelar la eliminación de fotos?");
  console.log("Confirmación de cancelación:", f);
  
});