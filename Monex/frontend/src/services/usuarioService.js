const API_URL = "http://localhost:8081/api/auth/register";
const API_CONFIG_TARJETA = "http://localhost:8081/api/tarjeta/configuracion";

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
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al obtener configuración de tarjeta");
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
            "Authorization": `Bearer ${token}`,
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
