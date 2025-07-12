import { PrismaClient } from '../../../../generated/prisma';
import { Elysia, t } from 'elysia';

const prisma = new PrismaClient();

const PostSchema = t.Object({
  id: t.String(),
  title: t.String(),
  content: t.String({ default: '' }),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  tags: t.Array(t.String())
});

const UserWithPosts = t.Object({
  id: t.String(),
  name: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  posts: t.Array(PostSchema)
});

const UserWithoutPosts = t.Object({
  id: t.String(),
  name: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date()
});

export const getUser = new Elysia().get(
  '/users',
  async ({ set, query }) => {
    const { username, posts } = query;

    if (posts === 'include') {
      const user = await prisma.user.findFirst({
        where: { name: username },
        include: {
          posts: {
            select: {
              id: true,
              title: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              tags: true
            }
          }
        }
      });

      if (!user) {
        set.status = 404;
        return 'User not found';
      }

      return {
        id: user.id,
        name: user.name || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        posts: (user.posts || []).map((post) => ({
          ...post,
          content: post.content || '',
          tags: post.tags || []
        }))
      };
    } else {
      const user = await prisma.user.findFirst({
        where: { name: username }
      });

      if (!user) {
        set.status = 404;
        return 'User not found';
      }

      return {
        id: user.id,
        name: user.name || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    }
  },
  {
    query: t.Object({
      username: t.String(),
      posts: t.Union([t.Literal('include'), t.Literal('exclude')])
    }),
    response: {
      200: t.Union([UserWithPosts, UserWithoutPosts]),
      404: t.String(),
      500: t.String()
    }
  }
);
