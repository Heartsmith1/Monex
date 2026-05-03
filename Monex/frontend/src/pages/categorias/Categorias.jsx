import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";

export function Categorias() {
    return (
        <div className="contenedor_Home">
            <SideBar />

            <div className="contenido_Home">
                <Navbar />

                <div className="contenido_Categorias">
                    <h1>Categoría</h1>
                    <p>Organiza y gestiona las categorías de tus gastos</p>
                </div>
            </div>
        </div>
    );
}