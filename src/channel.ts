import { App } from "@slack/bolt";
// eslint-disable-next-line import/no-extraneous-dependencies
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
            this.app.client.conversations
                .members({
                    channel: process.env.CHANNEL_ID,
                    token: process.env.SLACK_BOT_TOKEN,
                })
                .then(result => {
                    if (result.ok) {
                        const membersResult = result.members as string[];
                        resolve(membersResult);
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
                    include_labels: true,
                })
                .then(result => {
                    if (result.ok) {
                        const profile = new Profile(result);
                        return resolve(profile.getUserInfo());
                    }
                    return rejects();
                })
                .catch(err => {
                    return new Error(err);
                });
        });
    };

    public async putChannelMemberFirestore(): Promise<void> {
        const usersRef = firestore.collection(`users`);
        const members = await this.getChannelInfo();
        console.log({ members });
        const result = await Promise.all(
            members.map<Promise<boolean>>(async userId => {
                const userProfile = await this.getProfile(userId);
                console.log({ userProfile });
                // eslint-disable-next-line no-shadow
                return new Promise((resolve, rejects) => {
                    usersRef
                        .doc(userId)
                        .set(userProfile)
                        .then(() => {
                            resolve(true);
                        })
                        .catch(err => {
                            console.error({ err });
                            rejects(err);
                        });
                });
            })
        );

        console.log({ result });

        if (result) {
            console.log(`upsert: ok ✅`);
        } else {
            console.log(`Failed to upsert channel members info`);
        }
    }
}

export default Channel;
