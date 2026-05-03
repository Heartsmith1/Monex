import { useState } from "react";
import usuario from "../../assets/icon/icono_usuario_blanco.png"
import frameee from "../../assets/icon/Frameee.png"
import ocultar from "../../assets/icon/ocultar_contrasena.png"
import { useNavigate } from "react-router-dom";

export function Register (){

    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [confirmarContraseña, setConfirmarContraseña] = useState("");

    // --- Estados para mensajes de validación ---
    const [mensajeContraseñas, setMensajeContraseñas] = useState("");
    const [colorMensajeContraseñas, setColorMensajeContraseñas] = useState("");
    const [mensajeNombre, setMensajeNombre] = useState("");
    const [colorMensajeNombre, setColorMensajeNombre] = useState("");
    const [mensajeContraseña, setMensajeContraseña] = useState("");
    const [colorMensajeContraseña, setColorMensajeContraseña] = useState("");
    const [mensajeEmail, setMensajeEmail] = useState("");
    const [colorMensajeEmail, setColorMensajeEmail] = useState("");

    // --- Expresiones regulares para validación ---
    const regexEmail = /^[a-zA-Z0-9._%+-]+@(duocuc\.cl|gmail\.com|duocProfesor\.com)$/;
    const regexNombre = /^[a-zA-ZÀ-ÿ\s]{3,40}$/;
    const regexContraseña = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    const validarNombre = (valor) => {
        if (valor === "") {
            setMensajeNombre("Debe ingresar un nombre.");
            setColorMensajeNombre("red");
        } else if (!regexNombre.test(valor)) {
            setMensajeNombre("El nombre solo puede contener letras y espacios (3-40 caracteres).");
            setColorMensajeNombre("red");
        } else {
            setMensajeNombre("Nombre válido");
            setColorMensajeNombre("#0d47a1");
        }
    };

    const validarEmail = (valor) => {
        if (valor === "") {
            setMensajeEmail("Debe ingresar un correo.");
            setColorMensajeEmail("red");
        } else if (!regexEmail.test(valor)) {
            setMensajeEmail("El correo debe ser de dominio @duocuc.cl, @gmail.com o @duocProfesor.com");
            setColorMensajeEmail("red");
        } else {
            setMensajeEmail("Correo válido");
            setColorMensajeEmail("#0d47a1");
        }
    };

    const validarContraseña = (valor) => {
        if (valor === "") {
            setMensajeContraseña("Debe ingresar una contraseña.");
            setColorMensajeContraseña("red");
        } else if (!regexContraseña.test(valor)) {
            setMensajeContraseña("La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.");
            setColorMensajeContraseña("red");
        } else {
            setMensajeContraseña("Contraseña válida");
            setColorMensajeContraseña("#0d47a1");
        }
    };

    const confirmarContraseñas = (valor) => {
        if (valor !== contraseña) {
            setMensajeContraseñas("Las contraseñas no coinciden.");
            setColorMensajeContraseñas("red");
        } else {
            setMensajeContraseñas("Contraseña válida");
            setColorMensajeContraseñas("#0d47a1");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones antes de enviar
        validarNombre(nombre);
        validarContraseña(contraseña);
        validarEmail(email);

        if (contraseña !== confirmarContraseña) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        navigate("/home");
    }

return(
    <div className="contenedor_registro">

      <div className="fondo_imagen"></div>

      <div className="register">
        <div className="register_contenido">

          <h1 className="texto_bienvenidos">REGISTRO</h1>

          <img 
            src={usuario} 
            className="img_register" 
            alt="Imagen logo usuario" 
          />

          <form className="form_register" onSubmit={handleSubmit}>

              <div className="input_group">
                <label className="text_usuario">Nombre usuario</label>
                <div className="input_wrapper">
                  <input
                    className="input_usuario"
                    type="text"
                    placeholder="Ingresa tu nombre"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      validarNombre(e.target.value);
                    }}
                  />
                  <img src={frameee} alt="icono usuario" className="input_icon_usuario" />
                </div>
                <span style={{ color: colorMensajeNombre }}>{mensajeNombre}</span>
              </div>

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

              <div className="input_group">
                <label className="text_contraseña">Repetir contraseña</label>
                <div className="input_wrapper">
                  <input 
                    className="input_contraseña"
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={confirmarContraseña}
                    onChange={(e) => {
                      setConfirmarContraseña(e.target.value);
                      confirmarContraseñas(e.target.value);
                    }}
                  />
                  <img src={ocultar} alt="icono contraseña" className="input_icon_password" />
                </div>
                <span style={{ color: colorMensajeContraseñas }}>{mensajeContraseñas}</span>
              </div>

              <button className="boton_ingresar" type="submit">Registrarse</button>

            </form>
                        
  
        </div>
      </div>

    </div>
  )
}