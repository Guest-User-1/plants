// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Dashboard = () => {
//   const [userData, setUserData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [editUser, setEditUser] = useState(null);
//   const [filteredData, setFilteredData] = useState({});

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No token provided");
//       }

//       const response = await axios.get(
//         "http://localhost:5000/dashboard/users",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const groupedByRole = response.data.reduce((acc, user) => {
//         if (!acc[user.role]) acc[user.role] = [];
//         acc[user.role].push(user);
//         return acc;
//       }, {});

//       setUserData(groupedByRole);
//       setFilteredData(groupedByRole);
//       setLoading(false);
//     } catch (error) {
//       toast.error("Failed to fetch users");
//       setLoading(false);
//       console.error("Error fetching users:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Handle search dynamically
//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearch(query);

//     const filtered = Object.entries(userData).reduce((acc, [role, users]) => {
//       const filteredUsers = users.filter(
//         (user) =>
//           user.full_name.toLowerCase().includes(query) ||
//           user.phone_number.includes(query)
//       );
//       if (filteredUsers.length) acc[role] = filteredUsers;
//       return acc;
//     }, {});

//     setFilteredData(filtered);
//   };

//   // Handle update
//   const handleUpdate = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("No token provided");

//       await axios.put(
//         `http://localhost:5000/dashboard/users/${editUser.id}`,
//         editUser,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success("User updated successfully");
//       setEditUser(null);
//       fetchUsers();
//     } catch (error) {
//       toast.error("Failed to update user");
//       console.error("Error updating user:", error);
//     }
//   };

//   // Handle delete
//   const handleDelete = async (id) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("No token provided");

//       await axios.delete(`http://localhost:5000/dashboard/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("User deleted successfully");
//       fetchUsers();
//     } catch (error) {
//       toast.error("Failed to delete user");
//       console.error("Error deleting user:", error);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="p-4">
//       <ToastContainer />
//       <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

//       {/* Search */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search by name or phone"
//           value={search}
//           onChange={handleSearch}
//           className="p-2 border rounded"
//         />
//       </div>

//       {/* Role-Based Categorization */}
//       {Object.entries(filteredData).map(([role, users]) => (
//         <div key={role} className="mb-6">
//           <h2 className="text-xl font-bold mb-2">Role: {role}</h2>
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr>
//                 <th className="border border-gray-300 p-2">Sr. No.</th>
//                 <th className="border border-gray-300 p-2">Name</th>
//                 <th className="border border-gray-300 p-2">Phone</th>
//                 <th className="border border-gray-300 p-2">Email</th>
//                 <th className="border border-gray-300 p-2">Zone</th>
//                 <th className="border border-gray-300 p-2">Vibhaag</th>
//                 <th className="border border-gray-300 p-2">Role</th>
//                 <th className="border border-gray-300 p-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user.id}>
//                   {Object.keys(user).map((field) => (
//                     <td className="border border-gray-300 p-2" key={field}>
//                       {editUser?.id === user.id && field !== "id" ? (
//                         <input
//                           type="text"
//                           value={editUser[field]}
//                           onChange={(e) =>
//                             setEditUser({
//                               ...editUser,
//                               [field]: e.target.value,
//                             })
//                           }
//                           className="p-2 border rounded"
//                         />
//                       ) : (
//                         user[field]
//                       )}
//                     </td>
//                   ))}
//                   <td className="border border-gray-300 p-2">
//                     {editUser?.id === user.id ? (
//                       <>
//                         <button
//                           onClick={handleUpdate}
//                           className="bg-green-500 text-white p-2 rounded mr-2"
//                         >
//                           Save
//                         </button>
//                         <button
//                           onClick={() => setEditUser(null)}
//                           className="bg-gray-500 text-white p-2 rounded"
//                         >
//                           Cancel
//                         </button>
//                       </>
//                     ) : (
//                       <button
//                         onClick={() => setEditUser(user)}
//                         className="bg-yellow-500 text-white p-2 rounded"
//                       >
//                         Edit
//                       </button>
//                     )}
//                     <button
//                       onClick={() => handleDelete(user.id)}
//                       className="ml-2 bg-red-500 text-white p-2 rounded"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaEdit, FaTrashAlt, FaSave, FaTimes } from "react-icons/fa"; // Import icons from react-icons

// const Dashboard = () => {
//   const [userData, setUserData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [editUser, setEditUser] = useState(null);
//   const [filteredData, setFilteredData] = useState({});

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No token provided");
//       }

//       const response = await axios.get(
//         "http://localhost:5000/dashboard/users",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const groupedByRole = response.data.reduce((acc, user) => {
//         if (!acc[user.role]) acc[user.role] = [];
//         acc[user.role].push(user);
//         return acc;
//       }, {});

//       setUserData(groupedByRole);
//       setFilteredData(groupedByRole);
//       setLoading(false);
//     } catch (error) {
//       toast.error("Failed to fetch users");
//       setLoading(false);
//       console.error("Error fetching users:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Handle search dynamically
//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearch(query);

