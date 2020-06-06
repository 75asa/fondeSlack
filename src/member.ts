import { app } from "./bolt";
import { firestore } from "./firestore";
import mock from "../../mock.json";

export const set = () => {
  app.command(
    `/set`,
    async ({ payload, ack, context }): Promise<void> => {
      ack();
      console.log({ payload });
      const usersRef = firestore.collection(`users`);
      const user = {
        message: payload.text,
      };
      // firestoreにデータ登録
      await usersRef.doc(payload.user_id).set(user);

      // 成功をSlack通知
      const msg = {
        token: context.botToken,
        text: `メッセージを登録しました\n${payload.text}`,
        channel: payload.channel_id,
      };
      app.client.chat.postMessage(msg).catch(err => {
        throw new Error(err);
      });
    }
  );
};

export const get = () => {
  app.command(
    `/get`,
    async ({ payload, ack, context }): Promise<void> => {
      ack();
      console.log({ payload });
      const summary = mock.attachments[0].fields.find(
        field => field.title === "内容"
      );

      console.log({ summary });
      const toMember = summary.value.split("\n")[0];
      console.log({ toMember });
      let hitUser = [];

      // firestoreのデータを取得
      await firestore
        .collection(`users`)
        .get()
        .then(user => {
          let isMentioned = false;
          user.forEach(content => {
            const data = content.data();

            isMentioned = data.arrayData.some(keyword => {
              return toMember.includes(keyword);
            });
            if (isMentioned) {
              hitUser.push({ id: content.id, data: data });
              isMentioned = false;
              console.log({ data });
            }
          });
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });

      console.log({ hitUser });

      let message = "<!here>";

      if (hitUser.length > 0) {
        message = hitUser.map(user => `<@${user.id}>`).join(" ");
      }
      message += " 電話だよ";

      // Slack通知
      const msg = {
        token: context.botToken,
        text: message,
        channel: payload.channel_id,
      };

      app.client.chat.postMessage(msg).catch(err => {
        throw new Error(err);
      });
    }
  );
};
