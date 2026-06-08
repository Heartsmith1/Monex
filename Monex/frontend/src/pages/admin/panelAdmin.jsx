import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { SideBarAdmin } from "../../components/SideBar/SideBarAdmin";
import "../../css/pages/panelAdmin.css";

export function PanelAdmin(){
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({ username: "Usuario", email: "" });
    const [usuarios, setUsuarios] = useState([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(true);

    useEffect(() => {
        const cargarUsuario = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {
                const response = await fetch("http://localhost:8081/api/auth/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                setUsuario({
                    username: data.username || "Usuario",
                    email: data.email || "",
                });
            } catch (error) {
                console.error("Error al cargar usuario:", error);
            }
        };

        cargarUsuario();
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        setLoadingUsuarios(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8081/api/users", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return setUsuarios([]);
            const data = await res.json();
            setUsuarios(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error cargando usuarios:", err);
            setUsuarios([]);
        } finally {
            setLoadingUsuarios(false);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("usuario");
        navigate("/");
    };

    const handleEliminarUsuario = async (id) => {
        if (!window.confirm("¿Eliminar usuario? Esta acción no se puede deshacer.")) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8081/api/users/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error al eliminar");
            await cargarUsuarios();
        } catch (err) {
            console.error(err);
            alert("No se pudo eliminar el usuario.");
        }
    };

    function UsersPerMonthChart({ users }) {
        const months = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                key: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`,
                label: d.toLocaleString('es-ES', { month: 'short' }).replace('.', '')
            });
        }

        const counts = Object.fromEntries(months.map((m) => [m.key, 0]));
        const dateFields = ['createdAt', 'created_at', 'registeredAt', 'registered_at', 'fechaRegistro', 'created', 'created_at'];

        users.forEach((u) => {
            let dateVal = null;
            for (const f of dateFields) {
                if (u[f]) {
                    dateVal = u[f];
                    break;
                }
            }
            if (!dateVal && u.metadata && u.metadata.created) dateVal = u.metadata.created;
            if (!dateVal) return;
            const d = new Date(dateVal);
            if (isNaN(d)) return;
            const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
            if (counts[key] !== undefined) counts[key] += 1;
        });

        const values = months.map((m) => counts[m.key]);
        const max = Math.max(...values, 1);

        return (
            <div className="chart_container">
                <div className="chart_title">Usuarios registrados por mes</div>
                <div className="chart_bars">
                    {values.map((v, i) => {
                        const heightPercent = Math.round((v / max) * 100);
                        return (
                            <div className="chart_column" key={months[i].key}>
                                <div className="bar_value">{v}</div>
                                <div className="bar_wrap">
                                    <div className="bar_fill" style={{ height: `${heightPercent}%` }} />
                                </div>
                                <div className="bar_label">{months[i].label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return(
        <div className="contenedor_Home">
            <SideBarAdmin />

            <div className="contenido_Home">
                <Navbar />

                <div className="contenido_Admin">
                    <main className="admin-dashboard">

                        <section className="overview">
                            <h1 className="page-title">Panel Admin</h1>
                            <p>Bienvenido al panel.</p>
                            <p>Aquí irán las estadísticas de usuarios del sistema.</p>

                            <UsersPerMonthChart users={usuarios} />

                            <div className="tabla_Usuarios">
                                {loadingUsuarios ? (
                                    <p>Cargando usuarios...</p>
                                ) : (
                                    <>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Nombre</th>
                                                    <th>Email</th>
                                                    <th style={{width: '180px'}}>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {usuarios.length === 0 ? (
                                                    <tr><td colSpan={3}>No hay usuarios registrados.</td></tr>
                                                ) : (
                                                    usuarios.map((u) => (
                                                        <tr key={u.id || u._id || u.username}>
                                                            <td>{u.username || u.name || '-'}</td>
                                                            <td>{u.email || '-'}</td>
                                                            <td>
                                                                <button className="btn_editar">Editar</button>
                                                                <button className="btn_eliminar" onClick={() => handleEliminarUsuario(u.id || u._id)}>Eliminar</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                        <div className="paginacion_Usuarios">Mostrando {usuarios.length} usuarios</div>
                                    </>
                                )}
                            </div>
                        </section>
                    </main>
                </div>

            </div>
        </div>
    )
}