const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const patientRoutes = require("./routes/patientRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.set("io", io);
app.use(cors());
app.use(express.json());

app.use("/api/patients", patientRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

io.on("connection", (socket) => {
  console.log("🟢 Client Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client Disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Queue Cure Backend Running 🚀");
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});