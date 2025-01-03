const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold text-center text-gray-900 mb-4">
            तुम्हाला खरंच माहिती हटवायची आहे का?
          </h3>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold transition duration-200"
            >
              हो
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-bold transition duration-200"
            >
              नाही
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
