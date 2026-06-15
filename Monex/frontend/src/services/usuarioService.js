const API_URL = "http://localhost:8081/api/auth/register";
const API_CONFIG_TARJETA = "http://localhost:8081/api/tarjeta/configuracion";
const API_USERS = "http://localhost:8081/api/users";

export async function registrarUsuario({ username, email, password }) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            email,
            password,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al registrar usuario");
    }

    return await response.json();
}

export async function obtenerConfiguracionTarjeta() {
    const token = localStorage.getItem("token");

    const response = await fetch(API_CONFIG_TARJETA, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Debe configurar su tarjeta de crédito para acceder a esta información");
    }

    return await response.json();
}

export async function guardarConfiguracionTarjeta({
    fechaFacturacion,
    sueldoMes,
    cupoTarjeta,
}) {
    const token = localStorage.getItem("token");

    const response = await fetch(API_CONFIG_TARJETA, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            fechaFacturacion,
            sueldoMes,
            cupoTarjeta,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al guardar configuración de tarjeta");
    }

    return await response.json();
}

export async function eliminarConfiguracionTarjeta() {
    const token = localStorage.getItem("token");

    const response = await fetch(API_CONFIG_TARJETA, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok && response.status !== 404) {
        const error = await response.text();
        throw new Error(error || "Error al eliminar configuración de tarjeta");
    }

    return response;
}

export async function actualizarRolUsuario(usuario, role) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No hay token de autenticación.");
    }

    const id =
        usuario?.id ||
        usuario?._id ||
        usuario?.userId ||
        usuario?.idUsuario ||
        usuario?.usuarioId ||
        usuario?.usuario_id ||
        usuario?.id_user ||
        usuario?.id_usuario;

    if (!id) {
        throw new Error("No se pudo identificar el usuario.");
    }

    const roleValue = String(role || "").trim().toUpperCase();

    if (roleValue !== "USER" && roleValue !== "ADMIN") {
        throw new Error("Rol inválido. Solo se permite USER o ADMIN.");
    }

    const response = await fetch(`http://localhost:8081/api/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            role: roleValue,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Error al actualizar el rol (status ${response.status})`);
    }

    return await response.json();
}