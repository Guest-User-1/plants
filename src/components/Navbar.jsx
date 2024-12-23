import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Check if user is a super-admin or zonal-admin
  // const hasAdminRole =
  //   auth.user?.role === "super-admin" || auth.user?.role === "zonal-admin";
  const hasAdminRole = auth.user?.role === "super-admin";

  const hasZoneAdmin = auth.user?.role === "zonal-admin";

  return (
    <nav className="bg-green-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold hover:text-gray-100 transition duration-200 transform hover:scale-105"
        >
          🌿 Plant Tracker
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none"
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-white">
            Home
          </Link>
          <Link to="/zone-wise-plant-details" className="text-white">
            Zone Wise Plants
          </Link>
          <Link to="/all-plant-details" className="text-white">
            All Plant Details
          </Link>
          {/* <Link to="/attendance" className="text-white">
            Attendance
          </Link> */}
          {hasAdminRole && (
            <Link to="/dashboard" className="text-white">
              User Management
            </Link>
          )}

          {/* Conditionally Render Services Section */}
          {hasAdminRole && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-white flex items-center"
              >
                Services
                <svg
                  className="w-5 h-5 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg text-gray-800 z-10">
                  <Link
                    to="/register-plant"
                    className="block px-4 py-2 text-lg font-semibold hover:bg-green-200"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Register Plant
                  </Link>
                  <Link
                    to="/update-plant"
                    className="block px-4 py-2 text-lg font-semibold hover:bg-green-200"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Update Plant
                  </Link>
                  <Link
                    to="/delete-plant"
                    className="block px-4 py-2 text-lg font-semibold hover:bg-green-200"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Delete Plant
                  </Link>
                </div>
              )}
            </div>
          )}
          {hasZoneAdmin && (
            <Link to="/register-plant" className="text-white">
              Register Plant
            </Link>
          )}

          {/* Auth Links or Logout */}
          <div>
            {auth.token ? (
              <button
                onClick={logout}
                className="px-4 py-2 font-bold bg-red-500 rounded-xl text-white shadow-xl"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="mr-4 text-white">
                  Login
                </Link>
                <Link to="/register" className="text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center mt-4 bg-green-500 p-4 rounded-lg">
          <Link
            to="/"
            className="text-white font-bold mb-4"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/zone-wise-plant-details"
            className="text-white font-bold mb-4"
            onClick={toggleMenu}
          >
            Zone Wise Plants
          </Link>
          <Link
            to="/all-plant-details"
            className="text-white font-bold mb-4"
            onClick={toggleMenu}
          >
            All Plant Details
          </Link>
          {/* <Link
            to="/attendance"
            className="text-white font-bold mb-4"
            onClick={toggleMenu}
          >
            Attendance
          </Link> */}
          {hasAdminRole && (
            <Link
              to="/dashboard"
              className="text-white font-bold mb-4"
              onClick={toggleMenu}
            >
              User Management
            </Link>
          )}

          {hasAdminRole && (
            <>
              <button
                onClick={toggleDropdown}
                className="flex items-center font-bold text-white mb-4"
              >
                Services
                <svg
                  className="w-5 h-5 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="flex flex-col items-center mt-2 bg-white rounded-lg shadow-lg text-gray-800 mb-4">
                  <Link
                    to="/register-plant"
                    className="block px-4 py-2 text-lg font-semibold hover:bg-green-200"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Register Plant
                  </Link>
                  <Link
                    to="/update-plant"
                    className="block px-4 py-2 text-lg font-semibold hover:bg-green-200"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Update Plant
                  </Link>
                  <Link
                    to="/delete-plant"
                    className="block px-4 py-2 text-lg font-semibold hover:bg-green-200"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Delete Plant
                  </Link>
                </div>
              )}
            </>
          )}
          {hasZoneAdmin && (
            <>
              <Link
                to="/register-plant"
                className="text-white font-bold mb-4"
                onClick={toggleMenu}
              >
                Register Plant
              </Link>
            </>
          )}

          <div className="flex flex-col items-center">
            {auth.token ? (
              <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 font-bold rounded-xl text-white mb-4 shadow-xl"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-white mb-4">
                  Login
                </Link>
                <Link to="/register" className="text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