//     const filtered = Object.entries(userData).reduce((acc, [role, users]) => {
//       const filteredUsers = users.filter(
//         (user) =>
//           user.full_name.toLowerCase().includes(query) ||
//           user.phone_number.includes(query)
//       );
//       if (filteredUsers.length) acc[role] = filteredUsers;
//       return acc;
//     }, {});

//     setFilteredData(filtered);
//   };

//   // Handle update
//   const handleUpdate = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("No token provided");

//       await axios.put(
//         `http://localhost:5000/dashboard/users/${editUser.id}`,
//         editUser,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success("User updated successfully");
//       setEditUser(null);
//       fetchUsers();
//     } catch (error) {
//       toast.error("Failed to update user");
//       console.error("Error updating user:", error);
//     }
//   };

//   // Handle delete
//   const handleDelete = async (id) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) throw new Error("No token provided");

//       await axios.delete(`http://localhost:5000/dashboard/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("User deleted successfully");
//       fetchUsers();
//     } catch (error) {
//       toast.error("Failed to delete user");
//       console.error("Error deleting user:", error);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="p-4">
//       <ToastContainer />
//       <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

//       {/* Search */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search by name or phone"
//           value={search}
//           onChange={handleSearch}
//           className="p-2 border rounded w-full"
//         />
//       </div>

