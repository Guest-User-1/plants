import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const QuestionsForm = () => {
  const { auth } = useContext(AuthContext);
  const [plantZone, setPlantZone] = useState("");
  const [plantNumber, setPlantNumber] = useState("");
  const [questions, setQuestions] = useState(null);
  const [form, setForm] = useState({
    water_scheduled: "",
    insects_present: "",
    fertilizers_applied: "",
    soil_level_maintained: "",
    tree_burnt: "",
    unwanted_grass: "",
    water_logging: "",
    compound_maintained: "",
    comments: "",
  });

  const handleGetForm = async () => {
    try {
      const response = await axios.get(
        `/plants/get-plant/${plantZone}/${plantNumber}`,
        // "http://localhost:5000/plants/get-plant",
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching plant data", error);
      alert("Unable to fetch plant data. Check the zone and number.");
    }
  };

  console.log(auth.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { full_name, phone_number } = auth.user;
      await axios.post(
        "http://localhost:5000/questions/submit",
        {
          ...form,
          plantZone,
          plantNumber,
          full_name: full_name,
          phone_number: phone_number,
        },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      alert("Form submitted successfully!");
      setQuestions(null);
      setForm({
        water_scheduled: "",
        insects_present: "",
        fertilizers_applied: "",
        soil_level_maintained: "",
        tree_burnt: "",
        unwanted_grass: "",
        water_logging: "",
        compound_maintained: "",
        comments: "",
      });
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Error submitting form.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Plant Maintenance Form</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={plantZone}
          onChange={(e) => setPlantZone(e.target.value)}
          placeholder="Plant Zone"
          className="border border-gray-300 p-2 rounded w-full"
        />
        <input
          type="text"
          value={plantNumber}
          onChange={(e) => setPlantNumber(e.target.value)}
          placeholder="Plant Number"
          className="border border-gray-300 p-2 rounded w-full"
        />
        <button
          onClick={handleGetForm}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Get Form
        </button>
      </div>

      {questions && (
        <form onSubmit={handleSubmit}>
          {Object.keys(form).map((key, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                {key.replace(/_/g, " ").toUpperCase()}
              </label>
              {key !== "comments" ? (
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name={key}
                      value="true"
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={key}
                      value="false"
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              ) : (
                <textarea
                  name={key}
                  value={form[key]}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                ></textarea>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default QuestionsForm;
