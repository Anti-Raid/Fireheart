# Fireheart

Fireheart is the official rewrite for the Forums API used by [Badgerfang](https://github.com/anti-raid/badgerfang)

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/anti-raid/fireheart.git
   cd fireheart
   ```
2. **Install dependencies:**
   ```sh
   bun install
   # or
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your database credentials.
4. **Run database migrations:**
   ```sh
   bun run db:push
   # or
   npx prisma db push
   ```
5. **Start the development server:**
   ```sh
   bun run dev
   # or
   npm run dev
   ```
6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Scripts

- `dev` – Start the development server
- `start` – Start the production server
- `db:push` – Push Prisma schema to the database
- `db:studio` – Open Prisma Studio
- `format` – Format code with Prettier

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.

---

Made with ❤️ by team Purrquinox.
