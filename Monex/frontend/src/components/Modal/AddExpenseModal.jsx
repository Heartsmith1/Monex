import { useState } from "react";
import "../../css/components/AddExpenseModal.css";
import { crearGasto } from "../../services/expensesService";

function AddExpenseModal({ isOpen, onClose, onExpenseCreated }) {

    const [nombre, setNombre] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [monto, setMonto] = useState("");
    const [fechaIngreso, setFechaIngreso] = useState("");
    const [metodoPago, setMetodoPago] = useState("");

    if (!isOpen) return null;

    const limpiarFormulario = () => {
        setNombre("");
        setCantidad("");
        setDescripcion("");
        setCategoria("");
        setMonto("");
        setFechaIngreso("");
        setMetodoPago("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const nuevoGasto = {
                name: nombre,
                quantity: cantidad,
                description: descripcion,
                categoryId: categoria,
                amount: monto,
                date: fechaIngreso,
                paymentMethod: metodoPago
            };

            await crearGasto(nuevoGasto);

            limpiarFormulario();

            if (onExpenseCreated) {
                onExpenseCreated();
            }

            onClose();
        } catch (error) {
            console.error("Error al guardar gasto:", error);
            alert("Error al guardar gasto");
        }
    };

    return (
        <div className="expense-modal-overlay">
            <div className="expense-modal-container">

                <button className="expense-modal-close" onClick={onClose}>
                    X
                </button>

                <h2 className="expense-modal-title">Registrar gasto</h2>

                <form className="expense-modal-form" onSubmit={handleSubmit}>

                    <div className="expense-modal-row">

                        <div className="expense-modal-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                placeholder="Ej: Almuerzo"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>

                        <div className="expense-modal-group">
                            <label>Cantidad</label>
                            <input
                                type="text"
                                placeholder="Ej: 3"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                            />
                        </div>

                    </div>

                    <div className="expense-modal-group">
                        <label>Descripción</label>
                        <input
                            type="text"
                            placeholder="Ej: Descripción del gasto"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </div>

                    <div className="expense-modal-row">

                        <div className="expense-modal-group">
                            <label>Categoría</label>
                            <input
                                type="text"
                                placeholder="Ej: Alimentación"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                            />
                        </div>

                        <div className="expense-modal-group">
                            <label>Monto</label>
                            <input
                                type="text"
                                placeholder="Ej: $20,000"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                            />
                        </div>

                    </div>

                    <div className="expense-modal-row">

                        <div className="expense-modal-group">
                            <label>Fecha ingreso</label>
                            <input
                                type="text"
                                placeholder="Ej: 04/03/2026"
                                value={fechaIngreso}
                                onChange={(e) => setFechaIngreso(e.target.value)}
                            />
                        </div>

                        <div className="expense-modal-group">
                            <label>Método de pago</label>
                            <input
                                type="text"
                                placeholder="Ej: Efectivo"
                                value={metodoPago}
                                onChange={(e) => setMetodoPago(e.target.value)}
                            />
                        </div>

                    </div>

                    <div className="expense-modal-buttons">

                        <button
                            type="button"
                            className="expense-btn-cancel"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="expense-btn-save"
                        >
                            Guardar
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default AddExpenseModal;