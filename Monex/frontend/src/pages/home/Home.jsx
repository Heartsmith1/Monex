import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";

export function Home() {
    return (
        <div className="contenedor_Home">
            <SideBar />

            <div className="contenido_Home">
                <Navbar />
                <h1>Bienvenido Usuario</h1>
                
                <div className="box_grafico_lineal_home">
                    <h1>Total Gastos del Mes</h1>



                </div>
            </div>
        </div>
    );
}