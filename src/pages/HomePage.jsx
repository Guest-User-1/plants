import MapComponent from "../components/MapComponent";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const HomePage = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { auth } = useContext(AuthContext); // Access the auth context
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  // Redirect to login if user is not authenticated
  // useEffect(() => {
  //   if (!auth.token) {
  //     navigate("/login");
  //   }
  // }, [auth, navigate]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Please log in to continue.");
          navigate("/login");
          return;
        }
        await axios.get(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  // Check user role
  const isAdmin = auth.user?.role === "super-admin";
  const isZoneAdmin = auth.user?.role === "zonal-admin";

  // Scroll listener for showing the "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    // Attach the event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If not authenticated, render nothing (can also display a loading spinner)
  if (!auth.token) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <ToastContainer />
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold text-center mb-6 text-emerald-600">
          Welcome to the Plant Tracker App
        </h1>
        <p className="text-md text-center text-green-800 mb-8">
          Use this app to Track, Register, and Update information on various
          plants around you.
        </p>
        {/* Buttons Section */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 p-4 overflow-x-auto font-bold">
          {isAdmin && (
            <>
              <Link to="/register-plant">
                <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-4 w-full max-w-[220px] shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300">
                  Register Plant
                </button>
              </Link>
              <Link to="/update-plant">
                <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-300">
                  Update Plant
                </button>
              </Link>
              <Link to="/delete-plant">
                <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300">
                  Delete Plant
                </button>
              </Link>
              {/* <Link to="/questions">
                <button className="bg-gradient-to-r from-blue-500 to-cyan-800 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300">
                  Daily Updation
                </button>
              </Link> */}
              <Link to="/plant-report">
                <button className="bg-gradient-to-r from-sky-500 to-blue-800 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300">
                  Plant Report
                </button>
              </Link>
              <Link to="/dashboard">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300">
                  User Management
                </button>
              </Link>
              <Link to="/plant-report-management">
                <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300">
                  Plant Report Management
                </button>
              </Link>
            </>
          )}
          {isZoneAdmin && (
            <Link to="/register-plant">
              <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-4 w-full max-w-[220px] shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-teal-300">
                Register Plant
              </button>
            </Link>
          )}
          <Link to="/zone-wise-plant-details">
            <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300">
              Zone Wise Plant Details
            </button>
          </Link>
          <Link to="/all-plant-details">
            <button className="bg-gradient-to-r from-cyan-500 to-indigo-800 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300">
              All Plant Details
            </button>
          </Link>
          <Link to="/dashboard">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300">
              User Management
            </button>
          </Link>
        </div>
        {/* Map Section */}
        <div className="mt-8 overflow-hidden md:overflow-auto">
          <MapComponent />
        </div>
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 p-4 font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg focus:outline-none md:hidden transition-all duration-300 ease-in-out hover:bg-green-600"
            style={{ zIndex: 1000 }}
          >
            ↑ Back To Top
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
