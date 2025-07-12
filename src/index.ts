import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import  getPosts  from './routes/get/posts';
import { getUser }  from './routes/get/users';
import { search } from './routes/get/search';
import { postComment } from './routes/post/comment';
import { putComment } from './routes/put/comment';
import { deleteComment } from './routes/delete/comment';

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Fireheart API',
          description: 'API for Fireheart AntiRaid Forums',
          version: '1.0.0',
        },
        tags: [
          { name: 'General', description: 'General endpoints for posts and users' },
          { name: 'Comments', description: 'Endpoints for managing comments' },
          { name: 'Search', description: 'Search functionality' },
        ],
      },
      excludeStaticFile: true,
    })
  )
  .get('/', () => ({
    message: 'Welcome to Fireheart API',
    version: '1.0.0',
    uptime: process.uptime(),
    docs: '/swagger',
    author: 'Purrquinox Team',
    environment: process.env.NODE_ENV || 'development',
    website: 'https://antiraid.xyz',
    socials: {
      github: 'https://github.com/anti-raid/Fireheart',
      twitter: 'https://twitter.com/heyantiraid',
      discord: 'https://discord.com/invite/rCtD9RqWJf',
    },
  }))
  .group('/get', (app) => app
    .use(getPosts)
    .use(getUser)
    .use(search)
  )
  .group('/post', (app) => app
    .use(postComment)
  )
  .group('/put', (app) => app
    .use(putComment)
  )
  .group('/delete', (app) => app
    .use(deleteComment)
  )
  .listen(3000);

console.log(
  `🦊 Fireheart is running at http://${app.server?.hostname}:${app.server?.port}`
);
