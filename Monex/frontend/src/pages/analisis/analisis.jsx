import { useEffect, useState } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";
import AddExpenseModal from "../../components/Modal/AddExpenseModal";
import { obtenerGastos } from "../../services/expensesService";

export function Analisis() {

    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [totalGastos, setTotalGastos] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGastos = async () => {
            try {
                const data = await obtenerGastos();
                const expenses = Array.isArray(data) ? data : data?.data ?? data?.expenses ?? [];

                const suma = expenses.reduce((total, gasto) => {
                    const amount = Number(gasto?.amount ?? 0);
                    return total + (isNaN(amount) ? 0 : amount);
                }, 0);

                setTotalGastos(suma);
                setError(null);
            } catch (fetchError) {
                console.error("Error fetching gastos:", fetchError);
                setError(fetchError.message || "Error al cargar gastos");
            } finally {
                setLoading(false);
            }
        };

        fetchGastos();
    }, []);

    return (
        <div className="contenedor_analisis">
            <SideBar />

            <div className="contenido_anilisis">
                <Navbar onOpenExpenseModal={() => setIsExpenseModalOpen(true)} />

                <AddExpenseModal
                    isOpen={isExpenseModalOpen}
                    onClose={() => setIsExpenseModalOpen(false)}
                />

                <h1>Bienvenido Usuario</h1>

                <div className="layout_analisis">

                    {/* <div className="gastos_aumento">
                        <p>¡Tus gastos aumentaron 15% respecto al mes anterior, principalmente en la categoria Alimentación!</p>

                    </div> */}
                
                    <div className="col_izquierda_analisis">
                        
                        <div className="gastos_diarios">
                            <h1>teselia</h1>
                        </div>

                        <div className="estimacion_pago">
                            <h1>johto</h1>

                        </div>
                    </div>

                    <div className="col_derecha_analisis">
                        
                        <div className="total_gastos">
                            <h2>Total gastos registrados</h2>
                            {loading ? (
                                <h1>Cargando...</h1>
                            ) : error ? (
                                <p style={{ color: "#b91c1c" }}>Error: {error}</p>
                            ) : (
                                <>
                                    <h1>${totalGastos.toLocaleString("es-CL")}</h1>
                                    <p>{totalGastos > 0 ? "Gastos en total" : "Sin gastos"}</p>
                                </>
                            )}
                        </div>

                        <div className="gastos_categoria">
                            <h1>alola</h1>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}