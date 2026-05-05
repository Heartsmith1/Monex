const API_URL = "http://localhost:8081/api/auth/register";

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
