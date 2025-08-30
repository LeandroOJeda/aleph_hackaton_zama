import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import validation from "./validation.js";
import Swal from "sweetalert2";
import { logIn } from "../../redux/action.js";
import style from "./Login.module.css";
// import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay.jsx";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // Estado para el overlay
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
      setLoading(true); // Mostrar overlay
      try {
        // Intentar iniciar sesión
        await dispatch(logIn(user, navigate, Swal));

        // Si el inicio de sesión fue exitoso, actualizar el rol del usuario en Redux
        // dispatch(setRolUsuario());
        console.log("Inicio de sesión exitoso y rol actualizado en Redux");
      } catch (err) {
        console.error("Error durante el inicio de sesión", err);
        Swal.fire(
          "Error",
          "No se pudo iniciar sesión, intenta de nuevo",
          "error"
        );
      } finally {
        setLoading(false); // Ocultar overlay
      }
    }
  };

  const register = () => {
    navigate("/signUp");
  };

  return (
    <div className={style.bigDiv}>
      <div className={style.divForm}>
        <h3 className={style.titulo}>Iniciar Sesion</h3>
        <form onSubmit={handleSubmit} className={style.form}>
          {/* <div class="form-floating mb-3">
            <input
              type="email"
              class="form-control"
              id="floatingInput"
              name="email"
              placeholder="name@example.com"
              onChange={handleChange}
            ></input>
            <label for="floatingInput">Email</label>
          </div> */}
          <div className={`mb-3 ${style.divInput}`}>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            ></input>
            <label className={`form-label ${style.errorLabel}`}>
              {showError.email}
            </label>
          </div>
          <div className={`mb-3 ${style.divInput}`}>
            <input
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Contraseña"
              name="password"
              type="password"
              onChange={handleChange}
            ></input>
            <label className={`form-label ${style.errorLabel}`}>
              {showError.password}
            </label>
          </div>
          <div className={style.divButton}>
            <button
              type="submit"
              className={`btn btn-primary ${style.button1}`}
              disabled={loading}
            >
              Iniciar Sesion
            </button>
            {/* <button
              type="button"
              className={`btn btn-primary ${style.button2}`}
              onClick={register}
              disabled={loading}
            >
              Registrarse
            </button> */}
          </div>
        </form>
      </div>
      {/* Overlay para el estado de carga */}
      {/* <LoadingOverlay isVisible={loading} /> */}
    </div>
  );
}

export default Login;

// import React from "react";
// import { useState } from "react";
// import validation from "./Validation";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { logIn } from "../../redux/actions";
// import style from "./Login.module.css";
// import { setRolUsuario } from "../../redux/actions";

// function Login() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [error, setError] = useState({
//     email: "",
//     password: "",
//   });

//   const [user, setUser] = useState({
//     email: "",
//     password: "",
//   });

//   const [showError, setShowError] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (event) => {
//     const property = event.target.name;
//     const value = event.target.value;
//     setUser({ ...user, [property]: value });
//     setError(validation({ ...user, [property]: value }));
//   };

//   const handleSubmit = async (event) => {
//     setShowError({
//       ...showError,
//       email: error.email,
//       password: error.password,
//     });
//     event.preventDefault();
//     if (user.email == "" && user.password == "") {
//       setError(validation(user));
//       setShowError({
//         ...showError,
//         email: "Por favor, ingresa tu dirección de email",
//         password: "Por favor, ingresa tu contraseña",
//       });
//       return console.log("faltan datos");
//     }
//     if (error.email == "" && error.password == "") {
//       console.log(user);

//       dispatch(logIn(user, navigate, Swal));
//       console.log("se comprueba el inicio de sesion");
//     }
//   };

//   const register = () => {
//     dispatch(setRolUsuario());
//     const rol = useSelector((state) => {
//       state.rolUsuario;
//     });
//     console.log("pasa por aca 2222");

//     navigate("/signUp");
//   };

//   return (
//     <div className={style.bigDiv}>
//       {/* <form onSubmit={handleSubmit}>
//         <input
//           placeholder="Email"
//           name="email"
//           type="Email"
//           onChange={(event) => {
//             handleChange(event);
//           }}
//         ></input>
//         <label>{showError.email}</label>

//         <input
//           placeholder="Contraseña"
//           name="password"
//           type="Password"
//           onChange={(event) => {
//             handleChange(event);
//           }}
//         ></input>
//         <label>{showError.password}</label>

//         <button type="submit">Iniciar Sesion</button>
//       </form> */}

//       <div className={style.divForm}>
//         <h3 className={style.titulo}>Iniciar Sesion</h3>
//         <form onSubmit={handleSubmit} className={style.form}>
//           <div className={`mb-3 ${style.divInput}`}>
//             <input
//               type="email"
//               class="form-control"
//               id="exampleInputEmail1"
//               aria-describedby="emailHelp"
//               placeholder="Email"
//               name="email"
//               onChange={(event) => {
//                 handleChange(event);
//               }}
//             ></input>
//             <label
//               for="exampleInputEmail1"
//               className={`form-label ${style.errorLabel}`}
//             >
//               {showError.email}
//             </label>
//             {/* <div id="emailHelp" class="form-text">
//             We'll never share your email with anyone else.
//           </div> */}
//           </div>
//           <div className={`mb-3 ${style.divInput}`}>
//             <input
//               class="form-control"
//               id="exampleInputPassword1"
//               placeholder="Contraseña"
//               name="password"
//               type="password"
//               onChange={(event) => {
//                 handleChange(event);
//               }}
//             ></input>
//             <label
//               for="exampleInputPassword1"
//               className={`form-label ${style.errorLabel}`}
//             >
//               {showError.password}
//             </label>
//           </div>
//           {/* <div class="mb-3 form-check">
//             <input
//               type="checkbox"
//               class="form-check-input"
//               id="exampleCheck1"
//             ></input>
//           </div> */}
//           <div className={style.divButton}>
//             <button
//               type="submit"
//               className={`btn btn-primary ${style.button1}`}
//             >
//               Iniciar Sesion
//             </button>
//             <button
//               className={`btn btn-primary ${style.button2}`}
//               onClick={register}
//             >
//               Registrarse
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;

/////tailwind
//https://tailwindui.com/components/application-ui/forms/sign-in-forms