//       {/* Role-Based Categorization */}
//       {Object.entries(filteredData).map(([role, users]) => (
//         <div key={role} className="mb-6">
//           <h2 className="text-xl font-bold mb-2">Role: {role}</h2>
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr>
//                 <th className="border border-gray-300 p-2">Sr. No.</th>
//                 <th className="border border-gray-300 p-2">Name</th>
//                 <th className="border border-gray-300 p-2">Phone</th>
//                 <th className="border border-gray-300 p-2">Email</th>
//                 <th className="border border-gray-300 p-2">Zone</th>
//                 <th className="border border-gray-300 p-2">Vibhaag</th>
//                 <th className="border border-gray-300 p-2">Role</th>
//                 <th className="border border-gray-300 p-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user, index) => (
//                 <tr key={user.id}>
//                   {Object.keys(user).map((field) => (
//                     <td className="border border-gray-300 p-2" key={field}>
//                       {editUser?.id === user.id && field !== "id" ? (
//                         <input
//                           type="text"
//                           value={editUser[field]}
//                           onChange={(e) =>
//                             setEditUser({
//                               ...editUser,
//                               [field]: e.target.value,
//                             })
//                           }
//                           className="p-2 border rounded w-full"
//                         />
//                       ) : (
//                         user[field]
//                       )}
//                     </td>
//                   ))}
//                   <td className="border border-gray-300 p-2 flex justify-center items-center">
//                     {editUser?.id === user.id ? (
//                       <>
//                         <button
//                           onClick={handleUpdate}
//                           className="bg-green-500 text-white p-2 rounded mx-1"
//                         >
//                           <FaSave />
//                         </button>
//                         <button
//                           onClick={() => setEditUser(null)}
//                           className="bg-gray-500 text-white p-2 rounded mx-1"
//                         >
//                           <FaTimes />
//                         </button>
//                       </>
//                     ) : (
//                       <button
//                         onClick={() => setEditUser(user)}
//                         className="bg-yellow-500 text-white p-2 rounded mx-1"
//                       >
//                         <FaEdit />
//                       </button>
//                     )}
//                     <button
//                       onClick={() => handleDelete(user.id)}
//                       className="bg-red-500 text-white p-2 rounded mx-1"
//                     >
//                       <FaTrashAlt />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrashAlt, FaSave, FaTimes } from "react-icons/fa"; // Import icons from react-icons

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState(""); // Zone filter state
  const [editUser, setEditUser] = useState(null);
  const [filteredData, setFilteredData] = useState({});

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token provided");
      }

      const response = await axios.get(
        "http://localhost:5000/dashboard/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const groupedByRole = response.data.reduce((acc, user) => {
        if (!acc[user.role]) acc[user.role] = [];
        acc[user.role].push(user);
        return acc;
      }, {});

      setUserData(groupedByRole);
      setFilteredData(groupedByRole);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch users");
      setLoading(false);
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search dynamically
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    applyFilters(query, zoneFilter);
  };

  // Apply both search and zone filter
  const applyFilters = (query, zone) => {
    const zoneInt = zone ? parseInt(zone, 10) : null; // Convert zoneFilter to an integer
    const filtered = Object.entries(userData).reduce((acc, [role, users]) => {
      const filteredUsers = users.filter(
        (user) =>
          (!query ||
            user.full_name.toLowerCase().includes(query) ||
            user.phone_number.includes(query)) &&
          (zoneInt === null || user.zone === zoneInt) // Compare zone as an integer
      );
      if (filteredUsers.length) acc[role] = filteredUsers;
      return acc;
    }, {});
    setFilteredData(filtered);
  };

  // Handle zone filter
  const handleZoneFilter = (e) => {
    const zone = e.target.value;
    setZoneFilter(zone);

    applyFilters(search, zone);
  };

  // Handle update
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token provided");

      await axios.put(
        `http://localhost:5000/dashboard/users/${editUser.id}`,
        editUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("User updated successfully");
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Error updating user:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token provided");

      await axios.delete(`http://localhost:5000/dashboard/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-center">User Management</h1>

      {/* Search and Zone Filter */}
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={handleSearch}
          className="p-2 border rounded w-full md:w-1/2"
        />
        <select
          value={zoneFilter}
          onChange={handleZoneFilter}
          className="p-2 border rounded w-full md:w-1/2"
        >
          <option value="">All Zones</option>
          {/* Populate unique zones dynamically */}
          {Array.from(
            new Set(
              Object.values(userData).flatMap((users) =>
                users.map((user) => user.zone)
              )
            )
          ).map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </div>

      {/* Role-Based Categorization */}
      {Object.entries(filteredData).map(([role, users]) => (
        <div key={role} className="mb-6">
          <h2 className="text-xl font-bold mb-2">Role: {role}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-800 bg-emerald-400 p-2">
                    Sr. No.
                  </th>
                  <th className="border border-gray-800 bg-emerald-400 p-2">
                    Name
                  </th>
                  <th className="border border-gray-800 bg-emerald-400 p-2">
                    Phone
                  </th>
                  <th className="border border-gray-800 bg-emerald-400 p-2">
                    Email
                  </th>
                  <th className="border border-gray-800 bg-emerald-400 p-2">
                    Zone
                  </th>
                  <th className="border border-gray-800 bg-emerald-400 p-2">
                    Vibhaag
                  </th>
                  <th className="border border-gray-800 bg-emerald-400 p-2">
                    Role
                  </th>
                  <th className="border border-gray-800 bg-emerald-400 p-2">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-100 transition-all"
                  >
                    <td className="border border-gray-800 bg-slate-50 p-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-800 bg-slate-50 p-2">
                      {editUser?.id === user.id ? (
                        <input
                          type="text"
                          value={editUser.full_name}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              full_name: e.target.value,
                            })
                          }
                          className="p-2 border rounded w-full"
                        />
                      ) : (
                        user.full_name
                      )}
                    </td>
                    <td className="border border-gray-800 bg-slate-50 p-2">
                      {editUser?.id === user.id ? (
                        <input
                          type="text"
                          value={editUser.phone_number}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              phone_number: e.target.value,
                            })
                          }
                          className="p-2 border rounded w-full"
                        />
                      ) : (
                        user.phone_number
                      )}
                    </td>
                    <td className="border border-gray-800 bg-slate-50 p-2">
                      {editUser?.id === user.id ? (
                        <input
                          type="email"
                          value={editUser.email}
                          onChange={(e) =>
                            setEditUser({ ...editUser, email: e.target.value })
                          }
                          className="p-2 border rounded w-full"
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td className="border border-gray-800 bg-slate-50 p-2">
                      {editUser?.id === user.id ? (
                        <input
                          type="number"
                          value={editUser.zone}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              zone: parseInt(e.target.value, 10),
                            })
                          }
                          className="p-2 border rounded w-full"
                        />
                      ) : (
                        user.zone
                      )}
                    </td>
                    <td className="border border-gray-800 bg-slate-50 p-2">
                      {editUser?.id === user.id ? (
                        <input
                          type="text"
                          value={editUser.vibhaag}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              vibhaag: e.target.value,
                            })
                          }
                          className="p-2 border rounded w-full"
                        />
                      ) : (
                        user.vibhaag
                      )}
                    </td>
                    <td className="border border-gray-800 bg-slate-50 p-2">
                      {editUser?.id === user.id ? (
                        <select
                          value={editUser.role}
                          onChange={(e) =>
                            setEditUser({ ...editUser, role: e.target.value })
                          }
                          className="p-2 border rounded w-full"
                        >
                          <option value="normal-user">Normal User</option>
                          <option value="zonal-admin">Zonal Admin</option>
                          <option value="super-admin">Super Admin</option>
                        </select>
                      ) : (
                        user.role
                      )}
                    </td>

                    <td className="border border-gray-800 bg-slate-50 p-2 flex justify-center items-center gap-2">
                      {editUser?.id === user.id ? (
                        <>
                          <button
                            onClick={handleUpdate}
                            className="bg-green-500 text-white p-2 rounded"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={() => setEditUser(null)}
                            className="bg-gray-500 text-white p-2 rounded"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setEditUser(user)}
                          className="bg-yellow-500 text-white p-2 rounded"
                        >
                          <FaEdit />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 text-white p-2 rounded"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
