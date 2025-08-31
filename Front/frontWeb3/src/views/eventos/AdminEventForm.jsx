import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../redux/action';
import styles from './EventForm.module.css';

function AdminEventForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        kilometers: '',
        description: '',
        eventDate: '',
        location: '',
        licensePlate: '',
        eventType: 'inspection',
        adminNotes: '',
        priority: 'medium'
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
            setSubmitMessage('Evento creado exitosamente');
            
            // Reset form
            setFormData({
                kilometers: '',
                description: '',
                eventDate: '',
                location: '',
                licensePlate: '',
                eventType: 'inspection',
                adminNotes: '',
                priority: 'medium'
            });

        } catch (error) {
            setSubmitMessage('Error al crear el evento. Por favor intente nuevamente.');
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
                    <p className={styles.subtitle}>Administrador - Gestión Administrativa</p>
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
                                <option value="inspection">Inspección Administrativa</option>
                                <option value="audit">Auditoría</option>
                                <option value="compliance">Verificación de Cumplimiento</option>
                                <option value="documentation">Actualización de Documentación</option>
                                <option value="regulatory">Evento Regulatorio</option>
                            </select>
                            {errors.eventType && <div className={styles.errorMessage}>{errors.eventType}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="priority" className={styles.label}>Prioridad</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className={`${styles.select} ${errors.priority ? styles.inputError : ''}`}
                            >
                                <option value="low">Prioridad Baja</option>
                                <option value="medium">Prioridad Media</option>
                                <option value="high">Prioridad Alta</option>
                                <option value="critical">Crítica</option>
                            </select>
                            {errors.priority && <div className={styles.errorMessage}>{errors.priority}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="kilometers" className={styles.label}>Kilómetros</label>
                            <input
                                id="kilometers"
                                type="number"
                                name="kilometers"
                                placeholder="Ingrese los kilómetros del vehículo"
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
                                placeholder="Describe el evento administrativo"
                                value={formData.description}
                                onChange={handleChange}
                                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                                rows="4"
                            />
                            {errors.description && <div className={styles.errorMessage}>{errors.description}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="adminNotes" className={styles.label}>Notas Administrativas</label>
                            <textarea
                                id="adminNotes"
                                name="adminNotes"
                                placeholder="Notas adicionales del administrador"
                                value={formData.adminNotes}
                                onChange={handleChange}
                                className={`${styles.textarea} ${errors.adminNotes ? styles.inputError : ''}`}
                                rows="3"
                            />
                            {errors.adminNotes && <div className={styles.errorMessage}>{errors.adminNotes}</div>}
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
                                placeholder="Ubicación del evento"
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
                                {isSubmitting ? 'Creando...' : 'Crear Evento'}
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

export default AdminEventForm;