FROM node:22-alpine AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# pnpm 11 reports ignored dependency scripts as an error. Install the locked
# dependency graph, then run the one required and pinned helper explicitly.
RUN corepack enable \
  && (pnpm install --frozen-lockfile || test -d node_modules) \
  && node node_modules/.pnpm/esbuild@0.28.2/node_modules/esbuild/install.js

COPY . .
RUN node node_modules/typescript/bin/tsc -b \
  && node node_modules/vite/bin/vite.js build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
