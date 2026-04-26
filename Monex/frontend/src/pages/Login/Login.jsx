import { useState } from "react";
import usuario from "../../assets/icon/icono_usuario_blanco.png"
import frameee from "../../assets/icon/Frameee.png"
import ocultar from "../../assets/icon/ocultar_contrasena.png"
import { useNavigate } from "react-router-dom";

export function Login (){

  const navigate = useNavigate();

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
      navigate("/home");
    }
  };

return(
    <div className="contenedor_login">

      <div className="fondo_imagen"></div>

      <div className="login">
        <div className="login_contenido">

          <h1 className="texto_bienvenidos">Bienvenido</h1>

          <img 
            src={usuario} 
            className="img_login" 
            alt="Imagen logo usuario" 
          />

          <form className="form_login" onSubmit={handleSubmit}>


            <div className="input_group">
              <label className="text_email">Email</label>
              <div className="input_wrapper">
                <input
                  className="input_email"
                  type="text"
                  placeholder="Ingresa tu correo electronico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <img src={frameee} alt="icono email" className="input_icon_email" />
              </div>
              {errores.email && <span className="error">{errores.email}</span>}
            </div>

            <div className="input_group">
              <label className="text_contraseña">Contraseña</label>
              <div className="input_wrapper">
                <input 
                  className="input_contraseña"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                /> 
                  {/* Agregar funcionalidad de este icono  */}
                 <img src={ocultar} alt="icono contraseña" className="input_icon_password" />
              </div>
              {errores.password && <span className="error">{errores.password}</span>}
               <h3 className="texto_olvidar_contraseña">¿Olvidaste tu contraseña?</h3>
            </div>

            <button className="boton_ingresar" type="submit">Iniciar sesión</button>

          </form>
           

        </div>
      </div>

    </div>
  )
}