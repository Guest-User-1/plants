import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const DeletePlant = () => {
  const [zone, setZone] = useState("");
  const [plantNumber, setPlantNumber] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "zone") setZone(value);
    if (name === "plant_number") setPlantNumber(value);
  };

  const handleModalOpen = (e) => {
    e.preventDefault();
    setIsModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Handle delete operation
  const handleDelete = async (e) => {
    e.preventDefault();

    if (!zone || !plantNumber) {
      toast.error("Please enter both zone and plant number.");
      toast.error("कृपया योग्य झोन क्रमांक आणि वृक्ष क्रमांक टाका.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You need to be logged in to delete a plant.");
        navigate("/login");
        return;
      }

      // Send DELETE request to the backend to delete the plant
      await axios.delete(`http://localhost:5000/plants/delete-plant`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { zone, plant_number: plantNumber },
      });

      toast.success("Plant deleted successfully!");
      setZone("");
      setPlantNumber("");
      handleModalClose();
    } catch (error) {
      toast.error("Error deleting plant. Please provide correct details!");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="delete-plant max-w-lg mx-auto p-4 bg-white rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
        Delete Plant
      </h2>
      {/* <form onSubmit={handleDelete} className="space-y-6"> */}
      <form onSubmit={handleModalOpen} className="space-y-6">
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Plant Zone (वृक्ष विभाग)
            <input
              type="number"
              name="zone"
              placeholder="Enter Plant Zone"
              value={zone}
              onChange={handleInputChange}
              className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </label>
        </div>
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Plant Number (वृक्ष क्रमांक)
            <input
              type="text"
              name="plant_number"
              placeholder="Enter Plant Number"
              value={plantNumber}
              onChange={handleInputChange}
              className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-3 bg-red-500 text-white font-medium rounded-2xl active:scale-95 w-full sm:w-auto hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete Plant
        </button>
      </form>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
            <h2 className="text-lg font-semibold mb-4">
              तुम्हाला खरंच वरील माहिती हटवायची आहे का?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                होय
              </button>
              <button
                onClick={handleModalClose}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                नाही
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletePlant;
