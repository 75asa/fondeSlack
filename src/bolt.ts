import { App, LogLevel, ExpressReceiver } from "@slack/bolt";
import dotenv from "dotenv";
import Channel from "./channel";

dotenv.config();

Object.keys(dotenv).forEach(key => {
    process.env[key] = dotenv[key];
});

const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const config = {
    logLevel: LogLevel.DEBUG,
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    receiver,
};

export const app = new App(config);

export const upsertChannelMember = (): void => {
    receiver.app.get(`/register`, (req, res) => {
        res.sendStatus(200);
        // チャンネルメンバーを取得
        const channel = new Channel(app);
        // 更新
        channel.putChannelMemberFirestore();
    });
};
