import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './views/Login/Login';
import Consultas from './views/consultas/Consultas';
import VehicleDisplay from './views/visualizadorDatos/VisualizadorDatos';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}></Route>

        <Route path="/form" element={<Consultas />}></Route>
      </Routes >

      {/* <Route path="/datos" element={<VehicleDisplay />}></Route> */}

    </>
  )
}

export default App
