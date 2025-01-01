import { useState, useEffect } from "react";
import axios from "axios";

const AllPlantDetails = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [zones, setZones] = useState([]); // New state to store available zones
  const [selectedZone, setSelectedZone] = useState(null); // Selected zone
  const [selectedPlant, setSelectedPlant] = useState(null); // Selected plant
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch all plants data and zones
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No token provided");
        }
        const response = await axios.get(`${apiUrl}/plants/get-map-plant`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched plants:", response.data); // Log response data
        setPlants(response.data);

        // Extract unique zones from the plants data
        const uniqueZones = [
          ...new Set(response.data.map((plant) => plant.plant_zone)),
        ];
        // Sort zones in ascending order (numerically)
        uniqueZones.sort((a, b) => a - b); // This assumes zones are numeric
        setZones(uniqueZones);
        setFilteredPlants(response.data);
      } catch (error) {
        console.error("Unexpected error", error);
      }
    };

    fetchPlants();
  }, []);

  // Handle zone selection
  const handleZoneSelection = (zone) => {
    setSelectedZone(zone);
    setSelectedPlant(null); // Reset selected plant when a new zone is selected
    // const filtered = plants.filter((plant) => plant.plant_zone === zone);
    const filtered = plants
      .filter((plant) => plant.plant_zone === zone)
      .sort((a, b) => a.plant_number - b.plant_number);
    setFilteredPlants(filtered);
  };

  // Handle plant selection
  const handlePlantSelection = (plantId) => {
    const plant = plants.find((plant) => plant.id === plantId);
    setSelectedPlant(plant);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-teal-800">
        All Plant Details
      </h2>

      {/* Zone Tiles */}
      <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {zones.map((zone, index) => (
          <div
            key={index}
            onClick={() => handleZoneSelection(zone)}
            className="cursor-pointer text-white bg-teal-500 p-4 rounded-xl text-center font-semibold hover:bg-teal-600 transition-all active:scale-95"
          >
            Zone {zone}
          </div>
        ))}
      </div>

      {/* Display Plants in Selected Zone */}
      {selectedZone && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-center mb-4">
            Plants in Zone: {selectedZone}
          </h3>
          <div className="grid grid-cols-6 gap-2 sm:gap-4">
            {filteredPlants.map((plant) => (
              <div
                key={plant.id}
                onClick={() => handlePlantSelection(plant.id)}
                className="cursor-pointer bg-emerald-200 p-2 sm:p-3 lg:p-4 rounded-full shadow-md text-center active:scale-95 aspect-square flex items-center justify-center"
              >
                <p className="text-xs sm:text-sm font-bold">
                  {plant.plant_number}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plant Details */}
      {selectedPlant && (
        <div className="fixed inset-0 text-sm bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white mx-20 mt-8 p-6 rounded-xl shadow-md shadow-gray-500 max-h-screen w-11/12 sm:w-3/4 md:w-1/2 lg:w-2/5 overflow-y-auto">
            {/* Close Icon */}
            <button
              onClick={() => setSelectedPlant(null)}
              className="absolute top-4 right-4 bg-green-400 rounded-full p-2 hover:bg-green-500 transition shadow-md shadow-gray-600"
              aria-label="Close"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold text-center mb-4">
              {selectedPlant.plant_name} Details
            </h3>
            <img
              src={selectedPlant.plant_image} // Adjust this URL based on your API
              alt={selectedPlant.plant_name}
              className="w-full h-auto rounded-lg mb-4"
            />
            <p>
              <strong>Plant Number:</strong> {selectedPlant.plant_number}
            </p>
            <p>
              <strong>Zone:</strong> {selectedPlant.plant_zone}
            </p>
            <p>
              <strong>Health Status:</strong> {selectedPlant.health_status}
            </p>
            <p>
              <strong>Planted On:</strong>{" "}
              {new Date(selectedPlant.planted_on).toLocaleDateString("en-GB")}
            </p>
            <p>
              <strong>Latitude:</strong> {selectedPlant.latitude}
            </p>
            <p>
              <strong>Longitude:</strong> {selectedPlant.longitude}
            </p>
            <p>
              <strong>Height:</strong> {selectedPlant.height}
            </p>
            <p>
              <strong>Stump:</strong> {selectedPlant.stump}
            </p>
            <p>
              <strong>Girth:</strong> {selectedPlant.girth}
            </p>
            <p>
              <strong>Registered By:</strong>{" "}
              {selectedPlant.registered_by_full_name}
            </p>
            <p>
              <strong>Registered By Zone:</strong>{" "}
              {selectedPlant.registered_by_zone}
            </p>
            <p>
              <strong>Registered By Vibhaag:</strong>{" "}
              {selectedPlant.registered_by_vibhaag}
            </p>
            <p>
              <strong>Registered on:</strong>{" "}
              {new Date(selectedPlant.upload_date).toLocaleString()}
            </p>
            <p>
              <strong>Updated By:</strong> {selectedPlant.updated_by_full_name}
            </p>
            <p>
              <strong>Updated By Zone:</strong> {selectedPlant.updated_by_zone}
            </p>
            <p>
              <strong>Updated By Vibhaag:</strong>{" "}
              {selectedPlant.updated_by_vibhaag}
            </p>
            <p>
              <strong>Updated on:</strong>{" "}
              {new Date(selectedPlant.updated_time).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPlantDetails;
