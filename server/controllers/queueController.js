const Patient = require("../models/Patient");

const callNextPatient = async (req, res) => {
  try {
    // Complete current active patient
    const currentPatient = await Patient.findOne({
      status: "active",
    });

    if (currentPatient) {
      const endTime = new Date();

      currentPatient.status = "completed";
      currentPatient.consultationEnd = endTime;

      if (currentPatient.consultationStart) {
        const startTime = new Date(
          currentPatient.consultationStart
        ).getTime();

        const endTimeMs = endTime.getTime();

        currentPatient.actualDuration = Math.max(
          1,
          Math.round(
            (endTimeMs - startTime) / 60000
          )
        );

        console.log(
          "Duration Saved:",
          currentPatient.actualDuration,
          "minutes"
        );
      }

      await currentPatient.save();
    }

    // Activate next waiting patient
    const nextPatient = await Patient.findOne({
      status: "waiting",
    }).sort({ tokenNumber: 1 });

    if (!nextPatient) {
      const io = req.app.get("io");

      if (io) {
        io.emit("queueUpdated");
      }

      return res.json({
        success: false,
        message: "No patients waiting",
      });
    }

    nextPatient.status = "active";
    nextPatient.consultationStart = new Date();

    await nextPatient.save();

    // Real-time update
    const io = req.app.get("io");

    if (io) {
      io.emit("queueUpdated");
    }

    res.json({
      success: true,
      patient: nextPatient,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  callNextPatient,
};