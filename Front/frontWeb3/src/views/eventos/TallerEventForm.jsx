import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent } from '../../redux/action';
import styles from '../aseguradoras_form/AseguradorasForm.module.css';

function TallerEventForm() {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        kilometers: '',
        description: '',
        eventDate: '',
        location: '',
        vehicleId: '',
        serviceType: 'maintenance', // Campo específico para Taller
        mechanicName: '',
        partsReplaced: '',
        laborHours: ''
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

        if (!formData.mechanicName.trim()) {
            newErrors.mechanicName = 'El nombre del mecánico es requerido';
        }

        if (!formData.laborHours || formData.laborHours <= 0) {
            newErrors.laborHours = 'Las horas de trabajo son requeridas';
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
                laborHours: parseFloat(formData.laborHours),
                eventDate: new Date(formData.eventDate).toISOString()
            };

            await dispatch(createEvent(eventData));
            setSubmitMessage('Evento de Taller registrado exitosamente');
            
            setFormData({
                kilometers: '',
                description: '',
                eventDate: '',
                location: '',
                vehicleId: '',
                serviceType: 'maintenance',
                mechanicName: '',
                partsReplaced: '',
                laborHours: ''
            });

        } catch (error) {
            setSubmitMessage('Error al registrar el evento. Por favor intente nuevamente.');
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData({
            kilometers: '',
            description: '',
            eventDate: '',
            location: '',
            vehicleId: '',
            serviceType: 'maintenance',
            mechanicName: '',
            partsReplaced: '',
            laborHours: ''
        });
        setErrors({});
        setSubmitMessage('');
    };

    return (
        <div className={styles.bigDiv}>
            <div className={styles.divForm}>
                <h1 className={styles.titulo}>Registro de Servicio - Taller</h1>
                
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.divInput}>
                        <select
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            className={errors.serviceType ? styles.inputError : ''}
                        >
                            <option value="maintenance">Mantenimiento Preventivo</option>
                            <option value="repair">Reparación</option>
                            <option value="inspection">Inspección</option>
                            <option value="emergency">Servicio de Emergencia</option>
                            <option value="warranty">Servicio de Garantía</option>
                        </select>
                        {errors.serviceType && <span className={styles.errorLabel}>{errors.serviceType}</span>}
                    </div>

                    <div className={styles.divInput}>
                        <input
                            type="text"
                            name="mechanicName"
                            placeholder="Nombre del Mecánico Responsable"
                            value={formData.mechanicName}
                            onChange={handleChange}
                            className={errors.mechanicName ? styles.inputError : ''}
                        />
                        {errors.mechanicName && <span className={styles.errorLabel}>{errors.mechanicName}</span>}
                    </div>

                    <div className={styles.divInput}>
                        <input
                            type="number"
                            step="0.5"
                            name="laborHours"
                            placeholder="Horas de Trabajo"
                            value={formData.laborHours}
                            onChange={handleChange}
                            className={errors.laborHours ? styles.inputError : ''}
                            min="0"
                        />
                        {errors.laborHours && <span className={styles.errorLabel}>{errors.laborHours}</span>}
                    </div>

                    <div className={styles.divInput}>
                        <textarea
                            name="partsReplaced"
                            placeholder="Repuestos utilizados (opcional)"
                            value={formData.partsReplaced}
                            onChange={handleChange}
                            className={styles.textarea}
                            rows="2"
                        />
                    </div>

                    <div className={styles.divInput}>
                        <input
                            type="number"
                            name="kilometers"
                            placeholder="Kilómetros del Vehículo"
                            value={formData.kilometers}
                            onChange={handleChange}
                            className={errors.kilometers ? styles.inputError : ''}
                            min="0"
                        />
                        {errors.kilometers && <span className={styles.errorLabel}>{errors.kilometers}</span>}
                    </div>

                    <div className={styles.divInput}>
                        <textarea
                            name="description"
                            placeholder="Descripción detallada del servicio realizado"
                            value={formData.description}
                            onChange={handleChange}
                            className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                            rows="3"
                        />
                        {errors.description && <span className={styles.errorLabel}>{errors.description}</span>}
                    </div>

                    <div className={styles.divInput}>
                        <input
                            type="datetime-local"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleChange}
                            className={errors.eventDate ? styles.inputError : ''}
                        />
                        {errors.eventDate && <span className={styles.errorLabel}>{errors.eventDate}</span>}
                    </div>

                    <div className={styles.divInput}>
                        <input
                            type="text"
                            name="location"
                            placeholder="Ubicación del Taller"
                            value={formData.location}
                            onChange={handleChange}
                            className={errors.location ? styles.inputError : ''}
                        />
                        {errors.location && <span className={styles.errorLabel}>{errors.location}</span>}
                    </div>

                    <div className={styles.divInput}>
                        <input
                            type="text"
                            name="vehicleId"
                            placeholder="ID del Vehículo"
                            value={formData.vehicleId}
                            onChange={handleChange}
                            className={errors.vehicleId ? styles.inputError : ''}
                        />
                        {errors.vehicleId && <span className={styles.errorLabel}>{errors.vehicleId}</span>}
                    </div>

                    <div className={styles.divButton}>
                        <button 
                            type="button" 
                            className={styles.button1}
                            onClick={handleReset}
                            disabled={isSubmitting}
                        >
                            Limpiar
                        </button>
                        
                        <button 
                            type="submit" 
                            className={styles.button2}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Enviando...' : 'Registrar Servicio'}
                        </button>
                    </div>
                </form>

                {submitMessage && (
                    <div className={`${styles.message} ${
                        submitMessage.includes('Error') ? styles.errorMessage : styles.successMessage
                    }`}>
                        {submitMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TallerEventForm;
