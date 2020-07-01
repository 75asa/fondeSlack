import { app, upsertChannelMember, notify } from "./bolt";
import { ChatPostMessageArguments } from "@slack/web-api";
// import notify from "./notify";
import * as member from "./member";
import { resolve } from "dns";
// TODO: mock
import mock from "../mock.json";

// To response only user w/o bot
const onlyBotMessages = async ({ logger, message: payload, next }) => {
  // console.log({ message })
  logger.info({ payload });
  if (payload.subtype && payload.subtype == "bot_message") next();
};

// TODO: production
const noThreadMessages = async ({ payload, next }) => {
  if (!payload.thread_ts) next();
};

// FIXME: middleware type
// app.use(onlyBotMessages);
app.message(/^(.*)/, async ({ client, logger, context, message: payload }) => {
  console.log({ payload });

  const withAttachment = payload.attachments && payload.attachments.length > 0;

  if (!withAttachment) {
    console.log(`webhook以外`);
    return;
  }
  // const summary = mock.attachments[0].fields.find(
  const summary = payload.attachments[0].fields.find(
    field => field.title === "内容"
  );

  if (!summary) {
    console.log(`fondeskのwebhookではない`);
    return;
  }

  console.log({ summary });
  const toMember = summary.value.split("\n")[0];
  console.log({ toMember });

  // firestoreのデータを取得
  const hitUser = await member.getFirestore(toMember);

  console.log({ hitUser });

  let message = "<!here>";
  let isHit = false;

  if (hitUser.length > 0) {
    message = hitUser.map(user => `<@${user.id}>`).join(" ");
    isHit = true;
  }
  message += " 電話だよ〜:call_me_hand::skin-tone-5:";

  // Slack通知
  const option: ChatPostMessageArguments = {
    token: context.botToken,
    text: message,
    channel: payload.channel,
  };

  console.log({ isHit });

  if (isHit) {
    option.thread_ts = payload.event_ts;
  }

  console.log({ option });

  app.client.chat.postMessage(option).catch(err => {
    throw new Error(err);
  });
});
(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  member.getFirestore;

  console.log("⚡️ Bolt app is running!");
})();

// member.set();
// member.get();
member.upsertByCommands();
upsertChannelMember();
notify();
