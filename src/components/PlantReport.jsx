// import { useState, useContext, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const PlantReport = () => {
//   const { auth } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [plantZone, setPlantZone] = useState("");
//   const [plantNumber, setPlantNumber] = useState("");
//   const [formData, setFormData] = useState(null);
//   const [reportDate, setReportDate] = useState("");
//   const [records, setRecords] = useState([]);

//   const questions = [
//     { key: "water_scheduled", label: "1) Is water scheduled?" },
//     { key: "insects_present", label: "2) Are insects present?" },
//     { key: "fertilizers_applied", label: "3) Are fertilizers applied?" },
//     { key: "soil_level_maintained", label: "4) Is soil level maintained?" },
//     { key: "tree_burnt", label: "5) Is the tree burnt?" },
//     { key: "unwanted_grass", label: "6) Is there unwanted grass?" },
//     { key: "water_logging", label: "7) Is there water logging?" },
//     { key: "compound_maintained", label: "8) Is the compound maintained?" },
//   ];

//   // Redirect to login if the user is not authenticated
//   useEffect(() => {
//     if (!auth.token) {
//       navigate("/login");
//     }
//   }, [auth, navigate]);

//   const handleGetForm = async () => {
//     if (!plantZone || !plantNumber) {
//       toast.error("Please enter both Plant Zone and Plant Number!");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `plant-report/plants?zone=${plantZone}&number=${plantNumber}`,
//         {
//           headers: { Authorization: `Bearer ${auth.token}` },
//         }
//       );

//       setFormData(response.data);
//       toast.success("Form data fetched successfully!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Error fetching form data.");
//     }
//   };

//   // Fetch records for the specific plant based on the date
//   const handleGetRecords = async () => {
//     console.log(plantZone, plantNumber, reportDate);
//     if (!plantZone || !plantNumber || !reportDate) {
//       toast.error("Please enter all details, including the date!");
//       return;
//     }

//     try {
//       const formattedDate = new Date(reportDate).toISOString().split("T")[0];
//       const response = await axios.get(
//         `http://localhost:5000/plant-report/records?zone=${plantZone}&number=${plantNumber}&date=${formattedDate}`,
//         {
//           headers: { Authorization: `Bearer ${auth.token}` },
//         }
//       );
//       const data = response.data;

//       // setRecords(Array.isArray(data) ? data : []);
//       if (!Array.isArray(data)) {
//         setRecords([]); // Ensure records is reset if no array is returned.
//       } else {
//         setRecords(data);
//       }
//       toast.success("Records fetched successfully!");
//     } catch (err) {
//       // console.error(err);
//       // toast.error("Error fetching records.");
//       console.error("Error fetching records:", err.response?.data || err);
//       toast.error(err.response?.data?.message || "Error fetching records.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const reportData = {
//       plant_zone: plantZone,
//       plant_number: plantNumber,
//       // plant_id: formData.id,
//       ...questions.reduce((acc, q) => {
//         acc[q.key] = formData[q.key];
//         return acc;
//       }, {}),
//       comments: questions.reduce((acc, q) => {
//         acc[q.key] = formData[`${q.key}_comment`] || null;
//         return acc;
//       }, {}),
//     };

//     console.log(reportData);

//     try {
//       await axios.post("http://localhost:5000/plant-report", reportData, {
//         headers: { Authorization: `Bearer ${auth.token}` },
//       });
//       toast.success("Report submitted successfully!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Error submitting report.");
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
//         <label className="block">
//           वृक्ष विभाग:
//           <input
//             type="text"
//             placeholder="Plant Zone"
//             value={plantZone}
//             onChange={(e) => setPlantZone(e.target.value)}
//             className="border p-2 rounded w-full sm:w-auto"
//           />
//         </label>
//         <label className="block">
//           वृक्ष क्रमांक:
//           <input
//             type="text"
//             placeholder="Plant Number"
//             value={plantNumber}
//             onChange={(e) => setPlantNumber(e.target.value)}
//             className="border p-2 rounded w-full sm:w-auto"
//           />
//         </label>
//         <button
//           onClick={handleGetForm}
//           disabled={!plantZone || !plantNumber} // Disable button if fields are empty
//           className={`px-4 py-2 rounded-xl w-full sm:w-auto ${
//             plantZone && plantNumber
//               ? "bg-purple-500 text-white hover:bg-purple-600"
//               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//           }`}
//         >
//           Get Form
//         </button>
//       </div>
//       <label className="block mb-6">
//         Select Date:
//         <input
//           type="date"
//           value={reportDate}
//           onChange={(e) => setReportDate(e.target.value)}
//           className="border p-2 rounded w-full sm:w-auto"
//         />
//       </label>
//       <button
//         onClick={handleGetRecords}
//         disabled={!plantZone || !plantNumber} // Disable button if fields are empty
//         className={`px-4 py-2 rounded-xl w-full sm:w-auto mb-12 ${
//           plantZone && plantNumber
//             ? "bg-purple-500 text-white hover:bg-purple-600"
//             : "bg-gray-300 text-gray-500 cursor-not-allowed"
//         }`}
//       >
//         Get Records
//       </button>

