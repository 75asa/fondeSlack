// eslint-disable-next-line import/no-extraneous-dependencies
import { ChatPostMessageArguments } from "@slack/web-api";
import { app, upsertChannelMember } from "./bolt";
import getFirestore from "./member";
// TODO: mock
// import mock from "../mock.json";

app.message(/^(.*)/, async ({ context, message: payload }) => {
    console.log({ payload });

    const withAttachment =
        payload.attachments && payload.attachments.length > 0;

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

    const targetMember = summary.value.split("\n")[0];

    console.log({ toMember: targetMember });

    // firestoreのデータを取得
    const hitUser = await getFirestore(targetMember);

    console.log({ hitUser });

    let message = "<!here>";
    let isHit = false;

    if (hitUser.length) {
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

    console.log("⚡️ Bolt app is running!");
})();

upsertChannelMember();
