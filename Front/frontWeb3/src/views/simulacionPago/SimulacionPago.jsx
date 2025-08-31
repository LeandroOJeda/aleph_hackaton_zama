import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SimulacionPago = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { vehicleData } = location.state || {};
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStep, setPaymentStep] = useState(1); // 1: detalles, 2: procesando, 3: completado

    if (!vehicleData) {
        navigate('/form');
        return null;
    }

    const handlePayment = async () => {
        setPaymentStep(2);
        setIsProcessing(true);
        
        // Simular proceso de pago
        setTimeout(() => {
            setPaymentStep(3);
            setIsProcessing(false);
            
            // Redirigir al historial después de 2 segundos
            setTimeout(() => {
                navigate('/historial-vehiculo', { 
                    state: { vehicleData } 
                });
            }, 2000);
        }, 3000);
    };

    const handleCancel = () => {
        navigate('/form', { 
            state: { vehicleData } 
        });
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center py-5"
            style={{
                backgroundColor: '#e8f4f8',
                minHeight: '100vh',
                backgroundImage: 'linear-gradient(135deg, #e8f4f8 0%, #d1ecf1 100%)'
            }}
        >
            <div className="container" style={{ maxWidth: '600px' }}>
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
                            Consulta de Historial Vehicular
                        </h2>
                        <p className="text-secondary mt-2 mb-0">
                            Vehículo: {vehicleData.licensePlate} - {vehicleData.brand} {vehicleData.model}
                        </p>
                    </div>

                    {paymentStep === 1 && (
                        <>
                            {/* Detalles del servicio */}
                            <div className="row g-3 mb-4">
                                <div className="col-12">
                                    <div
                                        className="p-3"
                                        style={{
                                            backgroundColor: 'white',
                                            border: '2px solid #17a2b8',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        <h5 className="fw-bold text-center mb-3" style={{ color: '#17a2b8' }}>
                                            Detalle del Servicio
                                        </h5>
                                        <div className="row">
                                            <div className="col-8">
                                                <p className="mb-1 fw-semibold">Consulta de Historial Blockchain</p>
                                                <small className="text-secondary">
                                                    Acceso completo al historial de eventos del vehículo almacenado en blockchain
                                                </small>
                                            </div>
                                            <div className="col-4 text-end">
                                                <h4 className="fw-bold" style={{ color: '#17a2b8' }}>$2.99</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Simulación de método de pago */}
                            <div className="row g-3 mb-4">
                                <div className="col-12">
                                    <label className="form-label fw-semibold text-secondary mb-2">
                                        Método de Pago
                                    </label>
                                    <div
                                        className="form-control d-flex align-items-center"
                                        style={{
                                            backgroundColor: 'white',
                                            border: '2px solid #dee2e6',
                                            borderRadius: '10px',
                                            padding: '15px'
                                        }}
                                    >
                                        <i className="fas fa-credit-card me-3" style={{ color: '#17a2b8', fontSize: '1.2rem' }}></i>
                                        <span className="fw-semibold">**** **** **** 4242</span>
                                        <span className="badge bg-success ms-auto">Verificada</span>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="row g-2">
                                <div className="col-6">
                                    <button
                                        className="btn w-100 fw-semibold"
                                        onClick={handleCancel}
                                        style={{
                                            backgroundColor: '#6c757d',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            padding: '12px',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button
                                        className="btn w-100 fw-semibold"
                                        onClick={handlePayment}
                                        style={{
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            padding: '12px',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        Pagar $2.99
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {paymentStep === 2 && (
                        <div className="text-center">
                            <div className="spinner-border mb-3" style={{ color: '#17a2b8', width: '3rem', height: '3rem' }} role="status">
                                <span className="visually-hidden">Procesando...</span>
                            </div>
                            <h4 className="fw-bold mb-2" style={{ color: '#17a2b8' }}>
                                Procesando Pago
                            </h4>
                            <p className="text-secondary">
                                Por favor espera mientras procesamos tu pago y habilitamos el acceso al historial...
                            </p>
                        </div>
                    )}

                    {paymentStep === 3 && (
                        <div className="text-center">
                            <i className="fas fa-check-circle mb-3" style={{ color: '#28a745', fontSize: '4rem' }}></i>
                            <h4 className="fw-bold mb-2" style={{ color: '#28a745' }}>
                                ¡Pago Exitoso!
                            </h4>
                            <p className="text-secondary mb-3">
                                Tu pago se ha procesado correctamente. 
                                Serás redirigido al historial del vehículo en unos segundos...
                            </p>
                            <div className="spinner-border spinner-border-sm" style={{ color: '#17a2b8' }} role="status">
                                <span className="visually-hidden">Redirigiendo...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SimulacionPago;