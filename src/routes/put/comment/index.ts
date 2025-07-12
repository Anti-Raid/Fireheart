import { PrismaClient } from '../../../../generated/prisma';
import { Elysia, t, type Static } from 'elysia';
import { CommentPlain } from '../../../../generated/prismabox/Comment';

const prisma = new PrismaClient();

// Request schema
const UpdateCommentBody = t.Object({
  content: t.String(),
  commentId: t.String(),
  userId: t.String()
});
type UpdateCommentInput = Static<typeof UpdateCommentBody>;

// Response schema
const CommentResponse = t.Composite([
  CommentPlain,
  t.Object({
    author: t.Object({
      id: t.String(),
      name: t.String({ default: '' })
    }),
    post: t.Object({
      id: t.String(),
      title: t.String()
    })
  })
]);
type UpdateCommentOutput = Static<typeof CommentResponse>;

// PUT /comment
export const putComment = new Elysia()
  .put(
    '/comment',
    async (context) => {
      const { content, commentId, userId } = context.body as UpdateCommentInput;

      try {
        // Fetch existing comment + author
        const existingComment = await prisma.comment.findUnique({
          where: { id: commentId },
          include: { author: true }
        });

        if (!existingComment) {
          context.set.status = 404;
          return 'Comment not found';
        }

        if (existingComment.author?.id !== userId) {
          context.set.status = 403;
          return 'Not authorized to update this comment';
        }

        // Update
        const updatedComment = await prisma.comment.update({
          where: { id: commentId },
          data: { content },
          include: {
            author: { select: { id: true, name: true } },
            post:   { select: { id: true, title: true } }
          }
        });

        return {
          ...updatedComment,
          author: {
            id:   updatedComment.author?.id   ?? '',
            name: updatedComment.author?.name ?? ''
          },
          post: {
            id:    updatedComment.post?.id    ?? '',
            title: updatedComment.post?.title ?? ''
          }
        };
      } catch (err) {
        console.error('Error updating comment:', err);
        context.set.status = 500;
        return 'Internal Server Error';
      }
    },
    {
      body: UpdateCommentBody,
      response: {
        200: CommentResponse,
        403: t.String(),
        404: t.String(),
        500: t.String()
      }
    }
  );