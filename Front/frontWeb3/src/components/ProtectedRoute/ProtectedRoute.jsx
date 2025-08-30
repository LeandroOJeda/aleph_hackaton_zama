import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, redirectTo = "/" }) => {
    const getRoles = () => {
        try {
            const rolesString = localStorage.getItem("roles");
            if (!rolesString) return [];
            
            // Los roles vienen como array de objetos [{id, name, description}, ...]
            const roles = JSON.parse(rolesString);
            
            if (Array.isArray(roles)) {
                // Extraer solo los nombres de los roles
                return roles.map(role => role.name);
            }
            return [];
        } catch (error) {
            console.error("Error parsing roles in ProtectedRoute:", error);
            return [];
        }
    };

    const userRoles = getRoles();
    const hasAccess = allowedRoles.some(role => userRoles.includes(role));
    
    console.log("ProtectedRoute - User roles:", userRoles);
    console.log("ProtectedRoute - Allowed roles:", allowedRoles);
    console.log("ProtectedRoute - Has access:", hasAccess);

    if (!hasAccess) {
        console.log("Access denied, redirecting to:", redirectTo);
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default ProtectedRoute;
