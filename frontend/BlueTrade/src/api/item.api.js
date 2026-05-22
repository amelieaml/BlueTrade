import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/item/test/usuarios/';

export const getItems = async () => {
    return axios.get(API_BASE_URL);
};

// Obtener todos los usuarios
export const getUsuarios = async () => {
    return axios.get(API_BASE_URL);
};

// Obtener usuario por ID
export const getUsuario = async (idUsuario) => {
    return axios.get(`${API_BASE_URL}${idUsuario}/`);
};

// Compatibilidad con el otro archivo
export const getUsuarioPorId = async (idUsuario) => {
    return axios.get(`${API_BASE_URL}${idUsuario}/`);
};

// Crear usuario
export const registrarUsuario = async (datosUsuario) => {
    return axios.post(API_BASE_URL, datosUsuario);
};

export const recargarAgua = async (idUsuario, cantidadLitros) => {
    return axios.post(`${API_BASE_URL}${idUsuario}/recargar_agua/`, {
        cantidad: cantidadLitros
    });
};

export const registrarUsuarioCompleto = async (datos) => {
    const formData = new FormData();

    formData.append('ci', datos.ci);
    formData.append('nombre', datos.nombre);
    formData.append('email', datos.email);
    formData.append('telefono', datos.telefono);
    formData.append('intencion_agua', datos.intencion_agua);
    formData.append('intencion_servicio', datos.intencion_servicio);
    formData.append('tipo_servicio_intencion', datos.tipo_servicio_intencion);
    formData.append('password', datos.password);
    formData.append('codigo_casa', datos.codigo_casa);

    if (datos.certificadoArchivo) {
        formData.append('certificado', datos.certificadoArchivo);
    }

    return axios.post(
        'http://127.0.0.1:8000/item/test/usuarios/registro_completo/',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
};

export const guardarCertificado = async (
    idUsuario,
    tipoServicio,
    archivoCertificado
) => {
    const formData = new FormData();

    formData.append('usuario', idUsuario);
    formData.append('tipo_servicio', tipoServicio);
    formData.append('archivo', archivoCertificado);

    const urlCertificados =
        'http://127.0.0.1:8000/item/test/certificados/';

    return axios.post(urlCertificados, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Iniciar sesión
export const loginUsuario = async (credenciales) => {
    return axios.post(`${API_BASE_URL}login/`, credenciales);
};

export const getCertificados = async (idUsuario) => {
    return axios.get(
        `${API_BASE_URL}${idUsuario}/certificados/`
    );
};

export const getServicios = async (idUsuario) => {
    return axios.get(
        'http://127.0.0.1:8000/item/test/servicios/'
    );
};

export const crearOferta = async (datosOferta) => {
    const urlOfertas =
        'http://127.0.0.1:8000/item/test/ofertas/';

    const token = localStorage.getItem('token');

    return axios.post(urlOfertas, datosOferta, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && {
                Authorization: `Bearer ${token}`
            })
        }
    });
};

export const getOfertas = async () => {
    const urlOfertas =
        'http://127.0.0.1:8000/item/test/ofertas/';

    const token = localStorage.getItem('token');

    return axios.get(urlOfertas, {
        headers: {
            ...(token && {
                Authorization: `Bearer ${token}`
            })
        }
    });
};

// Actualizar oferta
export const actualizarOferta = async (
    idOferta,
    datosOferta
) => {
    const urlOfertaEspecifica =
        `http://127.0.0.1:8000/item/test/ofertas/${idOferta}/`;

    const token = localStorage.getItem('token');

    return axios.patch(
        urlOfertaEspecifica,
        datosOferta,
        {
            headers: {
                'Content-Type': 'application/json',
                ...(token && {
                    Authorization: `Bearer ${token}`
                })
            }
        }
    );
};