//       {records.length > 0 && (
//         <div className="overflow-x-auto border rounded-lg p-4 mb-12">
//           <h3 className="text-xl font-bold mb-4">Plant Reports</h3>
//           <table className="table-auto w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-purple-400">
//                 <th className="p-2 border">Report Date</th>
//                 <th className="p-2 border">Report Time</th>
//                 <th className="p-2 border">Health Status</th>
//                 <th className="p-2 border">Reported By</th>
//                 <th className="p-2 border">Phone number</th>
//                 <th className="p-2 border">Water Scheduled</th>
//                 <th className="p-2 border">Insects Present</th>
//                 <th className="p-2 border">Fertilizers applied</th>
//                 <th className="p-2 border">Soil Level Maintained</th>
//                 <th className="p-2 border">Tree Burnt</th>
//                 <th className="p-2 border">Unwanted Grass</th>
//                 <th className="p-2 border">Water Logging</th>
//                 <th className="p-2 border">Compound Maintained</th>
//                 <th className="p-2 border">Comments</th>
//               </tr>
//             </thead>
//             <tbody>
//               {records.map((record, idx) => (
//                 <tr key={idx} className="hover:bg-purple-200 text-sm">
//                   <td className="p-2 border text-center">
//                     {new Date(record.report_date).toLocaleDateString("en-GB") ||
//                       "N/A"}
//                   </td>
//                   <td className="p-2 border text-center font-bold text-sm">
//                     {new Date(record.report_date).toLocaleTimeString() || "N/A"}
//                   </td>
//                   <td
//                     className={`p-2 border text-center font-bold bg-${
//                       record.health_status === "Good" ? "green-500" : "red-500"
//                     }`}
//                   >
//                     {record.health_status}
//                   </td>
//                   <td className="p-2 border text-center font-bold">
//                     {record.reported_by_full_name}
//                   </td>
//                   <td className="p-2 border text-center font-bold">
//                     {record.reported_by_phone}
//                   </td>
//                   <td className="p-2 border text-center">
//                     {record.water_scheduled ? "Yes" : "No"}
//                   </td>
//                   <td className="p-2 border text-center">
//                     {record.insects_present ? "Yes" : "No"}
//                   </td>
//                   <td className="p-2 border text-center">
//                     {record.fertilizers_applied ? "Yes" : "No"}
//                   </td>
//                   <td className="p-2 border text-center">
//                     {record.soil_level_maintained ? "Yes" : "No"}
//                   </td>
//                   <td className="p-2 border text-center">
//                     {record.tree_burnt ? "Yes" : "No"}
//                   </td>
//                   <td className="p-2 border text-center">
//                     {record.unwanted_grass ? "Yes" : "No"}
//                   </td>
//                   <td className="p-2 border text-center">
//                     {record.water_logging ? "Yes" : "No"}
//                   </td>
//                   <td className="p-2 border text-center">
//                     {record.compound_maintained ? "Yes" : "No"}
//                   </td>
//                   <td className="p-2 border text-center hover:bg-white">
//                     {record.comments
//                       ? Object.entries(record.comments)
//                           .filter(([key, value]) => value !== null) // Filter out null comments
//                           .map(([key, value]) => (
//                             <div
//                               key={key}
//                               className="mb-1 p-2 border hover:bg-purple-300 bg-purple-100 rounded-lg flex flex-col"
//                             >
//                               <strong className="items-start justify-start">
//                                 {key.replace(/_/g, " ")}:
//                               </strong>{" "}
//                               <span className="items-end justify-end">
//                                 {value}
//                               </span>
//                             </div>
//                           ))
//                       : "N/A"}
//                     {/* <td className="p-2 border">
//                     {record.comments ? JSON.stringify(record.comments) : "N/A"}
//                   </td> */}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {formData && (
//         <form
//           onSubmit={handleSubmit}
//           className="space-y-6 border p-4 rounded-xl shadow-lg bg-white"
//         >
//           <h3 className="text-xl font-bold mb-4">Plant Health Questions</h3>
//           {questions.map((q) => (
//             <div
//               key={q.key}
//               className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
//             >
//               <label className="font-medium flex-shrink-0 sm:w-1/3">
//                 {q.label}
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name={q.key}
//                     value="yes"
//                     onChange={() =>
//                       setFormData({
//                         ...formData,
//                         [q.key]: true,
//                       })
//                     }
//                     className="mr-2"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name={q.key}
//                     value="no"
//                     onChange={() =>
//                       setFormData({
//                         ...formData,
//                         [q.key]: false,
//                       })
//                     }
//                     className="mr-2"
//                   />
//                   No
//                 </label>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Comments"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     [`${q.key}_comment`]: e.target.value,
//                   })
//                 }
//                 className="border p-2 rounded w-full sm:flex-grow"
//               />
//             </div>
//           ))}
//           <button
//             type="submit"
//             className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 w-full sm:w-auto"
//           >
//             Submit
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default PlantReport;

