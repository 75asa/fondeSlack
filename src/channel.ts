import { App } from "@slack/bolt";
// eslint-disable-next-line import/no-extraneous-dependencies
import { channel } from "./types/channelResult";
import { userInfo } from "./types/userInfo";
// eslint-disable-next-line import/no-extraneous-dependencies
import firestore from "./firestore";
import Profile from "./profile";

class Channel {
    private app: App;

    public constructor(app: App) {
        this.app = app;
    }

    public getChannelInfo = async (): Promise<string[] | null> => {
        return new Promise((resolve, rejects) => {
            this.app.client.channels
                .info({
                    channel: process.env.CHANNEL_ID,
                    token: process.env.SLACK_BOT_TOKEN,
                })
                .then(result => {
                    if (result.ok) {
                        const channelResult = result.channel as channel;
                        resolve(channelResult.members);
                    } else {
                        rejects();
                    }
                });
        });
    };

    public getProfile = async (slackId: string): Promise<userInfo> => {
        return new Promise((resolve, rejects) => {
            this.app.client.users.profile
                .get({
                    token: process.env.SLACK_BOT_TOKEN,
                    user: slackId,
                })
                .then(result => {
                    if (result.ok) {
                        const profile = new Profile(result);
                        return resolve(profile.getUserInfo());
                    }
                    return rejects();
                });
        });
    };

    public async putChannelMemberFirestore(): Promise<void> {
        const usersRef = firestore.collection(`users`);
        const members = await this.getChannelInfo();
        await members.map(async userId => {
            const userProfile = await this.getProfile(userId);
            this.logger.debug({ userProfile });
            await usersRef.doc(userId).set(userProfile);
            return userProfile;
        });
    }
}

export default Channel;
