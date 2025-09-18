// models/Favorite.ts
import { Schema, model, models } from "mongoose";

const favoriteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  bookId: { type: String, required: true, index: true },
  note: String
}, { timestamps: true });

favoriteSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export default models.Favorite || model("Favorite", favoriteSchema);
