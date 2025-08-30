import { SET_ROL_USUARIO } from "./action";





const initialState = {
  rolUsuario: null,
  dataAuto:{}
}

const rootReducer = (state = initialState, action) => {
  const { payload } = action;
  switch (action.type) {
    case "FETCH_USUARIOS_REQUEST":
      return {
        ...state,
        loading: true, // Estamos esperando datos, por lo que ponemos loading en true
      };
    case "FETCH_USUARIOS_SUCCESS":
      return {
        ...state,
        usuarios: payload, // Guardamos los usuarios en el estado
        loading: false, // Ya no estamos cargando
      };
    case "FETCH_USUARIOS_ERROR":
      return {
        ...state,
        error: action.payload, // Si hay un error, lo guardamos
        loading: false, // De todas formas, no estamos cargando
      };
    case SET_ROL_USUARIO:
      return {
        ...state,
        rolUsuario: payload,
      };
    
    case "DATA_AUTO":
      return {
        ...state,
        dataAuto:payload,
      }
default:
      return state; // Si no hay ninguna acción que coincida, mantenemos el estado igual
  }
};

export default rootReducer;
