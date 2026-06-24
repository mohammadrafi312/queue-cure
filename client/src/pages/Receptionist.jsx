import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

function Receptionist() {
  const [patientName, setPatientName] = useState("");
  const [patients, setPatients] = useState([]);
  const [avgTime, setAvgTime] = useState(5);

  const fetchPatients = async () => {
    const res = await axios.get(
      "http://localhost:8000/api/patients"
    );

    setPatients(res.data);
  };

  useEffect(() => {
  fetchPatients();

  socket.on("queueUpdated", () => {
    fetchPatients();
  });

  return () => {
    socket.off("queueUpdated");
  };
}, []);

  const addPatient = async () => {
    if (!patientName.trim()) return;

    await axios.post(
      "http://localhost:8000/api/patients",
      {
        patientName,
      }
    );

    setPatientName("");
    fetchPatients();
  };

  const callNext = async () => {
    await axios.post(
      "http://localhost:8000/api/patients/call-next"
    );

    fetchPatients();
  };

  const startNewSession = async () => {
    const confirmReset = window.confirm(
      "Start a new clinic session? This will clear all patients."
    );

    if (!confirmReset) return;

    await axios.delete(
      "http://localhost:8000/api/patients/reset"
    );

    fetchPatients();
  };

  const editPatient = async (id, currentName) => {
    const newName = prompt(
      "Enter new patient name:",
      currentName
    );

    if (!newName) return;

    await axios.put(
      `http://localhost:8000/api/patients/${id}`,
      {
        patientName: newName,
      }
    );

    fetchPatients();
  };

  const removePatient = async (id) => {
    const confirmDelete = window.confirm(
      "Remove this patient?"
    );

    if (!confirmDelete) return;

    await axios.delete(
      `http://localhost:8000/api/patients/${id}`
    );

    fetchPatients();
  };

  const getEstimatedWait = (patient) => {
    if (patient.status === "active") {
      return "Now";
    }

    if (patient.status === "completed") {
      return "-";
    }

    const activePatient = patients.find(
      (p) => p.status === "active"
    );

    if (!activePatient) {
      return `${patient.tokenNumber * avgTime} mins`;
    }

    const patientsAhead =
      patient.tokenNumber -
      activePatient.tokenNumber;

    return `${patientsAhead * avgTime} mins`;
  };

  return (
   <div className="min-h-screen bg-slate-100 p-8">
  <div className="max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold text-slate-800 mb-2">
  🏥 Queue Cure
</h1>

<p className="text-slate-500 mb-6">
  Smart Hospital Queue Management Dashboard
</p>

<div className="flex gap-4 mb-8">
  <a
    href="/"
    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
  >
    Receptionist
  </a>

  <a
    href="/waiting-room"
    className="bg-slate-700 text-white px-4 py-2 rounded-lg shadow hover:bg-slate-800"
  >
    Waiting Room
  </a>
</div>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
          alignItems: "end",
        }}
      >
        <div>
          <label>Patient Name</label>
          <br />
          <input
  value={patientName}
  onChange={(e) =>
    setPatientName(e.target.value)
  }
  placeholder="Enter patient name"
  className="border border-slate-300 rounded-xl px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
        </div>

        <div>
          <label>
            Avg Consultation Time (mins)
          </label>
          <br />
         <input
  type="number"
  min="1"
  value={avgTime}
  onChange={(e) =>
    setAvgTime(Number(e.target.value))
  }
  className="border border-slate-300 rounded-xl px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
        </div>

        <button
  onClick={addPatient}
  className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition shadow-md"
>
  ➕ Add Patient
</button>

        <button
  onClick={callNext}
  className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition shadow-md"
>
  📢 Call Next
</button>
<button
  onClick={startNewSession}
  className="bg-red-600 text-white px-5 py-3 rounded-xl hover:bg-red-700"
>
  🔄 Start New Clinic Session
</button>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
    <h3 className="text-white/80 text-sm">
      Total Patients
    </h3>

    <p className="text-5xl font-bold">
      {patients.length}
    </p>
  </div>

  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
  <h3 className="text-white/80 text-sm">
    Active Token
  </h3>

  <p className="text-5xl font-bold">
    {patients.find((p) => p.status === "active")?.tokenNumber || "-"}
  </p>
</div>

  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
  <h3 className="text-white/80 text-sm">
    Waiting Patients
  </h3>

  <p className="text-5xl font-bold">
    {patients.filter((p) => p.status === "waiting").length}
  </p>
</div>

</div>

<div className="bg-white rounded-2xl shadow-md overflow-hidden">
<table className="w-full">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="p-4 text-left">Token</th>
<th className="p-4 text-left">Name</th>
<th className="p-4 text-left">Status</th>
<th className="p-4 text-left">Estimated Wait</th>
<th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr
  key={patient._id}
  className="border-b hover:bg-slate-50"
>
              <td className="p-4">{patient.tokenNumber}</td>
              <td className="p-4">{patient.patientName}</td>
              <td className="p-4">
  {patient.status === "waiting" && (
    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
      Waiting
    </span>
  )}

  {patient.status === "active" && (
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
      Active
    </span>
  )}

  {patient.status === "completed" && (
    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
      Completed
    </span>
  )}
</td>
              <td className="p-4">{getEstimatedWait(patient)}</td>

              <td className="p-4">
  {patient.status === "waiting" && (
    <>
      <button
        onClick={() =>
          editPatient(
            patient._id,
            patient.patientName
          )
        }
        className="bg-blue-500 text-white px-3 py-2 rounded-lg mr-2 hover:bg-blue-600"
      >
        ✏️ Edit
      </button>

      <button
        onClick={() =>
          removePatient(patient._id)
        }
        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
      >
        🗑️ Remove
      </button>
    </>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
        </div>

  );
}

export default Receptionist;