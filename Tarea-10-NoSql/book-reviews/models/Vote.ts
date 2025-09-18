// models/Vote.ts
import { Schema, model, models } from "mongoose";

const voteSchema = new Schema({
  reviewId: { type: Schema.Types.ObjectId, ref: "Review", required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  value: { type: Number, enum: [1, -1], required: true }
}, { timestamps: true });

voteSchema.index({ reviewId: 1, userId: 1 }, { unique: true });

export default models.Vote || model("Vote", voteSchema);
