import { SocketModeClient } from "@slack/socket-mode";
import { LogLevel } from "@slack/logger";
import { fromSocketModeToRequest as toRequest, fromResponseToSocketModePayload as toAckMessage } from "slack-edge";
import { app } from "./app";

const sm = new SocketModeClient({
  appToken: process.env.SLACK_APP_TOKEN!,
  logLevel: (process.env.SLACK_LOGGING_LEVEL as LogLevel) || LogLevel.DEBUG,
});

// No need to modify the following lines of code
sm.on("slack_event", async ({ body, ack, retry_num: retryNum, retry_reason: retryReason }) => {
  const request = toRequest({ body, retryNum, retryReason });
  if (!request) return;
  const response = await app.run(request);
  await ack(await toAckMessage({ response }));
});

(async () => await sm.start())();
