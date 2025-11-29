// models/review.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: String,
      required: true,
    },
    bookId: {
      type: String,
      required: true, // Google Books ID
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
