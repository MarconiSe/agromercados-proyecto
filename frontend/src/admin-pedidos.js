import { apiFetch } from "./api.js";

import {
    requerirRol,
    cerrarSesion
} from "./auth.js";

if (!requerirRol("Admin", "../login.html")) {
    throw new Error("Rol Admin requerido.");
}

const contenedor =
    document.querySelector("#pedidos");

const mensaje =
    document.querySelector("#mensaje");

const estados = [
    "Pendiente",
    "Confirmado",
    "Listo para retirar",
    "Entregado"
];

document
    .querySelector("#logout")
    .addEventListener(
        "click",
        () => cerrarSesion("../login.html")
    );

function formatearFecha(fecha) {
    return new Date(fecha)
        .toLocaleString(
            "es-SV",
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        );
}

async function actualizarEstado(
    pedidoId,
    select
) {
    try {
        await apiFetch(
            `/api/pedidos/${pedidoId}/estado`,
            {
                method: "PUT",
                auth: true,

                body: JSON.stringify({
                    estado: select.value
                })
            }
        );

        mensaje.textContent =
            "Estado actualizado correctamente.";

        await cargarPedidos();

    } catch (error) {
        mensaje.textContent = error.message;
    }
}

function renderPedidos(pedidos) {
    contenedor.innerHTML = "";

    pedidos.forEach(pedido => {

        const card =
            document.createElement("article");

        card.className = "admin-order";

        const opciones = estados
            .map(estado => `
                <option
                    value="${estado}"
                    ${estado === pedido.estado
                        ? "selected"
                        : ""}
                >
                    ${estado}
                </option>
            `)
            .join("");

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
                        Retiro:
                        ${formatearFecha(
                            pedido.fechaHoraRetiro
                        )}
                    </div>

                    <div>
                        Total:
                        $${pedido.total.toFixed(2)}
                    </div>
                </div>

                <div class="state-controls">

                    <select>
                        ${opciones}
                    </select>

                    <button
                        class="btn primary small"
                    >
                        Guardar
                    </button>

                </div>

            </div>

            <details>

                <summary>
                    Ver productos
                </summary>

                <ul>
                    ${items}
                </ul>

                <small>
                    Usuario:
                    ${pedido.usuarioId}
                </small>

            </details>
        `;

        const select =
            card.querySelector("select");

        card
            .querySelector("button")
            .addEventListener(
                "click",
                () =>
                    actualizarEstado(
                        pedido.id,
                        select
                    )
            );

        contenedor.appendChild(card);
    });
}

async function cargarPedidos() {
    try {
        const pedidos =
            await apiFetch(
                "/api/pedidos",
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
