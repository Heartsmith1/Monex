import { useEffect, useState } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";
import { EditcategoriesModal } from "../../components/Modal/EditcategoriesModal";
import { AddCategoryModal } from "../../components/Modal/AddCategoryModal";
import { DeleteCategoryModal } from "../../components/Modal/DeleteCategoryModal";
import AddExpenseModal from "../../components/Modal/AddExpenseModal";
import lupa from "../../assets/icon/material-symbols_search.png";
import {
    obtenerCategorias,
    editarCategoria,
    crearCategoria,
    eliminarCategoria,
} from "../../services/categoriesService";
import "../../css/pages/categories.css";

export function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);

    const [paginaActual, setPaginaActual] = useState(1);
    const categoriasPorPagina = 5;

    const [modalEditar, setModalEditar] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    const [nombreEditado, setNombreEditado] = useState("");
    const [descripcionEditada, setDescripcionEditada] = useState("");

    const [modalAgregar, setModalAgregar] = useState(false);
    const [nombreNuevo, setNombreNuevo] = useState("");
    const [descripcionNueva, setDescripcionNueva] = useState("");

    const [modalEliminar, setModalEliminar] = useState(false);
    const [categoriaEliminar, setCategoriaEliminar] = useState(null);

    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

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

    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda]);

    const abrirModalEditar = (categoria) => {
        setCategoriaSeleccionada(categoria);
        setNombreEditado(categoria.name || categoria.nombre || "");
        setDescripcionEditada(categoria.description || categoria.descripcion || "");
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

            await editarCategoria(
                categoriaSeleccionada.id,
                nombreEditado,
                descripcionEditada
            );

            cerrarModalEditar();
            cargarCategorias();
        } catch (error) {
            console.error("Error al editar categoría:", error);
            alert("Error al editar categoría");
        }
    };

    const abrirModalAgregar = () => {
        setNombreNuevo("");
        setDescripcionNueva("");
        setModalAgregar(true);
    };

    const cerrarModalAgregar = () => {
        setModalAgregar(false);
        setNombreNuevo("");
        setDescripcionNueva("");
    };

    const guardarCategoria = async () => {
        try {
            if (!nombreNuevo.trim()) {
                alert("El nombre de la categoría no puede estar vacío");
                return;
            }

            await crearCategoria(nombreNuevo, descripcionNueva);

            cerrarModalAgregar();
            cargarCategorias();
        } catch (error) {
            console.error("Error al crear categoría:", error);
            alert("Error al crear categoría");
        }
    };

    const abrirModalEliminar = (categoria) => {
        setCategoriaEliminar(categoria);
        setModalEliminar(true);
    };

    const cerrarModalEliminar = () => {
        setModalEliminar(false);
        setCategoriaEliminar(null);
    };

    const eliminarConfirmado = async (id) => {
        try {
            await eliminarCategoria(id);

            cerrarModalEliminar();
            cargarCategorias();
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
            alert("Error al eliminar categoría");
        }
    };

    const categoriasFiltradas = categorias.filter((categoria) =>
        (categoria.name || categoria.nombre || "")
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    const totalPaginas = Math.ceil(categoriasFiltradas.length / categoriasPorPagina);
    const indiceInicial = (paginaActual - 1) * categoriasPorPagina;
    const indiceFinal = indiceInicial + categoriasPorPagina;
    const categoriasPaginadas = categoriasFiltradas.slice(indiceInicial, indiceFinal);

    return (
        <div className="contenedor_Home">
            <SideBar />

            <div className="contenido_Home">
                <Navbar onOpenExpenseModal={() => setIsExpenseModalOpen(true)} />

                <AddExpenseModal
                    isOpen={isExpenseModalOpen}
                    onClose={() => setIsExpenseModalOpen(false)}
                />

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

                        <button
                            className="btn_Agregar_Categoria"
                            onClick={abrirModalAgregar}
                        >
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
                            <>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nombre de categoría</th>
                                            <th>Descripción de categoría</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {categoriasPaginadas.map((categoria) => (
                                            <tr key={categoria.id}>
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

                                                    <button
                                                        className="btn_eliminar"
                                                        onClick={() => abrirModalEliminar(categoria)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="paginacion_Categorias">
                                    <p>
                                        Mostrando {indiceInicial + 1} a{" "}
                                        {Math.min(indiceFinal, categoriasFiltradas.length)} de{" "}
                                        {categoriasFiltradas.length} categorías
                                    </p>

                                    <div className="botones_paginacion_Categorias">
                                        <button
                                            disabled={paginaActual === 1}
                                            onClick={() => setPaginaActual(paginaActual - 1)}
                                        >
                                            ← Anterior
                                        </button>

                                        {Array.from({ length: totalPaginas }, (_, index) => (
                                            <button
                                                key={index + 1}
                                                className={
                                                    paginaActual === index + 1
                                                        ? "pagina_activa_Categorias"
                                                        : ""
                                                }
                                                onClick={() => setPaginaActual(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}

                                        <button
                                            disabled={paginaActual === totalPaginas}
                                            onClick={() => setPaginaActual(paginaActual + 1)}
                                        >
                                            Siguiente →
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {modalEditar && (
                <EditcategoriesModal
                    nombreEditado={nombreEditado}
                    setNombreEditado={setNombreEditado}
                    descripcionEditada={descripcionEditada}
                    setDescripcionEditada={setDescripcionEditada}
                    cerrarModalEditar={cerrarModalEditar}
                    guardarCambios={guardarCambios}
                />
            )}

            {modalAgregar && (
                <AddCategoryModal
                    nombre={nombreNuevo}
                    setNombre={setNombreNuevo}
                    descripcion={descripcionNueva}
                    setDescripcion={setDescripcionNueva}
                    cerrarModal={cerrarModalAgregar}
                    guardarCategoria={guardarCategoria}
                />
            )}

            {modalEliminar && (
                <DeleteCategoryModal
                    categoria={categoriaEliminar}
                    cerrarModal={cerrarModalEliminar}
                    eliminarCategoriaConfirmada={eliminarConfirmado}
                />
            )}
        </div>
    );
}