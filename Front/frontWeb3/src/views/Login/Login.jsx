import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import validation from "./validation.js";
import Swal from "sweetalert2";
import { logIn } from "../../redux/action.js";
import style from "./Login.module.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [showError, setShowError] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const property = event.target.name;
    const value = event.target.value;
    setUser({ ...user, [property]: value });
    setError(validation({ ...user, [property]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowError({
      ...showError,
      email: error.email,
      password: error.password,
    });

    if (user.email === "" && user.password === "") {
      setError(validation(user));
      setShowError({
        email: "Por favor, ingresa tu dirección de email",
        password: "Por favor, ingresa tu contraseña",
      });
      return;
    }

    if (error.email === "" && error.password === "") {
      setLoading(true);
      try {
        await dispatch(logIn(user, navigate, Swal));
        console.log("Inicio de sesión exitoso y rol actualizado en Redux");
      } catch (err) {
        console.error("Error durante el inicio de sesión", err);
        Swal.fire(
          "Error",
          "No se pudo iniciar sesión, intenta de nuevo",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={style.container}>
      <div className={style.card}>
        {/* Header with Icon and Title */}
        <div className={style.header}>
          <div className={style.iconContainer}>
            <div className={style.iconWrapper}>
              {/* Car Icon */}
              <svg className={style.carIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/>
              </svg>
              {/* Shield Icon (smaller) */}
              <svg className={style.shieldIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C9.24,7 7,9.24 7,12S9.24,17 12,17S17,14.76 17,12S14.76,7 12,7M12,8.5C13.93,8.5 15.5,10.07 15.5,12S13.93,15.5 12,15.5S8.5,13.93 8.5,12S10.07,8.5 12,8.5Z"/>
              </svg>
            </div>
          </div>
          <h1 className={style.title}>VehicleChain</h1>
          <p className={style.subtitle}>
            Historial vehicular certificado por blockchain
          </p>
        </div>

        {/* Login Form */}
        <div className={style.content}>
          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.inputGroup}>
              <label htmlFor="email" className={style.label}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="usuario@ejemplo.com"
                value={user.email}
                onChange={handleChange}
                className={`${style.input} ${showError.email ? style.inputError : ''}`}
                disabled={loading}
                required
              />
              {showError.email && (
                <div className={style.errorAlert}>
                  <span className={style.errorMessage}>{showError.email}</span>
                </div>
              )}
            </div>

            <div className={style.inputGroup}>
              <label htmlFor="password" className={style.label}>
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={user.password}
                onChange={handleChange}
                className={`${style.input} ${showError.password ? style.inputError : ''}`}
                disabled={loading}
                required
              />
              {showError.password && (
                <div className={style.errorAlert}>
                  <span className={style.errorMessage}>{showError.password}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={style.submitButton}
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
}

export default Login;