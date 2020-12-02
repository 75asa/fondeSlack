import { ChatPostMessageArguments } from "@slack/web-api";
import { SectionBlock } from "@slack/types";
import { app, upsertChannelMember } from "./bolt";
import getFirestore from "./member";

// TODO: mock
// import mock from "../mock.json";

app.message(/^(.*)/, async ({ context, message: payload }) => {
    console.log({ payload });

    if (
        payload.subtype !== "bot_message" ||
        !payload.blocks ||
        !payload.blocks.length
    ) {
        console.log("🥺 not fondesk message");
        return;
    }

    const targetMembers = payload.blocks.reduce<string[]>((acc, block) => {
        if (block.type !== "section") return acc;
        const section = block as SectionBlock;
        if (!section.text.type || section.text.type !== "mrkdwn") return acc;
        const sectionText = section.text.text;
        const sectionTextConponent = sectionText.split(/\*あて先\*+\s/);
        if (sectionTextConponent.length < 2) return acc;
        const result = sectionTextConponent[1].split(/\s/g).filter(Boolean);
        console.log({ result });
        return [...acc, ...result];
    }, []);

    console.log({ targetMembers });

    // firestoreのデータを取得
    const hitUser = await getFirestore(targetMembers);

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

    const res = await app.client.chat.postMessage(option).catch(err => {
        throw new Error(err);
    });
    if (res.ok) {
        console.log("msg: ok ✅");
    } else {
        console.log(`Failed to post a message (error: ${res.error})`);
    }
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log("⚡️ Bolt app is running!");
})();

upsertChannelMember();
