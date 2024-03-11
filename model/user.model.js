import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema({
  personalDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: true,
    },
    mobileNumber: { type: String },
    guardiansMobileNumber: { type: String, required: true },
  },
  addressDetails: {
    houseNumber: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    referralCode: { type: String, default: null },
  },
  academicDetails: {
    school: { type: String, required: true },
    class: { type: String, required: true },
    boards: { type: String, required: true },
    subject: {
      type: String,
      enum: [
        "English",
        "Hindi",
        "Biology",
        "Chemistry",
        "Political Science",
        "Computer Science",
        "Accountancy",
        "Geography",
        "Economics",
        "Mathematics",
        "Physical Education",
        "Social Science",
        "Business",
        "Physics",
      ],
      required: true,
    },
  },
  mobile: {
    type: String,
    required: true,
  },
  otpDetails: {},
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

export default UserDetails;
