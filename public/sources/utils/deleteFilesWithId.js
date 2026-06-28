import { mostrarMensaje } from "./modalTexto.js";
import { fetchDataWithToken } from "./peticionServer.js";
const URL_API = "https://mivault.tailff2832.ts.net"

export async function deleteFilesWithIds(ids , type) {
    if (ids && type) {
        const response = await fetchDataWithToken(
                    `${URL_API}/api/files/delfiles`,
                    "POST",
                    {idFile : ids , fileType : type}
                );
        return response

    } 

}
