const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["waiting", "active", "completed"],
      default: "waiting",
    },

    consultationStart: {
      type: Date,
      default: null,
    },

    consultationEnd: {
      type: Date,
      default: null,
    },

    actualDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Patient",
  patientSchema
);