
import { fetchData  } from "./sources/utils/peticionServer.js";
// funcion capyurar items 
function capItem(name) {
    let item = document.getElementById(name);
    return item;
}
//animacion de error 
function animarError(input) {
    input.classList.remove("shake-horizontal"); 
    void input.offsetWidth; 
    input.classList.add("shake-horizontal");
}
//definir host api
const HOST_API = "http://localhost:3000";
const btnChangePositionSvgLogin = document.getElementById("btnChangePositionSvgLogin");
const btnChangePositionSvgRegister = document.getElementById("btnChangePositionSvgRegister");

btnChangePositionSvgLogin.addEventListener("click", ()=>{
    document.getElementById("cardRegister").classList.remove("animate-enter");
    document.getElementById("cardRegister").classList.add("animate-enter");
    document.getElementById("cardLogin").classList.remove("animate-enter")
    document.getElementById("image-svg-slice-login").style.display = "none";
    document.getElementById("image-svg-slice-login").classList.remove("animate-exit");
    document.getElementById("image-svg-slice-register").classList.add("animate-enter");
    document.getElementById("image-svg-slice-register").style.display = "block";
    document.getElementById("svg-slice-container").classList.add("image-svg-slice-right")
    document.getElementById("svg-slice-container").classList.remove("image-svg-slice-left")
})
btnChangePositionSvgRegister.addEventListener("click", ()=>{
    document.getElementById("cardLogin").classList.remove("animate-enter");
    document.getElementById("cardLogin").classList.add("animate-enter");
    document.getElementById("cardRegister").classList.remove("animate-enter")
    document.getElementById("image-svg-slice-login").style.display = "block";
    document.getElementById("image-svg-slice-register").style.display = "none";
    document.getElementById("image-svg-slice-login").classList.add("animate-enter");
    document.getElementById("image-svg-slice-register").classList.remove("animate-exit");
    document.getElementById("svg-slice-container").classList.add("image-svg-slice-left")
    document.getElementById("svg-slice-container").classList.remove("image-svg-slice-right")
})

//funcione abrir modal de mensaje
function mostrarMensaje(mensaje) {
  const modal = document.getElementById('modalMensaje');
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
///captura registro usuario
const formularionuevoUsuario = capItem("formRegisterNewUser");
formularionuevoUsuario.addEventListener("submit", function(e) {
    e.preventDefault();
    let NewCorreo = document.getElementById("new-email").value.trim();
    let NewPass = document.getElementById("new-pass").value.trim();
    let ConfirmPass = document.getElementById("confirm-pass").value.trim();


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(NewCorreo)) {
        
        mostrarMensaje("Correo inválido");
        animarError(document.getElementById("new-email"));
        
        return;
    }

    if (NewPass.length < 8) {
        mostrarMensaje("La contraseña debe tener al menos 12 caracteres");
        animarError(document.getElementById("new-pass"));
        return;
    }

    if (NewPass !== ConfirmPass) {
        mostrarMensaje("Las contraseñas no coinciden");
        animarError(document.getElementById("new-pass"));
        animarError(document.getElementById("confirm-pass"));
        return;
    }
    if (!document.getElementById("terms").checked) {
        mostrarMensaje("Debes aceptar los términos y condiciones");
        animarError(document.getElementById("terms"));
        return;
    }

    // Si pasa todo, continuar
    mostrarMensaje("Formulario válido, enviando...");
    async function confirmacionRegistro() {
    const response = await fetchData(`${HOST_API}/api/register`, "POST", { emailNewUser: NewCorreo, passNewUser: NewPass })
    if(response.status !== 201) {
        console.log(response)
        mostrarMensaje("Ya existe un usuario registrado con ese correo electrónico.");
    } else {
        mostrarMensaje("¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.");
        formularionuevoUsuario.reset();
        btnChangePositionSvgRegister.click()
    }
};
   confirmacionRegistro();
   
    
});
//captura login usuario
const formularioLoginUsuario = capItem("formLoginUser");
formularioLoginUsuario.addEventListener("submit", function(e) {
    e.preventDefault();
    let emailLogin = document.getElementById("email-login").value.trim();
    let passLogin = document.getElementById("pass-login").value.trim();
    let savesession = document.getElementById("RecordUser").checked; 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLogin)) {
        mostrarMensaje("Correo inválido");
        animarError(document.getElementById("email-login"));
        return;
    }


    
    async function confirmacionLogin() {
        const response = await fetchData(`${HOST_API}/api/login`, "POST", { email: emailLogin, password: passLogin });
        if (response.error) {
            mostrarMensaje("Datos de login incorrectos");
            console.log(response)
        } else {
            if (savesession) {
                localStorage.setItem("token", response.token);
            } else {
                sessionStorage.setItem("token", response.token);
                localStorage.removeItem("token");
            }
            window.location.href = "./sources/dashboard.html";
        }
    }
    confirmacionLogin();

    
});