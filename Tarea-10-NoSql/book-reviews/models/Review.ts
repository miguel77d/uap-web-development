// models/Review.ts
import { Schema, model, models } from "mongoose";

const reviewSchema = new Schema({
  bookId: { type: String, required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 500 }
}, { timestamps: true });

export default models.Review || model("Review", reviewSchema);
