export const CategoryForm = ({  onClose }: { onClose: () => void }) => {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Nueva categoria</h2>
        {/* Aquí van los campos del formulario según el tipo */}
        <button className="mt-2 p-2 bg-red-500 text-white rounded" onClick={onClose}>Cancelar</button>
      </div>
    );
  };
  