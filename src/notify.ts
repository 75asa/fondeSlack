import { app } from "./bolt";

export default () => {
    app.action.prototype.receiver.app.get(`/notify`, (req, res) => {
        res.sendStatus(200);

        const msg = {
            token: process.env.SLACK_BOT_TOKEN,
            text: `<!channel>\nお知らせです`,
            channel: process.env.CHANNEL, // 表示するチャンネルのID
        };
        return app.client.chat.postMessage(msg);
    });
};
