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
        localStorage.setItem("roles", JSON.stringify(roles));
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
    console.log("Buscando vehículo:", patente);
  
    try {
      const response = await axios.get(`/api/v1/vehicles/${patente}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      console.log("Respuesta del servidor:", response.status, response.data);
      
      if (response && response.data) {
        dispatch({type:"DATA_AUTO", payload: response.data})
        return response.data;
      } else {
        console.log("No se recibieron datos del servidor");
        dispatch({type:"DATA_AUTO", payload: null});
        throw new Error("No se recibieron datos del servidor");
      }
      
    } catch (error) {
      console.error("Error en getAuto:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      dispatch({type:"DATA_AUTO", payload: null});
      throw error; // Re-lanzar el error para que el componente lo maneje
    }
  }
}

export const createEvent = (eventData) => {
  const accessToken = localStorage.getItem("accessToken");
  return async (dispatch) => {
    console.log("Creando evento:", eventData);
    
    try {
      const response = await axios.post("/api/v1/events", eventData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      });
      
      console.log("Evento creado:", response.data);
      return response.data;
      
    } catch (error) {
      console.log("Error al crear evento:", error.message);
      throw error;
    }
  }
}