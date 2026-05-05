import { useEffect, useState } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";


export function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            
            const res = await fetch("http://localhost:8083/api/expenses", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (!res.ok) throw new Error("Error al traer los gastos");
            
            const data = await res.json();
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

    const handleEdit = (id) => {
        console.log("Editar gasto con ID:", id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este gasto?")) {
            try {
                const res = await fetch(`http://localhost:8083/api/expenses/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                
                if (!res.ok) throw new Error("Error al eliminar el gasto");
                
                setExpenses(expenses.filter(expense => expense.id !== id));
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
                <Navbar />

                <div className="layout_expenses">
                    <form action="POST">
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
                    <table>
                        <thead className="nav_tabla_gastos">
                            <tr>
                                <th>Nombre</th>
                                <th>Fecha de ingreso</th>
                                <th>Método de pago</th>
                                <th>Monto</th>
                                <th>Cantidad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="body_tabla_gastos">
                            {expenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{expense.description}</td>
                                    <td>{expense.date}</td>
                                    <td>{expense.payment_method}</td>
                                    <td>${expense.amount}</td>
                                    <td>{expense.installments}</td>
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
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}