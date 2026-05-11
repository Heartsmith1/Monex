import { useEffect, useState } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";
import AddExpenseModal from "../../components/Modal/AddExpenseModal";
import { obtenerGastos } from "../../services/expensesService";

export function Expenses() {
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExpenses = async () => {
        try {
            setLoading(true);

            const data = await obtenerGastos();

            console.log("Datos obtenidos:", data);

            setExpenses(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error("Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const formatPaymentMethod = (method) => {
        if (!method) return "Sin método";

        const methods = {
            EFECTIVO: "Efectivo",
            DEBITO: "Débito",
            CREDITO: "Crédito"
        };

        return methods[method] || method;
    };

    const formatAmount = (amount) => {
        if (amount === null || amount === undefined || amount === "") return "$0";

        return Number(amount).toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP"
        });
    };

    const formatCommission = (commission) => {
        if (commission === null || commission === undefined || commission === "") {
            return "0.00%";
        }

        return `${Number(commission).toFixed(2)}%`;
    };

    const handleEdit = (id) => {
        console.log("Editar gasto con ID:", id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este gasto?")) {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(`http://localhost:8083/api/expenses/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error("Error al eliminar el gasto");
                }

                setExpenses(expenses.filter((expense) => expense.id !== id));
            } catch (err) {
                console.error(err);
                alert("Error al eliminar el gasto");
            }
        }
    };

    return (
        <div className="contenedor_expenses">
            <SideBar />

            <div className="contenido_expenses">
                <Navbar onOpenExpenseModal={() => setIsExpenseModalOpen(true)} />

                <AddExpenseModal
                    isOpen={isExpenseModalOpen}
                    onClose={() => setIsExpenseModalOpen(false)}
                    onExpenseCreated={fetchExpenses}
                />

                <div className="layout_expenses">
                    <form>
                        <input
                            className="buscar_gasto_nombre"
                            type="text"
                            placeholder="Buscar gasto por nombre"
                        />

                        <input
                            className="buscar_gasto_fecha"
                            type="text"
                            placeholder="Fecha: 01/03/2026 - 30/04/2026"
                        />

                        <input
                            className="select_gasto"
                            type="text"
                            placeholder="Todas las categorías"
                        />
                    </form>
                </div>

                <div className="tabla_expenses">
                    {loading && <p>Cargando gastos...</p>}
                    {error && <p>{error}</p>}

                    {!loading && !error && (
                        <table>
                            <thead className="nav_tabla_gastos">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Fecha del gasto</th>
                                    <th>Método de pago</th>
                                    <th>Monto</th>
                                    <th>Comisión</th>
                                    <th>Cuotas</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="body_tabla_gastos">
                                {expenses.length > 0 ? (
                                    expenses.map((expense) => (
                                        <tr key={expense.id}>
                                            <td>{expense.name || "Sin nombre"}</td>

                                            <td>
                                                {expense.categoryName ||
                                                    expense.category?.name ||
                                                    `Categoría ${expense.categoryId}`}
                                            </td>

                                            <td>{expense.date || "Sin fecha"}</td>

                                            <td>{formatPaymentMethod(expense.paymentMethod)}</td>

                                            <td>{formatAmount(expense.amount)}</td>

                                            <td>{formatCommission(expense.commission)}</td>

                                            <td>{expense.installments || 1}</td>

                                            <td>
                                                <button
                                                    className="boton_editar_expenses"
                                                    onClick={() => handleEdit(expense.id)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="boton_eliminar_expenses"
                                                    onClick={() => handleDelete(expense.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">No hay gastos registrados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}