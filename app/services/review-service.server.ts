import { eq } from "drizzle-orm";
import { z } from "zod";
import { uploadService } from "./file-service.server";
import { db } from "~/database/db.server";
import { reviewsTable, type Review } from "~/database/schema.server";

const createReviewSchema = z.object({
  user: z.string().nonempty({ message: "User is required" }),

  image: z.string().nonempty({ message: "Image is required" }),

  title: z.string().nonempty({ message: "Title is required" }),

  comment: z.string().nonempty({ message: "Comment is required" }),
});

export const reviewService = {
  async create(dto: z.infer<typeof createReviewSchema>) {
    let imagePath = await uploadService.storeFile(dto.image, "reviews");
    const result = await db
      .insert(reviewsTable)
      .values({
        title: dto.title,
        user: dto.user,
        comment: dto.comment,
        image: imagePath,
      })
      .returning();

    return result[0];
  },

  async queryReviews(params: any) {
    const result = await db.query.reviewsTable.findMany({
      limit: params.limit,
    });

    return result;
  },

  async findById(reviewId: string) {
    return await db.query.reviewsTable.findFirst({
      where: (t, fn) => fn.eq(t.id, reviewId),
    });
  },

  async deleteReview(review: Review) {
    if (review) {
      await uploadService
        .deleteFile(review.image as string)
        .catch((err) => console.log(err));
      await db.delete(reviewsTable).where(eq(reviewsTable.id, review.id));
    }
  },
};
