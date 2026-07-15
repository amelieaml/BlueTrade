import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { crearResena } from '../api/item.api';
import Alerta from '../components/alerta'; 
import '../styles/PaginaResena.css'; 

// Componente interno para renderizar las estrellas SVG de forma limpia
const IconoEstrella = ({ activa }) => (
    <svg 
        className="estrella-icon" 
        viewBox="0 0 24 24" 
        fill={activa ? "#FFC107" : "none"} 
        stroke={activa ? "#FFC107" : "#9ca3af"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

function PaginaResena() {
    const { idTransaccion } = useParams();
    const navigate = useNavigate();
    const [calificacion, setCalificacion] = useState(5);
    const [comentario, setComentario] = useState('');
    const [cargando, setCargando] = useState(false);
    const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: 'success' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        try {
            await crearResena({ transaccion: idTransaccion, calificacion, comentario });
            setAlerta({
                mostrar: true,
                mensaje: "¡Tu valoración ha sido enviada con éxito!",
                tipo: "true"
            });
        } catch (error) {
            console.error("Error al enviar la reseña:", error);
            setAlerta({
                mostrar: true,
                mensaje: "No se pudo procesar la reseña. Por favor, verifica el estado de la transacción.",
                tipo: "error"
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="resena-container">
            {/* Elemento de fondo difuminado imitando tu LoginPage */}
            <div className="login-background" style={{ top: '-100px', left: '-100px', right: 'auto' }}></div>
            {alerta.mostrar && (
                <Alerta 
                mensaje={alerta.mensaje} 
                tipo={alerta.tipo} 
                onClose={() => setAlerta(prev => ({ ...prev, mostrar: false }))} 
                />
            )}
            <div className="resena-card">
                <h2>Califica tu Experiencia</h2>
                <p className="resena-subtitle">
                    Tu opinión es muy valiosa para mantener la transparencia y confianza en los intercambios de nuestra comunidad.
                </p>

                <form onSubmit={handleSubmit} className="resena-form">
                    
                    {/* Sección Interactiva de Estrellas */}
                    <div className="form-group">
                        <label>¿Qué puntuación le das?</label>
                        <div className="estrellas-selector">
                            {[1, 2, 3, 4, 5].map((valor) => (
                                <button
                                    key={valor}
                                    type="button"
                                    className="estrella-btn"
                                    onClick={() => setCalificacion(valor)}
                                    title={`${valor} Estrella${valor > 1 ? 's' : ''}`}
                                >
                                    <IconoEstrella activa={valor <= calificacion} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Caja de comentarios */}
                    <div className="form-group">
                        <label>Comentario u Observaciones</label>
                        <textarea 
                            className="resena-textarea"
                            placeholder="Cuéntanos un poco más sobre el cumplimiento, la amabilidad o detalles del intercambio..." 
                            value={comentario} 
                            onChange={(e) => setComentario(e.target.value)}
                            maxLength={300}
                            required
                        />
                    </div>

                    {/* Botones de control */}
                    <div className="resena-actions">
                        <button 
                            type="button" 
                            className="btn-cancelar-resena"
                            onClick={() => navigate('/transacciones')}
                            disabled={cargando}
                        >
                            Volver
                        </button>
                        <button 
                            type="submit" 
                            className="btn-submit-resena"
                            disabled={cargando}
                        >
                            {cargando ? 'Enviando...' : 'Enviar Valoración'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default PaginaResena;