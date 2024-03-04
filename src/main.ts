import { SocketModeClient } from "@slack/socket-mode";
import { LogLevel } from "@slack/logger";
import {
  fromSocketModeToRequest,
  fromResponseToSocketModePayload,
} from "slack-edge";
import { app } from "./app";

const socketModeClient = new SocketModeClient({
  appToken: process.env.SLACK_APP_TOKEN!,
  logLevel: (process.env.SLACK_APP_LOG_LEVEL as LogLevel) || LogLevel.DEBUG,
});

// No need to modify the following lines of code
socketModeClient.on(
  "slack_event",
  async ({ body, ack, retry_num: retryNum, retry_reason: retryReason }) => {
    const request = fromSocketModeToRequest({ body, retryNum, retryReason });
    if (!request) {
      return;
    }
    const response = await app.run(request);
    await ack(await fromResponseToSocketModePayload({ response }));
  },
);

(async () => {
  await socketModeClient.start();
})();
