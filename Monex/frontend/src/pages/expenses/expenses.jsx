import { useEffect, useState } from "react";
import { SideBar } from "../../components/SideBar/SideBar";
import { Navbar } from "../../components/Navbar/Navbar";
import AddExpenseModal from "../../components/Modal/AddExpenseModal";
import { obtenerGastos } from "../../services/expensesService";

export function Expenses() {
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [gastos, setGastos] = useState([]);

    const cargarGastos = async () => {
        try {
            const data = await obtenerGastos();
            setGastos(data);
        } catch (error) {
            console.error("Error al cargar gastos:", error);
        }
    };

    useEffect(() => {
        cargarGastos();
    }, []);

    return (
        <div className="contenedor_expenses">
            <SideBar />

            <div className="contenido_expenses">
                <Navbar onOpenExpenseModal={() => setIsExpenseModalOpen(true)} />

                <AddExpenseModal
                    isOpen={isExpenseModalOpen}
                    onClose={() => setIsExpenseModalOpen(false)}
                    onExpenseCreated={cargarGastos}
                />

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
                            {gastos.map((gasto) => (
                                <tr key={gasto.id}>
                                    <td>{gasto.name || gasto.nombre}</td>
                                    <td>{gasto.date || gasto.fechaIngreso}</td>
                                    <td>{gasto.paymentMethod || gasto.metodoPago}</td>
                                    <td>{gasto.amount || gasto.monto}</td>
                                    <td>{gasto.quantity || gasto.cantidad}</td>
                                    <td>
                                        <button className="boton_editar_expenses">Editar</button>
                                        <button className="boton_eliminar_expenses">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}