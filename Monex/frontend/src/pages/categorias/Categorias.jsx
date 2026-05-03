import { useEffect, useState } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";
import lupa from "../../assets/icon/material-symbols_search.png";

export function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const cargarCategorias = async () => {
        try {
            const response = await fetch("http://localhost:8082/api/categorias");

            if (!response.ok) {
                throw new Error("Error al obtener las categorías");
            }

            const data = await response.json();
            setCategorias(data);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    const categoriasFiltradas = categorias.filter((categoria) =>
        categoria.nombre.toLowerCase().includes(busqueda.toLowerCase())
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
                        {categoriasFiltradas.length === 0 ? (
                            <p className="mensaje_Sin_Categorias">
                                No hay categorías registradas
                            </p>
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
                                            <td>{categoria.nombre}</td>
                                            <td>{categoria.descripcion}</td>
                                            <td>
                                                <button className="btn_editar">
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
        </div>
    );
}