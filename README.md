## slack-edge app template (Socket Mode)

This is a template for a Slack app project, which demonstrates how to manage your app using [Slack CLI](https://api.slack.com/automation/cli/install) for local development.

The notable qualities of this app template include:

* Smooth integration with Slack CLI for rapid local app development
* No need to serve a public URL to receive Slack events, thanks to Socket Mode
* Auto-reloading for both TypeScript code and App Manifest
* Steamlined robust type-safety in TypeScript programming

## Getting Started

### Install CLI and grant permissions

If you haven't yet installed Slack CLI, I recommend visiting [this page](https://api.slack.com/automation/cli/install) to do so, and allowing it to install apps into your paid or sandbox Slack workspaces. To complete this, you will need to run `slack login` command on your terminal, plus execute `/slackauthticket` with the given parameter in your Slack workspace.

Please remember that either a sandbox or paid workpace is required to use the CLI.

### Start your app on your local machine

Once your CLI obtains the permission to install a local dev app, there is nothing else to prepare before running this template app. Clone this repo and install all the required npm packages:

```bash
git clone git@github.com:seratch/slack-edge-template.git
cd slack-edge-template/
npm i
```

Now you can execute `slack run` to activate your first Slack app connected to a workspace via the CLI. The CLI automaticaly creates a new local dev app, which synchronizes the `manifest.json` data behind the scenes and establishes a Socket Mode connection (WebSocket protocol) with the authorized Slack workspace.

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

This example app contains the following feature sets:

* An "app_mention" event listener (GA; app_mentions:read scope, $.settings.event_subscriptions.bot_events)
* A "message" event listener (GA; channels:history, groups:history scopes, $.settings.event_subscriptions.bot_events)
* A "reaction_added" event listener (GA; reactions:read scope, $.settings.event_subscriptions.bot_events)
* A `/run-test-app` slash command (GA; commands scope, $.shortcuts.slash_commands)
* A global shortcut (GA; commands scope, $.shortcuts.shortcuts)
* A message shortcut (GA; commands scope, $.shortcuts.shortcuts)
* Modal interactions (GA; commands scope, $.settings.interactivity)
* A custom step within Workflow Builder (Still in beta; $.functions in manifest)

If certain functionalities are deemed unnecessary, you can safely delete the corresponding code lines and remove the scopes used for them.
