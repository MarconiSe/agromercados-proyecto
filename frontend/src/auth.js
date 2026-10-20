const TOKEN_KEY = "agromercados_token";
const USER_KEY = "agromercados_usuario";

export function guardarSesion(token, usuario) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(
        USER_KEY,
        JSON.stringify(usuario)
    );
}

export function obtenerToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}

export function obtenerUsuario() {
    const usuario = sessionStorage.getItem(USER_KEY);

    if (!usuario) {
        return null;
    }

    return JSON.parse(usuario);
}

export function estaAutenticado() {
    return obtenerToken() !== null;
}

export function tieneRol(rol) {
    const usuario = obtenerUsuario();

    if (!usuario || !usuario.roles) {
        return false;
    }

    return usuario.roles.includes(rol);
}

export function cerrarSesion(redireccion = "/login.html") {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    window.location.href = redireccion;
}

export function requerirSesion(
    redireccion = "/login.html"
) {
    if (!estaAutenticado()) {
        window.location.href = redireccion;
        return false;
    }

    return true;
}

export function requerirRol(
    rol,
    redireccion = "/login.html"
) {
    if (!estaAutenticado() || !tieneRol(rol)) {
        window.location.href = redireccion;
        return false;
    }

    return true;
}
