import { apiFetch } from "./api.js";

import {
    requerirRol,
    cerrarSesion
} from "./auth.js";

if (!requerirRol("Cliente", "./login.html")) {
    throw new Error("Rol Cliente requerido.");
}

document
    .querySelector("#logout")
    .addEventListener(
        "click",
        () => cerrarSesion("./login.html")
    );

const contenedor =
    document.querySelector("#pedidos");

const mensaje =
    document.querySelector("#mensaje");

function formatearFecha(fecha) {
    return new Date(fecha)
        .toLocaleDateString("es-SV");
}

function formatearHora(fecha) {
    return new Date(fecha)
        .toLocaleTimeString(
            "es-SV",
            { timeStyle: "short" }
        );
}

function renderPedidos(pedidos) {
    contenedor.innerHTML = "";

    if (pedidos.length === 0) {
        contenedor.innerHTML =
            "<p>No tienes pedidos todavía.</p>";

        return;
    }

    pedidos.forEach(pedido => {

        const card =
            document.createElement("article");

        card.className = "order-card";

        const items = pedido.items
            .map(item => `
                <li>
                    ${item.nombre}
                    × ${item.cantidad}
                    — $${(
                        item.precioUnitario *
                        item.cantidad
                    ).toFixed(2)}
                </li>
            `)
            .join("");

        card.innerHTML = `
            <h2>
                Pedido #${pedido.id.slice(-6)}
            </h2>

            <dl class="datos">
                <dt>Fecha</dt>
                <dd>${formatearFecha(pedido.fechaHoraRetiro)}</dd>

                <dt>Total</dt>
                <dd>$${pedido.total.toFixed(2)}</dd>

                <dt>Retiro</dt>
                <dd>${formatearHora(pedido.fechaHoraRetiro)}</dd>

                <dt>Estado</dt>
                <dd>${pedido.estado}</dd>
            </dl>

            <details>
                <summary>
                    VER DETALLE
                </summary>

                <ul>
                    ${items}
                </ul>
            </details>
        `;

        contenedor.appendChild(card);
    });
}

async function cargarPedidos() {
    try {
        const pedidos =
            await apiFetch(
                "/api/pedidos/mis-pedidos",
                {
                    auth: true
                }
            );

        renderPedidos(pedidos);

    } catch (error) {
        mensaje.textContent = error.message;
    }
}

cargarPedidos();
