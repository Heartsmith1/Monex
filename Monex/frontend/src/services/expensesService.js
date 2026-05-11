const API_URL = "http://localhost:8083/api/expenses";

export const crearGasto = async (gasto) => {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(gasto),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error backend:", errorText);
        console.error("Status:", response.status);
        throw new Error(errorText || "Error al crear gasto");
    }

    return await response.json();
};

export const obtenerGastos = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error backend:", errorText);
        console.error("Status:", response.status);
        throw new Error(errorText || "Error al obtener gastos");
    }

    return await response.json();
};

export const obtenerEstimacionMensual = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/monthly-estimate`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error backend:", errorText);
        console.error("Status:", response.status);
        throw new Error(errorText || "Error al obtener estimación mensual");
    }

    return await response.json();
};

export const actualizarGasto = async (id, gasto) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(gasto),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error backend:", errorText);
        console.error("Status:", response.status);
        throw new Error(errorText || "Error al actualizar gasto");
    }

    return await response.json();
};