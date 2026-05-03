import { useState } from "react";
import usuario from "../../assets/icon/icono_usuario_blanco.png"
import frameee from "../../assets/icon/Frameee.png"
import ocultar from "../../assets/icon/ocultar_contrasena.png"
import { useNavigate } from "react-router-dom";

export function Login (){

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");

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
        setMensajeEmail("Correo válido");
        setColorMensajeEmail("#0d47a1");
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
        setMensajeContraseña("Contraseña válida");
        setColorMensajeContraseña("#0d47a1");
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
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      value={contraseña}
                      onChange={(e) => {
                      setContraseña(e.target.value);
                      validarContraseña(e.target.value);
                      }}
                      />
                      <img src={ocultar} alt="icono contraseña" className="input_icon_password" />
                  </div>
                  <span style={{ color: colorMensajeContraseña }}>{mensajeContraseña}</span>
            </div>

            <button className="boton_ingresar" type="submit">Iniciar sesión</button>

          </form>
           

        </div>
      </div>

    </div>
  )
}