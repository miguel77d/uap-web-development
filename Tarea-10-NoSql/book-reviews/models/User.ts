// models/User.ts
import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String }
}, { timestamps: true });

export default models.User || model("User", userSchema);
