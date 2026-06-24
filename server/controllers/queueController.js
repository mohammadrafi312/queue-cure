const Patient = require("../models/Patient");

const callNextPatient = async (req, res) => {
  try {
    const currentPatient = await Patient.findOne({
      status: "active",
    });

    if (currentPatient) {
      currentPatient.status = "completed";
      currentPatient.consultationEnd = new Date();

      await currentPatient.save();
    }

    const nextPatient = await Patient.findOne({
      status: "waiting",
    }).sort({ tokenNumber: 1 });

    if (!nextPatient) {
      return res.json({
        success: false,
        message: "No patients waiting",
      });
    }

    nextPatient.status = "active";
    nextPatient.consultationStart = new Date();

    await nextPatient.save();

    // Socket.IO Real-Time Update
    const io = req.app.get("io");

    if (io) {
      io.emit("queueUpdated");
    }

    res.json({
      success: true,
      patient: nextPatient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  callNextPatient,
};