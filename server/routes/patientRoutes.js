const express = require("express");
const router = express.Router();

const Patient = require("../models/Patient");

const {
  callNextPatient,
} = require("../controllers/queueController");

// Add Patient
router.post("/", async (req, res) => {
  try {
    const { patientName } = req.body;

    const lastPatient = await Patient.findOne()
      .sort({ tokenNumber: -1 });

    const nextToken = lastPatient
      ? lastPatient.tokenNumber + 1
      : 1;

    const patient = await Patient.create({
      tokenNumber: nextToken,
      patientName,
    });

    const io = req.app.get("io");
    io.emit("queueUpdated");

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get All Patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find()
      .sort({ tokenNumber: 1 });

    res.json(patients);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Call Next Patient
router.post(
  "/call-next",
  callNextPatient
);

// Start New Clinic Session
router.delete("/reset", async (req, res) => {
  try {
    await Patient.deleteMany({});

    const io = req.app.get("io");
    io.emit("queueUpdated");

    res.json({
      success: true,
      message: "New Clinic Session Started",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Edit Patient
router.put("/:id", async (req, res) => {
  try {
    const { patientName } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { patientName },
      { new: true }
    );

    const io = req.app.get("io");
    io.emit("queueUpdated");

    res.json(patient);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Remove Patient
router.delete("/:id", async (req, res) => {
  try {
    await Patient.findByIdAndDelete(
      req.params.id
    );

    const io = req.app.get("io");
    io.emit("queueUpdated");

    res.json({
      success: true,
      message: "Patient Removed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;