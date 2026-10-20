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
        .toLocaleString(
            "es-SV",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
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
            <div class="order-header">
                <div>
                    <strong>
                        Pedido
                        ${pedido.id.slice(-6)}
                    </strong>

                    <div>
                        ${formatearFecha(
                            pedido.fechaPedido
                        )}
                    </div>
                </div>

                <span class="status">
                    ${pedido.estado}
                </span>
            </div>

            <p>
                <strong>Retiro:</strong>
                ${formatearFecha(
                    pedido.fechaHoraRetiro
                )}
            </p>

            <p>
                <strong>Total:</strong>
                $${pedido.total.toFixed(2)}
            </p>

            <details>
                <summary>
                    Ver detalle
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
