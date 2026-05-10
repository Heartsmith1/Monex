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
        throw new Error("Error al crear gasto");
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
        throw new Error("Error al obtener gastos");
    }

    return await response.json();
};