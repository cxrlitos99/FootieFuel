import mongoose from "mongoose";

const categoriaEsquema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});

export default mongoose.model("futbol", categoriaEsquema);
