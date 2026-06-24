import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import socket from "../socket";

function WaitingRoom() {
  const [patients, setPatients] = useState([]);
const [currentTime, setCurrentTime] =
  useState(new Date());
  const fetchPatients = async () => {
    const res = await axios.get(
      "https://queue-cure-backend-eh9q.onrender.com/api/patients"
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
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);
  const currentPatient = patients.find(
    (p) => p.status === "active"
  );

  const waitingPatients = patients.filter(
    (p) => p.status === "waiting"
  );

  const tokensAhead = waitingPatients.length;
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

const estimatedWait =
  tokensAhead * realAverageTime;
const totalPatients = patients.length;

const completedPatientsCount =
  patients.filter(
    (p) => p.status === "completed"
  ).length;

const queueProgress =
  totalPatients > 0
    ? Math.round(
        (completedPatientsCount /
          totalPatients) *
          100
      )
    : 0;
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

        <h1 className="text-6xl font-bold text-center">
  🏥 Queue Cure
</h1>

<p className="text-center text-slate-300 text-xl mt-2">
  Live Waiting Room Display
</p>

<p className="text-center text-cyan-400 text-3xl font-bold mb-10 mt-4">
  {currentTime.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
})}
</p>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-5 gap-8 mb-10">

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
<div className="bg-cyan-600 rounded-3xl p-10 text-center shadow-xl">
  <h2 className="text-2xl mb-4">
    Current Patient
  </h2>

  <div className="text-4xl font-bold break-words">
    {currentPatient
      ? currentPatient.patientName
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

          <div className="bg-blue-600 rounded-3xl p-10 text-center shadow-xl">
            <h2 className="text-2xl mb-4">
              Tokens Ahead
            </h2>

            <div className="text-8xl font-bold">
              {tokensAhead}
            </div>
          </div>

          <div className="bg-purple-600 rounded-3xl p-10 text-center shadow-xl">
            <h2 className="text-2xl mb-4">
              Predicted Wait
            </h2>

            <div className="text-8xl font-bold">
              {estimatedWait}
            </div>

            <p className="mt-2 text-lg">
              mins
            </p>
          </div>

        </div>
<div className="bg-slate-800 rounded-3xl p-6 mb-8 shadow-xl">

  <div className="flex justify-between mb-3">
    <h2 className="text-xl font-bold">
      Queue Progress
    </h2>

    <span className="font-semibold">
      {queueProgress}%
    </span>
  </div>

  <div className="w-full bg-slate-700 rounded-full h-5">
    <div
      className="bg-green-500 h-5 rounded-full transition-all duration-500"
      style={{
        width: `${queueProgress}%`,
      }}
    />
  </div>

</div>
        {/* Queue Table */}
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

<th className="p-4 text-left">
  Position
</th>
              </tr>
            </thead>

            <tbody>

{patients.map((patient) => {

  const queuePosition =
    waitingPatients.findIndex(
      (p) => p._id === patient._id
    ) + 1;

  return (
                <tr
  key={patient._id}
  className={`border-b border-slate-700 ${
    patient.status === "active"
      ? "bg-green-900/40"
      : ""
  }`}
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
    <span className="bg-green-400 text-black px-3 py-1 rounded-full animate-pulse font-bold">
  ● Active
</span>
  )}

  {patient.status === "completed" && (
    <span className="bg-gray-500 px-3 py-1 rounded-full">
      Completed
    </span>
  )}

</td>

<td className="p-4">

  {patient.status === "waiting" ? (
    <span className="bg-blue-500 text-white px-3 py-1 rounded-full font-semibold">
      #{queuePosition}
    </span>
  ) : (
    "-"
  )}

</td>
               </tr>
);
})}

            </tbody>

          </table>

        </div>

      </div>
    </div>

  );
}

export default WaitingRoom;