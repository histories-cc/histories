FROM node:16.14.2-bullseye-slim
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

ENV NODE_ENV production

# disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1


CMD [ "yarn", "start" ]