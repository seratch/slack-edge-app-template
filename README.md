## slack-edge app template (Socket Mode)

This is a Slack app project template demonstrating how to manage your [slack-edge](https://github.com/seratch/slack-edge) app using [Slack CLI](https://api.slack.com/automation/cli/install) for local development.

The notable qualities of this app template include:

* Smooth integration with [Slack CLI](https://api.slack.com/automation/cli/install) for rapid local app development
* No need to serve a public URL to receive Slack events, thanks to [Socket Mode](https://api.slack.com/apis/connections/socket)
* Auto-reloading for both TypeScript code and App Manifest (see: [1](https://github.com/seratch/slack-edge-app-template/blob/main/package.json))
* Steamlined robust type-safety in TypeScript programming (see: [1](https://github.com/seratch/slack-edge), [2](https://github.com/seratch/slack-web-api-client))

## Getting Started

### Install CLI and grant permissions

If you haven't yet installed Slack CLI, I recommend visiting [the guide page](https://api.slack.com/automation/cli/install) to do so, and allowing it to install apps into your sandbox or paid Slack workspaces. To complete this, you will need to run `slack login` command on your terminal, plus execute `/slackauthticket` with the given parameter in your Slack workspace.

Please remember that either a sandbox or paid workpace is required to use the CLI. To learn more about the "sandbox", read [this article](https://dev.to/seratch/rapid-slack-app-development-using-slack-cli-and-sandboxes-2f6m) for details.

### Start your app on your local machine

Once your CLI obtains the permission to install a local dev app, there is nothing else to prepare before running this template app. Clone this repo and install all the required npm packages:

```bash
git clone git@github.com:seratch/slack-edge-app-template.git my-slack-app
cd my-slack-app/
npm i
```

Now you can execute `slack run` to activate your first Slack app connected to a workspace via the CLI. The CLI automaticaly creates a new local dev app, which synchronizes the `manifest.json` data behind the scenes and establishes a Socket Mode connection (WebSocket protocol) with the authorized Slack workspace.

```bash
unset SLACK_APP_TOKEN
unset SLACK_BOT_TOKEN
slack run
```

If you see `[INFO]  socket-mode:SocketModeClient:0 Now connected to Slack` in the console output, the local dev app is successfully connected to your Slack workspace :tada:

Unlike before, you don't need to set any environment variables such as `SLACK_BOT_TOKEN`. The CLI passes the required variables to your app instance. If you have some env variables in the terminal session, you might need to unset them (e.g., `unset SLACK_BOT_TOKEN`) to prevent potential misbehavior.

### Deploy the app to prod environment

For operational efficiency at a production-grade level, using a container is currently considered one of the best practices. You can use the `Dockerfile`, located at the project's root directory, for this purpose. To see how it works, you can execute the following commands:

```bash
docker build . -t my-awesome-slack-app

export SLACK_APP_TOKEN=xapp-...
export SLACK_BOT_TOKEN=xoxb-...

docker run \
  -e SLACK_APP_TOKEN=$SLACK_APP_TOKEN \
  -e SLACK_BOT_TOKEN=$SLACK_BOT_TOKEN \
  -e SLACK_APP_LOG_LEVEL=info \
  -it my-awesome-slack-app
```

## Features in the app

This example app contains the following feature sets (release status; required scopes; the settings in manifest.json):

* An ["app_mention" event](https://api.slack.com/events/app_mention) listener (GA; [app_mentions:read](https://api.slack.com/scopes/app_mentions:read) scope; [settings.event_subscriptions](https://api.slack.com/reference/manifests#settings))
* A ["message" event](https://api.slack.com/events/message) listener (GA; [channels:history](https://api.slack.com/scopes/channels:history), [groups:history](https://api.slack.com/scopes/groups:history) scopes; [settings.event_subscriptions](https://api.slack.com/reference/manifests#settings))
* A ["reaction_added" event](https://api.slack.com/events/reaction_added) listener (GA; [reactions:read](https://api.slack.com/scopes/reactions:read) scope; [settings.event_subscriptions](https://api.slack.com/reference/manifests#settings))
* A `/run-test-app` [slash command](https://api.slack.com/interactivity/slash-commands) (GA; [commands](https://api.slack.com/scopes/commands) scope; [features.slash_commands](https://api.slack.com/reference/manifests#features))
* A global [shortcut](https://api.slack.com/interactivity/shortcuts) (GA; [commands](https://api.slack.com/scopes/commands) scope, [features.shortcuts](https://api.slack.com/reference/manifests#features))
* A message [shortcut](https://api.slack.com/interactivity/shortcuts) (GA; [commands](https://api.slack.com/scopes/commands) scope; [features.shortcuts](https://api.slack.com/reference/manifests#features))
* [Modal](https://api.slack.com/surfaces/modals) interactions (GA; [commands](https://api.slack.com/scopes/commands) scope; [settings.interactivity](https://api.slack.com/reference/manifests#features))
* A [custom step](https://api.slack.com/automation/functions/custom-bolt) within Workflow Builder (Still in beta; no scope reqiured; [functions](https://api.slack.com/reference/manifests#functions))

If certain functionalities are deemed unnecessary, you can safely delete the corresponding code lines in `src/app.ts` and required scopes and settings in `manifest.json`.
