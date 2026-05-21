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
/// REGISTRO COMPLETO DE CERTIFICADOS (con archivo adjunto)
export const registrarUsuarioCompleto = async (datos) => {
    const formData = new FormData();
    
    // Agregamos todos los campos al FormData
    formData.append('ci', datos.ci);
    formData.append('nombre', datos.nombre);
    formData.append('email', datos.email);
    formData.append('telefono', datos.telefono);
    formData.append('intencion_agua', datos.intencion_agua);
    formData.append('intencion_servicio', datos.intencion_servicio);
    formData.append('tipo_servicio_intencion', datos.tipo_servicio_intencion);
    formData.append('password', datos.password);
    formData.append('codigo_casa', datos.codigo_casa);
    
    // Adjuntamos el archivo físico si existe
    if (datos.certificadoArchivo) {
        formData.append('certificado', datos.certificadoArchivo);
    }

    return axios.post('http://127.0.0.1:8000/item/test/usuarios/registro_completo/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const guardarCertificado = async (idUsuario, tipoServicio, archivoCertificado) => {
    const formData = new FormData();
    
    // Adjuntamos las variables que tu serializer/__all__ espera recibir
    formData.append('usuario', idUsuario); 
    formData.append('tipo_servicio', tipoServicio); 
    formData.append('archivo', archivoCertificado); 

    // URL estructurada según el prefijo /item/ y tu path('test/', ...)
    const urlCertificados = 'http://127.0.0.1:8000/item/test/certificados/'; 

    return axios.post(urlCertificados, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// 4. Iniciar Sesión (Login)

export const loginUsuario = async (credenciales) => {
    return axios.post(`${API_BASE_URL}login/`, credenciales);
};

export const getCertificados = async (idUsuario) => {
    return axios.get(`${API_BASE_URL}${idUsuario}/certificados/`);
};

export const getServicios = async (idUsuario) => {
    return axios.get('http://127.0.0.1:8000/item/test/servicios/');
};