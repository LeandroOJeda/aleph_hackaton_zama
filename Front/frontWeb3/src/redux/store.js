import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducer";
import { thunk } from "redux-thunk";

// Si Redux DevTools está disponible, lo usamos, sino usamos una función que no haga nada.
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;