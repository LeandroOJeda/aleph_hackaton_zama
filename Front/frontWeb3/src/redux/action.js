import axios from "axios";
// import { RoleBasedAccess } from "../components/RoleBasedAccess/RoleBasedAccess";
export const SET_PAGE = "SET_PAGE";
export const SET_PAGINATION = "SET_PAGINATION";
export const SET_ROL_USUARIO = "SET_ROL_USUARIO";
export const SET_DEPARTAMENT = "SET_DEPARTAMENT";
export const STATUS_USER = "STATUS_USER";
export const SET_MESSAGES = "SET_MESSAGES";
export const DETAIL_INFO = "DETAIL_INFO";
export const MESSAGE_DETAIL = "MESSAGE_DETAIL";
export const SET_MESSAGES_ADMIN = "SET_MESSAGES_ADMIN";
export const MESSAGE_DETAIL_ADMIN = "MESSAGE_DETAIL_ADMIN";

export const logIn = (user, navigate, Swal) => {
  // const endpoint = `${apiUrl}/JNR/login`;

  return async (dispatch) => {
    try {
      const userLogged = await axios.post("/api/v1/auth/login", user);
      // if (userLogged.data == "Contraseña incorrecta") {
      //   return console.log("Usuario o contraseña incorrecto");
      // }

      if (userLogged) {
        const accessToken = userLogged.data.accessToken;
        const refreshToken = userLogged.data.refreshToken;
        const roles = userLogged.data.roles;
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("roles", roles);
        Swal.fire({
          text: "Acceso concedido",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        navigate("/form");
        return console.log("Usuario logueado y token guardado");
      }

      // return console.log(userLogged);
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message;
        switch (status) {
          case 400:
            console.log("Solicitud invalida. Verifica los datos ingresados");
            Swal.fire({
              text: "Usuario o contraseña incorrecto",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
            break;

          case 401:
            console.log("No autorizado. Credenciales incorrectas");
            Swal.fire({
              text: "Usuario o contraseña incorrecto",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
            break;

          case 500:
            console.log("Error del servidor. Intenta mas tarde");
            Swal.fire({
              text: "Error del servidor. Intente más tarde",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
        }
      }
    }
  };
};


export const getAuto = (patente) => {
  const accessToken = localStorage.getItem("accessToken");
  return async (dispatch) => {
    console.log("llega al action");
  
    try {

      const response = await axios.get(`/api/v1/vehicles/${patente}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      })
      console.log(response.data);
      
      return response.data
      
    
    } catch (error) {
      console.log(error.message);
    
    }
  }
}