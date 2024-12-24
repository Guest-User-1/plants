// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AllPlantDetails = () => {
//   const [plants, setPlants] = useState([]);
//   const [filteredPlants, setFilteredPlants] = useState([]);
//   const [zoneFilter, setZoneFilter] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
//   const [showBackToTop, setShowBackToTop] = useState(false);

//   useEffect(() => {
//     // Fetch all plants data from your API
//     const fetchPlants = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           throw new Error("No token provided");
//         }
//         const response = await axios.get(
//           "http://localhost:5000/plants/get-map-plant",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log("Fetched plants:", response.data); // Log response data
//         setPlants(response.data);
//         setFilteredPlants(response.data);
//       } catch (error) {
//         console.error("Unexpected error", error);
//       }
//     };

//     fetchPlants();
//   }, []);

//   // Scroll listener for showing the "Back to Top" button
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 300) {
//         setShowBackToTop(true);
//       } else {
//         setShowBackToTop(false);
//       }
//     };
//     // Attach the event listener
//     window.addEventListener("scroll", handleScroll);

//     // Clean up the event listener on component unmount
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Scroll to top function
//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Function to handle filtering by zone
//   const handleZoneFilter = (event) => {
//     setZoneFilter(event.target.value);
//   };

//   // Function to handle sorting by plant number (numerically)
//   const handleSort = () => {
//     const sortedPlants = [...filteredPlants].sort((a, b) => {
//       const plantA = parseInt(a.plant_number, 10);
//       const plantB = parseInt(b.plant_number, 10);
//       return sortOrder === "asc" ? plantA - plantB : plantB - plantA;
//     });
//     setFilteredPlants(sortedPlants);
//     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//   };

//   // Function to filter plants by zone
//   const filterPlants = () => {
//     const filtered = plants.filter((plant) =>
//       plant.plant_zone
//         .toString()
//         .toLowerCase()
//         .includes(zoneFilter.toLowerCase())
//     );
//     setFilteredPlants(filtered);
//   };

//   useEffect(() => {
//     filterPlants();
//   }, [zoneFilter, plants]);

//   // Render function for boolean values (true/false)
//   const renderBoolean = (value) => (value ? "Yes" : "No");

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-teal-800">
//         All Plant Details
//       </h2>
//       {/* Filter Section */}
//       <div className="mb-4 flex flex-col sm:flex-row items-center">
//         <input
//           type="text"
//           placeholder="Filter by zone(वृक्ष विभाग)"
//           value={zoneFilter}
//           onChange={handleZoneFilter}
//           className="border p-2 rounded-xl border-solid-2 border-gray-400 mr-2 mb-2 sm:mb-0"
//         />
//         <button
//           onClick={handleSort}
//           className="bg-green-500 text-white p-2 text-sm rounded-xl"
//         >
//           Sort by Plant Number(वृक्ष क्रमांकाने सॉर्ट करा) (
//           {sortOrder === "asc"
//             ? "Ascending(चढता क्रम )"
//             : "Descending(उतरता क्रम)"}
//           )
//         </button>
//       </div>

//       {/* Display Plant Data in Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filteredPlants.map((plant) => (
//           <div
//             key={plant.id} // Assuming 'id' is the primary key
//             className="bg-green-50 p-4 rounded-3xl shadow-md"
//           >
//             <h3 className="font-bold text-center text-xl mb-4">
//               {plant.plant_name}
//             </h3>
//             <img
//               src={`http://localhost:5000${plant.plant_image}`} // Adjust this URL based on your API
//               alt={plant.plant_name}
//               className="w-full h-auto rounded-lg mb-4"
//             />
//             <p>
//               <strong>Plant Number(वृक्ष क्र.):</strong> {plant.plant_number}
//             </p>
//             <p>
//               <strong>Zone(विभाग ):</strong> {plant.plant_zone}
//             </p>
//             <p>
//               <strong>Health Status(स्थिति ):</strong> {plant.health_status}
//             </p>
//             <p>
//               <strong>Planted On(रोपण दिनांक):</strong>{" "}
//               {new Date(plant.planted_on).toLocaleDateString("en-GB")}
//             </p>
//             <p>
//               <strong>Latitude:</strong> {plant.latitude}
//             </p>
//             <p>
//               <strong>Longitude:</strong> {plant.longitude}
//             </p>
//             <p>
//               <strong>Height(ऊंची):</strong> {plant.height}
//             </p>
//             <p>
//               <strong>Insects Present(कीड लागली आहे का?):</strong>{" "}
//               {renderBoolean(plant.insects_present)}
//             </p>
//             <p>
//               <strong>Fettilizers Applied(खत टाकलेले आहे का?):</strong>{" "}
//               {renderBoolean(plant.fertilizers_applied)}
//             </p>
//             <p>
//               <strong>Compound Maintained (झाडाभोवती आळी आहे का?):</strong>{" "}
//               {renderBoolean(plant.compound_maintained)}
//             </p>
//             <p>
//               <strong>Water Logging (आळीमध्ये पाणी साचले आहे का?):</strong>{" "}
//               {renderBoolean(plant.water_logging)}
//             </p>

//             <p>
//               <strong>Water Schedule(वृक्षाला पाणी देण्याचा क्रम):</strong>{" "}
//               {plant.water_schedule}{" "}
//             </p>
//             <p>
//               <strong>
//                 Soil Level Maintained (मातीची पातळी योग्य आहे का?):
//               </strong>{" "}
//               {renderBoolean(plant.soil_level_maintained)}
//             </p>
//             <p>
//               <strong>Tree Burnt(झाड जळालेले आहे का?):</strong>{" "}
//               {renderBoolean(plant.tree_burnt)}
//             </p>
//             <p>
//               <strong>Unwanted Grass (झाडाभोवती अनावश्यक गवत आहे का?):</strong>{" "}
//               {renderBoolean(plant.unwanted_grass)}
//             </p>
//           </div>
//         ))}
//       </div>
//       {/* Back to Top Button for Mobile View */}
//       {showBackToTop && (
//         <button
//           onClick={scrollToTop}
//           className="fixed bottom-4 right-4 p-4 font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg focus:outline-none md:hidden transition-all duration-300 ease-in-out hover:bg-green-600"
//           style={{ zIndex: 1000 }}
//         >
//           ↑ Back To Top
//         </button>
//       )}
//     </div>
//   );
// };

// export default AllPlantDetails;

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

      {/* Display Plants in Selected Zone
      {selectedZone && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-center mb-4">
            Plants in Zone: {selectedZone}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPlants.map((plant) => (
              <div
                key={plant.id}
                onClick={() => handlePlantSelection(plant.id)}
                className="cursor-pointer bg-emerald-200 p-4 rounded-3xl shadow-md text-center active:scale-95"
              >
                <p className="font-bold">{plant.plant_number}</p>
              </div>
            ))}
          </div>
        </div>
      )} */}

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
              src={`${apiUrl}${selectedPlant.plant_image}`} // Adjust this URL based on your API
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

