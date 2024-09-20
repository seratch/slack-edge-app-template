import { Assistant, SlackApp } from "slack-edge";

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";
const logLevel = (process.env.SLACK_APP_LOG_LEVEL || "DEBUG") as LogLevel;

export const app = new SlackApp({
  socketMode: true,
  env: {
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN!,
    SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN!,
    SLACK_LOGGING_LEVEL: logLevel,
  },
});

// -------------------------------
// Agents & Assistants
// -------------------------------

app.assistant(
  new Assistant({
    threadStarted: async ({ context: { say, setSuggestedPrompts } }) => {
      await say({ text: "Hi, how can I help you today?" });
      await setSuggestedPrompts({
        prompts: ["What does SLACK stand for?"],
      });
    },
    userMessage: async ({ context: { setStatus, say } }) => {
      await setStatus({ status: "is typing..." });
      await say({ text: "Here you are!" });
    },
  }),
);

// -------------------------------
// Events API
// -------------------------------

app.event("app_home_opened", async ({ payload, context: { client, actorUserId } }) => {
  // do anything async here
  if (payload.tab === "home") {
    await client.views.publish({
      user_id: actorUserId!,
      view: {
        type: "home",
        blocks: [
          {
            type: "section",
            text: { type: "mrkdwn", text: `Hi <@${actorUserId}>!` },
          },
        ],
      },
    });
  }
});

app.event("app_mention", async ({ context: { say, actorUserId } }) => {
  // do anything async here
  await say({ text: `Hi <@${actorUserId}>!` });
});

app.message("hello", async ({ context: { say } }) => {
  // do anything async here
  await say({ text: "Hello!" });
});

app.event("message", async () => {
  // Ack the rest of message events
});

app.event("reaction_added", async ({ context: { say }, payload }) => {
  // do anything async here
  await say({ text: "Hello!", thread_ts: payload.item.ts });
});

// -------------------------------
// Slash Commands
// -------------------------------

app.command(
  "/run-test-app",
  async ({ context: { respond } }) => {
    // ack the request within 3 seconds
    await respond({
      text: "Hey, this is an ephemeral message sent using response_url :wave:",
    });

    return "Hey, what's up?";
    // If you want to send a message visible to everyone, you can pass response_type
    // return { text: "Hey, what's up?", response_type: "in_channel" };
  },
  async ({}) => {
    // do anything async here
  },
);

// -------------------------------
// Interactivity & Shortcuts
// -------------------------------

app.shortcut(
  "global_example",
  async ({}) => {}, // ack the request within 3 seconds
  async ({ context: { client, triggerId, actorUserId } }) => {
    // do anything async here
    await client.views.open({
      trigger_id: triggerId!,
      view: {
        type: "modal",
        callback_id: "test-modal",
        title: { type: "plain_text", text: "TestApp" },
        submit: { type: "plain_text", text: "Submit" },
        close: { type: "plain_text", text: "Close" },
        notify_on_close: true,
        blocks: [
          {
            type: "section",
            text: { type: "mrkdwn", text: `Hi <@${actorUserId}>!` },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                action_id: "button-example",
                text: { type: "plain_text", text: "Button example" },
                value: "global",
              },
            ],
          },
        ],
      },
    });
  },
);

app.shortcut(
  "message_example",
  async ({}) => {}, // ack the request within 3 seconds
  async ({ context: { client, triggerId, actorUserId } }) => {
    // do anything async here
    await client.views.open({
      trigger_id: triggerId!,
      view: {
        type: "modal",
        callback_id: "test-modal",
        title: { type: "plain_text", text: "TestApp" },
        submit: { type: "plain_text", text: "Submit" },
        close: { type: "plain_text", text: "Close" },
        notify_on_close: true,
        blocks: [
          {
            type: "section",
            text: { type: "mrkdwn", text: `Hi <@${actorUserId}>!` },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                action_id: "button-example",
                text: { type: "plain_text", text: "Button example" },
                value: "message",
              },
            ],
          },
        ],
      },
    });
  },
);

app.action(
  "button-example", // action_id
  async ({}) => {
    // ack the request within 3 seconds
    console.log("Button on a modal clicked!");
  },
  async ({}) => {
    // do anything async here
  },
);

app.view(
  "test-modal",
  async ({}) => {
    // ack the request within 3 seconds
    return {
      response_action: "update",
      view: {
        type: "modal",
        callback_id: "test-modal",
        title: { type: "plain_text", text: "TestApp" },
        close: { type: "plain_text", text: "Close" },
        blocks: [
          {
            type: "section",
            text: { type: "mrkdwn", text: "Thank you!" },
          },
        ],
      },
    };
  },
  async ({}) => {
    // do anything async here
  },
);

// -------------------------------
// Custom Functions
// -------------------------------

app.function(
  "fetch_user_details", // See the "functions" part in manifest.json
  async ({ payload, context: { client, functionExecutionId } }) => {
    try {
      // Requires users:read scope
      const userInfo = await client.users.info({
        user: payload.inputs.user_id,
      });
      const user = userInfo.user!;
      await client.functions.completeSuccess({
        function_execution_id: functionExecutionId!,
        outputs: {
          full_name: user.real_name || user.profile?.real_name_normalized || user.profile?.real_name,
          icon_url:
            user.profile?.image_512 ||
            user.profile?.image_192 ||
            user.profile?.image_72 ||
            user.profile?.image_48 ||
            user.profile?.image_32 ||
            user.profile?.image_24,
          tz_offset: user.tz_offset,
        },
      });
    } catch (e) {
      console.error(e);
      await client.functions.completeError({
        function_execution_id: functionExecutionId!,
        error: `Failed to respond to fetch_user_details function event (${e})`,
      });
    }
  },
);
