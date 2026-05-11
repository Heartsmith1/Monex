import { useEffect, useState } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";
import AddExpenseModal from "../../components/Modal/AddExpenseModal";
import { obtenerGastos } from "../../services/expensesService";

export function Analisis() {

    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [totalGastos, setTotalGastos] = useState(0);
    const [gastosGrafico, setGastosGrafico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchGastos = async () => {
            try {
                const data = await obtenerGastos();
                const expenses = Array.isArray(data)
                    ? data
                    : data?.data ?? data?.expenses ?? [];
                const suma = expenses.reduce((total, gasto) => {
                    const amount = Number(gasto?.amount ?? 0);
                    return total + (isNaN(amount) ? 0 : amount);
                }, 0);

                setTotalGastos(suma);
                setGastosGrafico(expenses);
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

    const puntos = gastosGrafico.map((gasto, index) => {
        const monto = Number(gasto.amount);
        const x = index * 80 + 40;
        const y = 180 - (monto / 500);
        return `${x},${y}`;
    }).join(" ");

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

                    <div className="col_izquierda">

                        <div className="gastos_diarios">
                            <h1>Gastos diarios</h1>

                            <div className="grafico_linea_container">

                                <div className="valores_grafico">
                                    <p>$70,000</p>
                                    <p>$50,000</p>
                                    <p>$20,000</p>
                                    <p>0</p>
                                </div>

                                <svg
                                    className="grafico_svg"
                                    viewBox="0 0 700 220"
                                >

                                    <line
                                        x1="40"
                                        y1="20"
                                        x2="40"
                                        y2="180"
                                        className="linea_eje"
                                    />

                                    <line
                                        x1="40"
                                        y1="180"
                                        x2="680"
                                        y2="180"
                                        className="linea_eje"
                                    />

                                    <polyline
                                        fill="none"
                                        points={puntos}
                                        className="linea_grafico"
                                    />

                                    {gastosGrafico.map((gasto, index) => {
                                        const monto = Number(gasto.amount);
                                        const x = index * 80 + 40;
                                        const y = 180 - (monto / 500);
                                        return (
                                            <g key={index}>
                                                <circle
                                                    cx={x}
                                                    cy={y}
                                                    r="6"
                                                    className="punto_grafico"
                                                />

                                                <text
                                                    x={x}
                                                    y="205"
                                                    textAnchor="middle"
                                                    className="texto_grafico"
                                                >
                                                    {index + 1}
                                                </text>

                                            </g>
                                        )
                                    })}

                                </svg>

                            </div>

                        </div>

                        <div className="estimacion_pago">
                            <h1>johto</h1>
                        </div>

                    </div>

                    <div className="col_derecha">

                        <div className="total_gastos">

                            <h2>Total gastos registrados</h2>

                            {loading ? (
                                <h1>Cargando...</h1>
                            ) : error ? (
                                <p style={{ color: "#b91c1c" }}>
                                    Error: {error}
                                </p>
                            ) : (
                                <>
                                    <h1>
                                        ${totalGastos.toLocaleString("es-CL")}
                                    </h1>
                                    <p>
                                        {totalGastos > 0
                                            ? "Gastos en total"
                                            : "Sin gastos"}
                                    </p>
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