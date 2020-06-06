import { App, LogLevel, ExpressReceiver } from "@slack/bolt";
import Channel from "./channel";
import dotenv from "dotenv";
dotenv.config();

for (const key in dotenv) {
  process.env[key] = dotenv[key];
}

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

export const notify = () => {
  receiver.app.get(`/notify`, (req, res) => {
    res.sendStatus(200);

    const msg = {
      token: process.env.SLACK_BOT_TOKEN,
      text: `<!channel>\nお知らせです`,
      channel: process.env.CHANNEL, // 表示するチャンネルのID
    };
    return app.client.chat.postMessage(msg);
  });
};

export const upsertChannelMember = () => {
  receiver.app.get(`/register`, (req, res) => {
    res.sendStatus(200);
    // チャンネルメンバーを取得
    const channel = new Channel(app);
    channel.putChannelMemberFirestore();
    // console.log({ channel });
  });
};

const config = {
  logLevel: LogLevel.DEBUG,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver: receiver,
};

// TODO: fix type <any> => <App>
// export const app: any = new App(config);
export const app = new App(config);
