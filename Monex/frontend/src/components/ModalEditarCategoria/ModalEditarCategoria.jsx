export function ModalEditarCategoria({
    nombreEditado,
    setNombreEditado,
    cerrarModalEditar,
    guardarCambios,
}) {
    return (
        <div className="modal_overlay">
            <div className="modal_editar">
                <button className="btn_cerrar_modal" onClick={cerrarModalEditar}>
                    X
                </button>

                <h2>Editar categoría</h2>

                <label>Nombre</label>
                <input
                    type="text"
                    value={nombreEditado}
                    onChange={(e) => setNombreEditado(e.target.value)}
                />

                <div className="modal_botones">
                    <button className="btn_cancelar_modal" onClick={cerrarModalEditar}>
                        Cancelar
                    </button>

                    <button className="btn_guardar_modal" onClick={guardarCambios}>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}