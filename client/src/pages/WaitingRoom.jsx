import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import socket from "../socket";

function WaitingRoom() {
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    const res = await axios.get(
      "http://localhost:8000/api/patients"
    );

    setPatients(res.data);
  };

  useEffect(() => {
  fetchPatients();

  socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  socket.on("queueUpdated", () => {
    console.log("QUEUE UPDATED RECEIVED");
    fetchPatients();
  });

  return () => {
    socket.off("queueUpdated");
  };
}, []);

  const currentPatient = patients.find(
    (p) => p.status === "active"
  );

  const waitingPatients = patients.filter(
    (p) => p.status === "waiting"
  );

  return (
  <div className="min-h-screen bg-slate-900 text-white p-8">

  <div className="max-w-7xl mx-auto">
 <div className="mb-8">
  <Link
    to="/"
    className="inline-block bg-blue-600 text-white px-5 py-3 rounded-xl shadow-md hover:bg-blue-700"
  >
    ← Back to Receptionist
  </Link>
</div>
    
    <h1 className="text-6xl font-bold text-center mb-10">
      🏥 Queue Cure
    </h1>

      <p className="text-center text-slate-300 mb-10 text-xl">
        Live Waiting Room Display
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-10">

        <div className="bg-green-600 rounded-3xl p-10 text-center shadow-xl">
          <h2 className="text-2xl mb-4">
            Current Token
          </h2>

          <div className="text-8xl font-bold">
            {currentPatient
              ? currentPatient.tokenNumber
              : "-"}
          </div>
        </div>

        <div className="bg-orange-500 rounded-3xl p-10 text-center shadow-xl">
          <h2 className="text-2xl mb-4">
            Patients Waiting
          </h2>

          <div className="text-8xl font-bold">
            {waitingPatients.length}
          </div>
        </div>

      </div>

      <div className="bg-slate-800 rounded-3xl overflow-hidden shadow-xl">

        <div className="bg-slate-700 p-5">
          <h2 className="text-2xl font-bold">
            Live Queue Board
          </h2>
        </div>

        <table className="w-full">

          <thead className="bg-slate-600">
            <tr>
              <th className="p-4 text-left">
                Token
              </th>

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Status
              </th>
            </tr>
          </thead>

          <tbody>

            {patients.map((patient) => (
              <tr
                key={patient._id}
                className="border-b border-slate-700"
              >
                <td className="p-4">
                  {patient.tokenNumber}
                </td>

                <td className="p-4">
                  {patient.patientName}
                </td>

                <td className="p-4">

                  {patient.status === "waiting" && (
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full">
                      Waiting
                    </span>
                  )}

                  {patient.status === "active" && (
                    <span className="bg-green-400 text-black px-3 py-1 rounded-full">
                      Active
                    </span>
                  )}

                  {patient.status === "completed" && (
                    <span className="bg-gray-500 px-3 py-1 rounded-full">
                      Completed
                    </span>
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

export default WaitingRoom;

