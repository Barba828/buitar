# stage-1: build
FROM node:alpine as builder

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install --no-frozen-lockfile && \
    pnpm build

# stage-2: package-static
FROM nginx:alpine

COPY --from=builder /app/packages/buitar/dist /usr/share/nginx/html/buitar
COPY --from=builder /app/packages/buitar-editor/dist /usr/share/nginx/html/buitar-editor
COPY --from=builder /app/packages/svg-chord/dist /usr/share/nginx/html/svg-chord
COPY --from=builder /app/packages/to-guitar/dist /usr/share/nginx/html/to-guitar
COPY --from=builder /app/packages/tone-player/dist /usr/share/nginx/html/tone-player

COPY dockerfile/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8282 8283

CMD ["nginx", "-g", "daemon off;"]
