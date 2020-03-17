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

const getChannelInfo = async (contex, message) => {

  // console.log({ message })
  const channelInfo = await app.client.channels.info({
    token: process.env.SLACK_BOT_TOKEN,
    channel: message.channel
  })
  // console.log({ channelInfo })
  if (!channelInfo.ok) return null
  const latest = channelInfo.channel.latest
  // console.log({ latest })
  const members = channelInfo.channel.members
  console.log({ members })
  contex.latest = latest;
  contex.members = members;
  return members;
}

// To add posted user's profile to context
const getUserInfo = async (context, message) => {

  let users = [];
  const name = 'ナゴ';

  // console.log({ context })

  context.members.forEach(async (member) => {
    console.log({ member });
    await app.client.users.profile.get({
      token: context.botToken,
      user: member,
      include_locale: true
    }).then((result) => {
      console.log({ result })
      Object.keys(result.profile).forEach((key) => {
        if (!result.profile) return
        if (JSON.stringify(result.profile[key]).includes(name)) {
          console.log('true');
          users.push(member);
          Promise.resolve(users);
        }
      })
      console.log('✅')
      // console.log({ users });
    })
  })
  console.log({ users })
  const u = users[0];
  const msg = `hi <@${u}>`;
  await app.client.chat.postMessage({
    token: context.botToken,
    channel: message.channel,
    text: msg,
  })
  console.log('🚫');

}
app.message(/^(.*)/, async ({ context, message }) => {
  context.members = await getChannelInfo(context, message)
  context.users = await getUserInfo(context, message);
  console.log('🥶🥶')


  // console.log({ context });
});


(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();