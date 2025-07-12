import { PrismaClient } from '../../../../generated/prisma';
import { Elysia, t } from 'elysia';

const prisma = new PrismaClient();

// Define request schema using generated types
const DeleteCommentParams = t.Object({
  commentId: t.String(),
  userId: t.String() // To verify the user owns the comment
});

export const deleteComment = new Elysia()
  .delete("/comment", async ({ query, set }) => {
    try {
      const { commentId, userId } = query;
      
      // Find the comment and verify ownership
      const existingComment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: { author: true }
      });

      if (!existingComment) {
        set.status = 404;
        return 'Comment not found';
      }

      if (existingComment.author?.id !== userId) {
        set.status = 403;
        return 'Not authorized to delete this comment';
      }

      await prisma.comment.delete({
        where: { id: commentId }
      });

      return 'Comment deleted successfully';
    } catch (err) {
      const error = err as Error;
      console.error('Error deleting comment:', error);
      set.status = 500;
      return 'Internal Server Error';
    }
  }, {
    query: DeleteCommentParams,
    response: {
      200: t.String(),
      403: t.String(),
      404: t.String(),
      500: t.String()
    }
  }); 