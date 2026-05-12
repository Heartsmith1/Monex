import { useEffect, useState } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";
import AddExpenseModal from "../../components/Modal/AddExpenseModal";
import CreditCardConfigModal from "../../components/Modal/CreditCardConfigModal";

import { obtenerGastos } from "../../services/expensesService";

import "../../css/pages/home.css";

export function Home() {
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

    const [ultimosGastos, setUltimosGastos] = useState([]);
    const [loadingGastos, setLoadingGastos] = useState(true);
    const [totalMes, setTotalMes] = useState(0);

    const cargarUltimosGastos = async () => {
        try {
            setLoadingGastos(true);

            const data = await obtenerGastos();

            const gastos = Array.isArray(data) ? data : [];

            const gastosOrdenados = [...gastos]
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            setUltimosGastos(gastosOrdenados.slice(0, 5));

            const fechaActual = new Date();
            const mesActual = fechaActual.getMonth();
            const anioActual = fechaActual.getFullYear();

            const totalDelMes = gastos.reduce((total, gasto) => {
                const fechaGasto = new Date(gasto.date);

                if (
                    fechaGasto.getMonth() === mesActual &&
                    fechaGasto.getFullYear() === anioActual
                ) {
                    return total + Number(gasto.amount || 0);
                }

                return total;
            }, 0);

            setTotalMes(totalDelMes);
        } catch (error) {
            console.error("Error al cargar últimos gastos:", error);
        } finally {
            setLoadingGastos(false);
        }
    };

    useEffect(() => {
        cargarUltimosGastos();
    }, []);

    const formatAmount = (amount) => {
        if (amount === null || amount === undefined || amount === "") {
            return "$0";
        }

        return Number(amount).toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
        });
    };

    const formatPaymentMethod = (method) => {
        const methods = {
            EFECTIVO: "Efectivo",
            DEBITO: "Débito",
            CREDITO: "Crédito",
        };

        return methods[method] || "Sin método";
    };

    return (
        <div className="contenedor_Home">
            <SideBar />

            <div className="contenido_Home home_page_content">
                <Navbar
                    onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
                    onOpenConfigModal={() => setIsConfigModalOpen(true)}
                />

                <AddExpenseModal
                    isOpen={isExpenseModalOpen}
                    onClose={() => setIsExpenseModalOpen(false)}
                    onExpenseCreated={cargarUltimosGastos}
                />

                <CreditCardConfigModal
                    isOpen={isConfigModalOpen}
                    onClose={() => setIsConfigModalOpen(false)}
                />

                <h1>Bienvenido, Usuario</h1>

                <div className="layout_home">
                    <div className="col_izquierda">
                        <div className="box_grafico_lineal_home">
                            <h1>Total Gastos del Mes</h1>

                            <span className="total_mes_home">
                                {formatAmount(totalMes)}
                            </span>

                            <p className="texto_presupuesto_home">
                                Total acumulado del mes actual
                            </p>
                        </div>

                        <div className="contendor_ultimos_gastos">
                            <div className="header_ultimos_gastos">
                                <h1>Últimos Gastos</h1>

                                <div className="decoracion_header_gastos">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>

                            {loadingGastos ? (
                                <p>Cargando últimos gastos...</p>
                            ) : ultimosGastos.length === 0 ? (
                                <p>No hay gastos registrados</p>
                            ) : (
                                <>
                                    <table className="tabla_ultimos_gastos_home">
                                        <tbody>
                                            {ultimosGastos.map((gasto) => (
                                                <tr key={gasto.id}>
                                                    <td className="info_gasto_home">
                                                        <strong>
                                                            {gasto.name || "Sin nombre"}
                                                        </strong>

                                                        <span>
                                                            {gasto.date || "Sin fecha"}
                                                        </span>
                                                    </td>

                                                    <td className="monto_gasto_home">
                                                        <strong>Monto:</strong>{" "}
                                                        {formatAmount(gasto.amount)}
                                                    </td>

                                                    <td className="metodo_gasto_home">
                                                        <strong>Método de pago:</strong>{" "}
                                                        {formatPaymentMethod(
                                                            gasto.paymentMethod
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="contenedor_btn_ver_todos">
                                        <button className="btn_ver_todos_home">
                                            Ver todos &gt;
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="col_derecha">
                        <div className="box_grafico_torta_home">
                            <h2>Gastos por categoría</h2>
                        </div>

                        <div className="contenedor_pago_tarjeta_home">
                            <h2>Pago Tarjeta</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;