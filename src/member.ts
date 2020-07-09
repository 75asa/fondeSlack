import { app } from "./bolt";
import firestore from "./firestore";
// TODO: mock
import mock from "../mock.json";
import Channel from "./channel";

interface userDocument {
    id: string;
    title: string;
    displayName: string[];
    realName: string[];
    field: string[];
    arrayData: string[];
}

export const getFirestore = async (
    payloadText: string
): Promise<userDocument[]> => {
    const hitUser = [];

    // firestoreのデータを取得
    return new Promise((resolve, rejects) => {
        firestore
            .collection(`users`)
            .get()
            .then(user => {
                let isMentioned = false;
                user.forEach(content => {
                    const data = content.data();

                    isMentioned = data.arrayData.some(keyword => {
                        return payloadText.includes(keyword);
                    });
                    if (isMentioned) {
                        hitUser.push({ id: content.id, data });
                        isMentioned = false;
                        console.log({ data });
                    }
                });
                resolve(hitUser);
            })
            .catch(err => {
                console.log("Error getting documents", err);
                rejects();
            });
    });
};

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

            // firestoreのデータを取得
            const hitUser = await getFirestore(toMember);

            console.log({ hitUser });

            let message = "<!here>";

            if (hitUser.length > 0) {
                message = hitUser.map(user => `<@${user.id}>`).join(" ");
            }
            message += " 電話だよ";

            // Slack通知
            const option = {
                token: context.botToken,
                text: message,
                channel: payload.channel_id,
            };

            app.client.chat.postMessage(option).catch(err => {
                throw new Error(err);
            });
        }
    );
};
