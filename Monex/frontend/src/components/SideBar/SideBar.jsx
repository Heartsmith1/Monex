export function SideBar(){

    return(

        <div className="contenedor_sideBar">
            <div className="contenedor_botones">
                <button type="buttom" className="boton_inicio">Inicio</button>

                <button type="buttom" className="boton_gastos">Gastos</button>

                <button type="buttom" className="boton_categoria">Categoria</button>

                <button type="buttom" className="boton_analisis">Analisis</button>

                <button type="buttom" className="boton_est_mensual">Est. Mensual</button>
            </div>


            <div className="sidebar_footer">
                <div className="usuario_info">
                    <div>
                        <p className="texto_usuario_sidebar">Nombre usuario</p>
                        <p className="texto_email_sidebar">usuario@gmail.com</p>
                    </div>
                </div>

                <button className="boton_logout">Cerrar Sesión</button>
            </div>
        </div>
    )
}