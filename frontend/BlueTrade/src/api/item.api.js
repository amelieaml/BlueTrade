import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/item/test/usuarios/';

export const getItems = async () => {
    return axios.get(API_BASE_URL);
}

// 1. Obtener todos los usuarios
export const getUsuarios = async () => {
    return axios.get(API_BASE_URL);
};

// 2. Crear un nuevo usuario (Sign Up / Registro)
export const registrarUsuario = async (datosUsuario) => {
    return axios.post(API_BASE_URL, datosUsuario);
};

// 3. LLAMADA AL MÉTODO ESPECÍFICO DE POO
// Envía una petición POST a http://127.0.0.1:8000/item/test/usuarios/{id}/recargar_agua/
export const recargarAgua = async (idUsuario, cantidadLitros) => {
    return axios.post(`${API_BASE_URL}${idUsuario}/recargar_agua/`, {
        cantidad: cantidadLitros
    });
};

export const guardarCertificado = async (idUsuario, tipoServicio, archivoCertificado) => {
    const formData = new FormData();
    
    // Adjuntamos los tres datos requeridos
    formData.append('usuario_id', idUsuario);
    formData.append('tipoServicio', tipoServicio);
    formData.append('certificado', archivoCertificado); // El archivo binario único

    // Enviamos la petición POST al endpoint del usuario específico
    return axios.post(`${API_BASE_URL}${idUsuario}/guardar_certificado/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// 4. Iniciar Sesión (Login)

export const loginUsuario = async (credenciales) => {
    return axios.post(`${API_BASE_URL}login/`, credenciales);
};