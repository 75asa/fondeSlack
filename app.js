const config = require("dotenv").config().parsed;
for (const key in config) {
  process.env[key] = config[key];
}
const { App, LogLevel } = require('@slack/bolt');

const app = new App({
  logLevel: LogLevel.DEBUG,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const allUsersInfo = async ({ context, next }) => {
  const users = await app.client.users.list({
    token: context.botToken,
    presence: true
  });
  console.log({ users })
  context.users = users
  next()
}
app.message(allUsersInfo, /^(.*)/, async ({ context, message }) => {
  console.log({ allUsersInfo })
  console.log({ message })
})

app.use(allUsersInfo);

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
