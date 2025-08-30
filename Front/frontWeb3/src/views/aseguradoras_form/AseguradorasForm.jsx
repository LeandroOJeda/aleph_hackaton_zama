import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent } from '../../redux/action';
import styles from './AseguradorasForm.module.css';
import { useNavigate } from 'react-router-dom';

function AseguradorasForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        kilometers: '',
        description: '',
        eventDate: '',
        location: '',
        vehicleId: ''
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

        // Limpiar error del campo cuando el usuario empiece a escribir
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
                eventDate: new Date(formData.eventDate).toISOString()
            };

            await dispatch(createEvent(eventData));
            setSubmitMessage('Evento creado exitosamente');

            // Limpiar formulario
            setFormData({
                kilometers: '',
                description: '',
                eventDate: '',
                location: '',
                vehicleId: ''
            });

        } catch (error) {
            setSubmitMessage('Error al crear el evento. Por favor intente nuevamente.');
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
            vehicleId: ''
        });
        setErrors({});
        setSubmitMessage('');
    };

    return (
        <div className={styles.bigDiv}>
            <div className={styles.divForm}>
                <button
                    type="button"
                    className={styles.button1}
                    onClick={navigate(-1)}
                // disabled={isSubmitting}
                >
                    Atras
                </button>
                <h1 className={styles.titulo}>Registro de Evento - Aseguradora</h1>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.divInput}>
                        <input
                            type="number"
                            name="kilometers"
                            placeholder="Kilómetros"
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
                            placeholder="Descripción del evento"
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
                            placeholder="Ubicación del evento"
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
                            {isSubmitting ? 'Enviando...' : 'Crear Evento'}
                        </button>
                    </div>
                </form>

                {submitMessage && (
                    <div className={`${styles.message} ${submitMessage.includes('Error') ? styles.errorMessage : styles.successMessage
                        }`}>
                        {submitMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AseguradorasForm;
