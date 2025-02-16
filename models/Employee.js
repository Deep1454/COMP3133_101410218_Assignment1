const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true, min: 1000 },
    joinDate: { type: Date, required: true },
    department: { type: String, required: true },
    profileImage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Employee", EmployeeSchema);
