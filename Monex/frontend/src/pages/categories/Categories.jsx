import { useEffect, useState } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";
import { EditcategoriesModal } from "../../components/Modal/EditcategoriesModal";
import { AddCategoryModal } from "../../components/Modal/AddCategoryModal";
import lupa from "../../assets/icon/material-symbols_search.png";
import { obtenerCategorias, editarCategoria, crearCategoria } from "../../services/categoriesService";
import "../../css/pages/categories.css";

export function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);

    const [modalEditar, setModalEditar] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    const [nombreEditado, setNombreEditado] = useState("");
    const [descripcionEditada, setDescripcionEditada] = useState("");

    const [modalAgregar, setModalAgregar] = useState(false);
    const [nombreNuevo, setNombreNuevo] = useState("");
    const [descripcionNueva, setDescripcionNueva] = useState("");

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
        </div>
    );
}