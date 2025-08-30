import React from 'react'

const VehicleDisplay = (vehicleData) => {
    const {
        id,
        licensePlate,
        chassisNumber,
        location,
        brand,
        model,
        isActive
    } = vehicleData
    console.log(model);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Información del Vehículo
                    </h1>
                    <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Status Banner */}
                    <div className={`px-6 py-4 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                <span className="text-white font-semibold">
                                    {isActive ? 'Vehículo Activo' : 'Vehículo Inactivo'}
                                </span>
                            </div>
                            <div className="text-white text-sm opacity-90">
                                Estado del registro
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Info Grid */}
                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* License Plate */}
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-blue-500 rounded-lg p-2">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v4a1 1 0 01-1 1h-1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-blue-600">Patente</p>
                                            <p className="text-2xl font-bold text-gray-900 font-mono">{licensePlate}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Brand & Model */}
                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border-l-4 border-purple-500">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-purple-500 rounded-lg p-2">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-purple-600">Vehículo</p>
                                            <p className="text-xl font-bold text-gray-900">{brand}</p>
                                            <p className="text-lg font-semibold text-gray-700">{model}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-500">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-green-500 rounded-lg p-2">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-green-600">Ubicación</p>
                                            <p className="text-lg font-bold text-gray-900">{location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Chassis Number */}
                                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border-l-4 border-orange-500">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-orange-500 rounded-lg p-2">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-orange-600">Número de Chasis</p>
                                            <p className="text-lg font-bold text-gray-900 font-mono break-all">{chassisNumber}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicle ID */}
                                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6 border-l-4 border-indigo-500">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-indigo-500 rounded-lg p-2">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-indigo-600">ID del Sistema</p>
                                            <p className="text-sm font-mono text-gray-600 break-all">{id}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Blockchain Status */}
                                <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-6 border-l-4 border-teal-500">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-teal-500 rounded-lg p-2">
                                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-teal-600">Estado Blockchain</p>
                                                <p className="text-lg font-bold text-gray-900">Verificado</p>
                                            </div>
                                        </div>
                                        <div className="text-teal-500">
                                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gray-50 px-8 py-6">
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Descargar Certificado</span>
                            </button>

                            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Validar en Blockchain</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VehicleDisplay

// Ejemplo de uso:
/*
const App = () => {
  const vehicleData = {
    "id": "c2f12119-dd8f-4d66-bb5f-45dc86eb96a4",
    "licensePlate": "ABC123",
    "chassisNumber": "VIN1234567890ABCD",
    "location": "Bogotá, Colombia",
    "brand": "Toyota",
    "model": "Corolla 2022",
    "isActive": true,
  }

  return <VehicleDisplay vehicleData={vehicleData} />
}
*/