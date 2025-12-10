export async function fetchData(apiUrl, metodo = "GET", datosEnviar = null) {
    try {
        const opciones = {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            }
        };

        // Si hay datos para enviar, se agregan al body
        if (datosEnviar) {
            opciones.body = JSON.stringify(datosEnviar);
        }

        const respuesta = await fetch(apiUrl, opciones);

        // Detectar error HTTP
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        // Convertir respuesta a JSON
        const data = await respuesta.json();
        return data;

    } catch (error) {
        console.error("Error en fetchData:", error);
        return { error: true, mensaje: error.message };
    }
}
export async function fetchDataWithToken(apiUrl, metodo = "GET", datosEnviar = null) {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        const opciones = {
            method: metodo,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };

        // Detectar si es FormData o JSON
        if (datosEnviar instanceof FormData) {
            opciones.body = datosEnviar;
        } else if (datosEnviar) {
            opciones.headers["Content-Type"] = "application/json";
            opciones.body = JSON.stringify(datosEnviar);
        }

        const respuesta = await fetch(apiUrl, opciones);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        return await respuesta.json();

    } catch (error) {
        console.error("Error en fetchDatawithtoken:", error);
        return {
            error: true,
            mensaje: error.message
        };
    }
}