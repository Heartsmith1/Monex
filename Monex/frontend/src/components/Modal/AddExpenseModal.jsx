import { useEffect, useState } from "react";
import "../../css/components/AddExpenseModal.css";
import { crearGasto } from "../../services/expensesService";
import { obtenerCategorias } from "../../services/categoriesService";

function AddExpenseModal({ isOpen, onClose, onExpenseCreated }) {

    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("");
    const [monto, setMonto] = useState("");
    const [comision, setComision] = useState("");
    const [fechaIngreso, setFechaIngreso] = useState("");
    const [metodoPago, setMetodoPago] = useState("EFECTIVO");
    const [cantidadCuotas, setCantidadCuotas] = useState("1");

    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const data = await obtenerCategorias();
                setCategorias(data);
            } catch (error) {
                console.error("Error al cargar categorías:", error);
            }
        };

        if (isOpen) {
            cargarCategorias();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const limpiarFormulario = () => {
        setNombre("");
        setCategoria("");
        setMonto("");
        setComision("");
        setFechaIngreso("");
        setMetodoPago("EFECTIVO");
        setCantidadCuotas("1");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const categoriaSeleccionada = categorias.find(
                (cat) => Number(cat.id) === Number(categoria)
            );

            const montoParsed = Number(monto);
            const comisionPorcentaje = Number(comision || 0);
            const comisionCalculada = comisionPorcentaje > 0 ? (montoParsed * comisionPorcentaje) / 100 : 0;

            const nuevoGasto = {
                name: nombre,
                categoryId: Number(categoria),
                categoryName: categoriaSeleccionada?.name || categoriaSeleccionada?.nombre || "",
                amount: montoParsed,
                commission: comisionCalculada,
                date: fechaIngreso,
                paymentMethod: metodoPago,
                installments: Number(cantidadCuotas)
            };

            console.log("Gasto enviado:", nuevoGasto);

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

                <button
                    type="button"
                    className="expense-modal-close"
                    onClick={onClose}
                >
                    X
                </button>

                <h2 className="expense-modal-title">
                    Registrar gasto
                </h2>

                <form
                    className="expense-modal-form"
                    onSubmit={handleSubmit}
                >

                    <div className="expense-modal-row">

                        <div className="expense-modal-group">
                            <label>Nombre</label>

                            <input
                                type="text"
                                placeholder="Ej: Desayuno"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        <div className="expense-modal-group">
                            <label>Monto</label>

                            <input
                                type="text"
                                placeholder="Ej: 20000"
                                value={monto}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setMonto(value);
                                }}
                                required
                            />
                        </div>

                    </div>

                    <div className="expense-modal-row">

                        <div className="expense-modal-group">
                            <label>Comisión</label>

                            <input
                                type="text"
                                placeholder="Ej: 0.5%"
                                value={comision}
                                onChange={(e) => {
                                    let value = e.target.value;

                                    value = value.replace(/[^0-9.]/g, "");

                                    const parts = value.split(".");

                                    if (parts.length > 2) {
                                        value = parts[0] + "." + parts.slice(1).join("");
                                    }

                                    setComision(value);
                                }}
                            />
                        </div>

                        <div className="expense-modal-group">
                            <label>Categoría</label>

                            <select
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                required
                            >
                                <option value="">
                                    Seleccione una categoría
                                </option>

                                {categorias.map((cat) => (
                                    <option
                                        key={cat.id}
                                        value={cat.id}
                                    >
                                        {cat.name || cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className="expense-modal-row">

                        <div className="expense-modal-group">
                            <label>Método de pago</label>

                            <select
                                value={metodoPago}
                                onChange={(e) => setMetodoPago(e.target.value)}
                                required
                            >
                                <option value="EFECTIVO">
                                    Efectivo
                                </option>

                                <option value="DEBITO">
                                    Débito
                                </option>

                                <option value="CREDITO">
                                    Crédito
                                </option>
                            </select>
                        </div>

                        <div className="expense-modal-group">
                            <label>Fecha del gasto</label>

                            <input
                                type="date"
                                value={fechaIngreso}
                                onChange={(e) => setFechaIngreso(e.target.value)}
                                required
                            />
                        </div>

                    </div>

                    <div className="expense-modal-row">

                        <div className="expense-modal-group">
                            <label>Cantidad de cuotas</label>

                            <input
                                type="text"
                                placeholder="Ej: 1"
                                value={cantidadCuotas}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setCantidadCuotas(value);
                                }}
                                required
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