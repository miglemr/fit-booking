## Setup

1. `npm install`
2. Create a PostgreSQL database.
3. Add credentials to `.env` file based on `.env.example`.

## Running the server

In development mode:

```bash
npm run dev
```

## Tests

```bash
npm run test
```

### Test coverage

```bash
npm  run  coverage
```

### Manual testing with TRPC Panel

Start the server and navigate to _localhost:3000/panel_ to manually test all endpoints.

To access admin only endpoints, sign up, in the database set user as admin, sign in, copy access token and set it in Headers.
