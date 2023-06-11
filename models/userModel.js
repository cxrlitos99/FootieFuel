import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    rol: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("usuarios", userSchema);
