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
    const [hoveredPoint, setHoveredPoint] = useState(null);

    useEffect(() => {

        const fetchGastos = async () => {

            try {

                const data = await obtenerGastos();

                const expenses = Array.isArray(data)
                    ? data
                    : data?.data ?? data?.expenses ?? [];

                // FECHA ACTUAL
                const fechaActual = new Date();

                const mesActual = fechaActual.getMonth() + 1;

                const añoActual = fechaActual.getFullYear();

                // FILTRAR SOLO GASTOS DEL MES ACTUAL
                const gastosMesActual = expenses.filter((gasto) => {

                    if (!gasto.date) return false;

                    // EVITA ERRORES DE ZONA HORARIA
                    const [año, mes] = gasto.date.split("-");

                    return (
                        Number(mes) === mesActual &&
                        Number(año) === añoActual
                    );
                });

                // TOTAL SOLO DEL MES
                const suma = gastosMesActual.reduce((total, gasto) => {

                    const amount = Number(gasto?.amount ?? 0);

                    return total + (isNaN(amount) ? 0 : amount);

                }, 0);

                setTotalGastos(suma);

                // GRAFICO SOLO DEL MES
                setGastosGrafico(gastosMesActual);

                setError(null);

            } catch (fetchError) {

                console.error("Error fetching gastos:", fetchError);

                setError(fetchError.message || "Error al cargar gastos");

            } finally {

                setLoading(false);

            }
        };

        // CARGA INICIAL
        fetchGastos();

        // ACTUALIZA AUTOMATICAMENTE CADA 1 MINUTO
        const intervalo = setInterval(() => {
            fetchGastos();
        }, 60000);

        return () => clearInterval(intervalo);

    }, []);

    // MONTO MAXIMO
    const montoMaximo = Math.max(
        ...gastosGrafico.map(gasto => Number(gasto.amount)),
        1
    );

    // ESPACIADO DINAMICO
    const espacioDisponible = 580;

    const separacionX = gastosGrafico.length > 1
        ? espacioDisponible / (gastosGrafico.length - 1)
        : 0;

    // PUNTOS DEL GRAFICO
    const puntos = gastosGrafico.map((gasto, index) => {

        const monto = Number(gasto.amount);

        const x = 70 + (index * separacionX);

        const y = 180 - ((monto / montoMaximo) * 160);

        return `${x},${y}`;

    }).join(" ");

    const gridRows = [20, 60, 100, 140, 180];

    const cantidadColumnas = 7;

    const gridColumns = Array.from(
        { length: cantidadColumnas },
        (_, index) => 150 + (index * 80)
    );

    return (
        <div className="contenedor_analisis">

            <SideBar />

            <div className="contenido_anilisis">

                <Navbar
                    onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
                />

                <AddExpenseModal
                    isOpen={isExpenseModalOpen}
                    onClose={() => setIsExpenseModalOpen(false)}
                />

                <h1>Bienvenido Usuario</h1>

                <div className="layout_analisis">

                    <div className="col_izquierda">

                        <div className="gastos_diarios">

                            <h1>Gastos del mes</h1>

                            <div className="grafico_linea_container">

                                <svg
                                    className="grafico_svg"
                                    viewBox="0 0 700 220"
                                >

                                    {/* VALORES EJE Y */}
                                    {[0, 0.25, 0.5, 0.75, 1].map((valor, index) => {

                                        const y = 180 - (valor * 160);

                                        return (
                                            <text
                                                key={index}
                                                x="10"
                                                y={y + 5}
                                                className="texto_grafico"
                                            >
                                                $
                                                {Math.round(montoMaximo * valor)
                                                    .toLocaleString("es-CL")}
                                            </text>
                                        );
                                    })}

                                    {/* LINEAS HORIZONTALES */}
                                    {gridRows.map((y) => (
                                        <line
                                            key={`grid-h-${y}`}
                                            x1="70"
                                            y1={y}
                                            x2="650"
                                            y2={y}
                                            className="grid_line"
                                        />
                                    ))}

                                    {/* LINEAS VERTICALES */}
                                    {gridColumns.map((x) => (
                                        <line
                                            key={`grid-v-${x}`}
                                            x1={x}
                                            y1="20"
                                            x2={x}
                                            y2="180"
                                            className="grid_line"
                                        />
                                    ))}

                                    {/* EJE Y */}
                                    <line
                                        x1="70"
                                        y1="20"
                                        x2="70"
                                        y2="180"
                                        className="linea_eje"
                                    />

                                    {/* EJE X */}
                                    <line
                                        x1="70"
                                        y1="180"
                                        x2="650"
                                        y2="180"
                                        className="linea_eje"
                                    />

                                    {/* LINEA */}
                                    <polyline
                                        fill="none"
                                        points={puntos}
                                        className="linea_grafico"
                                    />

                                    {/* PUNTOS */}
                                    {gastosGrafico.map((gasto, index) => {

                                        const monto = Number(gasto.amount);

                                        const x = 70 + (index * separacionX);

                                        const y = 180 - (
                                            (monto / montoMaximo) * 160
                                        );

                                        return (
                                            <g key={index}>

                                                {/* TOOLTIP */}
                                                {hoveredPoint === index && (
                                                    <g>

                                                        <rect
                                                            x={x - 55}
                                                            y={y - 75}
                                                            width="110"
                                                            height="45"
                                                            rx="8"
                                                            fill="#1F2937"
                                                        />

                                                        <text
                                                            x={x}
                                                            y={y - 55}
                                                            textAnchor="middle"
                                                            fill="#ffffff"
                                                            fontSize="11"
                                                        >
                                                            $
                                                            {monto.toLocaleString("es-CL")}
                                                        </text>

                                                        <text
                                                            x={x}
                                                            y={y - 40}
                                                            textAnchor="middle"
                                                            fill="#D1D5DB"
                                                            fontSize="10"
                                                        >
                                                            {gasto.date || "Sin fecha"}
                                                        </text>

                                                    </g>
                                                )}

                                                <circle
                                                    cx={x}
                                                    cy={y}
                                                    r="6"
                                                    className="punto_grafico"
                                                    onMouseEnter={() => {
                                                        setHoveredPoint(index);
                                                    }}
                                                    onMouseLeave={() => {
                                                        setHoveredPoint(null);
                                                    }}
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
                                        );
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

                            <h2>Total gastos del mes</h2>

                            {loading ? (

                                <h1>Cargando...</h1>

                            ) : error ? (

                                <p style={{ color: "#b91c1c" }}>
                                    Error: {error}
                                </p>

                            ) : (

                                <>
                                    <h1>
                                        $
                                        {totalGastos.toLocaleString("es-CL")}
                                    </h1>

                                    <p>
                                        {gastosGrafico.length}{" "}
                                        {gastosGrafico.length === 1
                                            ? "gasto"
                                            : "gastos durante el mes"}
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
    );
}