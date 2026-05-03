import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";

export function Home() {
    return (
        <div className="contenedor_Home">
            <SideBar />

            <div className="contenido_Home">
                <Navbar />
                <h1>Bienvenido Usuario</h1>

                <div className="layout_home">

                    {/* IZQUIERDA */}
                    <div className="col_izquierda">
                        <div className="box_grafico_lineal_home">
                            <h1>Total Gastos del Mes</h1>
                        </div>

                        <div className="contendor_ultimos_gastos">
                            <h1>Ultimos Gastos</h1>
                        </div>
                    </div>

                    {/* DERECHA */}
                    <div className="col_derecha">
                        <div className="box_grafico_torta_home">
                            <h2>Gastos por categoria</h2>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}