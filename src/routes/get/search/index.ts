import { PrismaClient } from '../../../../generated/prisma';
import { Elysia, t } from 'elysia';

const prisma = new PrismaClient();

// Query parameters schema
const SearchParams = t.Object({
  query: t.String(),
  type: t.Union([t.Literal('posts'), t.Literal('comments'), t.Literal('all')]),
  page: t.Number({ default: 1 }),
  limit: t.Number({ default: 10, maximum: 50 })
});

// Manual post result schema
const SearchPostResult = t.Object({
  id: t.String(),
  title: t.String(),
  content: t.String(),
  createdAt: t.String({ format: 'date-time' }),
  author: t.Object({
    id: t.String(),
    name: t.String()
  }),
  type: t.Literal('post')
});

// Manual comment result schema
const SearchCommentResult = t.Object({
  id: t.String(),
  content: t.String(),
  createdAt: t.String({ format: 'date-time' }),
  author: t.Object({
    id: t.String(),
    name: t.String()
  }),
  post: t.Object({
    id: t.String(),
    title: t.String()
  }),
  type: t.Literal('comment')
});

const SearchResponse = t.Object({
  results: t.Array(t.Union([SearchPostResult, SearchCommentResult])),
  total: t.Number(),
  page: t.Number(),
  totalPages: t.Number()
});

type PostResult = {
  type: 'post';
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
};

type CommentResult = {
  type: 'comment';
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  post: {
    id: string;
    title: string;
  };
};

type SearchResult = PostResult | CommentResult;

export const search = new Elysia()
  .get(
    '/search',
    async ({ query, set }) => {
      try {
        const searchQuery = query.query;
        const type = query.type as 'posts' | 'comments' | 'all';
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        let results: SearchResult[] = [];
        let total = 0;

        if (type === 'all' || type === 'posts') {
          const posts = await prisma.post.findMany({
            where: {
              OR: [
                { title: { contains: searchQuery, mode: 'insensitive' } },
                { content: { contains: searchQuery, mode: 'insensitive' } }
              ]
            },
            include: {
              author: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            skip: type === 'posts' ? skip : 0,
            take: type === 'posts' ? limit : undefined
          });

          results.push(
            ...posts.map((post) => ({
              id: post.id,
              title: post.title,
              content: post.content || '',
              createdAt: post.createdAt.toISOString(),
              author: {
                id: post.author?.id || '',
                name: post.author?.name || ''
              },
              type: 'post' as const
            }))
          );

          if (type === 'posts') {
            total = await prisma.post.count({
              where: {
                OR: [
                  { title: { contains: searchQuery, mode: 'insensitive' } },
                  { content: { contains: searchQuery, mode: 'insensitive' } }
                ]
              }
            });
          }
        }

        if (type === 'all' || type === 'comments') {
          const comments = await prisma.comment.findMany({
            where: {
              content: { contains: searchQuery, mode: 'insensitive' }
            },
            include: {
              author: {
                select: {
                  id: true,
                  name: true
                }
              },
              post: {
                select: {
                  id: true,
                  title: true
                }
              }
            },
            skip: type === 'comments' ? skip : 0,
            take: type === 'comments' ? limit : undefined
          });

          results.push(
            ...comments.map((comment) => ({
              id: comment.id,
              content: comment.content,
              createdAt: comment.createdAt.toISOString(),
              author: {
                id: comment.author?.id || '',
                name: comment.author?.name || ''
              },
              post: {
                id: comment.post?.id || '',
                title: comment.post?.title || ''
              },
              type: 'comment' as const
            }))
          );

          if (type === 'comments') {
            total = await prisma.comment.count({
              where: {
                content: { contains: searchQuery, mode: 'insensitive' }
              }
            });
          }
        }

        if (type === 'all') {
          results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          total = results.length;
          results = results.slice(skip, skip + limit);
        }

        const totalPages = Math.ceil(total / limit);

        if (results.length === 0) {
          set.status = 404;
          return 'No results found';
        }

        return {
          results,
          total,
          page,
          totalPages
        };
      } catch (err) {
        console.error('Error searching:', err);
        set.status = 500;
        return 'Internal Server Error';
      }
    },
    {
      query: SearchParams,
      response: {
        200: SearchResponse,
        404: t.String(),
        500: t.String()
      }
    }
  );
