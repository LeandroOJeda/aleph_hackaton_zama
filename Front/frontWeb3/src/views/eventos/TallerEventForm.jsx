import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../redux/action';
import styles from './EventForm.module.css';

function TallerEventForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        kilometers: '',
        description: '',
        eventDate: '',
        location: '',
        licensePlate: '',
        eventType: 'maintenance',
        serviceType: '',
        mechanic: '',
        cost: '',
        partsUsed: ''
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

        if (!formData.licensePlate.trim()) {
            newErrors.licensePlate = 'La patente del vehículo es requerida';
        }

        if (!formData.mechanic.trim()) {
            newErrors.mechanic = 'El nombre del mecánico es requerido';
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
                kilometers: parseInt(formData.kilometers),
                description: formData.description,
                eventDate: new Date(formData.eventDate).toISOString(),
                location: formData.location,
                licensePlate: formData.licensePlate
            };

            await dispatch(createEvent(eventData));
            setSubmitMessage('Servicio registrado exitosamente');
            
            // Reset form
            setFormData({
                kilometers: '',
                description: '',
                eventDate: '',
                location: '',
                licensePlate: '',
                eventType: 'maintenance',
                serviceType: '',
                mechanic: '',
                cost: '',
                partsUsed: ''
            });

        } catch (error) {
            setSubmitMessage('Error al registrar el servicio. Por favor intente nuevamente.');
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
                    <h1 className={styles.title}>Registro de Servicio</h1>
                    <p className={styles.subtitle}>Taller - Mantenimiento y Reparaciones</p>
                </div>
                
                <div className={styles.content}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="eventType" className={styles.label}>Tipo de Servicio</label>
                            <select
                                id="eventType"
                                name="eventType"
                                value={formData.eventType}
                                onChange={handleChange}
                                className={`${styles.select} ${errors.eventType ? styles.inputError : ''}`}
                            >
                                <option value="maintenance">Mantenimiento Preventivo</option>
                                <option value="repair">Reparación</option>
                                <option value="inspection">Inspección Técnica</option>
                                <option value="oil_change">Cambio de Aceite</option>
                                <option value="tire_service">Servicio de Neumáticos</option>
                            </select>
                            {errors.eventType && <div className={styles.errorMessage}>{errors.eventType}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="serviceType" className={styles.label}>Detalle del Servicio</label>
                            <input
                                id="serviceType"
                                type="text"
                                name="serviceType"
                                placeholder="Ej: Cambio de frenos, Alineación, etc."
                                value={formData.serviceType}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.serviceType ? styles.inputError : ''}`}
                            />
                            {errors.serviceType && <div className={styles.errorMessage}>{errors.serviceType}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="mechanic" className={styles.label}>Mecánico Responsable</label>
                            <input
                                id="mechanic"
                                type="text"
                                name="mechanic"
                                placeholder="Nombre del mecánico"
                                value={formData.mechanic}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.mechanic ? styles.inputError : ''}`}
                            />
                            {errors.mechanic && <div className={styles.errorMessage}>{errors.mechanic}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="kilometers" className={styles.label}>Kilómetros</label>
                            <input
                                id="kilometers"
                                type="number"
                                name="kilometers"
                                placeholder="Kilómetros actuales del vehículo"
                                value={formData.kilometers}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.kilometers ? styles.inputError : ''}`}
                                min="0"
                            />
                            {errors.kilometers && <div className={styles.errorMessage}>{errors.kilometers}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="description" className={styles.label}>Descripción del Trabajo</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Describe el trabajo realizado y observaciones"
                                value={formData.description}
                                onChange={handleChange}
                                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                                rows="4"
                            />
                            {errors.description && <div className={styles.errorMessage}>{errors.description}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="partsUsed" className={styles.label}>Repuestos Utilizados</label>
                            <textarea
                                id="partsUsed"
                                name="partsUsed"
                                placeholder="Lista de repuestos y materiales utilizados"
                                value={formData.partsUsed}
                                onChange={handleChange}
                                className={`${styles.textarea} ${errors.partsUsed ? styles.inputError : ''}`}
                                rows="3"
                            />
                            {errors.partsUsed && <div className={styles.errorMessage}>{errors.partsUsed}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="cost" className={styles.label}>Costo del Servicio</label>
                            <input
                                id="cost"
                                type="number"
                                name="cost"
                                placeholder="Costo total del servicio"
                                value={formData.cost}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.cost ? styles.inputError : ''}`}
                                min="0"
                                step="0.01"
                            />
                            {errors.cost && <div className={styles.errorMessage}>{errors.cost}</div>}
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
                                placeholder="Ubicación del taller"
                                value={formData.location}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.location ? styles.inputError : ''}`}
                            />
                            {errors.location && <div className={styles.errorMessage}>{errors.location}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="licensePlate" className={styles.label}>Patente del Vehículo</label>
                            <input
                                id="licensePlate"
                                type="text"
                                name="licensePlate"
                                placeholder="Ej: ABC123, BNA946"
                                value={formData.licensePlate}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.licensePlate ? styles.inputError : ''}`}
                            />
                            {errors.licensePlate && <div className={styles.errorMessage}>{errors.licensePlate}</div>}
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
                                {isSubmitting ? 'Registrando...' : 'Registrar Servicio'}
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

export default TallerEventForm;