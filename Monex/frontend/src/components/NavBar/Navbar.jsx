import logo from "../../assets/logo/Logo_Monex_Azul.png";
import icono from "../../assets/icon/usuario_verde.png";
import { useNavigate } from "react-router-dom";

export function Navbar({ onOpenExpenseModal }) {
    const navigate = useNavigate();

    return (
        <>
            <div className="navbar">
                <img
                    src={logo}
                    alt="Logo Monex"
                    className="img_logo_navbar"
                    onClick={() => navigate("/Home")}
                    style={{ cursor: "pointer" }}
                />

                <button
                    className="btn_Agregar_Gasto"
                    onClick={onOpenExpenseModal}
                >
                    + Agregar Gasto
                </button>

                <img src={icono} alt="usuario_verde" className="icono_Usuario" />
            </div>
        </>
    );
}