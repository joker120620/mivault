import { mostrarMensaje } from "./modalTexto.js";
import { fetchDataWithToken } from "./peticionServer.js";
const URL_API = "http://localhost:3000"

export async function deleteFilesWithIds(ids, type) {
    if (ids && type) {
        const response = await fetchDataWithToken(
            `${URL_API}/api/files/delfiles`,
            "POST",
            { idFile: ids, fileType: type }
        );
        return response

    }

}
