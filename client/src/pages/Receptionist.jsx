import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

function Receptionist() {
  const [patientName, setPatientName] = useState("");
  const [patients, setPatients] = useState([]);
 

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
const completedPatients = patients.filter(
  (p) =>
    p.status === "completed" &&
    p.actualDuration > 0
);

const realAverageTime =
  completedPatients.length > 0
    ? Math.round(
        completedPatients.reduce(
          (sum, p) => sum + p.actualDuration,
          0
        ) / completedPatients.length
      )
    : 5;
  const addPatient = async () => {
  if (!patientName.trim()) return;

  const alreadyExists = patients.some(
    (p) =>
      p.patientName.toLowerCase() ===
      patientName.trim().toLowerCase()
  );

  if (alreadyExists) {
    alert("Patient already exists in queue");
    return;
  }

  await axios.post(
    "http://localhost:8000/api/patients",
    {
      patientName: patientName.trim(),
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
    return `${patient.tokenNumber * realAverageTime} mins`;
  }

  const patientsAhead =
    patient.tokenNumber -
    activePatient.tokenNumber;

  return `${
    patientsAhead * realAverageTime
  } mins`;
};

  return (
   <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dbeafe,_#f8fafc,_#e0f2fe)]">
  <div>

<main className="max-w-7xl mx-auto p-8">
  
<div className="bg-white rounded-3xl shadow-lg p-5 mb-8 flex justify-between items-center">

  <div>
    <h1 className="text-4xl font-bold text-blue-900">
      🏥 Queue Cure
    </h1>

    <p className="text-slate-500">
      Smart Hospital Queue Management System
    </p>
  </div>

  <div className="flex gap-3">
    <a
      href="/"
      className="bg-blue-600 text-white px-5 py-3 rounded-xl shadow hover:bg-blue-700"
    >
      Receptionist
    </a>

    <a
      href="/waiting-room"
      className="bg-slate-700 text-white px-5 py-3 rounded-xl shadow hover:bg-slate-800"
    >
      Waiting Room
    </a>
  </div>

</div>





      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
  <h2 className="text-2xl font-bold text-slate-800 mb-2">
  Patient Registration & Queue Control
</h2>
<div className="flex flex-wrap items-end gap-6">
       <div className="w-72">
  <label className="block text-sm font-medium text-slate-600 mb-2">
    Patient Name
  </label>

  <input
    value={patientName}
    onChange={(e) => setPatientName(e.target.value)}
    placeholder="Enter patient name"
    className="w-full h-14 border border-slate-300 rounded-xl px-4 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
  />
</div>

      

       <button
  onClick={addPatient}
  className="h-14 px-8 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-md whitespace-nowrap"
>
  ➕ Add Patient
</button>

        <button
  onClick={callNext}
  disabled={
    patients.filter(
      (p) => p.status === "waiting"
    ).length === 0
  }
  className="h-14 px-8 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium shadow-md whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
>
  📢 Call Next
</button>
<button
  onClick={startNewSession}
  className="h-14 px-8 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium shadow-md whitespace-nowrap"
>
  🔄 Start New Clinic Session
</button>

</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">

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
<div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
  <h3 className="text-white/80 text-sm">
    Real Avg Wait Time
  </h3>

  <p className="text-5xl font-bold">
    {realAverageTime} min
  </p>

  <p className="text-white/70 text-sm mt-2">
    Calculated from actual consultation history
  </p>
</div>
<div
  className={`p-6 rounded-2xl shadow-lg text-white ${
    patients.some((p) => p.status === "active")
      ? "bg-gradient-to-r from-green-500 to-emerald-600"
      : "bg-gradient-to-r from-gray-500 to-slate-600"
  }`}
>
  <h3 className="text-white/80 text-sm">
    Queue Status
  </h3>

  <p className="text-3xl font-bold">
    {patients.some(
      (p) => p.status === "active"
    )
      ? "In Progress"
      : "Idle"}
  </p>

  <p className="text-white/70 text-sm mt-2">
    Live Queue Monitoring
  </p>
</div>
</div>
<div className="mb-4 bg-green-100 border border-green-300 rounded-2xl p-4">
  <h3 className="text-lg font-bold text-green-800">
    Currently Serving
  </h3>

  <p className="text-2xl font-semibold text-green-700">
    {
      patients.find(
        (p) => p.status === "active"
      )?.patientName || "No Active Patient"
    }
  </p>
</div>
<div className="bg-white rounded-2xl shadow-md overflow-hidden">
<table className="w-full">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="p-4 text-left">Token</th>
<th className="p-4 text-left">Name</th>
<th className="p-4 text-left">Status</th>
<th className="p-4 text-left">Estimated Wait</th>
<th className="p-4 text-left">  Actual Consultation Time</th>
<th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr
  key={patient._id}
  className={`border-b hover:bg-slate-50 ${
    patient.status === "active"
      ? "bg-green-50"
      : ""
  }`}
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
              <td className="p-4">
  {getEstimatedWait(patient)}
</td>

<td className="p-4">
  {patient.actualDuration
    ? `${patient.actualDuration} mins`
    : "-"}
</td>

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

<footer className="mt-8 bg-white rounded-3xl shadow-lg p-6">

  <div className="flex flex-col md:flex-row justify-between items-center">

    <div>
      <h3 className="text-xl font-bold text-blue-900">
        🏥 Queue Cure
      </h3>

      <p className="text-slate-500">
        Smart Hospital Queue Management System
      </p>
    </div>

    <div className="text-center">
      <p className="text-slate-600">
        Real-Time Patient Queue Monitoring
      </p>

      <p className="text-slate-400 text-sm">
        React • Node.js • MongoDB • Socket.io
      </p>
    </div>

    <div className="text-right">
      <p className="text-slate-500 text-sm">
        © 2026 Queue Cure
      </p>

      <p className="text-green-600 font-semibold">
        ● System Online
      </p>
    </div>

  </div>

</footer>

</main>
</div>
</div>

  );
}

export default Receptionist;