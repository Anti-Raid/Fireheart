import { PrismaClient } from '../../../../generated/prisma';
import { Elysia, t } from 'elysia';
import { PostPlain } from '../../../../generated/prismabox/Post';

const prisma = new PrismaClient();

const PostWithAuthor = t.Composite([
  PostPlain,
  t.Object({
    author: t.Object({
      id: t.String(),
      name: t.String({ default: '' }),
    }),
  }),
]);

const getPosts = new Elysia().get(
  '/posts',
  async ({ set }) => {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!posts || posts.length === 0) {
        set.status = 404;
        return 'No posts found';
      }

      return posts.map((post) => ({
        ...post,
        content: post.content || '',
        author: {
          id: post.author?.id || '',
          name: post.author?.name || '',
        },
      }));
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching posts:', error);
      set.status = 500;
      return 'Internal Server Error';
    }
  },
  {
    response: {
      200: t.Array(PostWithAuthor),
      404: t.String(),
      500: t.String(),
    },
  }
);

export default getPosts;