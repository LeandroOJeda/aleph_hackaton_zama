import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, useLocation } from "react-router-dom";
import Login from './views/Login/Login';
import Consultas from './views/consultas/Consultas';
import VehicleDisplay from './views/visualizadorDatos/VisualizadorDatos';
import AseguradorasForm from './views/aseguradoras_form/AseguradorasForm';
import SuperAdminEventForm from './views/eventos/SuperAdminEventForm';
import AdminEventForm from './views/eventos/AdminEventForm';
import TallerEventForm from './views/eventos/TallerEventForm';
import ConcesionariaEventForm from './views/eventos/ConcesionariaEventForm';
import SimulacionPago from './views/simulacionPago/SimulacionPago';
import HistorialVehiculo from './views/historialVehiculo/HistorialVehiculo';
import NavBar from './components/NavBar/NavBar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Componente para mostrar NavBar condicionalmente
function AppContent() {
  const location = useLocation();
  const showNavBar = location.pathname !== '/';

  return (
    <>
      {showNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route 
          path="/form" 
          element={<Consultas />} 
        />
        
        {/* Rutas protegidas por rol */}
        <Route 
          path="/eventos/superadmin" 
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminEventForm />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/eventos/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <AdminEventForm />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/eventos/aseguradora" 
          element={
            <ProtectedRoute allowedRoles={['aseguradora']}>
              <AseguradorasForm />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/eventos/taller" 
          element={
            <ProtectedRoute allowedRoles={['taller']}>
              <TallerEventForm />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/eventos/concesionaria" 
          element={
            <ProtectedRoute allowedRoles={['concesionaria']}>
              <ConcesionariaEventForm />
            </ProtectedRoute>
          } 
        />

        {/* Ruta legacy para aseguradoras */}
        <Route 
          path="/eventos" 
          element={
            <ProtectedRoute allowedRoles={['aseguradora']}>
              <AseguradorasForm />
            </ProtectedRoute>
          } 
        />

        {/* Rutas para flujo de historial vehicular */}
        <Route 
          path="/simulacion-pago" 
          element={<SimulacionPago />} 
        />
        
        <Route 
          path="/historial-vehiculo" 
          element={<HistorialVehiculo />} 
        />
      </Routes>
    </>
  );
}

function App() {
  return <AppContent />
}

export default App
