import { PrismaClient } from '../../../../generated/prisma';
import { Elysia, t, type Static } from 'elysia';
import { CommentPlain } from '../../../../generated/prismabox/Comment';

const prisma = new PrismaClient();

// --- Schemas ---
const CreateCommentBody = t.Object({
  content: t.String(),
  postId: t.String(),
  userId: t.String()
});
type CreateCommentInput = Static<typeof CreateCommentBody>;

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
type CreateCommentOutput = Static<typeof CommentResponse>;

// --- App & Route ---
export const postComment = new Elysia()
  .post(
    '/comment',
    // <-- no manual annotation here, let Elysia infer `Context`
    async (context) => {
      const { content, postId, userId } = context.body;
      try {
        // Verify post and user exist
        const [post, user] = await Promise.all([
          prisma.post.findUnique({ where: { id: postId } }),
          prisma.user.findUnique({ where: { id: userId } })
        ]);

        if (!post) {
          context.set.status = 404;
          return 'Post not found';
        }

        if (!user) {
          context.set.status = 404;
          return 'User not found';
        }

        // Create the comment
        const comment = await prisma.comment.create({
          data: {
            content,
            post:    { connect: { id: postId } },
            author:  { connect: { id: userId } }
          },
          include: {
            author: { select: { id: true, name: true } },
            post:   { select: { id: true, title: true } }
          }
        });

        return {
          ...comment,
          author: {
            id:   comment.author?.id   ?? '',
            name: comment.author?.name ?? ''
          },
          post: {
            id:    comment.post?.id    ?? '',
            title: comment.post?.title ?? ''
          }
        };
      } catch (err) {
        console.error('Error creating comment:', err);
        context.set.status = 500;
        return 'Internal Server Error';
      }
    },
    {
      body:     CreateCommentBody,
      response: {
        200: CommentResponse,
        404: t.String(),
        500: t.String()
      }
    }
  );
