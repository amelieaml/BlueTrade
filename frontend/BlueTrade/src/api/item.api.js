import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/item/test/usuarios/';

export const getItems = async () => {
    return axios.get(API_BASE_URL);
};

// Obtener todos los usuarios
export const getUsuarios = async () => {
    return axios.get(API_BASE_URL);
};

// Obtener usuarios para el panel administrativo
export const getUsuariosAdmin = async (signal) => {
    return axios.get(`${API_BASE_URL}listar-admin/`, {
        signal
    });
};

// Obtener usuario por ID
export const getUsuario = async (idUsuario) => {
    return axios.get(`${API_BASE_URL}${idUsuario}/`);
};

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
    if (!idUsuario || idUsuario === 'undefined') {
        throw new Error(
            'No se recibió un ID de usuario válido para guardar el certificado.'
        );
    }

    if (!tipoServicio) {
        throw new Error(
            'No se recibió un tipo de servicio válido.'
        );
    }

    if (!archivoCertificado) {
        throw new Error(
            'No se seleccionó ningún certificado.'
        );
    }

    const formData = new FormData();

    formData.append('usuario', String(idUsuario));
    formData.append('tipo_servicio', String(tipoServicio));
    formData.append('archivo', archivoCertificado);

    return axios.post(
        'http://127.0.0.1:8000/item/test/certificados/',
        formData
    );
};

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

export const getOfertas = async (usuarioId) => {
    const urlOfertas = 'http://127.0.0.1:8000/item/test/ofertas/';

    const token = localStorage.getItem('token');

    return axios.get(urlOfertas, {
        params: {
            usuario_id: usuarioId
        },
        headers: {
            ...(token && {
                Authorization: `Bearer ${token}`
            })
        }
    });
};

export const getOfertasCompletadas = async (
    usuarioId,
    limit = 20,
    offset = 0
) => {
    const urlOfertasCompletadas =
        'http://127.0.0.1:8000/item/test/ofertas/completadas/';

    const token = localStorage.getItem('token');

    return axios.get(urlOfertasCompletadas, {
        params: {
            usuario_id: usuarioId,
            limit,
            offset
        },
        headers: {
            ...(token && {
                Authorization: `Bearer ${token}`
            })
        }
    });
};

export const getServiciosExternosConectados = async () => {
    return axios.get(
        'http://127.0.0.1:8000/item/test/servicios/externos-conectados/'
    );
};

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

const URL_TRANSACCIONES = 'http://127.0.0.1:8000/item/test/transacciones/';


export const iniciarTransaccion = async (ofertaId, compradorId) => {
    return axios.post('http://127.0.0.1:8000/item/test/transacciones/', {
        oferta: ofertaId,     
        comprador: compradorId 
    });
};

export const getMisTransacciones = async () => {
    const token = localStorage.getItem('token');
    return axios.get(URL_TRANSACCIONES, {
        headers: {
            ...(token && { Authorization: `Bearer ${token}` })
        }
    });
};

export const actualizarTransaccion = async (idTransaccion, datosTransaccion) => {
    const urlTransaccionEspecifica = 
        `http://127.0.0.1:8000/item/test/transacciones/${idTransaccion}/`;

    const token = localStorage.getItem('token');

    return axios.patch(
        urlTransaccionEspecifica,
        datosTransaccion,
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

const URL_NOTIFICACIONES = 'http://127.0.0.1:8000/item/test/notificaciones/';

export const getNotificaciones = async (usuarioId) => {
    const token = localStorage.getItem('token');
    return axios.get(`${URL_NOTIFICACIONES}?usuario_id=${usuarioId}`, {
        headers: {
            ...(token && { Authorization: `Bearer ${token}` })
        }
    });
};

// 2. Marcar una notificación como leída
export const marcarNotificacionLeida = async (idNotificacion) => {
    const token = localStorage.getItem('token');
    return axios.patch(`${URL_NOTIFICACIONES}${idNotificacion}/marcar_leida/`, {}, {
        headers: {
            ...(token && { Authorization: `Bearer ${token}` })
        }
    });
};

export const buscarMatch = async (datosMatching) => {
    const token = localStorage.getItem('token');
    return axios.post('http://127.0.0.1:8000/item/test/ofertas/matching/', datosMatching, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        }
    });
};


export const crearResena = async (datosResena) => {
    const token = localStorage.getItem('token');
    
    return axios.post('http://127.0.0.1:8000/item/test/resenas/', datosResena, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        }
    });
};

export const getResenasUsuario = async (idUsuario) => {
    return axios.get(`${API_BASE_URL}${idUsuario}/resenas_recibidas/`);
};

export const obtenerCertificadosUsuario = async (usuarioId) => {
  // Ajusta la URL a la ruta real de tu backend
  return await axios.get(`${API_BASE_URL}${usuarioId}/certificados/`);
}

export const crearCobroComunal = async (datosCobro) => {
    return axios.post('http://127.0.0.1:8000/item/test/cobros/', datosCobro);
};

export const obtenerCobrosComunales = async () => {
    return axios.get('http://127.0.0.1:8000/item/test/cobros/');
};

// Obtener un solo cobro por su ID
export const obtenerCobroComunal = async (id) => {
    return axios.get(`http://127.0.0.1:8000/item/test/cobros/${id}/`);
};