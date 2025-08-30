import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAuto } from '../../redux/action'
import VehicleDisplay from '../visualizadorDatos/VisualizadorDatos'

function Consultas() {
    const dispatch = useDispatch()
    const dataAuto = useSelector(state => state.dataAuto)

    const [patente, setPatente] = useState("")
    const [hasSearched, setHasSearched] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (event) => {
        setPatente(event.target.value)
        setError("") // Limpiar error al escribir
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (!patente.trim()) {
            setError("Por favor ingrese una patente o número de chasis")
            return
        }

        dispatch(getAuto(patente))
        setHasSearched(true)
        setError("")
    }

    const handleClear = () => {
        setPatente("")
        setHasSearched(false)
        setError("")
    }

    // Si hay datos y se ha buscado, mostrar solo el resultado
    if (hasSearched && dataAuto && dataAuto.id) {
        return <VehicleDisplay vehicleData={dataAuto} />
    }

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                backgroundColor: '#e8f4f8',
                minHeight: '100vh',
                backgroundImage: 'linear-gradient(135deg, #e8f4f8 0%, #d1ecf1 100%)'
            }}
        >
            <div className="container" style={{ maxWidth: '500px' }}>
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
                            Consulta de Vehículo
                        </h2>
                        <p className="text-secondary mt-2 mb-0">
                            Ingrese patente o número de chasis
                        </p>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary mb-2">
                                Patente / Número de Chasis
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                id="patente"
                                placeholder="Ej: ABC123 o VIN1234567890"
                                value={patente}
                                onChange={handleChange}
                                style={{
                                    backgroundColor: 'white',
                                    border: '2px solid #dee2e6',
                                    borderRadius: '10px',
                                    padding: '15px',
                                    fontSize: '1.1rem',
                                    color: '#2c3e50'
                                }}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div
                                className="mb-3 p-3 text-center fw-semibold"
                                style={{
                                    backgroundColor: '#f8d7da',
                                    color: '#721c24',
                                    borderRadius: '10px',
                                    border: '1px solid #f5c6cb',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {error}
                            </div>
                        )}

                        {/* Search Result Message */}
                        {hasSearched && (!dataAuto || !dataAuto.id) && (
                            <div
                                className="mb-3 p-3 text-center fw-semibold"
                                style={{
                                    backgroundColor: '#fff3cd',
                                    color: '#856404',
                                    borderRadius: '10px',
                                    border: '1px solid #ffeaa7',
                                    fontSize: '0.9rem'
                                }}
                            >
                                No se encontró información para este vehículo
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="row g-2">
                            <div className="col-6">
                                <button
                                    type="button"
                                    className="btn w-100 fw-semibold"
                                    onClick={handleClear}
                                    style={{
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        padding: '12px',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Limpiar
                                </button>
                            </div>
                            <div className="col-6">
                                <button
                                    type="submit"
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
                                    Buscar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Consultas