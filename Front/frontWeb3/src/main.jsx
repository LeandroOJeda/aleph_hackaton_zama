import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/colors.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import axios from 'axios'
import store from './redux/store.js'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Incluye Popper.js
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers = { 'ngrok-skip-browser-warning': '69420' }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>


      <BrowserRouter>
        <App />

      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
