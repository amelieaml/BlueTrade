# services.py
class MatchingEngine:
    @staticmethod
    def encontrar_mejor_match(requerimientos, todas_las_ofertas):
        mejor_oferta = None
        mejor_puntaje = -1
        
        print("Requerimientos recibidos para matching:", requerimientos)
        print("Número de ofertas disponibles:", todas_las_ofertas)
        
        for oferta in todas_las_ofertas:
            # Función auxiliar para limpiar y normalizar los textos de forma segura
            def limpiar(valor):
                if valor is None:
                    return ""
                return str(valor).strip().lower()

            # Extraemos los datos usando las llaves reales que llegan al backend
            tipo_busco = limpiar(requerimientos.get('tipo_que_busco'))
            cat_busco = limpiar(requerimientos.get('cat_que_busco'))
            tipo_ofrecido = limpiar(requerimientos.get('tipo_que_ofrecido'))
            cat_ofrecido = limpiar(requerimientos.get('cat_que_ofrecido'))

            # Validación bidireccional estricta y segura
            es_compatible = (
                limpiar(oferta.tipo_ofrecido) == tipo_busco and
                limpiar(oferta.categoria_ofrecida) == cat_busco and
                limpiar(oferta.tipo_solicitado) == tipo_ofrecido and
                limpiar(oferta.categoria_solicitada) == cat_ofrecido
            )
            
            if not es_compatible:
                continue
            
            # Si pasa el filtro, calculamos el puntaje
            puntaje = 100 

            if puntaje > mejor_puntaje:
                mejor_puntaje = puntaje
                mejor_oferta = oferta
        
        return mejor_oferta