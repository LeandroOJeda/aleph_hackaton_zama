import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';

const NavBar = () => {
    const navigate = useNavigate();
    
    // Obtener rol del localStorage
    const getRoles = () => {
        try {
            const rolesString = localStorage.getItem("roles");
            if (!rolesString) return [];
            
            console.log("Roles string from localStorage:", rolesString);
            
            // Los roles vienen como array de objetos [{id, name, description}, ...]
            const roles = JSON.parse(rolesString);
            console.log("Parsed roles:", roles);
            
            if (Array.isArray(roles)) {
                // Extraer solo los nombres de los roles
                return roles.map(role => role.name);
            }
            return [];
        } catch (error) {
            console.error("Error parsing roles:", error);
            return [];
        }
    };

    const roles = getRoles();
    const primaryRole = roles[0] || 'consumer';
    
    console.log("Primary role:", primaryRole);

    // Mapeo de roles a nombres legibles
    const roleDisplayNames = {
        superadmin: 'Super Administrador',
        admin: 'Administrador',
        aseguradora: 'Aseguradora',
        taller: 'Taller',
        concesionaria: 'Concesionaria',
        consumer: 'Consumidor'
    };

    // Mapeo de roles a rutas de formularios
    const roleFormRoutes = {
        superadmin: '/eventos/superadmin',
        admin: '/eventos/admin',
        aseguradora: '/eventos/aseguradora',
        taller: '/eventos/taller',
        concesionaria: '/eventos/concesionaria'
    };

    const handleCreateEvent = () => {
        const route = roleFormRoutes[primaryRole];
        if (route) {
            navigate(route);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("roles");
        navigate("/");
    };

    const handleHome = () => {
        navigate("/form");
    };

    // No mostrar el botón "Crear Evento" para consumer
    const shouldShowCreateEventButton = primaryRole !== 'consumer';

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarContainer}>
                {/* Logo/Brand */}
                <div className={styles.navbarBrand}>
                    <button onClick={handleHome} className={styles.brandButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,7C9.24,7 7,9.24 7,12S9.24,17 12,17S17,14.76 17,12S14.76,7 12,7M12,8.5C13.93,8.5 15.5,10.07 15.5,12S13.93,15.5 12,15.5S8.5,13.93 8.5,12S10.07,8.5 12,8.5Z"/>
                        </svg>
                        VehicleChain
                    </button>
                </div>

                {/* Center - Role Display */}
                <div className={styles.navbarCenter}>
                    <div className={styles.roleDisplay}>
                        <span className={styles.roleLabel}>Rol:</span>
                        <span className={`${styles.roleBadge} ${styles[primaryRole]}`}>
                            {roleDisplayNames[primaryRole] || primaryRole}
                        </span>
                    </div>
                </div>

                {/* Right - Actions */}
                <div className={styles.navbarActions}>
                    {shouldShowCreateEventButton && (
                        <button 
                            onClick={handleCreateEvent}
                            className={styles.createEventButton}
                        >
                            <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Crear Evento
                        </button>
                    )}
                    
                    <button 
                        onClick={handleLogout}
                        className={styles.logoutButton}
                    >
                        <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Salir
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
