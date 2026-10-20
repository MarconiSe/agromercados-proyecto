import { apiFetch } from "./api.js";

const form =
    document.querySelector("#registro-form");

const mensaje =
    document.querySelector("#mensaje");

form.addEventListener("submit", async event => {
    event.preventDefault();

    mensaje.textContent = "";

    const nombre =
        document.querySelector("#nombre").value;

    const email =
        document.querySelector("#email").value;

    const password =
        document.querySelector("#password").value;

    try {
        await apiFetch(
            "/api/auth/register",
            {
                method: "POST",
                body: JSON.stringify({
                    nombre,
                    email,
                    password
                })
            }
        );

        mensaje.textContent =
            "Cuenta creada correctamente.";

        setTimeout(() => {
            window.location.href =
                "./login.html";
        }, 1000);

    } catch (error) {
        mensaje.textContent = error.message;
    }
});
