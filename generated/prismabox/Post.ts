import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PostPlain = t.Object(
  {
    id: t.String(),
    title: t.String(),
    content: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
    tags: t.Array(t.String(), { additionalProperties: false }),
    userId: __nullable__(t.String()),
  },
  { additionalProperties: false },
);

export const PostRelations = t.Object(
  {
    author: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    Comment: t.Array(
      t.Object(
        {
          id: t.String(),
          content: t.String(),
          postId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          userId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const PostPlainInputCreate = t.Object(
  {
    title: t.String(),
    content: t.Optional(__nullable__(t.String())),
    tags: t.Array(t.String(), { additionalProperties: false }),
  },
  { additionalProperties: false },
);

export const PostPlainInputUpdate = t.Object(
  {
    title: t.Optional(t.String()),
    content: t.Optional(__nullable__(t.String())),
    tags: t.Optional(t.Array(t.String(), { additionalProperties: false })),
  },
  { additionalProperties: false },
);

export const PostRelationsInputCreate = t.Object(
  {
    author: t.Optional(
      t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    Comment: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const PostRelationsInputUpdate = t.Partial(
  t.Object(
    {
      author: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      Comment: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const PostWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          title: t.String(),
          content: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          tags: t.Array(t.String(), { additionalProperties: false }),
          userId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Post" },
  ),
);

export const PostWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.String() })], {
          additionalProperties: false,
        }),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.String(),
              title: t.String(),
              content: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              tags: t.Array(t.String(), { additionalProperties: false }),
              userId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Post" },
);

export const PostSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      title: t.Boolean(),
      content: t.Boolean(),
      author: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      tags: t.Boolean(),
      Comment: t.Boolean(),
      userId: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PostInclude = t.Partial(
  t.Object(
    { author: t.Boolean(), Comment: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PostOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      content: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tags: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Post = t.Composite([PostPlain, PostRelations], {
  additionalProperties: false,
});

export const PostInputCreate = t.Composite(
  [PostPlainInputCreate, PostRelationsInputCreate],
  { additionalProperties: false },
);

export const PostInputUpdate = t.Composite(
  [PostPlainInputUpdate, PostRelationsInputUpdate],
  { additionalProperties: false },
);
