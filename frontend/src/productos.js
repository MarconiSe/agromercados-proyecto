import { apiFetch } from "./api.js";

import {
    estaAutenticado,
    tieneRol,
    cerrarSesion
} from "./auth.js";

const contenedor =
    document.querySelector("#productos");

const mensaje =
    document.querySelector("#mensaje");

const cartCount =
    document.querySelector("#cart-count");

const navLogin =
    document.querySelector("#nav-login");

const navLogout =
    document.querySelector("#nav-logout");

const navAdmin =
    document.querySelector("#nav-admin");

const navPedidos =
    document.querySelector("#nav-pedidos");

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

    actualizarContador();
}

function actualizarContador() {
    const carrito = obtenerCarrito();

    cartCount.textContent = carrito.reduce(
        (total, item) =>
            total + item.cantidad,
        0
    );
}

function configurarNavegacion() {
    if (estaAutenticado()) {
        navLogin.hidden = true;
        navLogout.hidden = false;

        navLogout.addEventListener(
            "click",
            () => cerrarSesion("./login.html")
        );

        if (tieneRol("Admin")) {
            navAdmin.hidden = false;
            navPedidos.hidden = true;
            document.querySelector("#nav-carrito").hidden = true;
        }

    } else {
        navPedidos.hidden = true;
    }
}

function agregarProducto(producto) {
    const carrito = obtenerCarrito();

    const existente = carrito.find(
        item => item.productoId === producto.id
    );

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            productoId: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
}

function renderProductos(productos) {
    contenedor.innerHTML = "";

    const disponibles =
        productos.filter(producto => producto.disponible);

    const categorias = [
        ...new Set(
            disponibles.map(producto => producto.categoria)
        )
    ];

    categorias.forEach(categoria => {

        const titulo =
            document.createElement("h2");

        titulo.className = "seccion";
        titulo.textContent = categoria;

        const grid =
            document.createElement("div");

        grid.className = "product-grid";

        disponibles
            .filter(producto => producto.categoria === categoria)
            .forEach(producto => {

                const card =
                    document.createElement("article");

                card.className = "product-card";

                card.innerHTML = `
                    <div class="product-image">
                        <img
                            src="./img/${producto.imagenUrl}"
                            alt="${producto.nombre}"
                        >
                    </div>

                    <span>${producto.nombre}</span>

                    <small>
                        ${producto.descripcion}
                    </small>

                    <strong>
                        $${producto.precio.toFixed(2)}
                    </strong>

                    <button class="btn primary small">
                        Agregar
                    </button>
                `;

                card
                    .querySelector("img")
                    .addEventListener(
                        "error",
                        event => event.target.replaceWith(
                            producto.nombre.charAt(0)
                        )
                    );

                card
                    .querySelector("button")
                    .addEventListener(
                        "click",
                        () => agregarProducto(producto)
                    );

                grid.appendChild(card);
            });

        contenedor.append(titulo, grid);
    });
}

async function cargarProductos() {
    try {
        const productos =
            await apiFetch("/api/productos");

        renderProductos(productos);

    } catch (error) {
        mensaje.textContent = error.message;
    }
}

configurarNavegacion();
actualizarContador();
cargarProductos();
