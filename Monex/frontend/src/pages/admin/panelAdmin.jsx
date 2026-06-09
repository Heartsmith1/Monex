import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { SideBarSwitcher } from "../../components/SideBar/SideBarSwitcher";
import "../../css/pages/panelAdmin.css";

export function PanelAdmin(){
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({ username: "Usuario", email: "" });
    const [usuarios, setUsuarios] = useState([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(true);
    const [estadisticasUsuarios, setEstadisticasUsuarios] = useState([]);
    const [loadingEstadisticas, setLoadingEstadisticas] = useState(true);
    const [paginaActual, setPaginaActual] = useState(0);
    const usuariosPorPagina = 5;
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalElementos, setTotalElementos] = useState(0);

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
        cargarUsuarios(paginaActual);
        cargarEstadisticasUsuarios();
    }, [paginaActual]);

    const cargarUsuarios = async (pagina = paginaActual) => {
        setLoadingUsuarios(true);
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8081/api/users/admin?page=${pagina}&size=${usuariosPorPagina}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) return setUsuarios([]);
            const data = await response.json();
            
            // Extraer usuarios
            const usuariosData = data.content || data.usuarios || data.users || data.results || [];
            
            // Extraer información de paginación
            setUsuarios(usuariosData);
            setTotalPaginas(data.totalPages || 0);
            setTotalElementos(data.totalElements || data.total || 0);
        } catch (err) {
            console.error("Error cargando usuarios:", err);
            setUsuarios([]);
        } finally {
            setLoadingUsuarios(false);
        }
    };

    const cargarEstadisticasUsuarios = async () => {
        setLoadingEstadisticas(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8081/api/users/admin/stats/users-by-month", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) return setEstadisticasUsuarios([]);
            const data = await response.json();
            const statsData = Array.isArray(data)
                ? data
                : Array.isArray(data.stats)
                ? data.stats
                : Array.isArray(data.results)
                ? data.results
                : Array.isArray(data.data)
                ? data.data
                : Array.isArray(data.usuarios)
                ? data.usuarios
                : Array.isArray(data.users)
                ? data.users
                : data;
            setEstadisticasUsuarios(statsData);
        } catch (err) {
            console.error("Error cargando estadísticas de usuarios:", err);
            setEstadisticasUsuarios([]);
        } finally {
            setLoadingEstadisticas(false);
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
            const response = await fetch(`http://localhost:8081/api/usuarios/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Error al eliminar");
            
            // Si es el último usuario en la página y no es la primera página, retroceder
            const nuevaPagina = usuarios.length === 1 && paginaActual > 0 ? paginaActual - 1 : paginaActual;
            setPaginaActual(nuevaPagina);
            cargarUsuarios(nuevaPagina);
        } catch (err) {
            console.error(err);
            alert("No se pudo eliminar el usuario.");
        }
    };

    function UsersPerMonthChart({ stats, users }) {
        const months = [
            { key: '01', label: 'ene' },
            { key: '02', label: 'feb' },
            { key: '03', label: 'mar' },
            { key: '04', label: 'abr' },
            { key: '05', label: 'may' },
            { key: '06', label: 'jun' },
            { key: '07', label: 'jul' },
            { key: '08', label: 'ago' },
            { key: '09', label: 'sept' },
            { key: '10', label: 'oct' },
            { key: '11', label: 'nov' },
            { key: '12', label: 'dic' },
        ];

        const counts = Object.fromEntries(months.map((m) => [m.key, 0]));

        const parseMonthKey = (value) => {
            if (value == null) return null;
            if (typeof value === 'number') {
                const month = value.toString().padStart(2, '0');
                return month.length === 2 && Number(month) >= 1 && Number(month) <= 12 ? month : null;
            }
            const month = String(value).trim().toLowerCase();
            const monthNumber = Number(month);
            if (!Number.isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
                return monthNumber.toString().padStart(2, '0');
            }
            if (/^\d{4}-\d{2}$/.test(month)) return month.slice(5);
            if (/^\d{4}\/\d{2}$/.test(month)) return month.slice(5);
            if (/^\d{4}-\d{2}-\d{2}$/.test(month)) return month.slice(5, 7);
            if (/^\d{2}-\d{4}$/.test(month)) return month.slice(0, 2);
            if (/^\d{2}\/\d{4}$/.test(month)) return month.slice(0, 2);
            const monthNames = {
                enero: '01', ene: '01', febrero: '02', feb: '02', marzo: '03', mar: '03', abril: '04', abr: '04', mayo: '05', may: '05', junio: '06', jun: '06', julio: '07', jul: '07', agosto: '08', ago: '08', septiembre: '09', sept: '09', sep: '09', octubre: '10', oct: '10', noviembre: '11', nov: '11', diciembre: '12', dic: '12',
                january: '01', jan: '01', february: '02', feb: '02', march: '03', mar: '03', april: '04', apr: '04', may: '05', june: '06', jun: '06', july: '07', jul: '07', august: '08', aug: '08', september: '09', sept: '09', sep: '09', october: '10', oct: '10', november: '11', nov: '11', december: '12', dec: '12',
            };
            if (monthNames[month]) return monthNames[month];
            const parsed = new Date(month);
            if (!isNaN(parsed)) {
                return (parsed.getMonth() + 1).toString().padStart(2, '0');
            }
            return null;
        };

        const parseCountValue = (entry) => {
            if (entry == null) return 0;
            if (typeof entry === 'number') return entry;
            if (typeof entry === 'string') {
                const parsed = Number(entry);
                return Number.isNaN(parsed) ? 0 : parsed;
            }
            const count = entry.count ?? entry.cantidad ?? entry.value ?? entry.users ?? entry.total ?? entry.quantity ?? entry.num ?? entry.cantidadUsuarios;
            if (typeof count === 'number') return count;
            if (typeof count === 'string') {
                const parsed = Number(count);
                return Number.isNaN(parsed) ? 0 : parsed;
            }
            const numeric = Object.values(entry).find((v) => typeof v === 'number');
            return typeof numeric === 'number' ? numeric : 0;
        };

        const addStat = (monthKey, countValue) => {
            if (!monthKey || Number.isNaN(countValue)) return;
            if (counts[monthKey] !== undefined) {
                counts[monthKey] = Number(countValue);
            }
        };

        if (stats) {
            if (Array.isArray(stats) && stats.length > 0) {
                stats.forEach((entry) => {
                    const monthKey = parseMonthKey(entry.month ?? entry.mes ?? entry.label ?? entry.fecha ?? entry.date ?? entry._id ?? entry.key);
                    addStat(monthKey, parseCountValue(entry));
                });
            } else if (typeof stats === 'object' && !Array.isArray(stats)) {
                Object.entries(stats).forEach(([key, value]) => {
                    const monthKey = parseMonthKey(key);
                    const countValue = typeof value === 'object' ? parseCountValue(value) : parseCountValue(value);
                    addStat(monthKey, countValue);
                });
            }
        }

        if (!stats || (Array.isArray(stats) && stats.length === 0)) {
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
                const parsedKey = parseMonthKey(dateVal);
                if (parsedKey && counts[parsedKey] !== undefined) counts[parsedKey] += 1;
            });
        }

        const values = months.map((m) => counts[m.key]);
        const max = Math.max(...values, 1);
        const totalCount = values.reduce((sum, value) => sum + Number(value || 0), 0);

        return (
            <div className="chart_container">
                <div className="chart_title">Usuarios registrados por mes</div>
                <div className="chart_total">Total registrados: {totalCount}</div>
                <div className="chart_bars">
                    {values.map((v, i) => {
                        const heightPercent = Math.round((v / max) * 100);
                        const labelBottom = v === 0 ? 4 : Math.min(98, heightPercent + 6);
                        return (
                            <div className="chart_column" key={months[i].key}>
                                <div className="bar_wrap">
                                    <div className="bar_fill" style={{ height: `${heightPercent}%` }} />
                                    <div className="bar_value" style={{ bottom: `${labelBottom}%` }}>{v}</div>
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
            <SideBarSwitcher />

            <div className="contenido_Home">
                <Navbar />

                <div className="contenido_Admin">
                    <main className="admin-dashboard">

                        <section className="overview">
                            <h1 className="page-title">Panel Admin</h1>
                            <p>Bienvenido al panel.</p>
                            <p>Aquí irán las estadísticas de usuarios del sistema.</p>

                            <UsersPerMonthChart stats={estadisticasUsuarios} users={usuarios} />

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
                                                    <th>Rol</th>
                                                    <th style={{width: '180px'}}>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {usuarios.length === 0 ? (
                                                    <tr><td colSpan={4}>No hay usuarios registrados.</td></tr>
                                                ) : (
                                                    usuarios.map((u) => (
                                                        <tr key={u.id || u._id || u.username}>
                                                            <td>{u.username || u.name || '-'}</td>
                                                            <td>{u.email || '-'}</td>
                                                            <td>{u.role || u.roles || u.rol || '-'}</td>
                                                            <td>
                                                                <button className="btn_editar">Editar</button>
                                                                <button className="btn_eliminar" onClick={() => handleEliminarUsuario(u.id || u._id)}>Eliminar</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                        <div className="paginacion_Usuarios">
                                            <p>
                                                Mostrando {paginaActual * usuariosPorPagina + 1} a{" "}
                                                {Math.min((paginaActual + 1) * usuariosPorPagina, totalElementos)} de{" "}
                                                {totalElementos} usuarios
                                            </p>

                                            <div className="botones_paginacion_Usuarios">
                                                <button
                                                    disabled={paginaActual === 0}
                                                    onClick={() => setPaginaActual(paginaActual - 1)}
                                                >
                                                    ← Anterior
                                                </button>

                                                {Array.from({ length: totalPaginas }, (_, index) => (
                                                    <button
                                                        key={index}
                                                        className={
                                                            paginaActual === index
                                                                ? "pagina_activa_Usuarios"
                                                                : ""
                                                        }
                                                        onClick={() => setPaginaActual(index)}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                ))}

                                                <button
                                                    disabled={paginaActual + 1 >= totalPaginas}
                                                    onClick={() => setPaginaActual(paginaActual + 1)}
                                                >
                                                    Siguiente →
                                                </button>
                                            </div>
                                        </div>
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