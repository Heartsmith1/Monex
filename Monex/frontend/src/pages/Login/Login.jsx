import { useState } from "react";
import usuario from "../../assets/icon/usuario.png"

export function Login (){

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errores, setErrores] = useState({});

const validar = () => {
    let nuevosErrores = {};

    if (!email) {
      nuevosErrores.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nuevosErrores.email = "El email no es válido";
    }

    if (!password) {
      nuevosErrores.password = "La contraseña es obligatoria";
    }

return nuevosErrores;
};   
  
const handleSubmit = (e) => {
    e.preventDefault();

const erroresValidados = validar();
setErrores(erroresValidados);

if (Object.keys(erroresValidados).length === 0) {
      console.log("Formulario válido");
     
}
};

return(
    <div className="contenedor_login">

      <div className="fondo_imagen"></div>

      <div className="login">
        <div className="login_contenido">

          <h1 className="texto_bienvenidos">BIENVENIDOS</h1>

          <img 
            src={usuario} 
            className="img_login" 
            alt="Imagen logo usuario" 
          />

          <form className="form_login" onSubmit={handleSubmit}>

            <div>
              <label className="text_email">Email</label>
              <input 
                className="input_email"
                type="text"
                placeholder="Ingresa tu correo electronico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errores.email && <span className="error">{errores.email}</span>}
            </div>

            <div>
              <label className="text_contraseña">Contraseña</label>
              <input 
                className="input_contraseña"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errores.password && <span className="error">{errores.password}</span>}
            </div>

            <button className="boton_ingresar" type="submit">Iniciar sesion</button>

          </form>
            <p>¿Todavía no tienes una cuenta o has olvidado tu contraseña? </p>

        </div>
      </div>

    </div>
  )
}