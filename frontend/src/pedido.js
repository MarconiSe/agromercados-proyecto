import { apiFetch } from "./api.js";

import {
    requerirSesion,
    tieneRol,
    cerrarSesion
} from "./auth.js";

if (!requerirSesion("./login.html")) {
    throw new Error("Sesión requerida.");
}

if (!tieneRol("Cliente")) {
    window.location.href =
        "./admin/pedidos.html";
}

document
    .querySelector("#logout")
    .addEventListener(
        "click",
        () => cerrarSesion("./login.html")
    );

const carritoContainer =
    document.querySelector("#carrito");

const totalElement =
    document.querySelector("#total");

const form =
    document.querySelector("#pedido-form");

const agromercadoSelect =
    document.querySelector("#agromercado");

const horarioSelect =
    document.querySelector("#horario");

const fechaInput =
    document.querySelector("#fecha");

const mensaje =
    document.querySelector("#mensaje");

let agromercados = [];

function obtenerCarrito() {
    return JSON.parse(
        sessionStorage.getItem("carrito") ?? "[]"
    );
}

function guardarCarrito(carrito) {
    sessionStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    renderCarrito();
}

function calcularTotal(carrito) {
    return carrito.reduce(
        (total, item) =>
            total +
            item.precio * item.cantidad,
        0
    );
}

function renderCarrito() {
    const carrito = obtenerCarrito();

    carritoContainer.innerHTML = "";

    if (carrito.length === 0) {
        carritoContainer.innerHTML = `
            <p>
                No tienes productos en el pedido.
            </p>
        `;

        form.hidden = true;
        totalElement.textContent = "$0.00";

        return;
    }

    form.hidden = false;

    carrito.forEach(item => {

        const fila =
            document.createElement("div");

        fila.className = "cart-row";

        fila.innerHTML = `
            <div>
                <strong>${item.nombre}</strong>
                <div>
                    $${item.precio.toFixed(2)}
                </div>
            </div>

            <input
                type="number"
                min="1"
                value="${item.cantidad}"
            >

            <button
                class="btn danger small"
                type="button"
            >
                Quitar
            </button>
        `;

        const cantidadInput =
            fila.querySelector("input");

        cantidadInput.addEventListener(
            "change",
            () => {
                item.cantidad =
                    Math.max(
                        1,
                        Number(cantidadInput.value)
                    );

                guardarCarrito(carrito);
            }
        );

        fila
            .querySelector("button")
            .addEventListener(
                "click",
                () => {
                    const actualizado =
                        carrito.filter(
                            producto =>
                                producto.productoId !==
                                item.productoId
                        );

                    guardarCarrito(actualizado);
                }
            );

        carritoContainer.appendChild(fila);
    });

    totalElement.textContent =
        `$${calcularTotal(carrito).toFixed(2)}`;
}

function cargarHorarios() {
    const id = agromercadoSelect.value;

    const agromercado =
        agromercados.find(
            item => item.id === id
        );

    horarioSelect.innerHTML = "";

    if (!agromercado) {
        return;
    }

    agromercado.horariosRetiro.forEach(
        horario => {
            const option =
                document.createElement("option");

            option.value = horario;
            option.textContent = horario;

            horarioSelect.appendChild(option);
        }
    );
}

async function cargarAgromercados() {
    agromercados =
        await apiFetch("/api/agromercados");

    agromercadoSelect.innerHTML = "";

    agromercados.forEach(agromercado => {
        const option =
            document.createElement("option");

        option.value = agromercado.id;

        option.textContent =
            `${agromercado.nombre} - ${agromercado.ubicacion}`;

        agromercadoSelect.appendChild(option);
    });

    cargarHorarios();
}

form.addEventListener(
    "submit",
    async event => {
        event.preventDefault();

        mensaje.textContent = "";

        const carrito = obtenerCarrito();

        const fechaHoraRetiro =
            `${fechaInput.value}T${horarioSelect.value}:00`;

        try {
            await apiFetch(
                "/api/pedidos",
                {
                    method: "POST",
                    auth: true,

                    body: JSON.stringify({
                        agromercadoId:
                            agromercadoSelect.value,

                        fechaHoraRetiro,

                        items: carrito.map(item => ({
                            productoId:
                                item.productoId,

                            cantidad:
                                item.cantidad
                        }))
                    })
                }
            );

            sessionStorage.removeItem("carrito");

            mensaje.innerHTML = `
                Pedido creado correctamente.
                <a href="./mis-pedidos.html">
                    Ver mis pedidos
                </a>
            `;

            renderCarrito();

        } catch (error) {
            mensaje.textContent = error.message;
        }
    }
);

agromercadoSelect.addEventListener(
    "change",
    cargarHorarios
);

const hoy = new Date();

const anio = hoy.getFullYear();

const mes = String(
    hoy.getMonth() + 1
).padStart(2, "0");

const dia = String(
    hoy.getDate()
).padStart(2, "0");

fechaInput.min =
    `${anio}-${mes}-${dia}`;

renderCarrito();

cargarAgromercados().catch(error => {
    mensaje.textContent = error.message;
});