import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlantReport = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // const [plantZone, setPlantZone] = useState("");
  // const [plantNumber, setPlantNumber] = useState("");
  const [plantZone, setPlantZone] = useState(searchParams.get("zone") || "");
  const [plantNumber, setPlantNumber] = useState(
    searchParams.get("plantNumber") || ""
  );
  const [formData, setFormData] = useState(null);
  const [reportDate, setReportDate] = useState("");
  const [records, setRecords] = useState([]);
  const [showRecords, setShowRecords] = useState(false);

  const questions = [
    { key: "water_scheduled", label: "1) नियमित पाणी देण्यात आले?" },
    { key: "insects_present", label: "2) कीड किंवा वाळवी लागली आहे का?" },
    { key: "fertilizers_applied", label: "3) खत दिले का ?" },
    {
      key: "soil_level_maintained",
      label: "4) झाडाखाली मातीची पातळी योग्य आहे का?",
    },
    { key: "tree_burnt", label: "5) झाड जळाले / करपले आहे का?" },
    { key: "unwanted_grass", label: "6) झाडाभोवती अनावश्यक गवत आहे का?" },
    {
      key: "water_logging",
      label: "7) पाण्याचा निचरा होण्यासाठी चर मारला आहे का ?",
    },
    { key: "compound_maintained", label: "8) झाडाभोवती आळी आहे का ?" },
    {
      key: "tree_inspection",
      label: "9) झाडाची बुंध्यापासून ते शेंड्यापर्यंत झाडाची पाहणी केली का ?",
    },
    {
      key: "water_in_compound",
      label: "10) झाडाच्या आळीत पाणी साठलेले आहे का ?",
    },
    {
      key: "tree_height",
      label: "11) झाडाची उंची वयाप्रमाणे योग्य आहे का?",
    },
    {
      key: "tree_dead",
      label: "12) झाड मेले आहे का ?",
    },
  ];
  // const questions = [
  //   { key: "water_scheduled", label: "1) Is water scheduled?" },
  //   { key: "insects_present", label: "2) Are insects present?" },
  //   { key: "fertilizers_applied", label: "3) Are fertilizers applied?" },
  //   { key: "soil_level_maintained", label: "4) Is soil level maintained?" },
  //   { key: "tree_burnt", label: "5) Is the tree burnt?" },
  //   { key: "unwanted_grass", label: "6) Is there unwanted grass?" },
  //   { key: "water_logging", label: "7) Is there water logging?" },
  //   { key: "compound_maintained", label: "8) Is the compound maintained?" },
  //   {
  //     key: "tree_inspection",
  //     label: "9) Is tree inspected from root to crown?",
  //   },
  // ];

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!auth.token) {
      navigate("/login");
    }
  }, [auth, navigate]);

  // Ensure Zonal Admin can only access their assigned zone
  useEffect(() => {
    if (auth.role === "zonal-admin" && plantZone && auth.zone !== plantZone) {
      toast.error("You are not authorized to access this zone!");
      setPlantZone("");
      setPlantNumber("");
      setFormData(null);
    }
  }, [auth, plantZone]);

  useEffect(() => {
    // Set the current date in "YYYY-MM-DD" format
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setReportDate(formattedDate);
  }, []);

  const handleGetForm = async () => {
    if (!plantZone || !plantNumber) {
      toast.error("Please enter both Plant Zone and Plant Number!");
      return;
    }
    // Restrict access for zonal-admin outside their zone
    if (auth.role === "zonal-admin" && auth.zone !== plantZone) {
      toast.error(
        "Unauthorized! You can only access forms for your assigned zone."
      );
      return;
    }

    try {
      const response = await axios.get(
        `plant-report/plants?zone=${plantZone}&number=${plantNumber}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      setFormData(response.data);
      toast.success("Form data fetched successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching form data.");
    }
  };

  // Fetch records for the specific plant based on the date
  const handleGetRecords = async () => {
    if (!plantZone || !plantNumber || !reportDate) {
      toast.error("Please enter all details, including the date!");
      return;
    }

    try {
      const formattedDate = new Date(reportDate).toISOString().split("T")[0];
      const response = await axios.get(
        `http://localhost:5000/plant-report/records?zone=${plantZone}&number=${plantNumber}&date=${formattedDate}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      const data = response.data;

      if (!Array.isArray(data)) {
        setRecords([]);
      } else {
        setRecords(data);
      }
      setShowRecords(true);
      toast.success("Records fetched successfully!");
    } catch (err) {
      console.error("Error fetching records:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Error fetching records.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (auth.role === "zonal-admin" && auth.zone !== plantZone) {
      toast.error(
        "Unauthorized! You can only submit reports for your assigned zone."
      );
      return;
    }

    const reportData = {
      plant_zone: plantZone,
      plant_number: plantNumber,
      ...questions.reduce((acc, q) => {
        acc[q.key] = formData[q.key];
        return acc;
      }, {}),
      comments: questions.reduce((acc, q) => {
        acc[q.key] = formData[`${q.key}_comment`] || null;
        return acc;
      }, {}),
    };

    try {
      await axios.post("http://localhost:5000/plant-report", reportData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      toast.success("Report submitted successfully!");
      // Reset form data after successful submission
      setFormData(null);
    } catch (err) {
      console.error(err);
      toast.error("Error submitting report.");
    }
  };

  const handleCancelForm = () => {
    setFormData(null);
  };

  const handleCloseRecords = () => {
    setShowRecords(false);
    setRecords([]);
  };

  const handleCommentChange = (e, id) => {
    const updatedRecords = records.map((record) =>
      record.id === id
        ? { ...record, super_admin_comment: e.target.value }
        : record
    );
    setRecords(updatedRecords);
  };

  const handleSaveComment = async (id) => {
    const record = records.find((record) => record.id === id);

    try {
      await axios.patch(
        `http://localhost:5000/plant-report/${id}/comment`,
        { comment: record.super_admin_comment },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      toast.success("Comment saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error saving comment.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <label className="block">
          वृक्ष विभाग:
          <input
            type="text"
            placeholder="Plant Zone"
            value={plantZone}
            onChange={(e) => setPlantZone(e.target.value)}
            disabled={auth.user.role === "zonal-admin"}
            className="border p-2 rounded w-full sm:w-auto"
          />
        </label>
        <label className="block">
          वृक्ष क्रमांक:
          <input
            type="text"
            placeholder="Plant Number"
            value={plantNumber}
            onChange={(e) => setPlantNumber(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
        </label>
        {auth.user.role === "zonal-admin" ? (
          <button
            onClick={handleGetForm}
            disabled={!plantZone || !plantNumber}
            className={`px-4 py-2 rounded-xl w-full sm:w-auto ${
              plantZone && plantNumber
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {/* Get Form */}
            तपशील प्राप्त करा
          </button>
        ) : (
          ""
        )}
      </div>
      <label className="block mb-6">
        {/* Select Date: */}
        दिनांक निवडा:
        <input
          type="date"
          value={reportDate}
          onChange={(e) => setReportDate(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
      </label>
      <button
        onClick={handleGetRecords}
        disabled={!plantZone || !plantNumber}
        className={`px-4 py-2 rounded-xl w-full sm:w-auto mb-12 ${
          plantZone && plantNumber
            ? "bg-purple-500 text-white hover:bg-purple-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {/* Get Records */}
        पूर्व तपशिलांची नोंद प्राप्त करा
      </button>

      {showRecords && records.length > 0 && (
        <div className="relative overflow-x-auto border rounded-lg p-4 mb-12">
          <button
            onClick={handleCloseRecords}
            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
          >
            Close
          </button>
          <h3 className="text-xl font-bold mb-4">पूर्व तपशिलांची नोंद</h3>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              {/* <tr className="bg-purple-400">
                <th className="p-2 border">Report Date</th>
                <th className="p-2 border">Report Time</th>
                <th className="p-2 border">Health Status</th>
                <th className="p-2 border">Reported By</th>
                <th className="p-2 border">Phone number</th>
                <th className="p-2 border">Water Scheduled</th>
                <th className="p-2 border">Insects Present</th>
                <th className="p-2 border">Fertilizers applied</th>
                <th className="p-2 border">Soil Level Maintained</th>
                <th className="p-2 border">Tree Burnt</th>
                <th className="p-2 border">Unwanted Grass</th>
                <th className="p-2 border">Water Logging</th>
                <th className="p-2 border">Compound Maintained</th>
                <th className="p-2 border">Tree Inspection</th>
                <th className="p-2 border">Comments</th>
              </tr> */}
              <tr className="bg-purple-400">
                <th className="p-2 border">दिनांक </th>
                <th className="p-2 border">वेळ </th>
                <th className="p-2 border">स्थिति </th>
                <th className="p-2 border">स्थापितकर्ता </th>
                <th className="p-2 border">संपर्क</th>
                <th className="p-2 border">पाणी दिले</th>
                <th className="p-2 border">कीड/ वाळवी आहे</th>
                <th className="p-2 border">खत दिले </th>
                <th className="p-2 border">योग्य जमिनीची पातळी</th>
                <th className="p-2 border">झाड जडालेले </th>
                <th className="p-2 border">अनावश्यक गवत</th>
                <th className="p-2 border">पाणी साठलेले</th>
                <th className="p-2 border">आळी आहे </th>
                <th className="p-2 border">वृक्ष निरीक्षण(बुंधा ते शेंडा)</th>
                <th className="p-2 border">आळीत पाणी आहे</th>
                <th className="p-2 border">योग्य उंची </th>
                <th className="p-2 border">झाड मेलेले आहे</th>
                <th className="p-2 border">टिप्पणी</th>
                {auth.user.role === "super-admin" ? (
                  <th className="border px-4 py-2">Super Admin Comment</th>
                ) : (
                  ""
                )}
                <th className="p-2 border">Super Admin टिप्पणी</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, idx) => (
                <tr key={idx} className="hover:bg-purple-200 text-sm">
                  <td className="p-2 border text-center">
                    {new Date(record.report_date).toLocaleDateString("en-GB") ||
                      "N/A"}
                  </td>
                  <td className="p-2 border text-center font-bold text-sm">
                    {new Date(record.report_date).toLocaleTimeString() || "N/A"}
                  </td>
                  <td
                    className={`p-2 border text-center font-bold bg-${
                      record.health_status === "Good" ? "green-500" : "red-500"
                    }`}
                  >
                    {record.health_status === "Good" ? "सुस्थितीत" : "बाधित"}
                  </td>
                  <td className="p-2 border text-center font-bold">
                    {record.reported_by_full_name}
                  </td>
                  <td className="p-2 border text-center font-bold">
                    {record.reported_by_phone}
                  </td>
                  {/* <td className="p-2 border text-center">
                    {record.water_scheduled ? "हो" : "नाही"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.insects_present ? "हो" : "नाही"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.fertilizers_applied ? "हो" : "नाही"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.soil_level_maintained ? "हो" : "नाही"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.tree_burnt ? "हो" : "नाही"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.unwanted_grass ? "हो" : "नाही"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.water_logging ? "हो" : "नाही"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.compound_maintained ? "हो" : "नाही"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.tree_inspection ? "हो" : "नाही"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.water_in_compound ? "हो" : "नाही"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.tree_height ? "हो" : "नाही"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.tree_dead ? "हो" : "नाही"}
                  </td> */}
                  <td
                    className={`p-2 border text-center ${
                      !record.water_scheduled ? "bg-red-500" : ""
                    }`}
                  >
                    {record.water_scheduled ? "हो" : "नाही"}
                  </td>
                  <td
                    className={`p-2 border text-center ${
                      record.insects_present ? "bg-red-500" : ""
                    }`}
                  >
                    {record.insects_present ? "हो" : "नाही"}
                  </td>
                  <td
                    className={`p-2 border text-center ${
                      !record.fertilizers_applied ? "bg-red-500" : ""
                    }`}
                  >
                    {record.fertilizers_applied ? "हो" : "नाही"}
                  </td>
                  <td
                    className={`p-2 border text-center ${
                      !record.soil_level_maintained ? "bg-red-500" : ""
                    }`}
                  >
                    {record.soil_level_maintained ? "हो" : "नाही"}
                  </td>
                  <td
                    className={`p-2 border text-center ${
                      record.tree_burnt ? "bg-red-500" : ""
                    }`}
                  >
                    {record.tree_burnt ? "हो" : "नाही"}
                  </td>
                  <td
                    className={`p-2 border text-center ${
                      record.unwanted_grass ? "bg-red-500" : ""
                    }`}
                  >
                    {record.unwanted_grass ? "हो" : "नाही"}
                  </td>
                  <td
                    className={`p-2 border text-center ${
                      !record.water_logging ? "bg-red-500" : ""
                    }`}
                  >
                    {record.water_logging ? "हो" : "नाही"}
                  </td>
                  <td
                    className={`p-2 border text-center ${
                      !record.compound_maintained ? "bg-red-500" : ""
                    }`}
                  >
                    {record.compound_maintained ? "हो" : "नाही"}
                  </td>
                  <td
                    className={`p-2 border text-center ${
                      !record.tree_inspection ? "bg-red-500" : ""
                    }`}
                  >
                    {record.tree_inspection ? "हो" : "नाही"}
                  </td>
                  <td
                    className={`p-2 border text-center ${
                      record.water_in_compound ? "bg-red-500" : ""
                    }`}
                  >
                    {record.water_in_compound ? "हो" : "नाही"}
                  </td>
                  <td
                    className={`p-2 border text-center ${
                      !record.tree_height ? "bg-red-500" : ""
                    }`}
                  >
                    {record.tree_height ? "हो" : "नाही"}
                  </td>
                  <td
                    className={`p-2 border text-center ${
                      record.tree_dead ? "bg-red-500" : ""
                    }`}
                  >
                    {record.tree_dead ? "हो" : "नाही"}
                  </td>
                  <td className="p-2 border text-center hover:bg-white">
                    {record.comments
                      ? Object.entries(record.comments)
                          .filter(([key, value]) => value !== null)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="mb-1 p-2 border hover:bg-purple-300 bg-purple-100 rounded-lg flex flex-col"
                            >
                              <strong className="items-start justify-start">
                                {key.replace(/_/g, " ")}:
                              </strong>{" "}
                              <span className="items-end justify-end">
                                {value}
                              </span>
                            </div>
                          ))
                      : "N/A"}
                  </td>
                  {auth.user.role === "super-admin" ? (
                    <td className="border px-4 py-2">
                      <div className="flex flex-col items-start">
                        <textarea
                          value={record.super_admin_comment || ""}
                          onChange={(e) => handleCommentChange(e, record.id)}
                          rows={2}
                          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          onClick={() => handleSaveComment(record.id)}
                          className="bg-green-500 text-white px-3 py-1 mt-2 rounded-md hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </td>
                  ) : (
                    ""
                  )}
                  <td className="mb-1 min-w-min p-2 border text-wrap hover:bg-green-300 rounded-lg">
                    {record.super_admin_comment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {auth.user.role === "zonal-admin"
        ? formData && (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 border p-4 rounded-xl shadow-lg bg-white"
            >
              <h3 className="text-xl font-bold mb-4">
                वृक्षाच्या स्थितीचा तपशील भरा{" "}
              </h3>
              {questions.map((q) => (
                <div
                  key={q.key}
                  className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
                >
                  <label className="font-medium flex-shrink-0 sm:w-1/3">
                    {q.label}
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={q.key}
                        value="yes"
                        onChange={() =>
                          setFormData({
                            ...formData,
                            [q.key]: true,
                          })
                        }
                        className="mr-2"
                      />
                      हो
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={q.key}
                        value="no"
                        onChange={() =>
                          setFormData({
                            ...formData,
                            [q.key]: false,
                          })
                        }
                        className="mr-2"
                      />
                      नाही
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="टिप्पणी येथे लिहा"
                    // placeholder="Comments"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [`${q.key}_comment`]: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full sm:flex-grow"
                  />
                </div>
              ))}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 w-full sm:w-auto"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          )
        : ""}
    </div>
  );
};

export default PlantReport;
