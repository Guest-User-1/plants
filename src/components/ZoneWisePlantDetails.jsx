import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaWpforms } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "react-toastify/dist/ReactToastify.css";

const ZoneWisePlantDetails = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [zoneData, setZoneData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);
  const navigate = useNavigate();

  // Fetch plants data by zone
  useEffect(() => {
    const fetchPlantsData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No token provided");
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          throw new Error("No user data found");
        }

        const response = await axios.get(
          `${apiUrl}/plant-report/plants-with-last-report`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const groupedByZone = response.data.reduce((acc, plant) => {
          if (!acc[plant.plant_zone]) {
            acc[plant.plant_zone] = [];
          }
          acc[plant.plant_zone].push(plant);
          return acc;
        }, {});

        // To show zone specific tile
        if (user.role === "zonal-admin" || user.role === "normal-user") {
          setZoneData({ [user.zone]: groupedByZone[user.zone] || [] });
        } else if (user.role === "super-admin") {
          setZoneData(groupedByZone);
        } else {
          setZoneData({});
          toast.warn("Unauthorized role detected.");
        }
        // setZoneData(groupedByZone);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching plant data.");
        setLoading(false);
        console.error("Error fetching plant data:", error);
      }
    };

    fetchPlantsData();
  }, []);

  const handleZoneClick = (plant_zone) => {
    setSelectedZone(plant_zone);
  };

  const handlePlantClick = (plant) => {
    navigate("/detailed-map", {
      state: { plant },
    });
  };

  const handleEdit = (plant_zone, plantNumber) => {
    navigate(`/update-plant?zone=${plant_zone}&plantNumber=${plantNumber}`);
  };
  const handleForm = (plant_zone, plantNumber) => {
    navigate(`/plant-report?zone=${plant_zone}&plantNumber=${plantNumber}`);
  };

  const handleDelete = async (plantId, plant_zone, plant_number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token provided");
      }

      const response = await axios.delete(
        `${apiUrl}/plants/delete-zone-plant?plant_number=${encodeURIComponent(
          plant_number
        )}&zone=${plant_zone}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Plant deleted successfully!");
        setZoneData((prevZoneData) => {
          const updatedZoneData = { ...prevZoneData };
          updatedZoneData[plant_zone] = updatedZoneData[plant_zone].filter(
            (plant) => plant.plant_number !== plant_number
          );
          return updatedZoneData;
        });
      }
    } catch (error) {
      toast.error("Error deleting plant.");
      console.error("Error deleting plant:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem("user")); // Ensure user data is parsed correctly from localStorage

  return (
    <div className="zonewise-plant-details max-w-7xl mx-auto p-4">
      <ToastContainer />
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-indigo-800">
        Zonewise Plant Details
      </h2>

      {/* <div className="flex flex-wrap justify-center gap-3 mb-4">
        {Object.keys(zoneData).map((zone) => (
          <button
            key={zone}
            onClick={() => handleZoneClick(zone)}
            className="px-6 py-2 font-semibold text-white rounded-lg bg-indigo-600 hover:bg-indigo-800 active:scale-95 transition duration-300"
          >
            Zone {zone}
          </button>
        ))}
      </div> */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {Object.keys(zoneData).map((zone) => {
          const hasInfectedPlants = zoneData[zone].some(
            (plant) => plant.health_status === "Infected"
          );
          const plantCount = zoneData[zone].length;

          return (
            <button
              key={zone}
              onClick={() => handleZoneClick(zone)}
              title={`Plant Count: ${plantCount}`} // Shows count on hover
              className={`px-6 py-2 font-semibold text-white rounded-lg ${
                hasInfectedPlants
                  ? "bg-red-600 hover:bg-red-800"
                  : "bg-green-600 hover:bg-green-800"
              } active:scale-95 transition duration-300`}
            >
              Zone {zone}
            </button>
          );
        })}
      </div>

      {selectedZone && (
        <div className="overflow-x-auto">
          <h3 className="text-xl sm:text-2xl font-semibold text-center mb-4 text-indigo-600">
{/*             Plants in Zone {selectedZone} (झोन क्र. {selectedZone} मधील वृक्ष ) */}
            झोन क्र. {selectedZone} मधील वृक्ष
          </h3>
          <div className="flex justify-around mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="text-gray-700 font-bold">
              एकूण वृक्ष : {zoneData[selectedZone].length}
              {/* Total Plants: {zoneData[selectedZone].length} */}
            </div>
            <div className="text-red-600 font-bold">
              बाधित वृक्ष : {/* Infected Plants:{" "} */}
              {
                zoneData[selectedZone].filter(
                  (plant) => plant.health_status === "Infected"
                ).length
              }
            </div>
            <div className="text-green-600 font-bold">
              सुस्थितीत वृक्ष : {/* Healthy Plants:{" "} */}
              {
                zoneData[selectedZone].filter(
                  (plant) => plant.health_status !== "Infected"
                ).length
              }
            </div>
          </div>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md text-center">
            <thead className="bg-indigo-200">
              <tr>
                <th className="py-3 px-4 text-center text-sm sm:text-base font-extrabold text-gray-700">
                  {/* Plant No. (क्र.) */}
                  वृक्ष क्र.
                </th>
                <th className="py-3 px-4 text-center text-sm sm:text-base font-extrabold text-gray-700">
                  {/* Plant Name (नाव) */}
                  वृक्षाचे नाव
                </th>
                <th className="py-3 px-4 text-center text-sm sm:text-base font-extrabold text-gray-700">
                  {/* Health (स्थिति) */}
                  स्थिति
                </th>
                <th className="py-3 px-4 text-center text-sm sm:text-base font-extrabold text-gray-700">
                  {/* Last Report Date (शेवटचा तपशील) */}
                  शेवटच्या तपशीलची दिनांक
                </th>
                <th className="py-3 px-4 text-center text-sm sm:text-base font-extrabold text-gray-700">
                  {/* Last Report Time (शेवटच्या तपशीलचा वेळ) */}
                  शेवटच्या तपशीलचा वेळ
                </th>
                {/* {(user &&
                  user.role === "zonal-admin" &&
                  user.zone === selectedZone) ||
                user.role === "super-admin" ? (
                  <th className="py-3 px-4 text-center text-sm sm:text-base font-extrabold text-gray-700">
                    क्रिया
                  </th>
                ) : null} */}
                {(user && user.role === "zonal-admin") ||
                user.role === "super-admin" ? (
                  <th className="py-3 px-4 text-center text-sm sm:text-base font-extrabold text-gray-700">
                    {/* Action (क्रिया) */}
                    क्रिया
                  </th>
                ) : null}
              </tr>
            </thead>

            <tbody>
              {zoneData[selectedZone].map((plant) => (
                <tr
                  key={plant.id}
                  className={`border-b border-gray-200 ${
                    plant.health_status === "Infected" ? "bg-red-400" : ""
                  }`}
                >
                  <td
                    className="py-2 px-4 font-bold text-sm sm:text-base text-gray-700 cursor-pointer underline"
                    onClick={() => handlePlantClick(plant)}
                  >
                    {plant.plant_number}
                  </td>
                  <td className="py-2 px-4 font-bold text-sm sm:text-base text-gray-700">
                    {plant.plant_name}
                  </td>
                  <td className="py-2 px-4 font-bold text-sm sm:text-base text-gray-700">
                    {plant.health_status === "Good" ? "सुस्थितीत" : "बाधित"}
                  </td>
                  <td className="py-2 px-4 font-bold text-sm sm:text-base text-gray-700">
                    {plant.last_reported_date
                      ? new Date(plant.last_reported_date).toLocaleDateString(
                          "en-GB"
                        )
                      : "Not Reported"}
                  </td>
                  <td className="py-2 px-4 font-bold text-sm sm:text-base text-gray-700">
                    {plant.last_reported_date
                      ? new Date(plant.last_reported_date).toLocaleTimeString()
                      : "Not Reported"}
                  </td>
                  {(user &&
                    user.role === "zonal-admin" &&
                    user.zone === plant.plant_zone) ||
                  user.role === "super-admin" ? (
                    <td className="py-2 px-4 font-bold text-sm sm:text-base text-gray-700 flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleEdit(plant.plant_zone, plant.plant_number)
                        }
                        className="text-green-500 hover:text-green-700 transition duration-300 active:scale-90"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() =>
                          handleForm(plant.plant_zone, plant.plant_number)
                        }
                        className="text-green-500 hover:text-green-700 transition duration-300 active:scale-90"
                      >
                        <FaWpforms size={20} />
                      </button>
                      {user && user.role !== "zonal-admin" && (
                        <button
                          onClick={() =>
                            handleDelete(
                              plant.id,
                              plant.plant_zone,
                              plant.plant_number
                            )
                          }
                          className="text-red-500 hover:text-red-700 transition duration-300 active:scale-90"
                        >
                          <FaTrashAlt size={20} />
                        </button>
                      )}
                      {/* <button
                        onClick={() =>
                          handleDelete(
                            plant.id,
                            plant.plant_zone,
                            plant.plant_number
                          )
                        }
                        className="text-red-500 hover:text-red-700 transition duration-300 active:scale-90"
                      >
                        <FaTrashAlt size={20} />
                      </button> */}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setSelectedZone(null)}
            className="mt-4 px-4 py-2 font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 active:scale-90"
          >
            Back to Zones
          </button>
        </div>
      )}
    </div>
  );
};

export default ZoneWisePlantDetails;
