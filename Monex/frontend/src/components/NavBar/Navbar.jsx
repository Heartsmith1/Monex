import logo from "../../assets/logo/Logo_Monex_Azul.png";
import icono from "../../assets/icon/usuario_verde.png";

export function Navbar() {
    return (
        <>
            
            <div className="navbar">
                <img src={logo} alt="Logo Monex" className="img_logo" />
                <button className="btn_Agregar_Gasto">
                    + Agregar Gasto
                </button>
                <img src={icono} alt="usuario_verde" className="icono_Usuario" />
            </div>
        </>
    );
}