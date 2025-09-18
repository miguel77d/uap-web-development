// services/reviews.service.ts
import Review from "@/models/Review";

export async function createReview(
  userId: string,
  data: { bookId: string; rating: number; comment?: string }
) {
  return Review.create({ ...data, userId });
}
