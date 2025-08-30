import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent } from '../../redux/action';
import styles from '../aseguradoras_form/AseguradorasForm.module.css';
import { useNavigate } from 'react-router-dom';

function ConcesionariaEventForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        kilometers: '',
        description: '',
        eventDate: '',
        location: '',
        vehicleId: '',
        eventType: 'sale', // Campo específico para Concesionaria
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

        if (!formData.kilometers || formData.kilometers < 0) {
            newErrors.kilometers = 'Los kilómetros son requeridos';
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
            newErrors.salesPerson = 'El vendedor es requerido';
        }

        if (formData.eventType === 'sale' && (!formData.salePrice || formData.salePrice <= 0)) {
            newErrors.salePrice = 'El precio de venta es requerido para ventas';
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
                salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
                warranty: parseInt(formData.warranty),
                eventDate: new Date(formData.eventDate).toISOString()
            };

            await dispatch(createEvent(eventData));
            setSubmitMessage('Evento de Concesionaria registrado exitosamente');

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

    const handleReset = () => {
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
        setErrors({});
        setSubmitMessage('');
    };

    return (
        <div className={styles.bigDiv}>
            <div className={styles.divForm}>
                <h1 className={styles.titulo}>Registro de Evento - Concesionaria</h1>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.divInput}>
                        <select
                            name="eventType"
                            value={formData.eventType}
                            onChange={handleChange}
                            className={errors.eventType ? styles.inputError : ''}
                        >
                            <option value="sale">Venta de Vehículo</option>
                            <option value="delivery">Entrega de Vehículo</option>
                            <option value="test_drive">Prueba de Manejo</option>
                            <option value="inspection">Inspección Pre-entrega</option>
                            <option value="warranty_service">Servicio de Garantía</option>
                        </select>
                        {errors.eventType && <span className={styles.errorLabel}>{errors.eventType}</span>}
                    </div>

                    <div className={styles.divInput}>
                        <input
                            type="text"
                            name="salesPerson"
                            placeholder="Nombre del Vendedor"
                            value={formData.salesPerson}
                            onChange={handleChange}
                            className={errors.salesPerson ? styles.inputError : ''}
                        />
                        {errors.salesPerson && <span className={styles.errorLabel}>{errors.salesPerson}</span>}
                    </div>

                    <div className={styles.divInput}>
                        <input
                            type="text"
                            name="customerInfo"
                            placeholder="Información del Cliente (opcional)"
                            value={formData.customerInfo}
                            onChange={handleChange}
                        />
                    </div>

                    {formData.eventType === 'sale' && (
                        <div className={styles.divInput}>
                            <input
                                type="number"
                                step="0.01"
                                name="salePrice"
                                placeholder="Precio de Venta"
                                value={formData.salePrice}
                                onChange={handleChange}
                                className={errors.salePrice ? styles.inputError : ''}
                                min="0"
                            />
                            {errors.salePrice && <span className={styles.errorLabel}>{errors.salePrice}</span>}
                        </div>
                    )}

                    <div className={styles.divInput}>
                        <select
                            name="warranty"
                            value={formData.warranty}
                            onChange={handleChange}
                        >
                            <option value="6">6 meses de garantía</option>
                            <option value="12">12 meses de garantía</option>
                            <option value="24">24 meses de garantía</option>
                            <option value="36">36 meses de garantía</option>
                        </select>
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
                            placeholder="Ubicación de la Concesionaria"
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
                            {isSubmitting ? 'Enviando...' : 'Registrar Evento'}
                        </button>
                        <button
                            type="button"
                            className={styles.button1}
                            onClick={() => navigate(-1)}
                        // disabled={isSubmitting}
                        >
                            Atras
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

export default ConcesionariaEventForm;
