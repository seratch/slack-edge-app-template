FROM node:20-alpine3.18 as builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine3.18
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/ ./
ENTRYPOINT [ "node", "./lib/main.js" ]

# docker build . -t your-repo/my-awesome-slack-app
# export SLACK_APP_TOKEN=xapp-...
# export SLACK_BOT_TOKEN=xoxb-...
# docker run -e SLACK_APP_TOKEN=$SLACK_APP_TOKEN -e SLACK_BOT_TOKEN=$SLACK_BOT_TOKEN -e SLACK_APP_LOG_LEVEL=info -it your-repo/my-awesome-slack-app