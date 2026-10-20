import { API_URL } from "./config.js";
import { obtenerToken } from "./auth.js";

export async function apiFetch(
    endpoint,
    {
        method = "GET",
        body = null,
        auth = false,
        headers = {}
    } = {}
) {
    const requestHeaders = new Headers(headers);

    if (body !== null) {
        requestHeaders.set(
            "Content-Type",
            "application/json"
        );
    }

    if (auth) {
        const token = obtenerToken();

        if (token) {
            requestHeaders.set(
                "Authorization",
                `Bearer ${token}`
            );
        }
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            method,
            headers: requestHeaders,
            body
        }
    );

    const text = await response.text();

    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        let mensaje = `Error ${response.status}`;

        if (data?.mensaje) {
            mensaje = data.mensaje;
        } else if (data?.title) {
            mensaje = data.title;
        } else if (Array.isArray(data)) {
            mensaje = data
                .map(error =>
                    error.description ?? error.code
                )
                .join(" ");
        }

        const error = new Error(mensaje);

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}
