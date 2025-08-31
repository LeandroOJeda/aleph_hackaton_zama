import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../redux/action';
import styles from './EventForm.module.css';

function ConcesionariaEventForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        kilometers: '',
        description: '',
        eventDate: '',
        location: '',
        vehicleId: '',
        eventType: 'sale',
        salesPerson: '',
        customerInfo: '',
        salePrice: '',
        warranty: '12'
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.kilometers || formData.kilometers <= 0) {
            newErrors.kilometers = 'Los kilómetros son requeridos y deben ser mayor a 0';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es requerida';
        }

        if (!formData.eventDate) {
            newErrors.eventDate = 'La fecha del evento es requerida';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'La ubicación es requerida';
        }

        if (!formData.vehicleId.trim()) {
            newErrors.vehicleId = 'El ID del vehículo es requerido';
        }

        if (!formData.salesPerson.trim()) {
            newErrors.salesPerson = 'El nombre del vendedor es requerido';
        }

        if (formData.eventType === 'sale' && !formData.customerInfo.trim()) {
            newErrors.customerInfo = 'La información del cliente es requerida para ventas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const eventData = {
                ...formData,
                kilometers: parseInt(formData.kilometers),
                eventDate: new Date(formData.eventDate).toISOString(),
                salePrice: formData.salePrice ? parseFloat(formData.salePrice) : 0,
                warranty: parseInt(formData.warranty)
            };

            await dispatch(createEvent(eventData));
            setSubmitMessage('Evento registrado exitosamente');
            
            // Reset form
            setFormData({
                kilometers: '',
                description: '',
                eventDate: '',
                location: '',
                vehicleId: '',
                eventType: 'sale',
                salesPerson: '',
                customerInfo: '',
                salePrice: '',
                warranty: '12'
            });

        } catch (error) {
            setSubmitMessage('Error al registrar el evento. Por favor intente nuevamente.');
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate('/form');
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {isSubmitting && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}></div>
                    </div>
                )}
                
                <div className={styles.header}>
                    <h1 className={styles.title}>Registro de Evento</h1>
                    <p className={styles.subtitle}>Concesionaria - Ventas y Servicios</p>
                </div>
                
                <div className={styles.content}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="eventType" className={styles.label}>Tipo de Evento</label>
                            <select
                                id="eventType"
                                name="eventType"
                                value={formData.eventType}
                                onChange={handleChange}
                                className={`${styles.select} ${errors.eventType ? styles.inputError : ''}`}
                            >
                                <option value="sale">Venta de Vehículo</option>
                                <option value="delivery">Entrega de Vehículo</option>
                                <option value="test_drive">Prueba de Manejo</option>
                                <option value="inspection">Inspección Pre-entrega</option>
                                <option value="warranty_service">Servicio de Garantía</option>
                            </select>
                            {errors.eventType && <div className={styles.errorMessage}>{errors.eventType}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="salesPerson" className={styles.label}>Vendedor</label>
                            <input
                                id="salesPerson"
                                type="text"
                                name="salesPerson"
                                placeholder="Nombre del vendedor responsable"
                                value={formData.salesPerson}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.salesPerson ? styles.inputError : ''}`}
                            />
                            {errors.salesPerson && <div className={styles.errorMessage}>{errors.salesPerson}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="customerInfo" className={styles.label}>Información del Cliente</label>
                            <textarea
                                id="customerInfo"
                                name="customerInfo"
                                placeholder="Nombre, contacto y datos relevantes del cliente"
                                value={formData.customerInfo}
                                onChange={handleChange}
                                className={`${styles.textarea} ${errors.customerInfo ? styles.inputError : ''}`}
                                rows="3"
                            />
                            {errors.customerInfo && <div className={styles.errorMessage}>{errors.customerInfo}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="salePrice" className={styles.label}>Precio de Venta</label>
                            <input
                                id="salePrice"
                                type="number"
                                name="salePrice"
                                placeholder="Precio final de venta"
                                value={formData.salePrice}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.salePrice ? styles.inputError : ''}`}
                                min="0"
                                step="0.01"
                            />
                            {errors.salePrice && <div className={styles.errorMessage}>{errors.salePrice}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="warranty" className={styles.label}>Garantía (meses)</label>
                            <select
                                id="warranty"
                                name="warranty"
                                value={formData.warranty}
                                onChange={handleChange}
                                className={`${styles.select} ${errors.warranty ? styles.inputError : ''}`}
                            >
                                <option value="6">6 meses</option>
                                <option value="12">12 meses</option>
                                <option value="24">24 meses</option>
                                <option value="36">36 meses</option>
                            </select>
                            {errors.warranty && <div className={styles.errorMessage}>{errors.warranty}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="kilometers" className={styles.label}>Kilómetros</label>
                            <input
                                id="kilometers"
                                type="number"
                                name="kilometers"
                                placeholder="Kilómetros del vehículo"
                                value={formData.kilometers}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.kilometers ? styles.inputError : ''}`}
                                min="0"
                            />
                            {errors.kilometers && <div className={styles.errorMessage}>{errors.kilometers}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="description" className={styles.label}>Descripción</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Detalles del evento, condiciones especiales, etc."
                                value={formData.description}
                                onChange={handleChange}
                                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                                rows="4"
                            />
                            {errors.description && <div className={styles.errorMessage}>{errors.description}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="eventDate" className={styles.label}>Fecha y Hora</label>
                            <input
                                id="eventDate"
                                type="datetime-local"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.eventDate ? styles.inputError : ''}`}
                            />
                            {errors.eventDate && <div className={styles.errorMessage}>{errors.eventDate}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="location" className={styles.label}>Ubicación</label>
                            <input
                                id="location"
                                type="text"
                                name="location"
                                placeholder="Ubicación de la concesionaria"
                                value={formData.location}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.location ? styles.inputError : ''}`}
                            />
                            {errors.location && <div className={styles.errorMessage}>{errors.location}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="vehicleId" className={styles.label}>ID del Vehículo</label>
                            <input
                                id="vehicleId"
                                type="text"
                                name="vehicleId"
                                placeholder="Identificador único del vehículo"
                                value={formData.vehicleId}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.vehicleId ? styles.inputError : ''}`}
                            />
                            {errors.vehicleId && <div className={styles.errorMessage}>{errors.vehicleId}</div>}
                        </div>

                        <div className={styles.buttonGroup}>
                            <button 
                                type="button" 
                                className={styles.backButton}
                                onClick={handleBack}
                                disabled={isSubmitting}
                            >
                                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver
                            </button>
                            
                            <button 
                                type="submit" 
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {isSubmitting ? 'Registrando...' : 'Registrar Evento'}
                            </button>
                        </div>
                    </form>

                    {submitMessage && (
                        <div className={`${styles.messageContainer} ${
                            submitMessage.includes('Error') ? styles.errorMessageContainer : styles.successMessage
                        }`}>
                            {submitMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConcesionariaEventForm;