import { mostrarMensaje } from "./modalTexto.js";
import { fetchDataWithToken } from "./peticionServer.js";
const URL_API = "https://mivault.tailff2832.ts.net"
//obtener email del usuario guardado
const emailUserAguard = localStorage.getItem("user_email") || sessionStorage.getItem("user_email");
const nameUserActual = localStorage.getItem("user_name") || sessionStorage.getItem("user_name");
export async function changeDataUser(newNameUser = nameUserActual, newPassUser = null, actualPassUser) {
    try {
        let newDataUser = await {
            emailUser: emailUserAguard,
            passUser: actualPassUser,
            newPassUser,
            newNameUser
        }

        const response = await fetchDataWithToken(
            `${URL_API}/api/perfil/update`,
            "POST",
            newDataUser
        );
        return response
    } catch {
        return false
    }

}
