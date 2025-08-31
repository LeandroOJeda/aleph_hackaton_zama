import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const HistorialVehiculo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { vehicleData } = location.state || {};
    
    const [historial, setHistorial] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!vehicleData) {
            navigate('/form');
            return;
        }
        
        fetchHistorial();
    }, [vehicleData]);

    const fetchHistorial = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.get(`/api/v1/events/vehicle/${vehicleData.id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            
            setHistorial(response.data || []);
        } catch (error) {
            console.error('Error al obtener historial:', error);
            setError('No se pudo cargar el historial del vehículo');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/form', { 
            state: { vehicleData } 
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEventIcon = (description) => {
        const desc = description.toLowerCase();
        if (desc.includes('mantenimiento')) return 'fas fa-tools';
        if (desc.includes('inspección') || desc.includes('vtv')) return 'fas fa-clipboard-check';
        if (desc.includes('reparación')) return 'fas fa-wrench';
        if (desc.includes('entrega') || desc.includes('venta')) return 'fas fa-handshake';
        if (desc.includes('seguro') || desc.includes('reclamo')) return 'fas fa-shield-alt';
        return 'fas fa-car';
    };

    const getEventColor = (description) => {
        const desc = description.toLowerCase();
        if (desc.includes('mantenimiento')) return '#28a745';
        if (desc.includes('inspección') || desc.includes('vtv')) return '#17a2b8';
        if (desc.includes('reparación')) return '#ffc107';
        if (desc.includes('entrega') || desc.includes('venta')) return '#6f42c1';
        if (desc.includes('seguro') || desc.includes('reclamo')) return '#dc3545';
        return '#6c757d';
    };

    if (!vehicleData) {
        return null;
    }

    return (
        <div
            className="d-flex justify-content-center align-items-start py-5"
            style={{
                backgroundColor: '#e8f4f8',
                minHeight: '100vh',
                backgroundImage: 'linear-gradient(135deg, #e8f4f8 0%, #d1ecf1 100%)'
            }}
        >
            <div className="container" style={{ maxWidth: '900px' }}>
                <div
                    className="card shadow-lg border-0 p-4"
                    style={{
                        borderRadius: '20px',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    {/* Header */}
                    <div className="text-center mb-4">
                        <h2 className="fw-bold mb-0" style={{ color: '#17a2b8', fontSize: '1.8rem' }}>
                            Historial Vehicular Blockchain
                        </h2>
                        <p className="text-secondary mt-2 mb-0">
                            {vehicleData.licensePlate} - {vehicleData.brand} {vehicleData.model}
                        </p>
                    </div>

                    {/* Vehicle Info Summary */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <div className="text-center p-3" style={{ 
                                backgroundColor: 'white', 
                                borderRadius: '10px',
                                border: '2px solid #dee2e6'
                            }}>
                                <i className="fas fa-tachometer-alt mb-2" style={{ color: '#17a2b8', fontSize: '1.5rem' }}></i>
                                <p className="mb-0 fw-semibold">Último Kilometraje</p>
                                <h5 className="mb-0" style={{ color: '#17a2b8' }}>
                                    {vehicleData.blockchain?.lastKilometers || '0'} km
                                </h5>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-3" style={{ 
                                backgroundColor: 'white', 
                                borderRadius: '10px',
                                border: '2px solid #dee2e6'
                            }}>
                                <i className="fas fa-history mb-2" style={{ color: '#28a745', fontSize: '1.5rem' }}></i>
                                <p className="mb-0 fw-semibold">Total Eventos</p>
                                <h5 className="mb-0" style={{ color: '#28a745' }}>
                                    {historial.length}
                                </h5>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-3" style={{ 
                                backgroundColor: 'white', 
                                borderRadius: '10px',
                                border: `2px solid ${vehicleData.blockchain?.verified ? '#28a745' : '#dc3545'}`
                            }}>
                                <i className={`fas ${vehicleData.blockchain?.verified ? 'fa-check-circle' : 'fa-times-circle'} mb-2`} 
                                   style={{ color: vehicleData.blockchain?.verified ? '#28a745' : '#dc3545', fontSize: '1.5rem' }}>
                                </i>
                                <p className="mb-0 fw-semibold">Estado Blockchain</p>
                                <h6 className="mb-0" style={{ color: vehicleData.blockchain?.verified ? '#28a745' : '#dc3545' }}>
                                    {vehicleData.blockchain?.verified ? 'Verificado' : 'No Verificado'}
                                </h6>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-5">
                            <div className="spinner-border" style={{ color: '#17a2b8' }} role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-3 text-secondary">Cargando historial desde blockchain...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-5">
                            <i className="fas fa-exclamation-triangle mb-3" style={{ color: '#dc3545', fontSize: '3rem' }}></i>
                            <h5 className="text-danger">{error}</h5>
                        </div>
                    )}

                    {/* Historial Events */}
                    {!isLoading && !error && (
                        <>
                            {historial.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-inbox mb-3" style={{ color: '#6c757d', fontSize: '3rem' }}></i>
                                    <h5 className="text-secondary">No hay eventos registrados</h5>
                                    <p className="text-secondary">Este vehículo no tiene historial en blockchain</p>
                                </div>
                            ) : (
                                <div className="row">
                                    <div className="col-12">
                                        <h5 className="fw-bold mb-3" style={{ color: '#17a2b8' }}>
                                            Eventos Registrados ({historial.length})
                                        </h5>
                                        
                                        {/* Timeline de eventos */}
                                        <div className="timeline-container">
                                            {historial.map((evento, index) => (
                                                <div key={evento.id || index} className="timeline-item mb-4">
                                                    <div className="row align-items-center">
                                                        <div className="col-md-2 text-center">
                                                            <div 
                                                                className="timeline-icon d-inline-flex align-items-center justify-content-center"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: getEventColor(evento.description),
                                                                    color: 'white'
                                                                }}
                                                            >
                                                                <i className={getEventIcon(evento.description)}></i>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-10">
                                                            <div 
                                                                className="card border-0 shadow-sm"
                                                                style={{ backgroundColor: 'white', borderRadius: '10px' }}
                                                            >
                                                                <div className="card-body">
                                                                    <div className="row">
                                                                        <div className="col-md-8">
                                                                            <h6 className="fw-bold mb-2">{evento.description}</h6>
                                                                            <p className="text-secondary mb-1">
                                                                                <i className="fas fa-map-marker-alt me-2"></i>
                                                                                {evento.location}
                                                                            </p>
                                                                            <p className="text-secondary mb-1">
                                                                                <i className="fas fa-building me-2"></i>
                                                                                {evento.organization?.name || 'Organización desconocida'}
                                                                            </p>
                                                                        </div>
                                                                        <div className="col-md-4 text-end">
                                                                            <div className="mb-2">
                                                                                <span 
                                                                                    className="badge px-3 py-2"
                                                                                    style={{ 
                                                                                        backgroundColor: getEventColor(evento.description),
                                                                                        color: 'white',
                                                                                        fontSize: '0.9rem'
                                                                                    }}
                                                                                >
                                                                                    {evento.kilometers?.toLocaleString()} km
                                                                                </span>
                                                                            </div>
                                                                            <small className="text-secondary">
                                                                                {formatDate(evento.eventDate)}
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className="row mt-4 g-2">
                        <div className="col-6">
                            <button
                                className="btn w-100 fw-semibold"
                                onClick={handleBack}
                                style={{
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '12px',
                                    fontSize: '1rem'
                                }}
                            >
                                Volver
                            </button>
                        </div>
                        <div className="col-6">
                            <button
                                className="btn w-100 fw-semibold"
                                onClick={() => window.print()}
                                style={{
                                    backgroundColor: '#17a2b8',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '12px',
                                    fontSize: '1rem'
                                }}
                            >
                                Imprimir Historial
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistorialVehiculo;