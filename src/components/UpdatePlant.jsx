import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdatePlant = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const location = useLocation();
  // const { zone, plantNumber } = location.state || {};
  // Get query params from URL
  const queryParams = new URLSearchParams(location.search);
  const plant_zone = queryParams.get("zone");
  const plantNumber = queryParams.get("plantNumber");
  const [searchParams, setSearchParams] = useState({
    // plant_zone: "",
    // plant_number: "",
    plant_zone: plant_zone || "",
    plant_number: plantNumber || "",
  });
  const [formData, setFormData] = useState(null);
  const [userInfo, setUserInfo] = useState({
    full_name: "",
    zone: "",
    vibhaag: "",
  });
  const [plantImage, setPlantImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    toast.info("Please enter plant zone and number to fetch the plant data.");
    toast.info("कृपया योग्य झोन क्रमांक आणि वृक्ष क्रमांक टाका.");
  }, []);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Please log in to continue.");
          navigate("/login");
          return;
        }
        const response = await axios.get(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          toast.error("तुमचा सेशन संपला आहे, पुन्हा लॉगिन करा.");
          localStorage.removeItem("authToken");
          navigate("/login");
        } else {
          toast.error("Error fetching user info.");
        }
      }
    };
    fetchUserInfo();
  }, [navigate]);

  // Handle input changes for search parameters
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchPlantData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to fetch plant data.");
        navigate("/login");
        return;
      }

      // Restrict `zonal-admin` users to fetch plants within their zone
      if (
        userInfo.role === "zonal-admin" &&
        searchParams.plant_zone === userInfo.zone
      ) {
        toast.error("You can only update plants from your assigned zone.");
        toast.error(
          "तुम्ही फक्त तुमच्या विभागातील वृक्षांची माहिती अद्ययावत करू शकता."
        );
        return;
      }

      const response = await axios.get(`${apiUrl}/plants/get-plant`, {
        params: searchParams,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        const formattedData = {
          ...response.data,
          planted_on: response.data.planted_on
            ? new Date(response.data.planted_on).toISOString().split("T")[0]
            : "",
        };

        setFormData(formattedData);
        toast.success("Plant data fetched successfully.");
      } else {
        toast.error("No plant found with the provided details.");
      }
    } catch (error) {
      toast.error("Error fetching plant data.");
      console.error("Fetch error:", error);
    }
  };
  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? value === "true" : value,
    }));
  };

  // Handle image upload
  const handleFileChange = (e) => {
    setPlantImage(e.target.files[0]);
  };

  // Fetch GPS location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          toast.success("Location fetched successfully.");
        },
        (error) => console.error("Error fetching location:", error)
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };
  const handleModalOpen = (e) => {
    e.preventDefault();
    setIsModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
  };
  // const handleUpdate = async (e) => {
  //   e.preventDefault();
  //   if (!formData) {
  //     toast.error("Please fetch plant data before updating.");
  //     return;
  //   }

  //   // Restrict `zonal-admin` users to update plants within their zone
  //   if (
  //     userInfo.role === "zonal-admin" &&
  //     formData.plant_zone !== userInfo.zone
  //   ) {
  //     toast.error("You can only update plants from your assigned zone.");
  //     toast.error(
  //       "तुम्ही फक्त तुमच्या विभागातील वृक्षांची माहिती अद्ययावत करू शकता."
  //     );
  //     return;
  //   }
  //   const processedFormData = { ...formData };

  //   const data = new FormData();
  //   Object.keys(processedFormData).forEach((key) =>
  //     data.append(key, processedFormData[key])
  //   );

  //   // data.append("updated_by_full_name", userInfo.full_name);
  //   // data.append("updated_by_zone", userInfo.zone);
  //   // data.append("updated_by_vibhaag", userInfo.vibhaag);
  //   // Combine `updated_by` fields into a single object
  //   const updatedBy = {
  //     full_name: userInfo.full_name,
  //     zone: userInfo.zone,
  //     vibhaag: userInfo.vibhaag,
  //   };
  //   data.append("updated_by", JSON.stringify(updatedBy)); // Send as JSON string
  //   // if (plantImage) data.append("plant_image", plantImage);
  //   if (plantImage) {
  //     // Check if plantImage is Base64 encoded
  //     if (typeof plantImage === "string" && plantImage.startsWith("data:")) {
  //       data.append("plant_image", plantImage);
  //     } else {
  //       data.append("plant_image", plantImage);
  //     }
  //   }

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     if (!token) {
  //       toast.error("You need to be logged in to update the plant.");
  //       navigate("/login");
  //       return;
  //     }

  //     await axios.put(`${apiUrl}/plants/update-plant`, data, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     toast.success("Plant updated successfully!");
  //     toast.success("माहिती अद्ययावत झाली आहे!");

  //     setFormData(null);
  //     setPlantImage(null);
  //     handleModalClose();
  //   } catch (error) {
  //     toast.error("Error updating plant.");
  //     console.error("Update error:", error);
  //   }
  // };
  // Update the handleUpdate function in UpdatePlant.jsx

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData) {
      toast.error("Please fetch plant data before updating.");
      return;
    }

    // Restrict zonal-admin users to update plants within their zone
    if (
      userInfo.role === "zonal-admin" &&
      formData.plant_zone !== userInfo.zone
    ) {
      toast.error("You can only update plants from your assigned zone.");
      toast.error(
        "तुम्ही फक्त तुमच्या विभागातील वृक्षांची माहिती अद्ययावत करू शकता."
      );
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You need to be logged in to update the plant.");
        navigate("/login");
        return;
      }

      const formDataToSend = new FormData();

      // Append all form data fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined &&
          key !== "plant_image") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append updated_by information
      const updatedBy = {
        full_name: userInfo.full_name,
        zone: userInfo.zone,
        vibhaag: userInfo.vibhaag,
      };
      formDataToSend.append("updated_by", JSON.stringify(updatedBy));

      // Handle image upload
      if (plantImage) {
        if (typeof plantImage === "string" && plantImage.startsWith("data:")) {
          // If it's a base64 string
          formDataToSend.append("plant_image", plantImage);
        } else {
          // If it's a File object
          formDataToSend.append("plant_image", plantImage);
        }
      }

      const response = await axios.put(
        `${apiUrl}/plants/update-plant`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Plant updated successfully!");
        toast.success("माहिती अद्ययावत झाली आहे!");
        setFormData(null);
        setPlantImage(null);
        handleModalClose();
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Error updating plant.");
    }
  };
  return (
    <div className="update-plant p-4 sm:p-6 lg:p-8">
      <ToastContainer />
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Update Plant
      </h2>

      <div className="space-y-4">
        <label className="block text-sm sm:text-base">
          Plant Zone (वृक्ष विभाग)
          <input
            type="number"
            name="plant_zone"
            placeholder="Plant Zone Number"
            value={searchParams.plant_zone}
            onChange={handleSearchChange}
            className={`mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 ${
              userInfo.role === "zonal-admin"
                ? "bg-gray-100"
                : "focus:ring-yellow-500"
            }`}
            disabled={userInfo.role === "zonal-admin"}
            required
          />
        </label>

        <label className="block text-sm sm:text-base">
          Plant Number (वृक्ष क्रमांक)
          <input
            type="text"
            name="plant_number"
            placeholder="Enter Plant Number"
            value={searchParams.plant_number}
            onChange={handleSearchChange}
            className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </label>

        <button
          onClick={fetchPlantData}
          className="w-full sm:w-auto mt-4 py-2 px-4 bg-yellow-500 text-white rounded-2xl shadow hover:bg-yellow-600 active:scale-95 transition duration-200"
        >
          Fetch Plant Data
        </button>
      </div>
      {formData && (
        // <form onSubmit={handleUpdate} className="space-y-6 mt-8">
        <form onSubmit={handleModalOpen} className="space-y-6 mt-8">
          {/* Plant Details */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Plant Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="block text-sm sm:text-base">
                Plant Name (वृक्षाचे नाव)
                <input
                  type="text"
                  name="plant_name"
                  placeholder="Enter Plant Name"
                  value={formData.plant_name}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </label>
              <label className="block text-sm sm:text-base">
                Plant Number (वृक्ष क्रमांक)
                <input
                  type="text"
                  name="plant_number"
                  placeholder="Enter Plant Number"
                  value={formData.plant_number}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border bg-gray-100 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </label>
              <label className="block text-sm sm:text-base">
                Plant Zone (वृक्ष विभाग)
                <input
                  type="number"
                  name="plant_zone"
                  placeholder="Plant Zone Number"
                  value={formData.plant_zone}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border bg-gray-100 rounded w-full shadow-sm"
                  disabled
                  required
                />
              </label>
              <label className="block text-sm sm:text-base">
                Height (ft.) (उंची फूटमध्ये):
                <input
                  type="number"
                  name="height"
                  placeholder="Enter Plant Height"
                  value={formData.height}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </label>
              <label className="block">
                Stump (cm.) (बुंधा सें.मी.मध्ये):
                <input
                  type="number"
                  name="stump"
                  placeholder="Enter Plant Stump"
                  value={formData.stump}
                  onChange={handleFormChange}
                  className="p-2 border rounded w-full"
                  required
                />
              </label>
              <label className="block">
                Girth (ft.) (घेरा फूटमध्ये):
                <input
                  type="number"
                  name="girth"
                  placeholder="Enter Plant Girth"
                  value={formData.girth}
                  onChange={handleFormChange}
                  className="p-2 border rounded w-full"
                  required
                />
              </label>
              <label className="block text-sm sm:text-base">
                Planted On (वृक्ष रोपण दिनांक)
                <input
                  type="date"
                  name="planted_on"
                  value={formData.planted_on}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </label>
              <label>
                Registered on (माहिती स्थापित केली)
                <input
                  type="text"
                  name="upload_date"
                  value={
                    formData.upload_date
                      ? new Date(formData.upload_date).toLocaleString("en-GB")
                      : ""
                  }
                  className="cursor-pointer mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                  readOnly
                />
              </label>
              <label className="block text-sm sm:text-base">
                Full Name (पूर्ण नाव)
                <input
                  type="text"
                  name="updated_by_full_name"
                  value={formData.updated_by_full_name || ""}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                  readOnly
                />
              </label>
              <label className="block text-sm sm:text-base">
                Vibhaag (विभाग)
                <input
                  type="text"
                  name="updated_by_vibhaag"
                  value={formData.updated_by_vibhaag || ""}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                  readOnly
                />
              </label>
              <label className="block text-sm sm:text-base">
                Zone (झोन)
                <input
                  type="numbernumber"
                  name="updated_by_zone"
                  value={formData.updated_by_zone || ""}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                  readOnly
                />
              </label>
              <label>
                Updated on (माहिती स्थापित केली)
                <input
                  type="text"
                  name="updated_time"
                  value={
                    formData.updated_time
                      ? new Date(formData.updated_time).toLocaleString("en-GB")
                      : ""
                  }
                  className="cursor-pointer mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                  readOnly
                />
              </label>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Location</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="block text-sm sm:text-base">
                Latitude
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </label>
              <label className="block text-sm sm:text-base">
                Longitude
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </label>
            </div>
            <button
              type="button"
              onClick={fetchLocation}
              className="w-full sm:w-auto mt-4 py-2 px-4 bg-yellow-500 text-white rounded-2xl shadow hover:bg-yellow-600 transition active:scale-95 duration-200"
            >
              Fetch GPS Location
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <label className="block text-sm sm:text-base">
              Health Status (वृक्षाची सध्यस्थिति)
              <select
                name="health_status"
                value={formData.health_status}
                onChange={handleFormChange}
                className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="Good">Good (सुस्थितीत)</option>
                <option value="Infected">Infected (बाधित) </option>
              </select>
            </label>
          </div>
          {/* Image Upload */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Plant Image
            </h2>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full border rounded p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-white font-bold rounded-2xl mt-6 hover:bg-yellow-600 transition duration-200 active:scale-95"
          >
            Update Plant
          </button>
        </form>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
            <h2 className="text-lg font-semibold mb-4">
              तुम्हाला खरंच वरील माहिती अद्ययावत करायची आहे का?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleUpdate}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
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

export default UpdatePlant;
