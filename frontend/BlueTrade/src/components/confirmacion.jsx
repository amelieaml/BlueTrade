export default function Confirmacion({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    // Fondo con desenfoque
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Caja de la Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Cabecera y cuerpo */}
        <div className="p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            {/* Icono de advertencia */}
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-500">{message}</p>
        </div>

        {/* Botones */}
        <div className="flex gap-2 px-6 py-4 bg-gray-50">
          <button 
            onClick={onClose}
            className="flex-1 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 rounded-xl px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-200 transition-all"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}