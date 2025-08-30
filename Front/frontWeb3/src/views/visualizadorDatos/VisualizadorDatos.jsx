import React from 'react'

const VehicleDisplay = ({ vehicleData, onBack }) => {
    const {
        id,
        licensePlate,
        chassisNumber,
        location,
        brand,
        model,
        isActive
    } = vehicleData

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
                {/* Main Card */}
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
                            Información del Vehículo
                        </h2>
                    </div>

                    {/* Status Badge */}
                    <div className="text-center mb-4">
                        <span
                            className={`badge px-3 py-2 fw-semibold ${isActive ? 'bg-success' : 'bg-danger'}`}
                            style={{
                                borderRadius: '15px',
                                fontSize: '0.9rem'
                            }}
                        >
                            {isActive ? 'Vehículo Activo' : 'Vehículo Inactivo'}
                        </span>
                    </div>

                    {/* Form-like Display */}
                    <div className="row g-3">
                        {/* License Plate */}
                        <div className="col-12">
                            <label className="form-label fw-semibold text-secondary mb-2">Patente</label>
                            <div
                                className="form-control-lg text-center fw-bold"
                                style={{
                                    backgroundColor: 'white',
                                    border: '2px solid #dee2e6',
                                    borderRadius: '10px',
                                    padding: '15px',
                                    fontSize: '2rem',
                                    fontFamily: 'monospace',
                                    letterSpacing: '0.2em',
                                    color: '#2c3e50'
                                }}
                            >
                                {licensePlate}
                            </div>
                        </div>

                        {/* Brand */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary mb-2">Marca</label>
                            <div
                                className="form-control"
                                style={{
                                    backgroundColor: 'white',
                                    border: '2px solid #dee2e6',
                                    borderRadius: '10px',
                                    padding: '12px',
                                    fontSize: '1.1rem',
                                    color: '#2c3e50'
                                }}
                            >
                                {brand}
                            </div>
                        </div>

                        {/* Model */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-secondary mb-2">Modelo</label>
                            <div
                                className="form-control"
                                style={{
                                    backgroundColor: 'white',
                                    border: '2px solid #dee2e6',
                                    borderRadius: '10px',
                                    padding: '12px',
                                    fontSize: '1.1rem',
                                    color: '#2c3e50'
                                }}
                            >
                                {model}
                            </div>
                        </div>

                        {/* Chassis Number */}
                        <div className="col-12">
                            <label className="form-label fw-semibold text-secondary mb-2">Número de Chasis</label>
                            <div
                                className="form-control"
                                style={{
                                    backgroundColor: 'white',
                                    border: '2px solid #dee2e6',
                                    borderRadius: '10px',
                                    padding: '12px',
                                    fontSize: '1rem',
                                    fontFamily: 'monospace',
                                    color: '#2c3e50',
                                    wordBreak: 'break-all'
                                }}
                            >
                                {chassisNumber}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="col-12">
                            <label className="form-label fw-semibold text-secondary mb-2">Ubicación</label>
                            <div
                                className="form-control"
                                style={{
                                    backgroundColor: 'white',
                                    border: '2px solid #dee2e6',
                                    borderRadius: '10px',
                                    padding: '12px',
                                    fontSize: '1.1rem',
                                    color: '#2c3e50'
                                }}
                            >
                                {location}
                            </div>
                        </div>

                        {/* Blockchain Status */}
                        <div className="col-12">
                            <label className="form-label fw-semibold text-secondary mb-2">Estado Blockchain</label>
                            <div
                                className="form-control d-flex align-items-center justify-content-between"
                                style={{
                                    backgroundColor: 'white',
                                    border: '2px solid #28a745',
                                    borderRadius: '10px',
                                    padding: '12px',
                                    fontSize: '1.1rem',
                                    color: '#28a745'
                                }}
                            >
                                <span className="fw-semibold">Verificado</span>
                                <i className="fas fa-check-circle"></i>
                            </div>
                        </div>

                        {/* System ID */}
                        <div className="col-12">
                            <label className="form-label fw-semibold text-secondary mb-2">ID del Sistema</label>
                            <div
                                className="form-control"
                                style={{
                                    backgroundColor: '#f8f9fa',
                                    border: '1px dashed #dee2e6',
                                    borderRadius: '10px',
                                    padding: '8px',
                                    fontSize: '0.85rem',
                                    fontFamily: 'monospace',
                                    color: '#6c757d',
                                    wordBreak: 'break-all'
                                }}
                            >
                                {id}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="row mt-4 g-2">
                        <div className="col-6">
                            <button
                                className="btn w-100 fw-semibold"
                                onClick={onBack}
                                style={{
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '12px',
                                    fontSize: '1rem'
                                }}
                            >
                                Atrás
                            </button>
                        </div>
                        <div className="col-6">
                            <button
                                className="btn w-100 fw-semibold"
                                style={{
                                    backgroundColor: '#17a2b8',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '12px',
                                    fontSize: '1rem'
                                }}
                            >
                                Descargar Certificado
                            </button>
                        </div>
                    </div>

                    {/* Success message style (hidden by default) */}
                    <div
                        className="mt-3 p-3 text-center fw-semibold d-none"
                        style={{
                            backgroundColor: '#f8d7da',
                            color: '#721c24',
                            borderRadius: '10px',
                            border: '1px solid #f5c6cb'
                        }}
                    >
                        Certificado descargado exitosamente
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VehicleDisplay