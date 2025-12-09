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