import { useState } from "react";
import usuario from "../../assets/icon/icono_usuario_blanco.png"
import frameee from "../../assets/icon/Frameee.png"
import logo from "../../assets/logo/Logo_Monex_Azul.png"
import ocultar from "../../assets/icon/ocultar_contrasena.png"
import { useNavigate } from "react-router-dom";

export function Login (){

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Nuevo estado para controlar la visibilidad de la contraseña

    // --- Estados para mensajes de validación ---
    const [mensajeContraseñas, setMensajeContraseñas] = useState("");
    const [colorMensajeContraseñas, setColorMensajeContraseñas] = useState("");
    const [mensajeContraseña, setMensajeContraseña] = useState("");
    const [colorMensajeContraseña, setColorMensajeContraseña] = useState("");
    const [mensajeEmail, setMensajeEmail] = useState("");
    const [colorMensajeEmail, setColorMensajeEmail] = useState("");

    // --- Expresiones regulares para validación ---
    const regexEmail = /^[a-zA-Z0-9._%+-]+@(duocuc\.cl|gmail\.com|duocProfesor\.com)$/;
    const regexNombre = /^[a-zA-ZÀ-ÿ\s]{3,40}$/;
    const regexContraseña = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    
  const validarEmail = (valor) => {
    if (valor === "") {
        setMensajeEmail("Debe ingresar un correo.");
        setColorMensajeEmail("red");
        return false;
    } else if (!regexEmail.test(valor)) {
        setMensajeEmail("Correo inválido");
        setColorMensajeEmail("red");
        return false;
    } else {
        return true;
    }
};

const validarContraseña = (valor) => {
    if (valor === "") {
        setMensajeContraseña("Debe ingresar una contraseña.");
        setColorMensajeContraseña("red");
        return false;
    } else if (!regexContraseña.test(valor)) {
        setMensajeContraseña("Contraseña inválida");
        setColorMensajeContraseña("red");
        return false;
    } else {
        return true;
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const esPasswordValida = validarContraseña(contraseña);
    const esEmailValido = validarEmail(email);

    if (!esPasswordValida || !esEmailValido) {
        return; 
    }

    navigate("/home"); 
};

return(
    <div className="contenedor_login">

      <div className="fondo_imagen"></div>

      <div className="login">
        <div className="login_contenido">
          <img 
            src={usuario} 
            className="img_login" 
            alt="Imagen logo usuario" 
          />
          <img src={logo} alt="Logo Monex azul" className="img_logo" />

          <form className="form_login" onSubmit={handleSubmit}>

              <div className="input_group">
                  <label className="text_email">Email</label>
                  <div className="input_wrapper">
                      <input
                      className="input_email"
                      type="text"
                      placeholder="Ingresa tu correo electronico"
                      value={email}
                      onChange={(e) => {
                      setEmail(e.target.value);
                      validarEmail(e.target.value);
                      }}
                      />
                      <img src={frameee} alt="icono email" className="input_icon_email" />
                  </div>
                  <span style={{ color: colorMensajeEmail }}>{mensajeEmail}</span>
              </div>

              <div className="input_group">
                  <label className="text_contraseña">Contraseña</label>
                  <div className="input_wrapper">
                      <input 
                        className="input_contraseña"
                        type={showPassword ? "text" : "password"} // Cambia el tipo basado en el estado showPassword
                        placeholder="Ingresa tu contraseña"
                        value={contraseña}
                        onChange={(e) => {
                          setContraseña(e.target.value);
                          validarContraseña(e.target.value);
                        }}
                      />
                      <img 
                        src={ocultar} // Puedes cambiar esto a `showPassword ? mostrar : ocultar` si tienes dos iconos
                        alt="icono contraseña" 
                        className="input_icon_password" 
                        onClick={() => setShowPassword(!showPassword)} // Agrega el evento onClick para alternar la visibilidad
                      />
                  </div>
                  <span style={{ color: colorMensajeContraseña }}>{mensajeContraseña}</span>
            </div>
            
            <div className="contenedor-botones">
              <button className="boton_ingresar" type="submit">Iniciar sesión</button>
              <button className="boton_registro" type="button" onClick={() => navigate("/Register")}>Registrate</button>
            </div>

          </form>
           

        </div>
      </div>

    </div>
  )
}