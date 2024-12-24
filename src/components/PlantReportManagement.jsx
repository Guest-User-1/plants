import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const PlantReportManagement = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [selectedZones, setSelectedZones] = useState([]);
  const [healthStatus, setHealthStatus] = useState("");
  const [plantReports, setPlantReports] = useState([]);
  const [selectAllZones, setSelectAllZones] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // For dropdown visibility
  const [selectedPlant, setSelectedPlant] = useState(null); // To store the selected plant's data
  const [modalOpen, setModalOpen] = useState(false); // To control the modal visibility

  const fetchPlantReports = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token provided");
      }
      const response = await axios.get(`${apiUrl}/plant-report/plant-reports`, {
        params: {
          zones: selectedZones.join(","),
          healthStatus,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlantReports(response.data);
    } catch (error) {
      console.error("Error fetching plant reports:", error);
    }
  };

  useEffect(() => {
    fetchPlantReports();
  }, [selectedZones, healthStatus]);

  const handleZoneSelection = (zone) => {
    setSelectedZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  const toggleSelectAllZones = () => {
    setSelectAllZones(!selectAllZones);
    setSelectedZones(selectAllZones ? [] : [...Array(50)].map((_, i) => i + 1));
  };

  const handlePlantClick = (plant) => {
    setSelectedPlant(plant); // Set the selected plant data
    setModalOpen(true); // Open the modal
  };

  const exportToExcel = () => {
    // Map object keys to Marathi headers
    const headerMapping = {
      plant_number: "वृक्ष क्र",
      plant_name: "वृक्षाचे नाव",
      plant_zone: "विभाग",
      health_status: "स्थिति",
      report_date: "दिनांक",
      report_time: "वेळ",
      reported_by_full_name: "स्थापितकर्ता",
      reported_by_phone: "संपर्क",
    };

    // Transform plantReports to match the headers
    const transformedData = plantReports.map((report) => ({
      [headerMapping.plant_number]: report.plant_number,
      [headerMapping.plant_name]: report.plant_name,
      [headerMapping.plant_zone]: report.plant_zone,
      [headerMapping.health_status]:
        report.health_status === "Infected" ? "बाधित" : "सुस्थितीत",
      [headerMapping.report_date]: report.report_date
        ? new Date(report.report_date).toLocaleDateString("en-GB")
        : "Not Reported",
      [headerMapping.report_time]: report.report_date
        ? new Date(report.report_date).toLocaleTimeString()
        : "Not Reported",
      [headerMapping.reported_by_full_name]: report.reported_by_full_name,
      [headerMapping.reported_by_phone]: report.reported_by_phone,
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plant Reports");

    // Export to Excel
    XLSX.writeFile(workbook, "PlantReports.xlsx");
  };

  // const exportToExcel = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(plantReports);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Plant Reports");
  //   XLSX.writeFile(workbook, "PlantReports.xlsx");
  // };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Plant Report Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-medium mb-2">विभाग निवडा:</label>
          <div className="relative">
            <button
              className="w-full border border-gray-300 bg-white rounded-md shadow-sm p-2 flex justify-between items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>
                {selectAllZones
                  ? "सर्व विभाग"
                  : selectedZones.length > 0
                  ? `विभाग: ${selectedZones.join(", ")}`
                  : "येथे विभाग निवडा"}
              </span>
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute w-full border border-gray-300 bg-white rounded-md shadow-sm mt-2 max-h-64 overflow-y-auto z-10">
                <label className="flex items-center space-x-2 p-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectAllZones}
                    onChange={toggleSelectAllZones}
                  />
                  <span>सर्व विभाग</span>
                </label>
                {[...Array(50)].map((_, i) => (
                  <label
                    key={i + 1}
                    className="flex items-center space-x-2 p-2"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      value={i + 1}
                      checked={selectedZones.includes(i + 1)}
                      onChange={() => handleZoneSelection(i + 1)}
                    />
                    <span>विभाग {i + 1}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Health Status */}
        <div>
          <label className="block font-medium mb-2">
            स्वास्थ्याची सद्यस्थिति:
          </label>
          <select
            className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={healthStatus}
            onChange={(e) => setHealthStatus(e.target.value)}
          >
            <option value="">सर्व स्थितीतील</option>
            <option value="Good">सुस्थितीत</option>
            <option value="Infected">बाधित</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={exportToExcel}
          className="bg-cyan-600 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-cyan-700"
        >
          {/* Export to Excel */}
          डाउनलोड करा
        </button>
      </div>

      {/* Plant Reports Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm bg-white border border-gray-300 rounded-md shadow-sm">
          <thead className="bg-cyan-500">
            <tr>
              <th className="p-4 text-center">वृक्ष क्र</th>
              <th className="p-4 text-center">वृक्षाचे नाव</th>
              <th className="p-4 text-center">विभाग</th>
              <th className="p-4 text-center">स्थिति</th>
              <th className="p-4 text-center">दिनांक</th>
              <th className="p-4 text-center">वेळ</th>
              <th className="p-4 text-center">स्थापितकर्ता</th>
              <th className="p-4 text-center">संपर्क</th>
            </tr>
          </thead>
          <tbody>
            {plantReports.map((report, index) => (
              <tr
                key={index}
                className="border-t hover:bg-cyan-100 cursor-pointer"
              >
                <td
                  className="p-4 text-center font-semibold underline underline-offset-2 underline-green-500"
                  onClick={() => handlePlantClick(report)}
                >
                  {report.plant_number}
                </td>
                <td className="p-4 text-center font-semibold">
                  {report.plant_name}
                </td>
                <td className="p-4 text-center font-semibold">
                  {report.plant_zone}
                </td>
                <td
                  className={`p-4 text-center font-bold bg-${
                    report.health_status === "Good" ? "green-500" : "red-500"
                  }`}
                >
                  {report.health_status === "Infected" ? "बाधित" : "सुस्थितीत"}
                </td>
                <td className="p-4 text-center font-semibold">
                  {report.report_date
                    ? new Date(report.report_date).toLocaleDateString("en-GB")
                    : "Not Reported"}
                </td>
                <td className="p-4 text-center font-semibold">
                  {report.report_date
                    ? new Date(report.report_date).toLocaleTimeString()
                    : "Not Reported"}
                </td>
                <td className="p-4 text-center font-semibold">
                  {report.reported_by_full_name}
                </td>
                <td className="p-4 text-center font-semibold">
                  {report.reported_by_phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modalOpen && selectedPlant && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Plant Report Details</h2>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="p-2 border text-center">
                      <strong>नियमित पाणी देण्यात आले?</strong>
                    </td>
                    <td
                      className={`p-2 border text-center ${
                        !selectedPlant.water_scheduled ? "bg-red-500" : ""
                      }`}
                    >
                      {selectedPlant.water_scheduled ? "हो" : "नाही"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border text-center">
                      <strong>कीड किंवा वाळवी लागली आहे का?</strong>
                    </td>
                    <td
                      className={`p-2 border text-center ${
                        selectedPlant.insects_present ? "bg-red-500" : ""
                      }`}
                    >
                      {selectedPlant.insects_present ? "हो" : "नाही"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border text-center">
                      <strong>खत दिले का?</strong>
                    </td>
                    <td
                      className={`p-2 border text-center ${
                        !selectedPlant.fertilizers_applied ? "bg-red-500" : ""
                      }`}
                    >
                      {selectedPlant.fertilizers_applied ? "हो" : "नाही"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border text-center">
                      <strong>झाडाखाली मातीची पातळी योग्य आहे का?</strong>
                    </td>
                    <td className="p-2 border text-center">
                      {selectedPlant.soil_level_maintained ? "हो" : "नाही"}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className={`p-2 border text-center ${
                        !selectedPlant.soil_level_maintained ? "bg-red-500" : ""
                      }`}
                    >
                      <strong>झाड जळाले / करपले आहे का?</strong>
                    </td>
                    <td
                      className={`p-2 border text-center ${
                        selectedPlant.tree_burnt ? "bg-red-500" : ""
                      }`}
                    >
                      {selectedPlant.tree_burnt ? "हो" : "नाही"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border text-center">
                      <strong>झाडाभोवती अनावश्यक गवत आहे का?</strong>
                    </td>
                    <td
                      className={`p-2 border text-center ${
                        selectedPlant.unwanted_grass ? "bg-red-500" : ""
                      }`}
                    >
                      {selectedPlant.unwanted_grass ? "हो" : "नाही"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border text-center">
                      <strong>
                        पाण्याचा निचरा होण्यासाठी चर मारला आहे का?
                      </strong>
                    </td>
                    <td
                      className={`p-2 border text-center ${
                        !selectedPlant.water_logging ? "bg-red-500" : ""
                      }`}
                    >
                      {selectedPlant.water_logging ? "हो" : "नाही"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border text-center">
                      <strong>झाडाभोवती आळी आहे का?</strong>
                    </td>
                    <td
                      className={`p-2 border text-center ${
                        !selectedPlant.compound_maintained ? "bg-red-500" : ""
                      }`}
                    >
                      {selectedPlant.compound_maintained ? "हो" : "नाही"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border text-center">
                      <strong>
                        झाडाची बुंध्यापासून ते शेंड्यापर्यंत झाडाची पाहणी केली
                        का?
                      </strong>
                    </td>
                    <td
                      className={`p-2 border text-center ${
                        !selectedPlant.tree_inspection ? "bg-red-500" : ""
                      }`}
                    >
                      {selectedPlant.tree_inspection ? "हो" : "नाही"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border text-center">
                      <strong>झाडाच्या आळीत पाणी साठलेले आहे का?</strong>
                    </td>
                    <td
                      className={`p-2 border text-center ${
                        selectedPlant.water_in_compound ? "bg-red-500" : ""
                      }`}
                    >
                      {selectedPlant.water_in_compound ? "हो" : "नाही"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border text-center">
                      <strong>झाडाची उंची वयाप्रमाणे योग्य आहे का?</strong>
                    </td>
                    <td
                      className={`p-2 border text-center ${
                        !selectedPlant.tree_height ? "bg-red-500" : ""
                      }`}
                    >
                      {selectedPlant.tree_height ? "हो" : "नाही"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border text-center">
                      <strong>झाड मेले आहे का?</strong>
                    </td>
                    <td
                      className={`p-2 border text-center ${
                        selectedPlant.tree_dead ? "bg-red-500" : ""
                      }`}
                    >
                      {selectedPlant.tree_dead ? "हो" : "नाही"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border text-center">
                      <strong>टिप्पणी</strong>
                    </td>
                    <td className="p-2 border text-center">
                      {selectedPlant.comments
                        ? Object.entries(selectedPlant.comments)
                            .filter(([key, value]) => value !== null)
                            .map(([key, value]) => (
                              <div
                                key={key}
                                className="mb-1 p-2 border hover:bg-purple-300 bg-purple-100 rounded-lg flex flex-col"
                              >
                                <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                                <span>{value}</span>
                              </div>
                            ))
                        : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantReportManagement;
