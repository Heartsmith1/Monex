import { useEffect, useState } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";
import { ModalEditarCategoria } from "../../components/ModalEditarCategoria/ModalEditarCategoria";
import lupa from "../../assets/icon/material-symbols_search.png";
import { obtenerCategorias, editarCategoria,} from "../../services/categoriasService";
import "../../css/pages/categorias.css";

export function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);

    const [modalEditar, setModalEditar] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    const [nombreEditado, setNombreEditado] = useState("");
    const [descripcionEditada, setDescripcionEditada] = useState("");

    const cargarCategorias = async () => {
        try {
            setLoading(true);
            const data = await obtenerCategorias();
            setCategorias(data);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    const abrirModalEditar = (categoria) => {
        setCategoriaSeleccionada(categoria);
        setNombreEditado(categoria.name || categoria.nombre || "");
        setDescripcionEditada(
            categoria.description || categoria.descripcion || ""
        );
        setModalEditar(true);
    };

    const cerrarModalEditar = () => {
        setModalEditar(false);
        setCategoriaSeleccionada(null);
        setNombreEditado("");
        setDescripcionEditada("");
    };

    const guardarCambios = async () => {
        try {
            if (!nombreEditado.trim()) {
                alert("El nombre de la categoría no puede estar vacío");
                return;
            }

            // Por ahora el backend solo recibe name y no descripcion
            await editarCategoria(
                categoriaSeleccionada.id,
                nombreEditado
            );

            cerrarModalEditar();
            cargarCategorias();
        } catch (error) {
            console.error("Error al editar categoría:", error);
            alert("Error al editar categoría");
        }
    };

    const categoriasFiltradas = categorias.filter((categoria) =>
        (categoria.name || categoria.nombre || "")
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    return (
        <div className="contenedor_Home">
            <SideBar />

            <div className="contenido_Home">
                <Navbar />

                <div className="contenido_Categorias">
                    <h1>Categoría</h1>
                    <p>Organiza y gestiona las categorías de tus gastos</p>

                    <div className="barra_Categorias">
                        <div className="input_con_icono">
                            <img src={lupa} alt="buscar" className="icono_buscar" />

                            <input
                                type="text"
                                placeholder="Buscar categoría..."
                                className="input_Buscar"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>

                        <button className="btn_Agregar_Categoria">
                            + Agregar Categoría
                        </button>
                    </div>

                    <div className="tabla_Categorias">
                        {loading ? (
                            <p className="mensaje_Sin_Categorias">Cargando categorías...</p>
                        ) : categorias.length === 0 ? (
                            <p className="mensaje_Sin_Categorias">No hay categorías registradas</p>
                        ) : categoriasFiltradas.length === 0 ? (
                            <p className="mensaje_Sin_Categorias">No se encontraron resultados</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre de categoría</th>
                                        <th>Descripción de categoría</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {categoriasFiltradas.map((categoria) => (
                                        <tr key={categoria.id}>
                                            <td>{categoria.id}</td>
                                            <td>{categoria.name || categoria.nombre || "Sin nombre"}</td>
                                            <td>
                                                {categoria.description ||
                                                    categoria.descripcion ||
                                                    "Sin descripción"}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn_editar"
                                                    onClick={() => abrirModalEditar(categoria)}
                                                >
                                                    Editar
                                                </button>

                                                <button className="btn_eliminar">
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {modalEditar && (
                <ModalEditarCategoria
                    nombreEditado={nombreEditado}
                    setNombreEditado={setNombreEditado}
                    descripcionEditada={descripcionEditada}
                    setDescripcionEditada={setDescripcionEditada}
                    cerrarModalEditar={cerrarModalEditar}
                    guardarCambios={guardarCambios}
                />
            )}
        </div>
    );
}