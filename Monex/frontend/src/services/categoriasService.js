const API_URL = "http://localhost:8082/api/categorias";

function obtenerToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No hay token guardado. Debes iniciar sesión primero.");
    }

    return token;
}

export async function obtenerCategorias() {
    const token = obtenerToken();

    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al obtener categorías");
    }

    return await response.json();
}

export async function crearCategoria(nombre) {
    const token = obtenerToken();

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: nombre,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al crear categoría");
    }

    return await response.json();
}

export async function editarCategoria(id, nombre) {
    const token = obtenerToken();

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: nombre,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al editar categoría");
    }

    return await response.json();
}


export async function eliminarCategoria(id) {
    const token = obtenerToken();

    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al eliminar categoría");
    }
}