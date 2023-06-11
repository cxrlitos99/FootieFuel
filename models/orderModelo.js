import mongoose from "mongoose";

const orderEsquema = new mongoose.Schema(
  {
    productos: [
      {
        type: mongoose.ObjectId,
        ref: "Productos",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderEsquema);
