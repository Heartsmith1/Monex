import { useNavigate } from "react-router-dom"; // Importa useNavigate
import home from "../../assets/icon/home.png";
import gastos from "../../assets/icon/gastos.png";
import categoria from "../../assets/icon/categorias.png";
import analisis from "../../assets/icon/analisis.png";
import estMensual from "../../assets/icon/est_mensual.png";
import logout from "../../assets/icon/cerrar_sesion.png";
export function SideBar(){
    const navigate = useNavigate(); // Inicializa useNavigate
    return(

        <div className="contenedor_sideBar">
            <div className="contenedor_botones">
                <button type="button" className="boton_inicio" onClick={() => navigate("/Home")}>
                    Inicio
                    <img src={home} alt="Inicio" />
                </button>

                <button type="button" className="boton_gastos" onClick={() => navigate("/Gastos")}>
                    Gastos
                    <img src={gastos} alt="Gastos" />
                </button>

                <button type="button" className="boton_categoria" onClick={() => navigate("/categorias")}>
                    Categoria
                    <img src={categoria} alt="Categoria" />
                </button>

                <button type="button" className="boton_analisis" onClick={() => navigate("/Analisis")}>
                    Analisis
                    <img src={analisis} alt="Analisis" />
                </button>

                <button type="button" className="boton_est_mensual" onClick={() => navigate("/EstMensual")}>
                    Est. Mensual
                    <img src={estMensual} alt="Est. Mensual" />
                </button>
            </div>


            <div className="sidebar_footer">
                <div className="usuario_info">
                    <div>
                        <p className="texto_usuario_sidebar">Nombre usuario</p>
                        <p className="texto_email_sidebar">usuario@gmail.com</p>
                    </div>
                </div>

                <button className="boton_logout" onClick={() => navigate("/")}>
                    <img src={logout} alt="Cerrar Sesión" /> {/* La imagen va primero */}
                    Cerrar Sesión {/* El texto va después */}
                </button>
            </div>
        </div>
    )
}