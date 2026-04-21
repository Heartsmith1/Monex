import usuario from "../../assets/icon/usuario.png"

export function Login (){


    return(
        <div className="contenedor_login">

            {/* LA IMAGEN SE ESTA LLAMANDO DESDE CSS YA QUE ES FONDO */}
            <div className="fondo_imagen">
            </div>

            <div className="login">
                <h1>BIENVENIDOS</h1>

                <img src={usuario} className="img_login" alt="Imagen logo usuario" />

                <form className="form_login" action="">

                    <div>
                        <label className="text_email" htmlFor="input_email">Email</label>
                        <input className="input_email" type="text" placeholder="Ingresa tu correo electronico"  id="input_email"/>

                    </div>

                    <div>

                        <label className="text_contraseña" htmlFor="input_contraseña">Contraseña</label>
                        <input className="input_contraseña" type="password" placeholder="Ingresa tu contraseña" id="input_contraseña"/>

                    </div>
                </form>
            </div>

        </div>
    )
}
    