import { apiFetch } from "./api.js";

import {
    guardarSesion
} from "./auth.js";

const form = document.querySelector("#login-form");
const mensaje = document.querySelector("#mensaje");

form.addEventListener("submit", async event => {
    event.preventDefault();

    mensaje.textContent = "";

    const email =
        document.querySelector("#email").value;

    const password =
        document.querySelector("#password").value;

    try {
        const respuesta = await apiFetch(
            "/api/auth/login",
            {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        guardarSesion(
            respuesta.token,
            respuesta.usuario
        );

        if (
            respuesta.usuario.roles.includes("Admin")
        ) {
            window.location.href =
                "./admin/pedidos.html";
        } else {
            window.location.href =
                "./index.html";
        }

    } catch (error) {
        mensaje.textContent = error.message;
    }
});
