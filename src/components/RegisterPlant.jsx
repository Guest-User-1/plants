import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPlant = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    plant_name: "",
    plant_number: "",
    plant_zone: "",
    height: "",
    stump: "",
    girth: "",
    planted_on: "",
    latitude: "",
    longitude: "",
    health_status: "Good",
  });
  const [userInfo, setUserInfo] = useState({
    full_name: "",
    zone: "",
    vibhaag: "",
    role: "",
  });
  const [plantImage, setPlantImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Display a pop-up notification before the form is filled
    toast.info("Please fill out all the fields before submitting the form.");
    toast.info("कृपया फॉर्म पूर्णपणे भरून रजिस्टर करा.");
  }, []);

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
        if (response.data.role === "zonal-admin") {
          setFormData((prev) => ({
            ...prev,
            plant_zone: response.data.zone, // Pre-fill the zone for zonal-admin
          }));
        }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPlantImage(e.target.files[0]);
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate health status-related fields
    // (Same validation logic as before)

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    data.append("upload_date", new Date().toISOString());
    if (plantImage) data.append("plant_image", plantImage);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You need to be logged in to register a plant.");
        navigate("/login");
        return;
      }

      await axios.post(`${apiUrl}/plants/register-plant`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Plant registered successfully!");
      toast.success("माहिती अद्ययावत झाली आहे!");

      setFormData({
        plant_name: "",
        plant_number: "",
        plant_zone: userInfo.role === "zonal-admin" ? userInfo.zone : "",
        height: "",
        stump: "",
        girth: "",
        planted_on: "",
        latitude: "",
        longitude: "",
        health_status: "Good",
      });
      setPlantImage(null);
      handleModalClose();
    } catch (error) {
      toast.error("Error registering plant.");
      console.error("Registration error:", error);
    }
  };
  return (
    <div className="max-w-full sm:max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Register Plant
      </h1>
      {/* <form onSubmit={handleSubmit} className="space-y-6"> */}
      <form onSubmit={handleModalOpen} className="space-y-6">
        {/* Plant Details */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Plant Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              Plant Name (वृक्षाचे नाव):
              <input
                type="text"
                name="plant_name"
                placeholder="Enter Plant Name"
                value={formData.plant_name}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </label>
            <label className="block">
              Plant Number (वृक्ष क्रमांक):
              <input
                type="text"
                name="plant_number"
                placeholder="Enter Plant Number"
                value={formData.plant_number}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </label>
            {/* <label className="block">
              Plant Zone
              <input
                type="number"
                name="plant_zone"
                placeholder="Plant Zone Number"
                value={formData.plant_zone}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </label> */}
            <label className="block">
              Plant Zone (वृक्ष विभाग):
              {userInfo.role === "super-admin" ? (
                <input
                  type="text"
                  name="plant_zone"
                  value={formData.plant_zone}
                  onChange={handleChange}
                  placeholder="Zone"
                  className="p-2 border rounded w-full"
                  required
                />
              ) : (
                <input
                  type="text"
                  name="plant_zone"
                  value={userInfo.zone} // Set to the user's zone for zonal-admin
                  disabled
                  className="p-2 border rounded w-full bg-gray-100" // Optional styling for disabled input
                  required
                />
              )}
            </label>

            <label className="block">
              Height (ft.) (उंची फूटमध्ये):
              <input
                type="number"
                name="height"
                placeholder="Enter Plant Height"
                value={formData.height}
                onChange={handleChange}
                className="p-2 border rounded w-full"
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
                onChange={handleChange}
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
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </label>
            <label className="block">
              Planted On (वृक्ष रोपण दिनांक):
              <input
                type="date"
                name="planted_on"
                value={formData.planted_on}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </label>
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              Latitude
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </label>
            <label className="block">
              Longitude
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </label>
          </div>
          <button
            type="button"
            onClick={fetchLocation}
            className="mt-4 py-2 px-4 bg-green-500 text-white rounded-2xl active:scale-95 w-full sm:w-auto"
          >
            Fetch GPS Location
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            Health Status (वृक्षाची सध्यस्थिति):
            <select
              name="health_status"
              value={formData.health_status}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            >
              <option value="Good">Good (सुस्थितीत) </option>
              <option value="Infected">Infected (बाधित) </option>
            </select>
          </label>
        </div>
        {/* Image Upload */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Plant Image</h2>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full border rounded p-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 font-bold rounded-2xl bg-green-500 text-white mt-4 active:scale-95"
        >
          Register Plant
        </button>
      </form>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
            <h2 className="text-lg font-semibold mb-4">
              तुम्हाला खरंच वरील माहिती स्थापित करायची आहे का?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
      <ToastContainer />
    </div>
  );
};

export default RegisterPlant;
