# Elysia with Bun runtime

## Getting Started
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

```shell
bun build --compile \
  --target bun-linux-x64 \
  --outfile server \
  --entrypoints src/index.ts \
  --entrypoints src/worker.ts
```

### Testing

```shell
 wrk2 -t 4 -c 500 -d 20 -R 5000 -L "http://localhost:8098/process"
```
