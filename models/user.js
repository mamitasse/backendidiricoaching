const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["homme", "femme"], required: true },
    age: { type: Number, required: true },
    phone: { type: String },
    address: { type: String },
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Référence au coach
    role: { type: String, enum: ["adherent", "coach"], default: "adherent" },
    resetPasswordToken: { type: String }, // Token pour la réinitialisation du mot de passe
    resetPasswordExpires: { type: Date }, // Date d'expiration du token
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
