import { apiFetch } from "./api.js";

import {
    requerirRol,
    cerrarSesion
} from "./auth.js";

if (!requerirRol("Admin", "../login.html")) {
    throw new Error("Rol Admin requerido.");
}

const tbody =
    document.querySelector("#productos");

const form =
    document.querySelector("#producto-form");

const mensaje =
    document.querySelector("#mensaje");

const formTitle =
    document.querySelector("#form-title");

const cancelar =
    document.querySelector("#cancelar");

let productos = [];
let editandoId = null;

document
    .querySelector("#logout")
    .addEventListener(
        "click",
        () => cerrarSesion("../login.html")
    );

function limpiarFormulario() {
    editandoId = null;

    form.reset();

    document.querySelector("#disponible").value =
        "true";

    formTitle.textContent =
        "Nuevo producto";
}

function editarProducto(producto) {
    editandoId = producto.id;

    document.querySelector("#nombre").value =
        producto.nombre;

    document.querySelector("#descripcion").value =
        producto.descripcion;

    document.querySelector("#categoria").value =
        producto.categoria;

    document.querySelector("#precio").value =
        producto.precio;

    document.querySelector("#disponible").value =
        producto.disponible.toString();

    document.querySelector("#imagenUrl").value =
        producto.imagenUrl ?? "";

    formTitle.textContent =
        "Editar producto";
}

async function eliminarProducto(id) {
    if (!confirm("¿Eliminar este producto?")) {
        return;
    }

    try {
        await apiFetch(
            `/api/productos/${id}`,
            {
                method: "DELETE",
                auth: true
            }
        );

        await cargarProductos();

    } catch (error) {
        mensaje.textContent = error.message;
    }
}

function renderProductos() {
    tbody.innerHTML = "";

    productos.forEach(producto => {

        const tr =
            document.createElement("tr");

        tr.innerHTML = `
            <td>${producto.nombre}</td>

            <td>
                $${producto.precio.toFixed(2)}
            </td>

            <td>
                ${producto.disponible ? "Sí" : "No"}
            </td>

            <td>
                <button
                    class="btn secondary small editar"
                >
                    Editar
                </button>

                <button
                    class="btn danger small eliminar"
                >
                    Eliminar
                </button>
            </td>
        `;

        tr
            .querySelector(".editar")
            .addEventListener(
                "click",
                () => editarProducto(producto)
            );

        tr
            .querySelector(".eliminar")
            .addEventListener(
                "click",
                () => eliminarProducto(producto.id)
            );

        tbody.appendChild(tr);
    });
}

async function cargarProductos() {
    productos =
        await apiFetch("/api/productos");

    renderProductos();
}

form.addEventListener(
    "submit",
    async event => {
        event.preventDefault();

        const producto = {
            nombre:
                document.querySelector("#nombre").value,

            descripcion:
                document.querySelector("#descripcion").value,

            categoria:
                document.querySelector("#categoria").value,

            precio:
                Number(
                    document.querySelector("#precio").value
                ),

            disponible:
                document.querySelector("#disponible").value
                === "true",

            imagenUrl:
                document.querySelector("#imagenUrl").value
        };

        try {
            if (editandoId) {
                await apiFetch(
                    `/api/productos/${editandoId}`,
                    {
                        method: "PUT",
                        auth: true,
                        body:
                            JSON.stringify(producto)
                    }
                );

                mensaje.textContent =
                    "Producto actualizado.";
            } else {
                await apiFetch(
                    "/api/productos",
                    {
                        method: "POST",
                        auth: true,
                        body:
                            JSON.stringify(producto)
                    }
                );

                mensaje.textContent =
                    "Producto creado.";
            }

            limpiarFormulario();

            await cargarProductos();

        } catch (error) {
            mensaje.textContent = error.message;
        }
    }
);

cancelar.addEventListener(
    "click",
    limpiarFormulario
);

cargarProductos().catch(error => {
    mensaje.textContent = error.message;
});
