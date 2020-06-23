import { App } from "@slack/bolt";
import { firestore } from "./firestore";
import Profile from "./profile";

interface channelResult {
  channel: object;
  members: string[];
}

interface userResult {
  profile: object;
  title: string;
  real_name: string;
  display_name: string;
  fields: object;
  status_text: string;
  first_name: string;
  last_name: string;
}

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
            const channelResult = result.channel as channelResult;
            resolve(channelResult.members);
          } else {
            rejects();
          }
        });
    });
  };

  public getProfile = async (slackId: string): Promise<object> => {
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
          } else {
            rejects();
          }
        });
    });
  };

  public async putChannelMemberFirestore(): Promise<void> {
    const usersRef = firestore.collection(`users`);
    const members = await this.getChannelInfo();
    await members.map(async userId => {
      const userProfile = await this.getProfile(userId);
      console.log({ userProfile });
      await usersRef.doc(userId).set(userProfile);
      return userProfile;
    });
  }
}

export default Channel;
